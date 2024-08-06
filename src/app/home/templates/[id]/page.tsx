import { auth } from '@/auth'
import CustomIframe from '@/components/custom-iframe'
import GoingEmail from '../emails/going-email'

export default async function GoingPage({ params }: { params: { id: string } }) {
  const session = await auth()

  const getComponent = () => {
    switch (params.id) {
      case 'going':
        return <GoingEmail />
      default:
        break
    }
  }

  const component = getComponent()

  return (
    <div>
      <CustomIframe session={session} id={params.id}>
        {component}
      </CustomIframe>
    </div>
  )
}
