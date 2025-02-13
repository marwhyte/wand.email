'use server'

import { auth } from '@/auth'
import type { Message } from 'ai'
import { revalidateTag } from 'next/cache'
import { db } from '../db'

// Modified internal functions without caching
const getChatsInternal = async (sessionUserId: string) => {
  const chats = await db.selectFrom('chats').selectAll().where('user_id', '=', sessionUserId).where('deleted_at', 'is', null).orderBy('updated_at', 'desc').execute()

  return chats
}

const getMessageInternal = async (id: string, sessionUserId: string) => {
  const message = await db.selectFrom('messages').selectAll().where('id', '=', id).executeTakeFirst()
  return message
}

const getChatInternal = async (id: string, sessionUserId: string) => {
  const chat = await db.selectFrom('chats').selectAll().where('id', '=', id).where('user_id', '=', sessionUserId).where('deleted_at', 'is', null).executeTakeFirst()
  return chat
}

const getChatWithMessagesInternal = async (id: string, sessionUserId: string) => {
  const chat = await db.selectFrom('chats').selectAll().where('id', '=', id).where('user_id', '=', sessionUserId).where('deleted_at', 'is', null).executeTakeFirst()

  if (!chat) return undefined

  const messages = await db.selectFrom('messages').selectAll().where('chat_id', '=', id).orderBy('sequence', 'asc').execute()

  const response = {
    ...chat,
    messages: messages.map((msg) => ({
      id: msg.id,
      role: msg.role,
      content: msg.content,
    })),
  }

  return response
}

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

export async function updateMessage(id: string, chatId: string, updates: { content?: string }) {
  const session = await auth()
  if (!session?.user?.id) {
    throw new Error('User not authenticated')
  }

  if (updates.content !== undefined) {
    await db.updateTable('messages').set({ content: updates.content }).where('id', '=', id).where('chat_id', '=', chatId).execute()
  }

  revalidateTag('chats')
}

export async function updateChat(id: string, updates: { messages?: Message[]; title?: string; email?: Email }) {
  const session = await auth()
  if (!session?.user?.id) {
    throw new Error('User not authenticated')
  }

  try {
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

        // Sort messages by creation time
        const sortedMessages = [...updates.messages].sort((a, b) => {
          const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0
          const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0
          return timeA - timeB
        })

        // Prepare message values with sequential ordering
        const messageValues = sortedMessages.map((msg, index) => ({
          chat_id: id,
          role: msg.role,
          content: msg.content,
          sequence: index,
          created_at: msg.createdAt || new Date(),
        }))

        console.log('Inserting messages with sequential ordering:', messageValues)

        // Insert new messages
        const result = await trx.insertInto('messages').values(messageValues).returningAll().execute()

        console.log('Inserted messages:', result)
      }

      revalidateTag('chats')
    })
  } catch (error) {
    console.error('Error updating chat:', error)
    throw error
  }
}

export async function deleteChat(id: string) {
  const session = await auth()
  if (!session?.user?.id) {
    throw new Error('User not authenticated')
  }

  await db.updateTable('chats').set({ deleted_at: new Date() }).where('id', '=', id).where('user_id', '=', session.user.id).execute()

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

export async function getMessage(id: string) {
  const session = await auth()
  if (!session?.user?.id) {
    throw new Error('User not authenticated')
  }
  return getMessageInternal(id, session.user.id)
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
