'use server'

import { auth } from '@/auth'
import type { Message } from 'ai'
import { revalidateTag, unstable_cache } from 'next/cache'
import { db } from '../db'

// Internal helper functions (not exported)
const getChatsInternal = unstable_cache(
  async (sessionUserId: string) => {
    const chats = await db
      .selectFrom('chats')
      .selectAll()
      .where('user_id', '=', sessionUserId)
      .where('deleted_at', 'is', null)
      .orderBy('updated_at', 'desc')
      .execute()

    return chats
  },
  ['chats'],
  {
    tags: ['chats'],
    revalidate: 60 * 60,
  }
)

const getChatInternal = unstable_cache(
  async (id: string, sessionUserId: string) => {
    const chat = await db
      .selectFrom('chats')
      .selectAll()
      .where('id', '=', id)
      .where('user_id', '=', sessionUserId)
      .where('deleted_at', 'is', null)
      .executeTakeFirst()
    return chat
  },
  ['chat'],
  {
    tags: ['chat'],
    revalidate: 60 * 60,
  }
)

const getChatWithMessagesInternal = unstable_cache(
  async (id: string, sessionUserId: string) => {
    const chat = await db
      .selectFrom('chats')
      .selectAll()
      .where('id', '=', id)
      .where('user_id', '=', sessionUserId)
      .where('deleted_at', 'is', null)
      .executeTakeFirst()

    if (!chat) return undefined

    const messages = await db
      .selectFrom('messages')
      .selectAll()
      .where('chat_id', '=', id)
      .orderBy('sequence', 'asc')
      .execute()

    console.log(chat)

    const response = {
      ...chat,
      messages: messages.map((msg) => ({
        id: msg.id,
        role: msg.role,
        content: msg.content,
      })),
    }

    return response
  },
  ['chat'],
  {
    tags: ['chat'],
    revalidate: 60 * 60,
  }
)

export async function createChat(messages: Message[], title?: string, email?: Email) {
  const session = await auth()
  if (!session?.user?.id) {
    throw new Error('User not authenticated')
  }

  return await db.transaction().execute(async (trx) => {
    // Create chat
    const chat = await trx
      .insertInto('chats')
      .values({
        user_id: session.user?.id ?? '',
        title: title ?? '',
        email: email ?? null,
        created_at: new Date(),
        updated_at: new Date(),
      })
      .returningAll()
      .executeTakeFirst()

    if (!chat) throw new Error('Failed to create chat')

    // Insert messages
    if (messages.length > 0) {
      await trx
        .insertInto('messages')
        .values(
          messages.map((msg, index) => ({
            chat_id: chat.id,
            role: msg.role,
            content: msg.content,
            sequence: index,
            created_at: new Date(),
          }))
        )
        .execute()
    }

    revalidateTag('chats')
    return chat
  })
}

export async function updateChat(id: string, updates: { messages?: Message[]; title?: string; email?: Email }) {
  const session = await auth()
  if (!session?.user?.id) {
    throw new Error('User not authenticated')
  }

  return await db.transaction().execute(async (trx) => {
    // Update chat
    if (updates.title !== undefined) {
      await trx
        .updateTable('chats')
        .set({
          title: updates.title,
          updated_at: new Date(),
        })
        .where('id', '=', id)
        .where('user_id', '=', session.user?.id ?? '')
        .execute()
    }

    if (updates.email) {
      await trx
        .updateTable('chats')
        .set({
          email: updates.email,
          updated_at: new Date(),
        })
        .where('id', '=', id)
        .where('user_id', '=', session.user?.id ?? '')
        .execute()
    }

    // Update messages
    if (updates.messages) {
      // Delete existing messages
      await trx.deleteFrom('messages').where('chat_id', '=', id).execute()

      // Insert new messages
      await trx
        .insertInto('messages')
        .values(
          updates.messages.map((msg, index) => ({
            chat_id: id,
            role: msg.role,
            content: msg.content,
            sequence: index,
            created_at: new Date(),
          }))
        )
        .execute()
    }

    revalidateTag('chats')
  })
}

export async function deleteChat(id: string) {
  const session = await auth()
  if (!session?.user?.id) {
    throw new Error('User not authenticated')
  }

  await db
    .updateTable('chats')
    .set({ deleted_at: new Date() })
    .where('id', '=', id)
    .where('user_id', '=', session.user.id)
    .execute()

  revalidateTag('chats')
}

// Exported secure functions
export async function getChats() {
  const session = await auth()
  if (!session?.user?.id) {
    throw new Error('User not authenticated')
  }
  return getChatsInternal(session.user.id)
}

export async function getChat(id: string) {
  const session = await auth()
  if (!session?.user?.id) {
    throw new Error('User not authenticated')
  }
  return getChatInternal(id, session.user.id)
}

export async function getChatWithMessages(id: string) {
  const session = await auth()
  if (!session?.user?.id) {
    throw new Error('User not authenticated')
  }
  return getChatWithMessagesInternal(id, session.user.id)
}
