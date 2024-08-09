import { goingTemplate } from '@/app/home/templates/email-workspace/going-template'

export const templates = [
  {
    name: '',
  },
]

export const getTemplateName = (id: string) => {
  switch (id) {
    case 'going':
      return 'Going'
    default:
      break
  }
}
export const getTemplate = (id: string) => {
  let template = null
  switch (id) {
    case 'going':
      template = goingTemplate
      break
    default:
      break
  }
  if (!template) return null

  return template
}
