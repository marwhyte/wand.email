import { auth } from '@/auth'
import { getChats } from '@/lib/database/queries/chats'

export async function GET() {
  const session = await auth()

  if (!session || !session.user) {
    return Response.json('Unauthorized!', { status: 401 })
  }

  const chats = await getChats()
  return Response.json(chats)
}
