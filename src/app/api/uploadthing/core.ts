import { db } from '@/db'
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server'

import {
  createUploadthing,
  type FileRouter,
} from 'uploadthing/next'

const f = createUploadthing();

export const ourFileRouter = {
  pdfUploader: f({ pdf: { maxFileSize: "16MB" } })
    .middleware(async ({ req }) => {
      console.log('Middleware started');
      const { getUser } = getKindeServerSession();
      const user = await getUser();

      if (!user || !user.id) {
        console.error('Unauthorized access');
        throw new Error("Unauthorized");
      }

      console.log('Middleware completed', { userId: user.id });
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
        }
      )
    })
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
