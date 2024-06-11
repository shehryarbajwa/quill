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
      console.log("Upload complete for userId:", metadata.userId);
      console.log("file url", file.url);
      console.log('metadata', { metadata: metadata.userId, file: file.name })
      return
    })
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
