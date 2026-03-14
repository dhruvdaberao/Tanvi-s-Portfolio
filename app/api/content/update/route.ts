import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { extractYouTubeId } from "@/utils/video";
import { verifyAdminToken } from "@/lib/security";

function unauthorized() {
  return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
}

export async function POST(request: NextRequest) {
  try {
    const mongoUri = process.env.MONGO_URI;
    const jwtSecret = process.env.JWT_SECRET;

    if (!mongoUri || !jwtSecret) {
      return NextResponse.json(
        { success: false, error: "Missing environment variables" },
        { status: 500 }
      );
    }

    const auth = request.headers.get("authorization") || "";
    const token = auth.replace("Bearer ", "").trim();
    if (!token || !verifyAdminToken(token)) return unauthorized();

    const contentType = request.headers.get("content-type") || "";
    if (!contentType.toLowerCase().includes("application/json")) {
      return NextResponse.json(
        { success: false, error: "Content-Type must be application/json" },
        { status: 400 }
      );
    }

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ success: false, error: "Invalid JSON payload" }, { status: 400 });
    }

    const incomingContent =
      typeof body === "object" && body !== null && "content" in body
        ? (body as { content?: unknown }).content
        : null;

    if (!incomingContent || typeof incomingContent !== "object") {
      return NextResponse.json({ success: false, error: "Invalid payload" }, { status: 400 });
    }

    const { admin: _legacyAdmin, ...sanitizedIncomingContent } = incomingContent as Record<string, any>;
    const content: Record<string, any> = {
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

    let db;
    try {
      db = await getDb();
    } catch (error) {
      console.error("DB connection failed:", error);
      return NextResponse.json(
        { success: false, error: "Database connection failed" },
        { status: 500 }
      );
    }

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

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("CONTENT SAVE FAILED:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Server error while saving content",
      },
      { status: 500 }
    );
  }
}
