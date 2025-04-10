'use client'

import { getThemeColors, shouldUseDarkText } from '@/lib/utils/colors'
import { closest } from 'color-2-name'
import namer from 'color-namer'
import { useState } from 'react'

// Helper function to get AI-friendly color representation
const getAIFriendlyColorDescription = (hexColor: string) => {
  const colorNames = namer(hexColor)
  const closestColorName = closest(hexColor).name

  // Use the most common name first, then the more specific ones
  return `${hexColor} (${closestColorName}, described as ${colorNames.basic[0].name} or ${colorNames.ntc[0].name})`
}

// More compact color sets with a wide range from light to dark
const COLORS = {
  themes: ['#8e6ff7', '#fcf8f2', '#059669', '#3b82f6', '#fed776'],
  reds: ['#FFD1D1', '#FFAAAA', '#FF7777', '#FF4444', '#FF0000', '#CC0000', '#990000', '#660000', '#330000'],
  oranges: ['#FFE8CC', '#FFDAAA', '#FFCC88', '#FFAA44', '#FF8800', '#EE7700', '#CC6600', '#994C00', '#663300'],
  yellows: ['#FFFFCC', '#FFFFAA', '#FFFF77', '#FFFF44', '#FFFF00', '#EEEE00', '#AAAA00', '#777700', '#444400'],
  greens: ['#CCFFCC', '#AAFFAA', '#77FF77', '#44FF44', '#00FF00', '#00CC00', '#009900', '#006600', '#003300'],
  blues: ['#CCCCFF', '#AAAAFF', '#7777FF', '#4444FF', '#0000FF', '#0000CC', '#000099', '#000066', '#000033'],
  purples: ['#E8CCFF', '#DDAAFF', '#CC88FF', '#BB44FF', '#9900FF', '#7700CC', '#550099', '#330066', '#220033'],
  pinks: ['#FFCCFF', '#FFAAFF', '#FF77FF', '#FF44FF', '#FF00FF', '#CC00CC', '#990099', '#660066', '#330033'],
  grays: ['#FFFFFF', '#DDDDDD', '#BBBBBB', '#999999', '#777777', '#555555', '#333333', '#222222', '#000000'],
}

// Helper component for each color sample
const ColorSample = ({ color }: { color: string }) => {
  const theme = getThemeColors(color)
  const usesDarkText = shouldUseDarkText(theme.action)
  const aiDescription = getAIFriendlyColorDescription(color)

  return (
    <div className="mb-3 overflow-hidden rounded-lg border border-gray-300">
      {/* Header with color info */}
      <div className="border-b border-gray-300 bg-gray-50 px-2 py-1 text-xs font-medium">
        <div>{color}</div>
        <div className="text-xs text-gray-500">{aiDescription}</div>
      </div>

      {/* Preview area with light background */}
      <div className="p-3" style={{ backgroundColor: theme.light }}>
        <div className="mb-2 overflow-hidden rounded-md bg-white p-2 shadow-sm">
          {/* Button */}
          <button
            className="mb-2 w-full rounded px-2 py-1 text-xs font-medium"
            style={{
              backgroundColor: theme.action,
              color: usesDarkText ? '#000000' : '#FFFFFF',
            }}
          >
            Button
          </button>

          {/* Card with gradients */}
          <div className="mb-2 rounded bg-white p-1 text-xs shadow-sm">
            {/* Light gradient */}
            <div
              className="mb-1 flex h-5 items-center justify-center rounded text-[10px] font-medium"
              style={{
                backgroundImage: `linear-gradient(to right, ${theme.gradientLight.start}, ${theme.gradientLight.end})`,
                color: shouldUseDarkText(theme.gradientLight.start) ? '#000' : '#fff',
              }}
            >
              Light
            </div>

            {/* Dark gradient */}
            <div
              className="flex h-5 items-center justify-center rounded text-[10px] font-medium"
              style={{
                backgroundImage: `linear-gradient(to right, ${theme.gradientDark.start}, ${theme.gradientDark.end})`,
                color: shouldUseDarkText(theme.gradientDark.start) ? '#000' : '#fff',
              }}
            >
              Dark
            </div>
          </div>

          {/* Levels indicators */}
          <div className="flex h-3 w-full overflow-hidden rounded">
            {theme.levels.map((level, i) => (
              <div key={i} className="flex-1" style={{ backgroundColor: level }} title={`Level ${i}: ${level}`} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// Color name tester
const ColorNameTester = () => {
  const [customColor, setCustomColor] = useState('#3b82f6')
  const aiDescription = getAIFriendlyColorDescription(customColor)

  return (
    <div className="rounded-lg bg-white p-4 shadow">
      <h2 className="mb-3 font-semibold">Color Name Tester</h2>
      <div className="flex items-center gap-3">
        <input
          type="color"
          value={customColor}
          onChange={(e) => setCustomColor(e.target.value)}
          className="h-10 w-16 cursor-pointer"
        />
        <div className="flex-1">
          <div className="font-medium">{customColor}</div>
          <div className="text-sm text-gray-600">{aiDescription}</div>
        </div>
      </div>
    </div>
  )
}

export default function ColorsPage() {
  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <h1 className="mb-4 text-xl font-bold">Color System Visualization</h1>

      {/* Controls */}
      <div className="mb-4 rounded-lg bg-white p-3 shadow">
        <p className="text-sm text-gray-600">
          This page shows how various colors are processed by the getThemeColors function with gradient levels. Each
          sample displays a button, light/dark gradients, and all 8 color levels.
        </p>
      </div>

      {/* Color Name Tester */}
      <ColorNameTester />

      {/* Color groups */}
      <div className="mt-6 space-y-6">
        {Object.entries(COLORS).map(([category, colors]) => (
          <div key={category} className="rounded-lg bg-white p-4 shadow">
            <h2 className="mb-3 font-semibold capitalize">{category}</h2>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-9">
              {colors.map((color) => (
                <ColorSample key={color} color={color} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
