import { themeColorMap } from '@/app/components/email-workspace/types'
import fs from 'fs'
import { NextRequest, NextResponse } from 'next/server'
import path from 'path'
import sharp from 'sharp'

// Get the path to the material icons package
const BASE_ICONS_DIR = path.join(process.cwd(), 'node_modules/@material-design-icons/svg')

// Different style variants available in the package
const ICON_VARIANTS = ['outlined', 'filled', 'round', 'sharp', 'two-tone']

export async function GET(request: NextRequest) {
  try {
    // Get icon name and theme from query parameters
    const searchParams = request.nextUrl.searchParams
    const iconName = searchParams.get('icon') || 'check' // Use 'check' as default icon if none provided
    const theme = searchParams.get('theme') || 'default'

    // Get size parameter from query or use default
    const size = parseInt(searchParams.get('size') || '128', 10)

    // Get the theme colors
    const themeColor = themeColorMap[theme as keyof typeof themeColorMap] || themeColorMap.default

    // Try to find the icon in different variants
    let svgContent = null
    let foundVariant = null

    // Convert kebab-case to camelCase for the filename (e.g., local-shipping -> local_shipping)
    const normalizedIconName = iconName.replace(/-/g, '_')

    // Look for the icon in each variant directory
    for (const variant of ICON_VARIANTS) {
      const variantDir = path.join(BASE_ICONS_DIR, variant)
      const iconPath = path.join(variantDir, `${normalizedIconName}.svg`)

      console.log('Trying icon path:', iconPath)

      if (fs.existsSync(iconPath)) {
        svgContent = fs.readFileSync(iconPath, 'utf8')
        foundVariant = variant
        console.log(`Found icon ${normalizedIconName} in variant: ${foundVariant}`)
        break
      }
    }

    // If we couldn't find the icon, fall back to a generic one
    if (!svgContent) {
      console.error(`Icon ${normalizedIconName} not found in any variant`)
      return generateFallbackIcon(normalizedIconName, size, themeColor)
    }

    // Extract the viewBox to understand original dimensions
    const viewBoxMatch = svgContent.match(/viewBox=['"]([\d\s.]+)['"]/i)
    const originalViewBox = viewBoxMatch ? viewBoxMatch[1].split(/\s+/).map(Number) : [0, 0, 24, 24]

    // Extract all path data from the SVG (some icons have multiple paths)
    const pathMatches = [...svgContent.matchAll(/<path[^>]*d="([^"]*)"/g)]
    if (pathMatches.length === 0) {
      console.error('Could not extract path from SVG')
      return generateFallbackIcon(normalizedIconName, size, themeColor)
    }

    // Collect all paths with their attributes
    const paths = pathMatches.map((match) => {
      const fullMatch = match[0]
      const fillMatch = fullMatch.match(/fill="([^"]*)"/)
      const fill = fillMatch ? fillMatch[1] : 'currentColor'
      return {
        d: match[1],
        fill: fill,
      }
    })

    // Calculate padding for the icon inside the circle
    // Icons should take about 70% of the circle's diameter (a bit larger than before)
    const iconPadding = size * 0.15 // 15% padding on each side = 70% icon size

    // Create our styled SVG with the path data - with high precision
    const styledSvg = `
      <svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" shape-rendering="geometricPrecision">
        <circle cx="${size / 2}" cy="${size / 2}" r="${size / 2}" fill="${themeColor.light}" />
        <g transform="translate(${iconPadding}, ${iconPadding}) scale(${(size - 2 * iconPadding) / originalViewBox[2]})">
          ${paths.map((path) => `<path d="${path.d}" fill="${themeColor.action}" />`).join('')}
        </g>
      </svg>
    `

    // Convert SVG to PNG at high quality
    const outputBuffer = await sharp(Buffer.from(styledSvg), { density: 300 }).png({ quality: 100 }).toBuffer()

    // Return the processed image
    return new NextResponse(outputBuffer, {
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'public, max-age=3600',
      },
    })
  } catch (error) {
    console.error('Error processing icon:', error)
    return new NextResponse('Error processing image', { status: 500 })
  }
}

// Helper function to generate a fallback icon
function generateFallbackIcon(iconName: string, size: number, themeColor: any) {
  // Create a simple fallback icon with the first letter of the icon name
  const letter = iconName.charAt(0).toUpperCase()

  const fallbackSvg = `
    <svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg" shape-rendering="geometricPrecision">
      <circle cx="${size / 2}" cy="${size / 2}" r="${size / 2}" fill="${themeColor.light}" />
      <text x="${size / 2}" y="${size / 2 + size / 10}" 
            font-family="Arial" font-size="${size / 3}" 
            text-anchor="middle" font-weight="bold" fill="${themeColor.action}">
        ${letter}
      </text>
    </svg>
  `

  return sharp(Buffer.from(fallbackSvg), { density: 300 })
    .png({ quality: 100 })
    .toBuffer()
    .then((buffer) => {
      return new NextResponse(buffer, {
        headers: {
          'Content-Type': 'image/png',
          'Cache-Control': 'public, max-age=3600',
        },
      })
    })
}
