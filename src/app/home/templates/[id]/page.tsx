import { auth } from '@/auth'
import CustomIframe from '@/components/custom-iframe'
import GoingEmail from './EmailTemplate'

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

  const getName = () => {
    switch (params.id) {
      case 'going':
        return 'Going'
      default:
        break
    }
  }

  const component = getComponent()
  const name = getName()

  return <CustomIframe name={name}>{component}</CustomIframe>
}
