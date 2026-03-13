import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { createAdminToken, sanitizeText } from "@/lib/security";

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json();
    const cleanPassword = sanitizeText(password);
    if (!cleanPassword) return NextResponse.json({ error: "Password required" }, { status: 400 });

    const db = await getDb();
    const siteContent = await db.collection("site_content").findOne({ key: "global" });
    const adminPass = siteContent?.content?.admin?.pass;

    if (!adminPass || cleanPassword !== adminPass) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    return NextResponse.json({ success: true, token: createAdminToken() });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}
