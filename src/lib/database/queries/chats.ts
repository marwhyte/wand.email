'use server'

import { auth } from '@/auth'
import type { Message } from 'ai'
import { db } from '../db'

export async function createChat({
  id,
  messages = [],
  title = '',
  email = null,
  companyId = null,
}: {
  id: string
  messages?: Message[]
  title?: string
  email?: string | null
  companyId?: string | null
}) {
  const session = await auth()

  return await db.transaction().execute(async (trx) => {
    if (!session?.user?.id) throw new Error('User not authenticated')

    const chat = await trx
      .insertInto('Chat')
      .values({
        id,
        userId: session.user.id,
        title: title ?? '',
        email,
        companyId: companyId,
        hasConfirmedOutline: false,
      })
      .returningAll()
      .executeTakeFirst()

    if (!chat) throw new Error('Failed to create chat')

    // Insert messages
    if (messages.length > 0) {
      await trx
        .insertInto('Message')
        .values(
          messages.map((msg, index) => ({
            chatId: chat.id,
            role: msg.role,
            content: msg.content,
          }))
        )
        .execute()
    }

    return chat
  })
}

export async function updateMessage(id: string, chatId: string, updates: { content?: string; email?: string }) {
  const session = await auth()
  if (!session?.user?.id) {
    throw new Error('User not authenticated')
  }

  // Check if the message exists
  const message = await db
    .selectFrom('Message')
    .select('id')
    .where('id', '=', id)
    .where('chatId', '=', chatId)
    .executeTakeFirst()

  if (updates.content !== undefined) {
    await db
      .updateTable('Message')
      .set({ content: updates.content })
      .where('id', '=', id)
      .where('chatId', '=', chatId)
      .execute()
  }

  if (updates.email !== undefined) {
    await db
      .updateTable('Message')
      .set({ email: updates.email })
      .where('id', '=', id)
      .where('chatId', '=', chatId)
      .execute()
  }
}

export async function deleteMessagesAfterId(id: string, chatId: string) {
  // Retrieve the created_at timestamp of the message with the given id
  const message = await db
    .selectFrom('Message')
    .select('createdAt')
    .where('id', '=', id)
    .where('chatId', '=', chatId)
    .executeTakeFirst()

  if (!message) {
    throw new Error('Message not found')
  }

  // Delete messages created after the retrieved timestamp
  await db.deleteFrom('Message').where('createdAt', '>', message.createdAt).where('chatId', '=', chatId).execute()

  return await db.selectFrom('Message').selectAll().where('chatId', '=', chatId).orderBy('createdAt', 'asc').execute()
}

export async function updateChat(
  id: string,
  updates: { messages?: Message[]; title?: string; email?: string; parsed?: boolean; hasConfirmedOutline?: boolean }
) {
  const session = await auth()
  if (!session?.user?.id) {
    throw new Error('User not authenticated')
  }

  try {
    return await db.transaction().execute(async (trx) => {
      if (!session?.user?.id) throw new Error('User not authenticated')

      if (updates.title !== undefined) {
        await trx
          .updateTable('Chat')
          .set({
            title: updates.title,
            updatedAt: new Date(),
          })
          .where('id', '=', id)
          .where('userId', '=', session.user.id)
          .execute()
      }

      if (updates.email) {
        await trx
          .updateTable('Chat')
          .set({
            email: updates.email,
            updatedAt: new Date(),
          })
          .where('id', '=', id)
          .where('userId', '=', session.user.id)
          .execute()
      }

      if (updates.hasConfirmedOutline !== undefined) {
        await trx
          .updateTable('Chat')
          .set({
            hasConfirmedOutline: updates.hasConfirmedOutline,
            updatedAt: new Date(),
          })
          .where('id', '=', id)
          .where('userId', '=', session.user.id)
          .execute()
      }

      if (updates.messages) {
        const existingMessages = await trx
          .selectFrom('Message')
          .select(['id', 'createdAt', 'email'])
          .where('chatId', '=', id)
          .execute()

        const existingMessageMap = new Map(
          existingMessages.map((msg) => [msg.id, { createdAt: msg.createdAt, email: msg.email }])
        )

        await trx.deleteFrom('Message').where('chatId', '=', id).execute()

        const sortedMessages = [...updates.messages].sort((a, b) => {
          const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0
          const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0
          return timeA - timeB
        })

        const messageValues = sortedMessages.map((msg, index) => {
          let createdAt: Date = new Date()
          if (existingMessageMap.get(msg.id)) {
            // Use existing timestamp from database
            createdAt = existingMessageMap.get(msg.id)?.createdAt as Date
          } else if (msg.createdAt) {
            createdAt = new Date(msg.createdAt)
          } else {
            createdAt = new Date()
          }

          const email = existingMessageMap.get(msg.id)?.email ?? null

          return {
            chatId: id,
            role: msg.role,
            content: msg.content,
            id: msg.id,
            createdAt,
            email,
          }
        })

        // Insert new messages
        await trx.insertInto('Message').values(messageValues).returningAll().execute()
      }
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

  try {
    const result = await db
      .updateTable('Chat')
      .set({ deletedAt: new Date() })
      .where('id', '=', id)
      .where('userId', '=', session.user.id)
      .executeTakeFirst()

    return result !== undefined
  } catch (error) {
    console.error('Error deleting chat:', error)
    return false
  }
}

export async function getChats() {
  const session = await auth()
  if (!session?.user?.id) {
    throw new Error('User not authenticated')
  }

  const chats = await db
    .selectFrom('Chat')
    .selectAll()
    .where('userId', '=', session.user.id)
    .where('deletedAt', 'is', null)
    .orderBy('updatedAt', 'desc')
    .execute()

  return chats
}

export async function getMessage(id: string) {
  const session = await auth()
  if (!session?.user?.id) {
    throw new Error('User not authenticated')
  }

  const message = await db.selectFrom('Message').selectAll().where('id', '=', id).executeTakeFirst()
  return message
}

export async function getChat(id: string) {
  const session = await auth()
  if (!session?.user?.id) {
    throw new Error('User not authenticated')
  }

  const chat = await db
    .selectFrom('Chat')
    .selectAll()
    .where('id', '=', id)
    .where('userId', '=', session.user.id)
    .where('deletedAt', 'is', null)
    .executeTakeFirst()
  return chat
}

export async function getChatWithMessages(id: string) {
  const session = await auth()
  if (!session?.user?.id) {
    throw new Error('User not authenticated')
  }

  const chat = await db
    .selectFrom('Chat')
    .selectAll()
    .where('id', '=', id)
    .where('userId', '=', session.user.id)
    .where('deletedAt', 'is', null)
    .executeTakeFirst()

  if (!chat) return undefined

  const messages = await db
    .selectFrom('Message')
    .selectAll()
    .where('chatId', '=', id)
    .orderBy('createdAt', 'asc')
    .execute()

  const response = {
    ...chat,
    messages: messages.map((msg) => ({
      id: msg.id,
      role: msg.role,
      createdAt: msg.createdAt,
      content: msg.content,
      email: msg.email,
    })),
  }

  return response
}

export async function getUserMessageCount(userId: string): Promise<number> {
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000)

  const result = await db
    .selectFrom('Message')
    .innerJoin('Chat', 'Chat.id', 'Message.chatId')
    .select(({ fn }) => [fn.count<number>('Message.id').as('count')])
    .where('Chat.userId', '=', userId)
    .where('Message.role', '=', 'user')
    .where('Message.createdAt', '>=', oneHourAgo)
    .executeTakeFirst()

  return result?.count ?? 0
}
