import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import { supabase } from '@/utils/supabase'

const resend = new Resend(process.env.RESEND_API_KEY || 're_placeholder')

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email } = body

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    const sanitizedEmail = email.trim().toLowerCase()
    
    // Check if valid email primitive 
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(sanitizedEmail)) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 })
    }

    // Insert into database, prevent duplicates
    const { data: existing, error: fetchError } = await supabase
      .from('newsletter_subscribers')
      .select('id')
      .eq('email', sanitizedEmail)
      .single()

    if (fetchError && fetchError.code !== 'PGRST116') {
      console.error('Supabase fetch error:', fetchError)
      return NextResponse.json({ error: 'Database error' }, { status: 500 })
    }

    if (existing) {
      return NextResponse.json({ error: 'You are already subscribed.' }, { status: 409 })
    }

    const { error: insertError } = await supabase
      .from('newsletter_subscribers')
      .insert([{ email: sanitizedEmail }])

    if (insertError) {
      console.error('Supabase insert error:', insertError)
      // Fallback if duplicate code hits
      if (insertError.code === '23505') {
        return NextResponse.json({ error: 'You are already subscribed.' }, { status: 409 })
      }
      return NextResponse.json({ error: 'Failed to subscribe. Please try again later.' }, { status: 500 })
    }

    // Send confirmation email
    const emailResponse = await resend.emails.send({
      from: 'Tanvi Sirsat <portfolio@tanvisirsat.com>',
      to: sanitizedEmail,
      subject: "Welcome to Tanvi's Newsletter",
      text: "Thank you for subscribing to Tanvi Sirsat's newsletter. You'll receive updates when new writings are published."
    })

    if (emailResponse.error) {
       console.error("Resend error:", emailResponse.error)
       // We still consider subscription successful if DB write succeeded
    }

    return NextResponse.json({ success: true, message: 'Thanks for subscribing!' })

  } catch (error) {
    console.error('Newsletter subscription error:', error)
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 })
  }
}
