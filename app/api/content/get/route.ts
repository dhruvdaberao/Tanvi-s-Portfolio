import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { defaultContent } from "@/lib/content";

export async function GET() {
  try {
    const db = await getDb();
    const siteContent = await db.collection("site_content").findOne({ key: "global" });

    const content = siteContent?.content || defaultContent;

    return NextResponse.json({ success: true, content });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, error: "Failed to fetch content" }, { status: 500 });
  }
}
