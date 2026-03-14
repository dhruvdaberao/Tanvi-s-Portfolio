import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { verifyAdminToken } from "@/lib/security";

export async function POST(request: NextRequest) {
  try {
    const token = (request.headers.get("authorization") || "").replace("Bearer ", "").trim();
    if (!verifyAdminToken(token)) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    const { url, caption, year } = body;
    if (!url) return NextResponse.json({ success: false, message: "url is required" }, { status: 400 });

    const db = await getDb();
    const result = await db.collection("gallery_items").insertOne({ url, caption: caption || "", year: year || "", createdAt: new Date() });

    return NextResponse.json({ success: true, id: result.insertedId.toString() });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: "Failed to add gallery item" }, { status: 500 });
  }
}
