import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getDb } from "@/lib/db";
import { verifyAdminToken } from "@/lib/security";
import { slugifyTitle } from "@/lib/blog";

type Params = { params: Promise<{ id: string }> };

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

export async function PUT(request: NextRequest, { params }: Params) {
  try {
    const token = (request.headers.get("authorization") || "").replace("Bearer ", "").trim();
    if (!verifyAdminToken(token)) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ success: false, message: "Invalid post id" }, { status: 400 });
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
    const existing = await db.collection("blog_posts").findOne({ _id: new ObjectId(id) });
    if (!existing) {
      return NextResponse.json({ success: false, message: "Blog post not found" }, { status: 404 });
    }

    const requestedSlug = slugifyTitle(rawSlug || title);
    let slug = requestedSlug;
    let counter = 1;
    while (await db.collection("blog_posts").findOne({ slug, _id: { $ne: new ObjectId(id) } })) {
      slug = `${requestedSlug}-${counter}`;
      counter += 1;
    }

    await db.collection("blog_posts").updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          title,
          slug,
          content,
          coverImage,
          status,
          updatedAt: new Date(),
        },
      },
    );

    const updated = await db.collection("blog_posts").findOne({ _id: new ObjectId(id) });
    return NextResponse.json({ success: true, post: mapPost(updated) });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: "Failed to update post" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    const token = (request.headers.get("authorization") || "").replace("Bearer ", "").trim();
    if (!verifyAdminToken(token)) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ success: false, message: "Invalid post id" }, { status: 400 });
    }

    const db = await getDb();
    await db.collection("blog_posts").deleteOne({ _id: new ObjectId(id) });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: "Failed to delete post" }, { status: 500 });
  }
}
