import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function uploadToCloudinary(file: Buffer, folder: string, resourceType: "image" | "video" | "raw" | "auto" = "auto") {
  const dataUri = `data:application/octet-stream;base64,${file.toString("base64")}`;
  return cloudinary.uploader.upload(dataUri, {
    folder,
    resource_type: resourceType,
  });
}
