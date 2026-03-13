import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { extractYouTubeId } from "@/utils/video";
import { verifyAdminToken } from "@/lib/security";

function unauthorized() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

export async function POST(request: NextRequest) {
  try {
    const auth = request.headers.get("authorization") || "";
    const token = auth.replace("Bearer ", "").trim();
    if (!token || !verifyAdminToken(token)) return unauthorized();

    const body = await request.json();
    const content = body?.content;
    if (!content) return NextResponse.json({ error: "Invalid payload" }, { status: 400 });

    const videoUrl = content.video?.url || "";
    const youtubeId = extractYouTubeId(videoUrl);
    const autoThumb = youtubeId ? `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg` : content.video?.thumbnail || "";

    content.video.thumbnail = autoThumb;

    const db = await getDb();
    await db.collection("site_content").updateOne(
      { key: "global" },
      {
        $set: {
          key: "global",
          authorName: content.hero?.name || "",
          heroQuote: content.hero?.quote || "",
          heroSubtitle: content.hero?.subtitle || "",
          profileImage: content.hero?.profilePhoto || "",
          videoIntroUrl: videoUrl,
          videoThumbnail: autoThumb,
          awardsCount: Number(content.awards?.countNumber || 0),
          socialLinks: content.social || {},
          backgroundMusicUrl: content.music?.fileUrl || "",
          content,
          updatedAt: new Date(),
        },
      },
      { upsert: true }
    );


    if (Array.isArray(content.gallery)) {
      await db.collection("gallery_items").deleteMany({});
      if (content.gallery.length) {
        await db.collection("gallery_items").insertMany(content.gallery.map((item: any) => ({ ...item, createdAt: new Date() })));
      }
    }

    if (Array.isArray(content.writings)) {
      await db.collection("featured_writings").deleteMany({});
      if (content.writings.length) {
        await db.collection("featured_writings").insertMany(content.writings.map((item: any) => ({ ...item, createdAt: new Date() })));
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to update content" }, { status: 500 });
  }
}
