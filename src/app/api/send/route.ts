import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export const POST = async (request: NextRequest) => {
  const { email, html } = await request.json()

  if (!email || !html) {
    return new NextResponse('Email and html are required', {
      status: 400,
    })
  }

  try {
    const { data, error } = await resend.emails.send({
      from: 'SwiftMaker <testing@sentswiftly.com>',
      to: [email],
      subject: 'Test from SentSwiftly',
      html: html,
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
