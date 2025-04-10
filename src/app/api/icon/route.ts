import { generateIconPng } from '@/lib/utils/icon-generator'
import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs' // Ensure this runs in Node.js runtime
export const dynamic = 'force-dynamic' // Prevent static generation

export async function GET(request: NextRequest) {
  try {
    // Get icon name and theme from query parameters
    const searchParams = request.nextUrl.searchParams
    const iconName = searchParams.get('icon') || 'check' // Use 'check' as default icon if none provided
    const theme = searchParams.get('theme') || '#8e6ff7'

    // Get size parameter from query or use default
    const size = parseInt(searchParams.get('size') || '128', 10)

    // Generate the icon using our shared utility
    const iconBuffer = await generateIconPng(iconName, theme, size)

    // Return the processed image with headers that prevent caching
    return new NextResponse(iconBuffer, {
      headers: {
        'Content-Type': 'image/png',
        // Disable caching completely
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        Pragma: 'no-cache',
        Expires: '0',
        'Surrogate-Control': 'no-store',
        'Content-Length': String(iconBuffer.length),
      },
    })
  } catch (error) {
    console.error('Error processing icon:', error)
    // Return a simple error icon instead of a text error
    try {
      const errorSvg = `
        <svg width="64" height="64" xmlns="http://www.w3.org/2000/svg">
          <circle cx="32" cy="32" r="32" fill="#ffeeee" />
          <text x="32" y="37" font-family="Arial" font-size="24" text-anchor="middle" fill="#ff0000">!</text>
        </svg>
      `
      const { default: sharp } = await import('sharp')
      const errorBuffer = await sharp(Buffer.from(errorSvg)).png().toBuffer()
      return new NextResponse(errorBuffer, {
        headers: {
          'Content-Type': 'image/png',
          'Cache-Control': 'no-store',
          'Content-Length': String(errorBuffer.length),
        },
        status: 500,
      })
    } catch {
      return new NextResponse('Error processing image', {
        status: 500,
        headers: { 'Content-Type': 'text/plain' },
      })
    }
  }
}
