import { NextRequest, NextResponse } from "next/server";
import { uploadToCloudinary } from "@/lib/cloudinary";
import { verifyAdminToken } from "@/lib/security";

export const maxDuration = 60; // Allows up to 60 seconds for large 15MB file uploads to stream to Cloudinary

export async function POST(request: NextRequest) {
  try {
    const token = (request.headers.get("authorization") || "").replace("Bearer ", "").trim();
    if (!verifyAdminToken(token)) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });

    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const folder = String(formData.get("folder") || "portfolio");

    if (!file) return NextResponse.json({ success: false, message: "File required" }, { status: 400 });

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const type = file.type.startsWith("image/") ? "image" : file.type.startsWith("video/") ? "video" : "auto";
    const result = await uploadToCloudinary(buffer, folder, type);

    return NextResponse.json({ success: true, secure_url: result.secure_url });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: "Upload failed" }, { status: 500 });
  }
}
