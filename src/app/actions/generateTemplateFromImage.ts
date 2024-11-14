'use server'

import OpenAI from 'openai'
import { ebayTemplate } from '../components/email-workspace/ebay-template'
import { stripeTemplate } from '../components/email-workspace/stripe-template'

const openai = new OpenAI()

const EMAIL_TEMPLATE_GENERATOR_PROMPT = `You are an email template generator that converts images into structured email templates. Follow these specifications carefully:

DESCRIPTION:
%DESCRIPTION%

TEMPLATE ROOT STRUCTURE:
An email template must be exported as a TypeScript constant with this EXACT format:
export const %templateName%Template: Email = {
  id: string                    // UUID
  name: string                  // Name of the template
  description: string           // Description of the template
  preview: string               // Preview text for email clients
  fontFamily: string            // e.g., "Arial, sans-serif"
  width: string                 // typically "600px"
  color: string                 // Base text color (hex)
  bgColor: string               // Base background color (hex)
  bgImage?: string              // Optional background image (use getPhotoUrl(imageName, "%templateName%"))
  bgPosition?: string           // Optional background position
  bgSize?: string               // Optional background size
  bgRepeat?: string             // Optional background repeat
  rows: RowBlock[]              // Array of row blocks
}

IMAGE USAGE RULES:
1. You can ONLY use images from this list: %IMAGENAMES%
2. For each image, you must reference it using getPhotoUrl(imageName, "%templateName%")
   Example: if the image is "header.png" and templateName is "stripe":
   getPhotoUrl("header.png", "stripe")

IMPORTANT:
- Never invent or use image names that aren't in the provided list
- Every image reference must use getPhotoUrl with the exact filename from the list
- The second parameter of getPhotoUrl must always be "%templateName%"

When analyzing an email image:
1. Break down the visual hierarchy
2. Identify repeating patterns
3. Note spacing and alignment
4. Pay attention to typography scale
5. Document all content sections
6. Generate unique IDs for all elements
7. ONLY use images from the provided list: %IMAGENAMES%
8. For each image, use: getPhotoUrl(imageName, "%templateName%")

LAYOUT HIERARCHY:
1. Email templates contain rows
2. Each row has:
   - attributes (padding, background, etc.)
   - a container object (for alignment and width settings)
   - an array of columns
3. Columns contain blocks (content elements)
4. Grid system uses 12 columns total per row
5. To center content,

BLOCK TYPES:
- Row Block
- Column Block
- Content Blocks (Heading, Text, Image, Button, Divider, Socials)

DESIGN GUIDELINES:

1. Spacing:
   - Use 8px increments for padding (8px, 16px, 24px, 32px, etc.)
   - Maintain 16px padding on outer edges
   - Use separate padding properties for each direction (e.g., paddingLeft, paddingRight, paddingTop, paddingBottom)
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

- Spacing: Use 8px increments for padding
- Typography: Use web-safe font families
- Images: Always use getPhotoUrl() for image sources
- Colors: Use hex codes (#000000 format)
- Mobile Considerations: Keep content columns under 600px total

RESPONSE FORMAT:
You must respond with a valid TypeScript export statement matching the template structure defined above. Include the import statement and type annotation. Do not include any additional text or explanations - only the TypeScript code.`

// Add a new constant for examples
const TEMPLATE_EXAMPLES = [ebayTemplate, stripeTemplate]

export async function convertImageToEmail(
  formData: FormData,
  templateName: string,
  imageNames: string[],
  description: string
): Promise<string> {
  try {
    const prompt = EMAIL_TEMPLATE_GENERATOR_PROMPT.replace(/%templateName%/g, templateName)
      .replace('%IMAGENAMES%', JSON.stringify(imageNames))
      .replace('%DESCRIPTION%', description)

    const file = formData.get('file') as File
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const base64Image = buffer.toString('base64')

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: prompt,
        },
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: `Generate a complete email template based on this image. Available images: ${JSON.stringify(imageNames)}. 

REQUIRED IMPORTS AND IMAGE USAGE:
1. Must start with: import { getPhotoUrl } from '@/lib/utils/misc'
2. For ALL images, use getPhotoUrl(imageName, "${templateName}")
   Example: getPhotoUrl("intuit.png", "${templateName}")

CRITICAL LAYOUT AND STYLING RULES:
1. EVERY row block MUST have a backgroundColor specified
2. Text colors must match the exact colors shown in the design
3. Button colors (background and text) must match the design exactly
4. For elements appearing side-by-side:
   - Use columns within a row
   - gridColumns of all columns in a row MUST sum to exactly 12
   Example:
   - Two equal columns: gridColumns: 6 each
   - Three equal columns: gridColumns: 4 each
   - One-third/two-thirds: gridColumns: 4 and gridColumns: 8

IMPORTANT IMAGE PLACEMENT RULES:
1. Look for logos, product images, and hero images in the design
2. Match them with the closest available image from the provided list
3. Use ALL provided images in appropriate sections
4. For logos: typically use company-related images (e.g., intuit.png, quickbooks.png)
5. For hero sections: use lifestyle or product-focused images
6. Place images strategically based on their content and context

Here are example templates for reference: ${JSON.stringify(TEMPLATE_EXAMPLES)}`,
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

    return result
  } catch (error) {
    console.error('Error converting image to email template:', error)
    throw new Error('Failed to convert image to email template')
  }
}
