import CustomIframe from '@/app/components/custom-iframe'
import { auth } from '@/auth'
import EmailRenderer from '../emails/email-renderer'
import { goingEmail } from '../emails/going-template'

export default async function GoingPage({ params }: { params: { id: string } }) {
  const session = await auth()

  const getTemplate = () => {
    switch (params.id) {
      case 'going':
        return goingEmail
      default:
        break
    }
  }

  console.log(goingEmail)

  const template = getTemplate()

  if (!template) {
    return <div>Template not found</div>
  }

  return (
    <div>
      <CustomIframe session={session} id={params.id}>
        <EmailRenderer originalTemplate={template} />
      </CustomIframe>
    </div>
  )
}
