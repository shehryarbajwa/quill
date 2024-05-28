import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { privateProcedure, publicProcedure, router } from './trpc';
import { TRPCError } from '@trpc/server';
import { db } from "@/db";

{/*authCallBack is a GET request. Client side makes a GET request and the function checks if the user exists from Kinde. 
If not, sends error 400 type. Then checks If user exists in db, if not 
then create it in DB  */}
export const appRouter = router({
  authCallback: publicProcedure.query(async () => {
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if (!user || !user.id || !user.email)
      throw new TRPCError({ code: 'UNAUTHORIZED' })

    const dbUser = await db.user.findFirst({
      where: {
        id: user.id,
      }
    })

    if (!dbUser) {
      await db.user.create({
        data: {
          id: user.id,
          email: user.email
        }
      })
    }

    return { success: true }
  }),
  getUserFiles: privateProcedure.query(async ({ ctx }) => {
    const { userId, user } = ctx

    return await db.file.findMany({
      where: {
        userId
      }
    })

  })

})

export type AppRouter = typeof appRouter;