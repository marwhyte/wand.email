import fs from 'fs'
import path from 'path'
import sharp from 'sharp'
import { getThemeColors } from './colors'

// Only using outlined icons as specified
const ICON_VARIANT = 'outlined'

// Built-in SVG paths for the most commonly used icons as emergency fallbacks
const BUILT_IN_ICONS: Record<string, string> = {
  star: '<path d="M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>',
  home: '<path d="M12 5.69l5 4.5V18h-2v-6H9v6H7v-7.81l5-4.5M12 3L2 12h3v8h6v-6h2v6h6v-8h3L12 3z"/>',
  check: '<path d="M9 16.17 4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>',
}

// Local development paths
const BASE_ICONS_DIR = path.join(process.cwd(), 'public/icons')
console.log('BASE_ICONS_DIR path:', BASE_ICONS_DIR)

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

    // First check if we have a built-in emergency fallback icon
    let svgContent = null
    const iconNameKey = iconName.toLowerCase()

    // Try to get SVG content based on environment
    if (process.env.NODE_ENV === 'development') {
      // In development, try to read from the file system first
      try {
        const variantDir = path.join(BASE_ICONS_DIR, ICON_VARIANT)
        const iconPath = path.join(variantDir, `${normalizedIconName}.svg`)

        if (fs.existsSync(iconPath)) {
          svgContent = fs.readFileSync(iconPath, 'utf8')
        }
      } catch (err) {
        console.warn('Error reading icon from file system:', err)
      }
    } else {
      // In production, try to fetch from the CDN URL
      try {
        // Use global fetch to get the SVG from the deployed CDN
        const iconUrl = `/icons/${ICON_VARIANT}/${normalizedIconName}.svg`
        const response = await fetch(iconUrl)

        if (response.ok) {
          svgContent = await response.text()
        } else {
          console.warn(`Icon not found at URL: ${iconUrl}, status: ${response.status}`)
        }
      } catch (fetchErr) {
        console.warn('Error fetching icon from CDN:', fetchErr)
      }
    }

    // If we still don't have SVG content, use our built-in fallbacks
    if (!svgContent && BUILT_IN_ICONS[iconNameKey]) {
      console.log(`Using built-in fallback icon for ${iconName}`)
      svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">${BUILT_IN_ICONS[iconNameKey]}</svg>`
    }

    // If still no SVG content, use the letter fallback
    if (!svgContent) {
      console.log(`Icon ${normalizedIconName} not found, using letter fallback`)
      return generateFallbackIconPng(normalizedIconName, size, theme)
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
