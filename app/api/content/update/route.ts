import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
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

    const authHeader = request.headers.get("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return Response.json(
        { success: false, error: "Missing authentication token" },
        { status: 401 }
      );
    }

    const token = authHeader.split(" ")[1];
    if (!token || !verifyAdminToken(token)) {
      return Response.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const contentType = request.headers.get("content-type") || "";
    if (!contentType.toLowerCase().includes("application/json")) {
      return Response.json(
        { success: false, error: "Content-Type must be application/json" },
        { status: 400 }
      );
    }

    let body: any;
    try {
      body = await request.json();
    } catch {
      return Response.json({ success: false, error: "Invalid JSON body" }, { status: 400 });
    }

    const content = body.content || body;

    if (!content || typeof content !== "object") {
      return Response.json({ success: false, error: "Invalid payload" }, { status: 400 });
    }

    console.log("Saving content sections:", Object.keys(content));

    const client = await connectDB();
    const db = client.db(process.env.DB_NAME);

    await db.collection("content").updateOne(
      { key: "portfolioContent" },
      {
        $set: {
          key: "portfolioContent",
          content: content,
          updatedAt: new Date(),
        },
      },
      { upsert: true }
    );

    return Response.json({ success: true });
  } catch (error) {
    console.error("CONTENT UPDATE ERROR:", error);
    console.error("STACK:", error instanceof Error ? error.stack : undefined);
    return Response.json(
      {
        success: false,
        error: "Server error while saving content",
      },
      { status: 500 }
    );
  }
}
