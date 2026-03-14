import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { verifyAdminToken } from "@/lib/security";
import { slugifyTitle } from "@/lib/blog";

export async function POST(request: NextRequest) {
  try {
    const token = (request.headers.get("authorization") || "").replace("Bearer ", "").trim();
    if (!verifyAdminToken(token)) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    const title = String(body.title || "").trim();
    const content = String(body.content || body.description || "").trim();
    const coverImage = String(body.coverImage || body.image || "").trim();
    const status = body.status === "published" ? "published" : "draft";

    if (!title || !content) {
      return NextResponse.json({ success: false, message: "title and content are required" }, { status: 400 });
    }

    const db = await getDb();
    const baseSlug = slugifyTitle(String(body.slug || title));
    let slug = baseSlug;
    let counter = 1;
    while (await db.collection("blog_posts").findOne({ slug })) {
      slug = `${baseSlug}-${counter}`;
      counter += 1;
    }

    const now = new Date();
    const result = await db.collection("blog_posts").insertOne({
      title,
      slug,
      content,
      coverImage,
      status,
      createdAt: now,
      updatedAt: now,
    });

    return NextResponse.json({ success: true, id: result.insertedId.toString() });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: "Failed to add blog post" }, { status: 500 });
  }
}
