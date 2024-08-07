import { EmailTemplate } from '@/app/home/templates/emails/email-renderer'

export function getFirstTwoInitials(name: string) {
  // Split the name by spaces
  const words = name.trim().split(/\s+/)

  // Get the first letter of the first two words
  const initials = words.slice(0, 2).map((word) => word[0].toUpperCase())

  // Join the initials
  return initials.join('')
}

export function getPhotoUrl(name: string, template: string) {
  return `https://swiftmailer-photos.imgix.net/${template}/${name}`
}

export function addIdsToContainers(template: EmailTemplate): EmailTemplate {
  let idCounter = 0
  const addIds = (item: any): any => {
    if (['container', 'row', 'column'].includes(item.type)) {
      item.id = `${item.type}-${idCounter++}`
      if (item.items) {
        item.items = item.items.map(addIds)
      }
    }
    return item
  }
  return {
    ...template,
    containers: template.containers.map(addIds),
  }
}
