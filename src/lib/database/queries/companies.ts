'use server'

import { auth } from '@/auth'
import { db } from '../db'

export async function getCompanies() {
  const session = await auth()
  if (!session?.user?.id) {
    throw new Error('User not authenticated')
  }

  const companies = await db
    .selectFrom('companies')
    .leftJoin('files', 'files.id', 'companies.logo_file_id')
    .select([
      'companies.created_at',
      'companies.id',
      'companies.name',
      'companies.logo_file_id',
      'companies.primary_color',
      'companies.user_id',
      'files.image_key as logo_image_key',
    ])
    .where('companies.user_id', '=', session.user.id)
    .execute()

  return companies
}

export async function getCompany(companyId: string) {
  const session = await auth()
  if (!session?.user?.id) {
    throw new Error('User not authenticated')
  }

  const company = await db
    .selectFrom('companies')
    .leftJoin('files', 'files.id', 'companies.logo_file_id')
    .select([
      'companies.id',
      'companies.name',
      'companies.primary_color',
      'companies.logo_file_id',
      'companies.user_id',
      'companies.created_at',
      'files.image_key as logo_image_key',
    ])
    .where('companies.id', '=', companyId)
    .where('companies.user_id', '=', session.user.id)
    .executeTakeFirst()
  return company
}

export async function addCompany({
  name,
  primaryColor,
  logoFileId,
}: {
  name: string
  primaryColor?: string
  logoFileId?: string
}) {
  const session = await auth()
  if (!session?.user?.id) {
    throw new Error('User not authenticated')
  }

  const company = await db
    .insertInto('companies')
    .values({
      name,
      primary_color: primaryColor,
      logo_file_id: logoFileId,
      user_id: session.user.id,
      created_at: new Date(),
    })
    .returning([
      'companies.id',
      'companies.name',
      'companies.primary_color',
      'companies.logo_file_id',
      'companies.user_id',
      'companies.created_at',
    ])
    .execute()
    .then(async ([newCompany]) => {
      if (!newCompany) return null
      return db
        .selectFrom('companies')
        .leftJoin('files', 'files.id', 'companies.logo_file_id')
        .select([
          'companies.id',
          'companies.name',
          'companies.primary_color',
          'companies.logo_file_id',
          'companies.user_id',
          'companies.created_at',
          'files.image_key as logo_image_key',
        ])
        .where('companies.id', '=', newCompany.id)
        .executeTakeFirst()
    })

  return company
}

export async function updateCompany(
  companyId: string,
  {
    name,
    primaryColor,
    logoFileId,
  }: {
    name?: string
    primaryColor?: string
    logoFileId?: string
  }
) {
  const session = await auth()
  if (!session?.user?.id) {
    throw new Error('User not authenticated')
  }

  const company = await db
    .updateTable('companies')
    .set({
      ...(name && { name }),
      ...(primaryColor !== undefined && { primary_color: primaryColor }),
      ...(logoFileId !== undefined && { logo_file_id: logoFileId }),
    })
    .where('id', '=', companyId)
    .where('user_id', '=', session.user.id)
    .returning(['id', 'name', 'primary_color', 'logo_file_id', 'user_id', 'created_at'])
    .execute()
    .then(async ([updatedCompany]) => {
      if (!updatedCompany) return null
      return db
        .selectFrom('companies')
        .leftJoin('files', 'files.id', 'companies.logo_file_id')
        .select([
          'companies.id',
          'companies.name',
          'companies.primary_color',
          'companies.logo_file_id',
          'companies.user_id',
          'companies.created_at',
          'files.image_key as logo_image_key',
        ])
        .where('companies.id', '=', updatedCompany.id)
        .executeTakeFirst()
    })

  return company
}

export async function deleteCompany(companyId: string) {
  const session = await auth()
  if (!session?.user?.id) {
    throw new Error('User not authenticated')
  }

  await db.deleteFrom('companies').where('id', '=', companyId).where('user_id', '=', session.user.id).execute()
}
