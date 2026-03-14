import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { verifyAdminToken } from "@/lib/security";

export async function GET(request: NextRequest) {
  try {
    const token = (request.headers.get("authorization") || "").replace("Bearer ", "").trim();
    if (!verifyAdminToken(token)) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });

    const db = await getDb();
    const subscribers = await db.collection("newsletter_subscribers").find({}).sort({ createdAt: -1 }).toArray();
    const normalized = subscribers.map(({ _id, ...rest }) => ({ id: _id.toString(), ...rest }));

    return NextResponse.json({ success: true, subscribers: normalized });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: "Failed to fetch subscribers" }, { status: 500 });
  }
}
