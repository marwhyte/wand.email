import { v4 as uuidv4 } from 'uuid'

export const blankTemplate = (): Email => {
  return {
    id: uuidv4(),
    name: 'Blank Template',
    preview: 'Blank Template',
    fontFamily: 'Arial, sans-serif',
    width: '600',
    color: '#000000',
    linkColor: '#000000',
    bgColor: '#FFFFFF',
    rows: [],
  }
}
