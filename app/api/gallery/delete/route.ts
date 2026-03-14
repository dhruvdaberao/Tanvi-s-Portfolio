import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getDb } from "@/lib/db";
import { verifyAdminToken } from "@/lib/security";

export async function POST(request: NextRequest) {
  try {
    const token = (request.headers.get("authorization") || "").replace("Bearer ", "").trim();
    if (!verifyAdminToken(token)) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });

    const { id } = await request.json();
    if (!id) return NextResponse.json({ success: false, message: "id is required" }, { status: 400 });

    const db = await getDb();
    await db.collection("gallery_items").deleteOne({ _id: new ObjectId(id) });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: "Failed to delete gallery item" }, { status: 500 });
  }
}
