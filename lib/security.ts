import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("Missing JWT_SECRET environment variable");
}

export function sanitizeText(value: unknown): string {
  if (typeof value !== "string") return "";
  return value.trim().replace(/<[^>]*>?/gm, "");
}

export function createAdminToken() {
  return jwt.sign({ role: "admin" }, JWT_SECRET as string, { expiresIn: "12h" });
}

export function verifyAdminToken(token: string) {
  try {
    const payload = jwt.verify(token, JWT_SECRET as string) as { role?: string };
    return payload.role === "admin";
  } catch {
    return false;
  }
}
