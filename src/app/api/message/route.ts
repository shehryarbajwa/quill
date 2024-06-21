import { db } from '@/db';
import { SendMessageValidator } from '@/lib/validators/SendMessageValidator';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server'
import { NextRequest } from "next/server";

export const POST = async (req: NextRequest) => {
  //endpoint for asking a question to a PDF file
  const body = await req.json()

  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user || !user.id) {
    console.error('User is null or User ID is missing');
    return new Response('Unauthorized', { status: 401 });
  }
  const userId = user.id;

  if (!user) return
  //wrapping SendMessageValidator on the Post response body
  //destructuring fileId from the response
  const { fileId, message } = SendMessageValidator.parse(body)

  const file = await db.file.findFirst({
    where: {
      id: fileId,
      userId
    }
  })

  if (!file) return new Response('Not found', { status: 404 })

  await db.message.create({
    data: {
      text: message,
      isUserMessage: true,
      userId,
      fileId
    }
  })


}