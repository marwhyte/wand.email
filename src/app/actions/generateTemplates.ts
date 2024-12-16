'use server'

import { getTemplate, templates, templateTypes } from '@/lib/data/templates'
import OpenAI from 'openai'

export async function generateTemplates(description: string, config?: Partial<TemplateConfig>) {
  const openai = new OpenAI()

  const prompt = `Based on the following email campaign description, which of these template types would be most appropriate? 
  Available templates: ${templateTypes.filter((type) => type !== 'personalized' && type !== 'recommended').join(', ')}
  
  Description: ${description}
  
  Return only the template type name, exactly as written in the list above.`

  const completion = await openai.chat.completions.create({
    messages: [{ role: 'user', content: prompt }],
    model: 'gpt-3.5-turbo',
    temperature: 0.3,
    max_tokens: 50,
  })

  let suggestedTemplate = completion.choices[0].message.content?.trim()

  if (!templateTypes.includes(suggestedTemplate as any)) {
    suggestedTemplate = 'recommended'
  }

  // Get filtered templates and apply config to each one
  const currentTemplates: Template[] = templates
    .filter((template) => template.types.includes(suggestedTemplate as any))
    .slice(0, 3)
    .map((template) => ({
      ...template,
      template: getTemplate(template.id, config) as Email,
    }))

  return currentTemplates
}
