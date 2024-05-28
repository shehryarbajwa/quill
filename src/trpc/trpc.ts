import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/dist/types/server';
import { TRPCError, initTRPC } from '@trpc/server';

const t = initTRPC.create();
const middleware = t.middleware;

const isAuth = middleware(async (opts) => {
  const { getUser } = getKindeServerSession()
  const user = await getUser();

  if (!user || !user.id) {
    throw new TRPCError({ code: "UNAUTHORIZED" })
  }

  return opts.next({
    ctx: {
      userId: user.id,
      user,
    }
  })
})
// Base router and procedure helpers
//Public procedure anyone can call with an API
//Auth procedure only authorized users can call
export const router = t.router;
export const publicProcedure = t.procedure;
export const privateProcedure = t.procedure.use(isAuth)
