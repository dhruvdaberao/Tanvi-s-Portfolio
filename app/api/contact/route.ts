import { NextResponse } from 'next/server'
import { Resend } from 'resend'

// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY || 're_placeholder')

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, email, inquiryType, message, honeypot } = body

    // 1. Validate inputs
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Name, email, and message are required fields.' },
        { status: 400 }
      )
    }

    // Spam protection: honeypot should be empty
    if (honeypot) {
      return NextResponse.json(
        { error: 'Spam detected.' },
        { status: 400 }
      )
    }

    // Sanitize inputs
    const sanitizedName = name.trim().replace(/<[^>]*>?/gm, '')
    const sanitizedEmail = email.trim().toLowerCase()
    const sanitizedInquiryType = (inquiryType || 'General').trim().replace(/<[^>]*>?/gm, '')
    const sanitizedMessage = message.trim().replace(/<[^>]*>?/gm, '')

    // 2. Send email using Resend API
    const data = await resend.emails.send({
      from: 'Contact Form <portfolio@tanvisirsat.com>',
      to: 'dhruvdaberao@gmail.com',
      subject: `New Contact Form Message: ${sanitizedInquiryType}`,
      text: `
Name: ${sanitizedName}
Email: ${sanitizedEmail}
Inquiry Type: ${sanitizedInquiryType}
Message: ${sanitizedMessage}
      `,
    })

    if (data.error) {
       console.error("Resend error:", data.error)
       return NextResponse.json({ error: 'Failed to send email.' }, { status: 500 })
    }

    // 3. Return success response
    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('Contact form error:', error)
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    )
  }
}
