import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
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
    const videoUrl = typeof body?.videoUrl === "string" ? body.videoUrl : "";
    const videoThumbnail = typeof body?.videoThumbnail === "string" ? body.videoThumbnail : "";

    const db = await getDb();

    await db.collection("site_content").updateOne(
      { type: "video_section" },
      {
        $set: {
          type: "video_section",
          videoUrl,
          videoThumbnail,
          updatedAt: new Date(),
        },
      },
      { upsert: true }
    );

    await db.collection("site_content").updateOne(
      { key: "global" },
      {
        $set: {
          videoIntroUrl: videoUrl,
          videoThumbnail,
          "content.video.url": videoUrl,
          "content.video.thumbnail": videoThumbnail,
          updatedAt: new Date(),
        },
      },
      { upsert: true }
    );

    return NextResponse.json({ success: true, videoUrl, videoThumbnail });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: "Error updating video section" }, { status: 500 });
  }
}
