import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

import { goingEmail } from '@/app/home/templates/emails/going-template'
import { renderEmailToString } from '@/app/home/templates/emails/server-email-renderer'

const resend = new Resend(process.env.RESEND_API_KEY)

export const POST = async (request: NextRequest) => {
  const { email, id } = await request.json()

  if (!email || !id) {
    return new NextResponse('Email and template id are required', {
      status: 400,
    })
  }

  try {
    const getTemplate = () => {
      switch (id) {
        case 'going':
          return goingEmail
        default:
          return null
      }
    }

    const getComponent = () => {
      const template = getTemplate()

      if (template) {
        return renderEmailToString(template)
      }
      return null
    }

    const { data, error } = await resend.emails.send({
      from: 'SwiftMaker <testing@marcowhyte.com>',
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
