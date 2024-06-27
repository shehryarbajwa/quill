import { db } from '@/db'
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server'

import {
  createUploadthing,
  type FileRouter,
} from 'uploadthing/next'

import { PDFLoader } from 'langchain/document_loaders/fs/pdf';
import { OpenAIEmbeddings } from "@langchain/openai";
import { pinecone } from '@/lib/pinecone';
import { env } from 'process';

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

        // vectorize and index the entire document

        const pineconeIndex = pinecone.Index('quill')

        const embeddings = new OpenAIEmbeddings({
          openAIApiKey: process.env.OPENAI_API_KEY
        })

      } catch (err) {

      }
    })
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
