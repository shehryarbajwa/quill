import { db } from '@/db'
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server'

import {
  createUploadthing,
  type FileRouter,
} from 'uploadthing/next'

import { PDFLoader } from '@langchain/community/document_loaders/fs/pdf';
import { OpenAIEmbeddings } from "@langchain/openai";

import { PineconeStore } from '@langchain/pinecone';
import { pc } from '@/lib/pinecone';

const f = createUploadthing();

export const ourFileRouter = {
  pdfUploader: f({ pdf: { maxFileSize: "16MB" } })
    .middleware(async ({ req }) => {

      const { getUser } = getKindeServerSession();
      const user = await getUser();

      if (!user || !user.id) {

        throw new Error("Unauthorized");
      }


      return { userId: user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      const createdFile = await db.file.create(
        {
          data: {
            key: file.key,
            name: file.name,
            userId: metadata.userId,
            url: `https://uploadthing-prod-sea1.s3.us-west-2.amazonaws.com/${file.key}`,
            uploadStatus: "PROCESSING"
          }
        })
      try {
        const response = await fetch(`https://uploadthing-prod-sea1.s3.us-west-2.amazonaws.com/${file.key}`)
        const blob = await response.blob()

        const loader = new PDFLoader(blob)

        const pageLevelDocs = await loader.load()

        const pagesAmt = pageLevelDocs.length

        const pineconeIndex = pc.Index(process.env.PINECONE_INDEX_NAME!);



        const embeddings = new OpenAIEmbeddings({
          openAIApiKey: process.env.OPENAI_API_KEY!
        })


        console.log('Starting document vectorization and indexing');
        await PineconeStore.fromDocuments(pageLevelDocs, embeddings, {
          pineconeIndex,
          namespace: createdFile.id
        })
        console.log('Document vectorization and indexing complete');

        await db.file.update({
          data: {
            uploadStatus: "SUCCESS"
          },
          where: {
            id: createdFile.id
          }
        })
      } catch (err) {
        console.log('err', err)
        await db.file.update({
          data: {
            uploadStatus: 'FAILED'
          },
          where: {
            id: createdFile.id
          }
        })

      }
    })
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
