'use server'

import { auth } from '@/auth'
import { revalidateTag, unstable_cache } from 'next/cache'
import { v4 as uuidv4 } from 'uuid'
import { db } from '../db'

export const getProjects = unstable_cache(
  async (sessionUserId: string) => {
    const projects = await db
      .selectFrom('projects')
      .selectAll()
      .where('user_id', '=', sessionUserId)
      .where('deleted_at', 'is', null)
      .execute()
    return projects
  },
  ['projects'],
  {
    tags: ['projects'],
    revalidate: 60 * 60 * 24,
  }
)

export async function addProject(title: string, content?: Email) {
  const session = await auth()
  if (!session?.user?.id) {
    throw new Error('User not authenticated')
  }

  const defaultContent = JSON.stringify({
    id: uuidv4(),
    name: title,
    preview: '',
    fontFamily: 'Arial',
    bgColor: '#FFFFFF',
    color: '#000000',
    width: '600px',
    rows: [],
  })
  const project = await db
    .insertInto('projects')
    .values({
      deleted_at: null,
      created_at: new Date(),
      user_id: session.user.id,
      title,
      content: (content || defaultContent) as Email,
    })
    .returningAll()
    .executeTakeFirst()

  revalidateTag('projects')
  return project
}

export const getProject = unstable_cache(
  async (id: string, sessionUserId: string): Promise<Project | undefined> => {
    const project = await db
      .selectFrom('projects')
      .selectAll()
      .where('id', '=', id)
      .where('user_id', '=', sessionUserId)
      .executeTakeFirst()
    return project
  },
  ['project'],
  {
    tags: ['project'],
    revalidate: 60 * 60,
  }
)

export async function updateProject(id: string, updates: { content?: Email; title?: string }) {
  const session = await auth()
  if (!session?.user?.id) {
    throw new Error('User not authenticated')
  }

  const updateFields: { content?: Email; title?: string } = {}
  if (updates.content !== undefined) updateFields.content = updates.content
  if (updates.title !== undefined) updateFields.title = updates.title

  if (Object.keys(updateFields).length === 0) {
    throw new Error('No fields to update')
  }

  await db
    .updateTable('projects')
    .set(updateFields)
    .where('id', '=', id)
    .where('user_id', '=', session.user.id)
    .execute()

  // Revalidate cache
  revalidateTag('projects')
}

export async function deleteProject(id: string) {
  const session = await auth()
  if (!session?.user?.id) {
    throw new Error('User not authenticated')
  }
  await db
    .updateTable('projects')
    .set({ deleted_at: new Date() })
    .where('id', '=', id)
    .where('user_id', '=', session.user.id)
    .execute()

  // Revalidate cache
  revalidateTag('projects')
}
