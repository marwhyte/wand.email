import { auth } from '@/auth'
import { getUserByEmail } from '@/lib/database/queries/users'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const session = await auth()
  if (!session?.user?.email) {
    throw new Error('User not authenticated')
  }

  try {
    const user = await getUserByEmail(session.user.email)
    return NextResponse.json(user)
  } catch (error) {
    return NextResponse.json([])
  }
}
