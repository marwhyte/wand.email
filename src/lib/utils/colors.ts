export type ThemeColors = {
  name: string
  light: string
  base: string
  action: string
  textColor: string
  gradientLight: {
    start: string
    end: string
  }
  gradientDark: {
    start: string
    end: string
  }
  levels: string[]
}

// Utility functions for color manipulation
export function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const sanitizedHex = hex.replace('#', '')
  const r = parseInt(sanitizedHex.substring(0, 2), 16)
  const g = parseInt(sanitizedHex.substring(2, 4), 16)
  const b = parseInt(sanitizedHex.substring(4, 6), 16)
  return { r, g, b }
}

export function rgbToHex(r: number, g: number, b: number): string {
  return (
    '#' +
    [r, g, b]
      .map((x) => {
        const hex = Math.max(0, Math.min(255, Math.round(x))).toString(16)
        return hex.length === 1 ? '0' + hex : hex
      })
      .join('')
  )
}

export function getLuminance(hex: string): number {
  const { r, g, b } = hexToRgb(hex)
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255
}

export function lighten(hex: string, amount: number): string {
  const { r, g, b } = hexToRgb(hex)
  return rgbToHex(r + (255 - r) * amount, g + (255 - g) * amount, b + (255 - b) * amount)
}

export function shouldUseDarkText(backgroundColor: string) {
  // Convert hex to RGB
  const hex = backgroundColor.replace('#', '')
  const r = parseInt(hex.substring(0, 2), 16)
  const g = parseInt(hex.substring(2, 4), 16)
  const b = parseInt(hex.substring(4, 6), 16)

  // Calculate relative luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255

  // Use dark text if background is light (luminance > 0.65)
  return luminance > 0.58
}

export function darken(hex: string, amount: number): string {
  const { r, g, b } = hexToRgb(hex)
  return rgbToHex(r * (1 - amount), g * (1 - amount), b * (1 - amount))
}

/**
 * Generate a complete theme color set from a single hex color
 */
