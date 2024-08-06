import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

import GoingEmail from '@/app/home/templates/emails/going-email'

const resend = new Resend(process.env.RESEND_API_KEY)

export const POST = async (request: NextRequest) => {
  const { email, id } = await request.json()

  console.log('heya')

  if (!email || !id) {
    return new NextResponse('Email and template id are required', {
      status: 400,
    })
  }

  try {
    const getComponent = () => {
      switch (id) {
        case 'going':
          return GoingEmail()
        default:
          break
      }
    }

    const { data, error } = await resend.emails.send({
      from: 'Acme <testing@marcowhyte.com>',
      to: [email],
      subject: 'Test from SwiftMailer',
      react: getComponent(),
    })

    if (error) {
      console.error('Error:', error)
      return new NextResponse('Failed to send email', {
        status: 500,
      })
    }

    return new NextResponse(JSON.stringify(data), {
      status: 200,
    })
  } catch (error) {
    console.error('Error:', error)
    return new NextResponse('Failed to send email', {
      status: 500,
    })
  }
}
