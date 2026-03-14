import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

function getJwtSecret() {
  if (!JWT_SECRET) {
    throw new Error("Missing JWT_SECRET environment variable");
  }

  return JWT_SECRET;
}

export function sanitizeText(value: unknown): string {
  if (typeof value !== "string") return "";
  return value.trim().replace(/<[^>]*>?/gm, "");
}

export function createAdminToken() {
  return jwt.sign({ role: "admin" }, getJwtSecret(), { expiresIn: "12h" });
}

export function verifyAdminToken(token: string) {
  try {
    const payload = jwt.verify(token, getJwtSecret()) as { role?: string };
    return payload.role === "admin";
  } catch {
    return false;
  }
}
