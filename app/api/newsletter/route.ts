import { NextResponse } from "next/server";
import { Resend } from "resend";
import { getDb } from "@/lib/db";
import { sanitizeText } from "@/lib/security";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = sanitizeText(body.email).toLowerCase();

    if (!email) return NextResponse.json({ success: false, message: "Email is required" }, { status: 400 });
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return NextResponse.json({ success: false, message: "Invalid email address" }, { status: 400 });

    const db = await getDb();
    const exists = await db.collection("newsletter_subscribers").findOne({ email });
    if (exists) return NextResponse.json({ success: false, message: "You are already subscribed." }, { status: 409 });

    await db.collection("newsletter_subscribers").insertOne({ email, createdAt: new Date() });

    await resend.emails.send({
      from: "Tanvi Sirsat <portfolio@tanvisirsat.com>",
      to: email,
      subject: "Welcome to Tanvi's Newsletter",
      text: "Thank you for subscribing to Tanvi Sirsat's newsletter. You'll receive updates when new writings are published.",
    });

    return NextResponse.json({ success: true, message: "Thanks for subscribing!" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: "Something went wrong. Please try again." }, { status: 500 });
  }
}
