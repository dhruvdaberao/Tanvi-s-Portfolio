import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getDb } from "@/lib/db";
import { defaultContent } from "@/lib/content";

export async function GET() {
  try {
    const db = await getDb();
    const siteContent = await db.collection("content").findOne({ key: "portfolioContent" });
    const videoSection = await db.collection("site_content").findOne({ type: "video_section" });

    const savedContent = siteContent?.content || {};
    const { admin: _legacyAdmin, ...savedContentWithoutAdmin } = savedContent;
    const fallbackVideoUrl =
      videoSection?.videoUrl || siteContent?.videoIntroUrl || savedContentWithoutAdmin.video?.url || "";
    const fallbackVideoThumbnail =
      videoSection?.videoThumbnail || siteContent?.videoThumbnail || savedContentWithoutAdmin.video?.thumbnail || "";

    const content = {
      ...defaultContent,
      ...savedContentWithoutAdmin,
      video: {
        ...defaultContent.video,
        ...(savedContentWithoutAdmin.video || {}),
        url: fallbackVideoUrl,
        thumbnail: fallbackVideoThumbnail,
      },
    };

    return NextResponse.json({
      success: true,
      content,
      videoUrl: content.video.url,
      videoThumbnail: content.video.thumbnail,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: "Failed to fetch content" }, { status: 500 });
  }
}
