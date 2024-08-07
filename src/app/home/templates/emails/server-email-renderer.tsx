import dynamic from 'next/dynamic'
import { EmailTemplate } from './email-renderer'

const EmailRenderer = dynamic(() => import('./email-renderer'), { ssr: true })

export async function renderEmailToString(template: EmailTemplate): Promise<string> {
  const html = await (await import('react-dom/server')).renderToString(<EmailRenderer originalTemplate={template} />)
  return html
}
