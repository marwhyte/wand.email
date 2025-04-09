'use client'

import { useEffect } from 'react'
import { getThemeColors } from './lib/utils/colors'

export default function TestColors() {
  useEffect(() => {
    const colors = getThemeColors('#8e6ff7')
    console.log('Theme colors for #8e6ff7:')
    console.log('Base:', colors.base)
    console.log('Gradient Light Start:', colors.gradientLight.start)
    console.log('Gradient Light End:', colors.gradientLight.end)

    // Check luminance
    console.log('Luminance values:')
    const getLuminance = (hex: string) => {
      // Simple luminance calculation for checking
      const r = parseInt(hex.substring(1, 3), 16)
      const g = parseInt(hex.substring(3, 5), 16)
      const b = parseInt(hex.substring(5, 7), 16)
      return (0.299 * r + 0.587 * g + 0.114 * b) / 255
    }

    console.log('Base luminance:', getLuminance(colors.base))
    console.log('Gradient Start luminance:', getLuminance(colors.gradientLight.start))
    console.log('Gradient End luminance:', getLuminance(colors.gradientLight.end))
  }, [])

  return (
    <div className="p-4">
      <h1>Color Test for #8e6ff7</h1>
      <p>Check the console for details</p>
    </div>
  )
}
