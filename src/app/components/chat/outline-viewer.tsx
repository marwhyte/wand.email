interface OutlineSection {
  title: string
  items: string[]
}

interface Outline {
  emailType: string
  sections: OutlineSection[]
}

function parseOutline(content: string): Outline {
  try {
    const lines = content.split('\n')
    const outline: Outline = {
      emailType: '',
      sections: [],
    }

    let currentSection: OutlineSection | null = null
    let currentItems: string[] = []

    for (const line of lines) {
      const trimmedLine = line.trim()
      if (!trimmedLine) continue

      // Parse header information
      if (trimmedLine.startsWith('Email Type:')) {
        outline.emailType = trimmedLine.replace('Email Type:', '').trim()
        continue
      }

      // Parse sections
      if (/^\d+\./.test(trimmedLine)) {
        if (currentSection) {
          currentSection.items = currentItems
          outline.sections.push(currentSection)
          currentItems = []
        }
        currentSection = {
          title: trimmedLine.replace(/^\d+\.\s*/, '').trim(),
          items: [],
        }
        continue
      }

      // Parse bullet points
      if (trimmedLine.startsWith('•') || trimmedLine.startsWith('*')) {
        const item = trimmedLine.replace(/^[•*]\s*/, '').trim()
        if (item) {
          currentItems.push(item)
        }
        continue
      }

      // Handle indented bullet points
      if (trimmedLine.startsWith('  •') || trimmedLine.startsWith('  *')) {
        const item = trimmedLine.replace(/^  [•*]\s*/, '').trim()
        if (item) {
          currentItems.push(item)
        }
        continue
      }
    }

    // Add the last section if exists
    if (currentSection) {
      currentSection.items = currentItems
      outline.sections.push(currentSection)
    }

    return outline
  } catch (error) {
    console.error('Error parsing outline:', error)
    return {
      emailType: 'Error',
      sections: [{ title: 'Error', items: ['Failed to parse outline'] }],
    }
  }
}

export function OutlineViewer({ content }: { content: string }) {
  const outline = parseOutline(content)

  return (
    <div className="prose prose-sm max-w-none">
      <div className="mb-4 text-sm text-gray-500">
        <span className="font-medium">Email Type:</span> {outline.emailType}
      </div>

      <ol className="list-decimal space-y-4 pl-5">
        {outline.sections.map((section, index) => (
          <li key={index} className="text-sm">
            <span className="font-medium">{section.title}</span>
            <ul className="mt-1 list-none space-y-1 pl-4">
              {section.items.map((item, itemIndex) => (
                <li key={itemIndex} className="text-gray-600">
                  • {item}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ol>
    </div>
  )
}
