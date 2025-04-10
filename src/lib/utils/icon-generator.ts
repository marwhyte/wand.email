import fs from 'fs'
import path from 'path'
import sharp from 'sharp'
import { getThemeColors } from './colors'

// Get the path to the icons in the public folder
const BASE_ICONS_DIR = path.join(process.cwd(), 'public/icons')

// Only using outlined icons as specified
const ICON_VARIANT = 'outlined'

/**
 * Generates an icon as a PNG buffer
 * @param iconName The name of the icon to generate
 * @param theme The theme to use for the icon
 * @param size The size of the icon in pixels
 * @returns PNG buffer of the generated icon
 */
export async function generateIconPng(iconName: string, themeColor: string, size: number): Promise<Buffer> {
  try {
    const theme = getThemeColors(themeColor)

    console.log('generating icon', iconName, themeColor, size)
    // Convert kebab-case to camelCase for the filename (e.g., local-shipping -> local_shipping)
    const normalizedIconName = iconName.replace(/-/g, '_')

    // Look for the icon in the outlined variant directory
    const variantDir = path.join(BASE_ICONS_DIR, ICON_VARIANT)
    const iconPath = path.join(variantDir, `${normalizedIconName}.svg`)

    // Check if the file exists
    let svgContent = null
    if (fs.existsSync(iconPath)) {
      svgContent = fs.readFileSync(iconPath, 'utf8')
    }

    // If we couldn't find the icon, fall back to a generic one
    if (!svgContent) {
      console.error(`Icon ${normalizedIconName} not found in the public icons directory`)
      return generateFallbackIconPng(normalizedIconName, size, themeColor)
    }

    // Extract the viewBox to understand original dimensions
    const viewBoxMatch = svgContent.match(/viewBox=['"]([\d\s.]+)['"]/i)
    const originalViewBox = viewBoxMatch ? viewBoxMatch[1].split(/\s+/).map(Number) : [0, 0, 24, 24]

    // Extract all path data from the SVG (some icons have multiple paths)
    const pathMatches = [...svgContent.matchAll(/<path[^>]*d="([^"]*)"/g)]
    if (pathMatches.length === 0) {
      console.error('Could not extract path from SVG')
      return generateFallbackIconPng(normalizedIconName, size, themeColor)
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
        <circle cx="${size / 2}" cy="${size / 2}" r="${size / 2}" fill="${theme.gradientLight.start}" />
        <g transform="translate(${iconPadding}, ${iconPadding}) scale(${(size - 2 * iconPadding) / originalViewBox[2]})">
          ${paths.map((path) => `<path d="${path.d}" fill="${theme.action}" />`).join('')}
        </g>
      </svg>
    `

    // Convert SVG to PNG at high quality
    return await sharp(Buffer.from(styledSvg), { density: 300 }).png({ quality: 100 }).toBuffer()
  } catch (error) {
    console.error('Error generating icon:', error)
    throw error
  }
}

/**
 * Generates a fallback icon PNG when the requested icon is not found
 * @param iconName The name of the icon to generate a fallback for
 * @param size The size of the icon in pixels
 * @param themeColor The theme colors to use
 * @returns PNG buffer of the fallback icon
 */
async function generateFallbackIconPng(iconName: string, size: number, themeColor: any): Promise<Buffer> {
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

  return await sharp(Buffer.from(fallbackSvg), { density: 300 }).png({ quality: 100 }).toBuffer()
}
