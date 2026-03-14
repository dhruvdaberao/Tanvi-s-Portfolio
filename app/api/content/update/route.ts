import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { extractYouTubeId } from "@/utils/video";
import { verifyAdminToken } from "@/lib/security";

function unauthorized() {
  return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
}

export async function POST(request: NextRequest) {
  try {
    const auth = request.headers.get("authorization") || "";
    const token = auth.replace("Bearer ", "").trim();
    if (!token || !verifyAdminToken(token)) return unauthorized();

    const body = await request.json();
    const incomingContent = body?.content;
    if (!incomingContent || typeof incomingContent !== "object") {
      return NextResponse.json({ success: false, message: "Invalid payload" }, { status: 400 });
    }

    const { admin: _legacyAdmin, ...sanitizedIncomingContent } = incomingContent;
    const content = {
      ...sanitizedIncomingContent,
      video: {
        ...(sanitizedIncomingContent.video || {}),
      },
    };

    const videoUrl = content.video?.url || "";
    const youtubeId = extractYouTubeId(videoUrl);
    const autoThumb = youtubeId
      ? `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`
      : "";

    const resolvedThumbnail = content.video?.thumbnail || autoThumb;
    content.video.thumbnail = resolvedThumbnail;

    const db = await getDb();
    const result = await db.collection("site_content").updateOne(
      { key: "global" },
      {
        $set: {
          key: "global",
          authorName: content.hero?.name || "",
          heroQuote: content.hero?.quote || "",
          heroSubtitle: content.hero?.subtitle || "",
          profileImage: content.hero?.profilePhoto || "",
          videoIntroUrl: videoUrl,
          videoThumbnail: resolvedThumbnail,
          awardsCount: Number(content.awards?.countNumber || 0),
          socialLinks: content.social || {},
          backgroundMusicUrl: content.music?.fileUrl || "",
          content,
          updatedAt: new Date(),
        },
        $unset: {
          "content.admin": "",
        },
      },
      { upsert: true }
    );

    return NextResponse.json({
      success: true,
      matchedCount: result.matchedCount,
      modifiedCount: result.modifiedCount,
      upsertedId: result.upsertedId,
      content,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: "Failed to update content" }, { status: 500 });
  }
}
