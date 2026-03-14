import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getDb } from "@/lib/db";
import { sanitizeText, verifyAdminToken } from "@/lib/security";

export async function POST(request: NextRequest) {
  try {
    const token = (request.headers.get("authorization") || "").replace("Bearer ", "").trim();
    if (!verifyAdminToken(token)) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const messageId = sanitizeText(body.messageId);

    if (!messageId) {
      return NextResponse.json({ success: false, message: "messageId is required" }, { status: 400 });
    }

    const db = await getDb();
    const result = await db.collection("contact_messages").deleteOne({ _id: new ObjectId(messageId) });

    if (result.deletedCount === 0) {
      return NextResponse.json({ success: false, message: "Message not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: "Failed to delete message" }, { status: 500 });
  }
}
