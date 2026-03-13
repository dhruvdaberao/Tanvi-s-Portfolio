import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { defaultContent } from "@/lib/content";

export async function GET() {
  try {
    const db = await getDb();
    const siteContent = await db.collection("site_content").findOne({ key: "global" });
    const gallery = await db.collection("gallery_items").find({}).sort({ createdAt: -1 }).toArray();
    const writings = await db.collection("featured_writings").find({}).sort({ createdAt: -1 }).toArray();

    const content = siteContent?.content || defaultContent;
    content.gallery = gallery.map(({ _id, ...item }) => ({ ...item, id: _id.toString() }));
    content.writings = writings.map(({ _id, ...item }) => ({ ...item, id: _id.toString() }));

    return NextResponse.json({ success: true, content });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch content" }, { status: 500 });
  }
}
