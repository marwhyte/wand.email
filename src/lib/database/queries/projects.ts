'use server'

import { auth } from '@/auth'
import { v4 as uuidv4 } from 'uuid'
import { db } from '../db'

export async function getProjects() {
  const session = await auth()
  if (!session?.user?.id) {
    throw new Error('User not authenticated')
  }

  const projects = await db.selectFrom('projects').selectAll().where('user_id', '=', session.user.id).execute()
  return projects
}

export async function addProject(title: string, content?: string) {
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
      created_at: new Date(),
      user_id: session.user.id,
      title,
      content: content || defaultContent,
    })
    .returningAll()
    .executeTakeFirst()

  return project
}

export async function getProject(id: string) {
  const session = await auth()
  if (!session?.user?.id) {
    throw new Error('User not authenticated')
  }

  const project = await db
    .selectFrom('projects')
    .selectAll()
    .where('id', '=', id)
    .where('user_id', '=', session.user.id)
    .executeTakeFirst()
  return project
}

export async function updateProject(id: string, content: string) {
  const session = await auth()
  if (!session?.user?.id) {
    throw new Error('User not authenticated')
  }

  await db.updateTable('projects').set({ content }).where('id', '=', id).execute()
}