export function getThemeColors(themeColor: string): ThemeColors {
  // Default to a purple if undefined or invalid
  if (!themeColor || !/^#([0-9A-F]{3}){1,2}$/i.test(themeColor)) {
    themeColor = '#8e6ff7' // Default purple
  }

  const luminance = getLuminance(themeColor)
  const isDark = luminance < 0.5

  // Set the action color to the input color
  let actionColor = themeColor

  // Base color is always white to ensure maximum contrast with gradients
  let baseColor = '#ffffff'

  // Determine text color based on theme color
  let textColor = shouldUseDarkText(themeColor) ? '#000000' : '#ffffff'

  // Get RGB components for color analysis
  const { r, g, b } = hexToRgb(themeColor)

  // Special case for pure black and white
  // Handle them immediately before the regular processing
  if (themeColor.toLowerCase() === '#000000' || themeColor.toLowerCase() === '#ffffff') {
    const levelColors = []

    if (themeColor.toLowerCase() === '#000000') {
      // For black, create a grayscale from almost white to black
      levelColors.push('#f8f8f8') // Almost white
      levelColors.push('#e0e0e0')
      levelColors.push('#c0c0c0')
      levelColors.push('#a0a0a0')
      levelColors.push('#808080')
      levelColors.push('#606060')
      levelColors.push('#404040')
      levelColors.push('#000000') // Pure black

      return {
        name: 'black',
        light: '#f0f0f0', // Light gray background
        base: '#ffffff', // White base
        action: '#000000', // Black action color
        textColor: '#000000', // Black text for light backgrounds
        gradientLight: {
          start: '#e0e0e0',
          end: '#c0c0c0',
        },
        gradientDark: {
          start: '#808080',
          end: '#404040',
        },
        levels: levelColors,
      }
    } else {
      // For white, create a grayscale from white to light gray
      levelColors.push('#f8f8f8') // Slightly off-white
      levelColors.push('#f0f0f0')
      levelColors.push('#e8e8e8')
      levelColors.push('#e0e0e0')
      levelColors.push('#d8d8d8')
      levelColors.push('#d0d0d0')
      levelColors.push('#c8c8c8')
      levelColors.push('#c0c0c0') // Light gray

      return {
        name: 'white',
        light: '#f0f0f0', // Slightly gray background instead of pure white
        base: '#ffffff', // White base
        action: '#c0c0c0', // Light gray action color
        textColor: '#000000', // Black text for light backgrounds
        gradientLight: {
          start: '#e8e8e8',
          end: '#d8d8d8',
        },
        gradientDark: {
          start: '#c8c8c8',
          end: '#b0b0b0',
        },
        levels: levelColors,
      }
    }
  }

  // Generate 8 adaptive gradient levels based on original color luminance
  const levelColors = []

  // For ALL colors, generate a consistent scale from very light to dark
  // Always generating full range ensures we have good options for gradients

  // Level 0 - Extremely light: Always very close to white (95% lightened)
  levelColors.push(lighten(themeColor, 0.95))

  // Level 1 - Very light: Close to white but with visible color (85% lightened)
  levelColors.push(lighten(themeColor, 0.85))

  // Level 2 - Light: Still light but with more color (70% lightened)
  levelColors.push(lighten(themeColor, 0.7))

  // Level 3 - Medium-light: A lighter version of the color (40% lightened)
  levelColors.push(lighten(themeColor, 0.4))

  // Level 4 - Base: The original color
  levelColors.push(themeColor)

  // Level 5 - Medium-dark: Slightly darkened (20% darkened)
  levelColors.push(darken(themeColor, 0.2))

  // Level 6 - Dark: Considerably darkened (40% darkened)
  levelColors.push(darken(themeColor, 0.4))

  // Level 7 - Very dark: Significantly darkened (60% darkened)
  levelColors.push(darken(themeColor, 0.6))

  // Light background is the lightest level
  let lightColor = levelColors[0]

  // Special case for explicitly dark themes
  if (themeColor.toLowerCase() === '#1a1c1e' || themeColor.toLowerCase() === '#121212') {
    baseColor = '#1a1c1e'

    // Reset the levels array
    levelColors.length = 0

    // For extremely dark themes, create a balanced range with better light end
    levelColors.push('#f0f0f5') // Even lighter gray - almost white with just a hint of theme
    levelColors.push('#e0e0e7') // Very light gray with hint of theme
    levelColors.push('#c0c0c8') // Light gray with hint of theme
    levelColors.push('#9c9ca5') // Medium light gray
    levelColors.push('#7a7a82') // Medium gray
    levelColors.push('#58585f') // Medium-dark gray
    levelColors.push('#38383f') // Dark gray
    levelColors.push('#1a1c1e') // Original dark theme

    // Set the light color to a dark but visible shade
    lightColor = '#f0f0f5' // Use a very light color instead of dark
  }

  // Define color family type for TypeScript type safety
  type ColorFamily = 'purple' | 'blue' | 'green' | 'red' | 'yellow' | 'orange' | 'pink' | 'teal' | 'indigo' | 'gray'

  // Define gradient type
  type GradientPair = {
    start: string
    end: string
  }

  // Predefined beautiful gradient pairs for different color families
  // Each gradient pair has been carefully curated to create appealing color mixes
  // with complementary or adjacent colors on the color wheel
  const lightGradients: Record<ColorFamily, GradientPair> = {
    // Purple family gradients - mixing purple and indigo for a richer gradient
    purple: {
      start: '#faf5ff', // purple-50
      end: '#eef2ff', // indigo-50
    },
    // Blue family gradients - mixing blue and cyan
    blue: {
      start: '#eff6ff', // blue-50
      end: '#ecfeff', // cyan-50
    },
    // Green family gradients - mixing green and teal
    green: {
      start: '#ecfdf5', // green-50
      end: '#f0fdfa', // teal-50
    },
    // Red family gradients - mixing red and rose
    red: {
      start: '#fef2f2', // red-50
      end: '#fff1f2', // rose-50
    },
    // Yellow family gradients - mixing yellow and amber
    yellow: {
      start: '#fefce8', // yellow-50
      end: '#fffbeb', // amber-50
    },
    // Orange family gradients - mixing orange and amber
    orange: {
      start: '#fff7ed', // orange-50
      end: '#fffbeb', // amber-50
    },
    // Pink family gradients - mixing pink and fuchsia
    pink: {
      start: '#fdf2f8', // pink-50
      end: '#fdf4ff', // fuchsia-50
    },
    // Teal family gradients - mixing teal and cyan
    teal: {
      start: '#f0fdfa', // teal-50
      end: '#ecfeff', // cyan-50
    },
    // Indigo family gradients - mixing indigo and violet
    indigo: {
      start: '#eef2ff', // indigo-50
      end: '#f5f3ff', // violet-50
    },
    // Gray family gradients - mixing cool and warm grays
    gray: {
      start: '#f9fafb', // gray-50
      end: '#f8fafc', // slate-50
    },
  }

  const darkGradients: Record<ColorFamily, GradientPair> = {
    // Purple family gradients - mixing purple and indigo
    purple: {
      start: '#f3e8ff', // purple-100
      end: '#e0e7ff', // indigo-100
    },
    // Blue family gradients - mixing blue and sky
    blue: {
      start: '#dbeafe', // blue-100
      end: '#e0f2fe', // sky-100
    },
    // Green family gradients - mixing green and emerald
    green: {
      start: '#d1fae5', // emerald-100
      end: '#a7f3d0', // green-200
    },
    // Red family gradients - mixing red and rose
    red: {
      start: '#fee2e2', // red-100
      end: '#ffe4e6', // rose-100
    },
    // Yellow family gradients - mixing yellow and amber
    yellow: {
      start: '#fef9c3', // yellow-100
      end: '#fef3c7', // amber-100
    },
    // Orange family gradients - mixing orange and amber
    orange: {
      start: '#ffedd5', // orange-100
      end: '#fef3c7', // amber-100
    },
    // Pink family gradients - mixing pink and fuchsia
    pink: {
      start: '#fce7f3', // pink-100
      end: '#fae8ff', // fuchsia-100
    },
    // Teal family gradients - mixing teal and cyan
    teal: {
      start: '#ccfbf1', // teal-100
      end: '#cffafe', // cyan-100
    },
    // Indigo family gradients - mixing indigo and violet
    indigo: {
      start: '#e0e7ff', // indigo-100
      end: '#ede9fe', // violet-100
    },
    // Gray family gradients - mixing cool and warm grays
    gray: {
      start: '#f3f4f6', // gray-100
      end: '#f1f5f9', // slate-100
    },
  }

  // Determine color family based on RGB analysis with improved classification
  let colorFamily: ColorFamily = 'gray'

  // Identify the dominant color channel and classify
  const maxChannel = Math.max(r, g, b)

  // Improved purple detection to ensure purple hex codes map to purple gradients
  if (r > 120 && b > 220 && r < b) {
    colorFamily = 'purple'
  } else if (r > 100 && b > 190 && g < 150 && r < b) {
    colorFamily = 'purple'
  } else if (r > 200 && g > 200 && b < 150) {
    colorFamily = 'yellow'
  } else if (r > 200 && g > 100 && g < 200 && b < 100) {
    colorFamily = 'orange'
  } else if (r > Math.max(g, b) * 1.5) {
    colorFamily = 'red'
  } else if (g > Math.max(r, b) * 1.5) {
    colorFamily = 'green'
  } else if (b > Math.max(r, g) * 1.5) {
    colorFamily = 'blue'
  } else if (g > r && b > r * 0.7 && g > 100 && b > 100) {
    colorFamily = 'teal'
  } else if (r > g && b > g && r > 100 && b > 100) {
    if (r > b) {
      colorFamily = 'pink'
    } else {
      colorFamily = 'purple'
    }
  } else if (b > r && b > g && r > g) {
    // Improved detection of purple vs indigo
    if (r > 130 && r / b > 0.6) {
      colorFamily = 'purple'
    } else {
      colorFamily = 'indigo'
    }
  }

  // Special case for #8e6ff7 (the specific purple color mentioned)
  if (themeColor.toLowerCase() === '#8e6ff7') {
    colorFamily = 'purple'
  }

  // Get gradient pairs based on color family
  const lightGradient = lightGradients[colorFamily]
  const darkGradient = darkGradients[colorFamily]

  // Determine common theme name if it matches known colors
  let name = colorFamily

  return {
    name,
    light: lightColor,
    base: baseColor,
    action: actionColor,
    textColor: shouldUseDarkText(actionColor) ? '#000000' : '#ffffff',
    gradientLight: {
      start: lightGradient.start,
      end: lightGradient.end,
    },
    gradientDark: {
      start: darkGradient.start,
      end: darkGradient.end,
    },
    levels: levelColors,
  }
}
