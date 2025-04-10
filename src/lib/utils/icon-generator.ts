import fs from 'fs'
import path from 'path'
import sharp from 'sharp'
import { getThemeColors } from './colors'

// Get the path to the icons in the public folder
const BASE_ICONS_DIR = path.join(process.cwd(), 'public/icons')
console.log('BASE_ICONS_DIR path:', BASE_ICONS_DIR)

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

    // Debug: Check if public directory exists and its contents
    const publicDir = path.join(process.cwd(), 'public')
    if (fs.existsSync(publicDir)) {
      try {
        const publicContents = fs.readdirSync(publicDir)
        console.log('Public directory contents:', publicContents)
      } catch (err) {
        console.error('Error reading public directory:', err)
      }
    } else {
      console.error('Public directory does not exist:', publicDir)
    }

    // Look for the icon in the outlined variant directory
    const variantDir = path.join(BASE_ICONS_DIR, ICON_VARIANT)
    const iconPath = path.join(variantDir, `${normalizedIconName}.svg`)

    console.log('Looking for icon at path:', iconPath)

    // Debug: Check if the directory exists and list available icons
    if (fs.existsSync(variantDir)) {
      try {
        const files = fs.readdirSync(variantDir)
        console.log(
          `Found ${files.length} icons in directory. Examples:`,
          files.slice(0, 5),
          files.includes(`${normalizedIconName}.svg`)
            ? 'Target icon found in directory!'
            : 'Target icon NOT found in directory'
        )
      } catch (readErr) {
        console.error('Error reading directory:', readErr)
      }
    } else {
      console.error('Icon directory does not exist:', variantDir)
    }

    // Check if the file exists
    let svgContent = null
    if (fs.existsSync(iconPath)) {
      svgContent = fs.readFileSync(iconPath, 'utf8')
    } else {
      // Try with .png extension as fallback
      const pngPath = path.join(variantDir, `${normalizedIconName}.png`)
      if (fs.existsSync(pngPath)) {
        // If we find a PNG, we can use that directly
        console.log('Found PNG version of icon')
        return await sharp(pngPath).resize(size, size).png({ quality: 100 }).toBuffer()
      }
    }

    // If we couldn't find the icon, try to find a similar icon or fall back to a generic one
    if (!svgContent) {
      console.warn(`Icon ${normalizedIconName} not found in the public icons directory, trying fallback options`)

      // Try some common alternatives (e.g., if star isn't found, try star_rate or grade or favorite)
      const alternatives: Record<string, string[]> = {
        star: ['star_rate', 'grade', 'favorite'],
        check: ['done', 'task_alt', 'check_circle'],
        heart: ['favorite', 'favorite_border'],
        user: ['person', 'account_circle'],
        home: ['house', 'home_filled'],
        // Add more common alternatives as needed
      }

      // Try the alternatives if available
      if (alternatives[iconName]) {
        for (const alt of alternatives[iconName]) {
          const altPath = path.join(variantDir, `${alt}.svg`)
          if (fs.existsSync(altPath)) {
            console.log(`Using alternative icon: ${alt} instead of ${iconName}`)
            svgContent = fs.readFileSync(altPath, 'utf8')
            break
          }
        }
      }

      // If still no icon found, use fallback
      if (!svgContent) {
        console.error(`Icon ${normalizedIconName} and alternatives not found, using fallback`)
        return generateFallbackIconPng(normalizedIconName, size, theme)
      }
    }

    // Extract the viewBox to understand original dimensions
    const viewBoxMatch = svgContent.match(/viewBox=['"]([\d\s.]+)['"]/i)
    const originalViewBox = viewBoxMatch ? viewBoxMatch[1].split(/\s+/).map(Number) : [0, 0, 24, 24]

    // Extract all path data from the SVG (some icons have multiple paths)
    const pathMatches = [...svgContent.matchAll(/<path[^>]*d="([^"]*)"/g)]
    if (pathMatches.length === 0) {
      console.error('Could not extract path from SVG')
      return generateFallbackIconPng(normalizedIconName, size, theme)
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
  try {
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
  } catch (fallbackError) {
    console.error('Error generating fallback icon, using ultra fallback:', fallbackError)

    // Ultra fallback - a simple colored square if even the SVG generation fails
    const ultraFallbackSvg = `<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg"><rect width="${size}" height="${size}" fill="blue"/></svg>`
    return Buffer.from(ultraFallbackSvg)
  }
}
