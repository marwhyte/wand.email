import { getCompanies } from '@/lib/database/queries/companies'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const companies = await getCompanies()
    return NextResponse.json(companies)
  } catch (error) {
    return NextResponse.json([])
  }
}
