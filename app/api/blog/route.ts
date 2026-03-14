import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getDb } from "@/lib/db";
import { verifyAdminToken } from "@/lib/security";
import { slugifyTitle } from "@/lib/blog";

function mapPost(item: any) {
  return {
    id: item._id instanceof ObjectId ? item._id.toString() : String(item._id),
    title: item.title || "",
    slug: item.slug || "",
    content: item.content || "",
    coverImage: item.coverImage || "",
    status: item.status === "published" ? "published" : "draft",
    createdAt: item.createdAt ? new Date(item.createdAt).toISOString() : new Date().toISOString(),
    updatedAt: item.updatedAt ? new Date(item.updatedAt).toISOString() : new Date().toISOString(),
  };
}

export async function GET(request: NextRequest) {
  try {
    const token = (request.headers.get("authorization") || "").replace("Bearer ", "").trim();
    const isAdmin = verifyAdminToken(token);

    const db = await getDb();
    const query = isAdmin ? {} : { status: "published" };
    const posts = await db.collection("blog_posts").find(query).sort({ createdAt: -1 }).toArray();

    return NextResponse.json({ success: true, posts: posts.map(mapPost) });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: "Failed to fetch blog posts" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = (request.headers.get("authorization") || "").replace("Bearer ", "").trim();
    if (!verifyAdminToken(token)) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const title = String(body.title || "").trim();
    const rawSlug = String(body.slug || "").trim();
    const content = String(body.content || "").trim();
    const coverImage = String(body.coverImage || "").trim();
    const status = body.status === "published" ? "published" : "draft";

    if (!title || !content) {
      return NextResponse.json({ success: false, message: "Title and content are required" }, { status: 400 });
    }

    const db = await getDb();
    const baseSlug = slugifyTitle(rawSlug || title);
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

    const created = await db.collection("blog_posts").findOne({ _id: result.insertedId });
    return NextResponse.json({ success: true, post: mapPost(created) });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: "Failed to create blog post" }, { status: 500 });
  }
}
