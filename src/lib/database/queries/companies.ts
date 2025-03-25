'use server'

import { auth } from '@/auth'
import { revalidateTag, unstable_cache } from 'next/cache'
import { db } from '../db'

// Internal helper that takes userId as parameter for caching
const getCompaniesInternal = unstable_cache(
  async (userId: string) => {
    const companies = await db
      .selectFrom('Company')
      .leftJoin('File', 'File.id', 'Company.logoFileId')
      .select([
        'Company.createdAt',
        'Company.updatedAt',
        'Company.id',
        'Company.name',
        'Company.logoFileId',
        'Company.primaryColor',
        'Company.userId',
        'File.imageKey as logoImageKey',
      ])
      .where('Company.userId', '=', userId)
      .execute()
    return companies
  },
  ['companies'],
  {
    tags: ['companies'],
    revalidate: 60 * 60 * 24,
  }
)

// Internal helper for getting a single company with caching
const getCompanyInternal = unstable_cache(
  async (userId: string, companyId: string) => {
    const company = await db
      .selectFrom('Company')
      .leftJoin('File', 'File.id', 'Company.logoFileId')
      .select([
        'Company.id',
        'Company.name',
        'Company.primaryColor',
        'Company.logoFileId',
        'Company.userId',
        'Company.createdAt',
        'Company.updatedAt',
        'File.imageKey as logoImageKey',
      ])
      .where('Company.id', '=', companyId)
      .where('Company.userId', '=', userId)
      .executeTakeFirst()
    return company
  },
  ['company'],
  {
    tags: ['companies'],
    revalidate: 60 * 60 * 24,
  }
)

// Public functions that handle auth internally
export async function getCompanies() {
  const session = await auth()
  if (!session?.user?.id) {
    throw new Error('User not authenticated')
  }

  return getCompaniesInternal(session.user.id)
}

export async function getCompany(companyId: string) {
  const session = await auth()
  if (!session?.user?.id) {
    throw new Error('User not authenticated')
  }

  return getCompanyInternal(session.user.id, companyId)
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
    .insertInto('Company')
    .values({
      name,
      primaryColor: primaryColor,
      logoFileId: logoFileId,
      userId: session.user.id,
    })
    .returning([
      'Company.id',
      'Company.name',
      'Company.primaryColor',
      'Company.logoFileId',
      'Company.userId',
      'Company.createdAt',
    ])
    .execute()
    .then(async ([newCompany]) => {
      if (!newCompany) return null
      return db
        .selectFrom('Company')
        .leftJoin('File', 'File.id', 'Company.logoFileId')
        .select([
          'Company.id',
          'Company.name',
          'Company.primaryColor',
          'Company.logoFileId',
          'Company.userId',
          'Company.createdAt',
          'File.imageKey as logoImageKey',
        ])
        .where('Company.id', '=', newCompany.id)
        .executeTakeFirst()
    })

  revalidateTag('companies')
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
    .updateTable('Company')
    .set({
      ...(name && { name }),
      ...(primaryColor !== undefined && { primaryColor }),
      ...(logoFileId !== undefined && { logoFileId }),
    })
    .where('id', '=', companyId)
    .where('userId', '=', session.user.id)
    .returning(['id', 'name', 'primaryColor', 'logoFileId', 'userId', 'createdAt'])
    .execute()
    .then(async ([updatedCompany]) => {
      if (!updatedCompany) return null
      return db
        .selectFrom('Company')
        .leftJoin('File', 'File.id', 'Company.logoFileId')
        .select([
          'Company.id',
          'Company.name',
          'Company.primaryColor',
          'Company.logoFileId',
          'Company.userId',
          'Company.createdAt',
          'File.imageKey as logoImageKey',
        ])
        .where('Company.id', '=', updatedCompany.id)
        .executeTakeFirst()
    })

  revalidateTag('companies')
  return company
}

export async function deleteCompany(companyId: string) {
  const session = await auth()
  if (!session?.user?.id) {
    throw new Error('User not authenticated')
  }

  await db.deleteFrom('Company').where('id', '=', companyId).where('userId', '=', session.user.id).execute()

  revalidateTag('companies')
}
