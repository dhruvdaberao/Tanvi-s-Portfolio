import { NextResponse } from "next/server";
import { Resend } from "resend";
import { getDb } from "@/lib/db";
import { sanitizeText } from "@/lib/security";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const name = sanitizeText(body.name);
    const email = sanitizeText(body.email).toLowerCase();
    const inquiryType = sanitizeText(body.inquiryType || "General");
    const message = sanitizeText(body.message);
    const honeypot = sanitizeText(body.honeypot);

    if (honeypot) return NextResponse.json({ error: "Spam detected" }, { status: 400 });
    if (!name || !email || !message) return NextResponse.json({ error: "Name, email, and message are required" }, { status: 400 });

    const db = await getDb();
    await db.collection("contact_messages").insertOne({ name, email, inquiryType, message, createdAt: new Date() });

    const data = await resend.emails.send({
      from: "Contact Form <portfolio@tanvisirsat.com>",
      to: "dhruvdaberao@gmail.com",
      subject: `New Contact Form Message: ${inquiryType}`,
      text: `Name: ${name}\nEmail: ${email}\nInquiry Type: ${inquiryType}\nMessage: ${message}`,
    });

    if (data.error) return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
