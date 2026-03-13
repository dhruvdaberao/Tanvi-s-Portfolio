import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export const runtime = "nodejs";

const methodNotAllowed = () =>
  NextResponse.json(
    { success: false, message: "Method not allowed" },
    {
      status: 405,
      headers: { Allow: "POST" },
    }
  );

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { password } = body;

    const adminPassword = process.env.ADMIN_PASSWORD;
    const jwtSecret = process.env.JWT_SECRET;
    const isProduction = process.env.NODE_ENV === "production";

    if (isProduction) {
      console.log("Received password length:", typeof password === "string" ? password.length : 0);
    } else {
      console.log("Received password:", password);
    }
    console.log("Env password exists:", !!adminPassword);
    console.log("JWT secret exists:", !!jwtSecret);

    if (typeof password !== "string" || !password) {
      return NextResponse.json(
        { success: false, message: "Password required" },
        { status: 400 }
      );
    }

    if (!adminPassword || !jwtSecret) {
      console.error("Missing required env vars: ADMIN_PASSWORD or JWT_SECRET");
      return NextResponse.json(
        { success: false, message: "Server error" },
        { status: 500 }
      );
    }

    if (password !== adminPassword) {
      return NextResponse.json(
        { success: false, message: "Invalid credentials" },
        { status: 401 }
      );
    }

    const token = jwt.sign({ role: "admin" }, jwtSecret, { expiresIn: "7d" });

    return NextResponse.json({
      success: true,
      token,
    });
  } catch (error) {
    console.error("Admin login route error:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  return methodNotAllowed();
}

export async function PUT() {
  return methodNotAllowed();
}

export async function PATCH() {
  return methodNotAllowed();
}

export async function DELETE() {
  return methodNotAllowed();
}
