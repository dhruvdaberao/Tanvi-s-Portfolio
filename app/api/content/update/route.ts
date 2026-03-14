import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import { extractYouTubeId } from "@/utils/video";
import { verifyAdminToken } from "@/lib/security";


export async function POST(request: NextRequest) {
  try {
    const mongoUri = process.env.MONGO_URI;
    const jwtSecret = process.env.JWT_SECRET;

    if (!mongoUri) {
      console.error("Missing MONGO_URI environment variable");
      return Response.json(
        { success: false, error: "Missing database configuration" },
        { status: 500 }
      );
    }

    if (!jwtSecret) {
      console.error("Missing JWT_SECRET environment variable");
      return Response.json(
        { success: false, error: "Missing authentication configuration" },
        { status: 500 }
      );
    }

    const authHeader = request.headers.get("authorization")

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return Response.json(
        { success: false, error: "Missing authentication token" },
        { status: 401 }
      )
    }

    const token = authHeader.split(" ")[1]
    if (!token || !verifyAdminToken(token)) {
      return Response.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    const contentType = request.headers.get("content-type") || "";
    if (!contentType.toLowerCase().includes("application/json")) {
      return Response.json(
        { success: false, error: "Content-Type must be application/json" },
        { status: 400 }
      );
    }

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return Response.json({ success: false, error: "Invalid JSON body" }, { status: 400 });
    }

    console.log("Received update request");

    const incomingContent =
      typeof body === "object" && body !== null
        ? ((body as { content?: unknown }).content ?? body)
        : null;

    if (!incomingContent || typeof incomingContent !== "object") {
      return Response.json({ success: false, error: "Invalid payload" }, { status: 400 });
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

    const client = await connectDB()
    const db = client.db(process.env.DB_NAME)

    await db.collection("content").updateOne(
      { key: "portfolioContent" },
      {
        $set: {
          key: "portfolioContent",
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

    return Response.json({
      success: true,
    });
  } catch (error) {
    console.error("CONTENT UPDATE ERROR:", error)
    console.error("STACK:", error instanceof Error ? error.stack : undefined)
    return Response.json(
      {
        success: false,
        error: "Server error while saving content",
      },
      { status: 500 }
    );
  }
}
