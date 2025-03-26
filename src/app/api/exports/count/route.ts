import { getMonthlyExportCount } from '@/lib/database/queries/exports'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const count = await getMonthlyExportCount()
    return NextResponse.json(count)
  } catch (error) {
    return NextResponse.json(0)
  }
}
