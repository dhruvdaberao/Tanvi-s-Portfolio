import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getDb } from "@/lib/db";
import { defaultContent } from "@/lib/content";

export async function GET() {
  try {
    const db = await getDb();
    const [siteContent, videoSection, galleryItems, awardItems, writings, blogPosts, publications] = await Promise.all([
      db.collection("site_content").findOne({ key: "global" }),
      db.collection("site_content").findOne({ type: "video_section" }),
      db.collection("gallery_items").find({}).sort({ createdAt: -1 }).toArray(),
      db.collection("awards").find({}).sort({ year: -1, createdAt: -1 }).toArray(),
      db.collection("writings").find({}).sort({ createdAt: -1 }).toArray(),
      db.collection("blog_posts").find({ status: "published" }).sort({ createdAt: -1 }).toArray(),
      db.collection("publications").find({}).sort({ createdAt: -1 }).toArray(),
    ]);

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

    if (galleryItems.length > 0) {
      content.gallery = galleryItems.map((item) => ({
        id: item._id instanceof ObjectId ? item._id.toString() : String(item._id || crypto.randomUUID()),
        url: item.url || item.image || "",
        caption: item.caption || item.title || "",
        title: item.title || item.caption || "",
        year: item.year ? String(item.year) : "",
      }));
    }

    if (awardItems.length > 0) {
      content.awards = {
        ...(content.awards || defaultContent.awards),
        list: awardItems.map((item) => ({
          id: item._id instanceof ObjectId ? item._id.toString() : String(item._id || crypto.randomUUID()),
          title: item.title || "",
          year: item.year ? String(item.year) : "",
          org: item.organization || item.org || "",
          description: item.description || "",
        })),
      };
    }

    if (writings.length > 0) {
      content.writings = writings.map((item) => ({
        id: item._id instanceof ObjectId ? item._id.toString() : String(item._id || crypto.randomUUID()),
        title: item.title || "",
        image: item.image || "",
        desc: item.description || item.desc || "",
        category: item.category || "",
        readUrl: item.link || item.readUrl || "",
      }));
    }

    if (blogPosts.length > 0) {
      content.blog = blogPosts.map((item) => ({
        id: item._id instanceof ObjectId ? item._id.toString() : String(item._id || crypto.randomUUID()),
        title: item.title || "",
        description: (item.content || "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim().slice(0, 160),
        image: item.coverImage || item.image || "",
        link: item.slug ? `/blog/${item.slug}` : item.link || "",
      }));
    }

    if (publications.length > 0) {
      content.publications = publications.map((item) => ({
        id: item._id instanceof ObjectId ? item._id.toString() : String(item._id || crypto.randomUUID()),
        title: item.title || "",
        description: (item.content || "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim().slice(0, 160),
        image: item.coverImage || item.image || "",
        link: item.slug ? `/blog/${item.slug}` : item.link || "",
      }));
    }

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
