import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export const POST = async (request: NextRequest) => {
  const { email, html } = await request.json()

  if (!email && !html) {
    return new NextResponse('Both email and html content are required', {
      status: 400,
    })
  }

  if (!email) {
    return new NextResponse('Email address is required', {
      status: 400,
    })
  }

  if (!html) {
    return new NextResponse('HTML content is required', {
      status: 400,
    })
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return new NextResponse('Invalid email format', {
      status: 400,
    })
  }

  try {
    const { data, error } = await resend.emails.send({
      from: 'wand.email <testing@wand.email>',
      to: [email],
      subject: 'Test from wand.email',
      html: html,
    })

    if (error) {
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
