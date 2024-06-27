import { db } from '@/db'
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server'
import { indexFileToElasticsearch } from '@/app/api/elasticsearch';

import {
  createUploadthing,
  type FileRouter,
} from 'uploadthing/next'

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

        await indexFileToElasticsearch(file.key, file.name, metadata.userId)
      } catch {

      }
    })
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
