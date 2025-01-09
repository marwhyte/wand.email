'use server'

import OpenAI from 'openai'
import { createApi } from 'unsplash-js'

const unsplash = createApi({
  accessKey: process.env.UNSPLASH_ACCESS_KEY!,
})

const openai = new OpenAI()

const TEXT_TO_EMAIL_PROMPT = `You are an email template generator that creates beautiful, on-brand email templates based on text descriptions. Follow these specifications carefully:

INPUT INTERPRETATION:
You will receive:
1. Company description
2. Color scheme preferences
3. Themes (e.g., ["elegant", "modern", "minimal"])
4. Logo image URL

Your task is to:
1. Create a cohesive design that matches the company's brand and requested themes
2. Select appropriate images from Unsplash that match the theme
3. Use the provided color scheme or suggest complementary colors if none provided
4. Create a layout that appropriately showcases the logo
5. Maintain visual hierarchy and professional email design principles

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
  bgImage?: string             // Optional background image (use getPhotoUrl(imageName, templateName))
  bgPosition?: string          // Optional background position
  bgSize?: string              // Optional background size
  bgRepeat?: string            // Optional background repeat
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

When designing the template:
1. Select images that reflect the company's industry and themes
2. Create a color palette that aligns with brand colors and themes
3. Choose typography that matches the requested themes
4. Structure layout to prioritize the logo and main message
5. Use the logo dimensions to inform header spacing
6. For all images, use the provided Unsplash URLs

RESPONSE FORMAT:
Respond with a valid JSON object matching the template root structure defined above. Do not include any additional text or explanations - only the JSON object.`

export async function generateEmailFromDescription(
  description: string,
  colorScheme: string,
  themes: string[],
  logoUrl: string,
  businessType: string
): Promise<Email> {
  try {
    // Search for relevant images on Unsplash based on themes and description
    const searchResults = await unsplash.search.getPhotos({
      query: `${businessType} ${themes.join(' ')} ${description.split(' ').slice(0, 3).join(' ')}`,
      perPage: 5,
    })

    const unsplashImages = searchResults.response?.results.map((result) => result.urls.regular) || []

    const prompt = TEXT_TO_EMAIL_PROMPT

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: `Create an email template with the following specifications:
              Company Description: ${description}
              Business Type: ${businessType}
              Color Scheme: ${colorScheme}
              Themes: ${themes.join(', ')}
              Logo URL: ${logoUrl}
              Available Unsplash Images: ${JSON.stringify(unsplashImages)}
              
              ${prompt}`,
            },
          ],
        },
      ],
      max_tokens: 4000,
    })

    const result = completion.choices[0].message.content
    if (!result) throw new Error('No response from OpenAI')

    try {
      // Clean the response by removing markdown code block formatting if present
      const cleanedResult = result.replace(/```json\n|\n```/g, '').trim()
      const emailTemplate = JSON.parse(cleanedResult) as Email
      return emailTemplate
    } catch (error) {
      console.error('Error parsing OpenAI response:', error)
      throw new Error('Invalid template format returned from OpenAI')
    }
  } catch (error) {
    console.error('Error generating email template from description:', error)
    throw new Error('Failed to generate email template')
  }
}
