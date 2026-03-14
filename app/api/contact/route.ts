import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { sanitizeText } from "@/lib/security";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const name = sanitizeText(body.name);
    const email = sanitizeText(body.email).toLowerCase();
    const inquiryType = sanitizeText(body.inquiryType || "General");
    const message = sanitizeText(body.message);
    const honeypot = sanitizeText(body.honeypot);

    if (honeypot) {
      return NextResponse.json({ success: false, message: "Spam detected" }, { status: 400 });
    }

    if (!name || !email || !inquiryType || !message) {
      return NextResponse.json(
        { success: false, message: "Name, email, inquiry type, and message are required" },
        { status: 400 },
      );
    }

    const db = await getDb();
    await db.collection("contact_messages").insertOne({
      name,
      email,
      inquiryType,
      message,
      createdAt: new Date(),
      status: "new",
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Unexpected error in /api/contact:", error);
    return NextResponse.json({ success: false, message: "Failed to save message" }, { status: 500 });
  }
}
