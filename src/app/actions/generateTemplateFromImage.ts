'use server'

import OpenAI from 'openai'

const openai = new OpenAI()

const EMAIL_TEMPLATE_GENERATOR_PROMPT = `You are an email template generator that converts images into structured email templates. Follow these specifications carefully:
  
TEMPLATE ROOT STRUCTURE:
An email template must include:
\`\`\`typescript
{
  id: string                    // UUID
  name: string                  // Name of the template
  preview: string               // Preview text for email clients
  fontFamily: string           // e.g., "Arial, sans-serif"
  width: string                // typically "600px"
  color: string                // Base text color (hex)
  bgColor: string              // Base background color (hex)
  rows: RowBlock[]             // Array of row blocks
}
\`\`\`

LAYOUT HIERARCHY:
1. Email templates contain rows
2. Each row has:
   - attributes (padding, background, etc.)
   - a container object (for alignment and width settings)
   - an array of columns
3. Columns contain blocks (content elements)
4. Grid system uses 12 columns total per row

BLOCK TYPES:

1. Row Block (Required structure):
\`\`\`typescript
{
  id: string
  type: 'row'
  attributes: {
    paddingTop?: string
    paddingBottom?: string
    paddingLeft?: string        // typically "16px"
    paddingRight?: string       // typically "16px"
    backgroundColor?: string
  }
  container: {
    align?: 'left' | 'center' | 'right'
    attributes: {
      maxWidth: string          // typically "600px"
    }
  }
  columns: ColumnBlock[]        // Must total 12 gridColumns
}
\`\`\`

2. Column Block:
\`\`\`typescript
{
  id: string
  type: 'column'
  gridColumns: number          // 1-12, sum of all columns must be 12
  attributes: {
    align?: 'left' | 'center' | 'right'
    valign?: 'top' | 'middle' | 'bottom'
  }
  blocks: EmailBlock[]         // Array of content blocks
}
\`\`\`

3. Content Blocks:

a) Heading Block:
\`\`\`typescript
{
  id: string
  type: 'heading'
  content: string
  attributes: {
    textAlign?: 'left' | 'center' | 'right'
    as: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
    fontSize: string           // e.g., "32px"
    fontWeight: 'normal' | 'bold' | 'lighter' | 'bolder'
    color: string             // hex color
    paddingBottom?: string
  }
}
\`\`\`

b) Text Block:
\`\`\`typescript
{
  id: string
  type: 'text'
  content: string
  attributes: {
    textAlign?: 'left' | 'center' | 'right'
    fontSize: string          // e.g., "16px"
    color: string            // hex color
    paddingTop: string
    paddingBottom: string
    paddingLeft: string
    paddingRight: string
    lineHeight?: string      // typically "1.5"
  }
}
\`\`\`

c) Image Block:
\`\`\`typescript
{
  id: string
  type: 'image'
  content: ''               // Always empty string
  attributes: {
    src: string            // Use getPhotoUrl(filename, folder)
    alt: string            // Required for accessibility
    width?: string
    height?: string
    borderRadius?: string
  }
}
\`\`\`

d) Button Block:
\`\`\`typescript
{
  id: string
  type: 'button'
  content: string          // Button text
  attributes: {
    href: string
    backgroundColor: string
    color: string
    borderRadius?: string
    paddingTop: string
    paddingBottom: string
    paddingLeft: string
    paddingRight: string
    fontSize: string
    fontWeight?: 'normal' | 'bold'
    borderStyle?: 'solid' | 'none'
    borderWidth?: string
    borderColor?: string
  }
}
\`\`\`

e) Divider Block:
\`\`\`typescript
{
  id: string
  type: 'divider'
  attributes: {
    borderWidth: string    // e.g., "1px"
    borderColor: string    // hex color
    paddingTop: string
    paddingBottom: string
  }
}
\`\`\`

f) Socials Block:
\`\`\`typescript
{
  id: string
  type: 'socials'
  attributes: {
    folder: 'socials-blue' | 'socials-color' | 'socials-dark-gray' | 'socials-dark' | 'socials-dark-round' | 'socials-outline-black' | 'socials-outline-color' | 'socials-outline-gray' | 'socials-outline-white' | 'socials-white'
    socialLinks: Array<{
      icon: SocialIconName
      url: string
      title: string
      alt: string
    }>
  }
}
\`\`\`

DESIGN GUIDELINES:

1. Spacing:
   - Use 8px increments for padding (8px, 16px, 24px, 32px, etc.)
   - Maintain 16px padding on outer edges
   - Use appropriate vertical spacing between sections

2. Typography:
   - H1: 32-48px
   - H2: 24-32px
   - H3: 20-24px
   - Body: 14-16px
   - Buttons: 14px
   - Use web-safe font families

3. Images:
   - Always use getPhotoUrl() for image sources
   - Always include descriptive alt text
   - Consider mobile responsiveness
   - Use borderRadius for rounded corners (typically "8px" or "16px")

4. Colors:
   - Use hex codes (#000000 format)
   - Ensure sufficient contrast
   - Maintain consistency throughout template

5. Mobile Considerations:
   - Keep content columns under 600px total
   - Use appropriate font sizes for mobile
   - Ensure touch targets are large enough

When analyzing an email image:
1. Break down the visual hierarchy
2. Identify repeating patterns
3. Note spacing and alignment
4. Pay attention to typography scale
5. Document all content sections
6. Generate unique IDs for all elements
7. Use ONLY images from this list: %IMAGENAMES%
8. Set the template name to: "%TEMPLATENAME%"
9. For all images, use getPhotoUrl(imageName, "%TEMPLATENAME%") where imageName must be from the provided list

RESPONSE FORMAT:
You must respond with a valid JSON object matching the template root structure defined above. Do not include any additional text or explanations - only the JSON object.`

export async function convertImageToEmail(
  formData: FormData,
  templateName: string,
  imageNames: string[]
): Promise<string> {
  try {
    // Convert File to base64 or appropriate format for OpenAI
    const file = formData.get('file') as File
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const base64Image = buffer.toString('base64')

    const prompt = EMAIL_TEMPLATE_GENERATOR_PROMPT.replace('%IMAGENAMES%', JSON.stringify(imageNames)).replace(
      /%TEMPLATENAME%/g,
      templateName
    )
    console.log('prompt', prompt)

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: prompt,
            },
            {
              type: 'image_url',
              image_url: {
                url: `data:${file.type};base64,${base64Image}`,
              },
            },
          ],
        },
      ],
      max_tokens: 4000,
    })

    const result = completion.choices[0].message.content
    if (!result) throw new Error('No response from OpenAI')

    console.log('result', result)

    // Parse the result to ensure it's valid JSON
    try {
      const emailTemplate = JSON.parse(result)
      return emailTemplate
    } catch (error) {
      console.error('Error parsing OpenAI response:', error)

      return result
    }
  } catch (error) {
    console.error('Error converting image to email template:', error)
    throw new Error('Failed to convert image to email template')
  }
}
