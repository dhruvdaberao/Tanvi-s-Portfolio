import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const sourceUrl = request.nextUrl.searchParams.get("url") || "";
    if (!sourceUrl) {
      return NextResponse.json({ success: false, message: "Missing audio URL" }, { status: 400 });
    }

    // Adding a timestamp to forcefully break out of CDN cache layers if there's any
    const fetchUrl = sourceUrl.includes('?') ? sourceUrl : `${sourceUrl}?t=${Date.now()}`;
    const upstream = await fetch(fetchUrl, { cache: "no-store" });
    if (!upstream.ok || !upstream.body) {
      return NextResponse.json({ success: false, message: "Failed to load audio" }, { status: 502 });
    }

    const headers = new Headers();
    headers.set("content-type", upstream.headers.get("content-type") || "audio/mpeg");
    headers.set("cache-control", "public, max-age=3600, must-revalidate");

    return new NextResponse(upstream.body, {
      status: 200,
      headers,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: "Failed to proxy audio" }, { status: 500 });
  }
}
