import type { VercelRequest, VercelResponse } from "@vercel/node";
import jwt from "jsonwebtoken";
import { query } from "./db.js";

export interface AuthUser {
  id: string;
  email: string;
  fullName: string;
}

export function sendJson(res: VercelResponse, status: number, data: unknown) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  return res.status(status).json(data);
}

export function handleOptions(req: VercelRequest, res: VercelResponse) {
  if (req.method === "OPTIONS") {
    sendJson(res, 200, { ok: true });
    return true;
  }
  return false;
}

export function readString(value: unknown, fallback = "") {
  return typeof value === "string" ? value.trim() : fallback;
}

export function readNumber(value: unknown, fallback = 0) {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

export function getJwtSecret() {
  return process.env.JWT_SECRET || process.env.VITE_JWT_SECRET || "thebookcycle-local-dev-secret";
}

export function signToken(user: AuthUser) {
  return jwt.sign(user, getJwtSecret(), { expiresIn: "7d" });
}

export async function requireUser(req: VercelRequest): Promise<AuthUser> {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";

  if (!token) {
    throw Object.assign(new Error("Authentication required"), { statusCode: 401 });
  }

  try {
    return jwt.verify(token, getJwtSecret()) as AuthUser;
  } catch {
    throw Object.assign(new Error("Invalid or expired session"), { statusCode: 401 });
  }
}

export async function getCurrentUser(req: VercelRequest) {
  const auth = await requireUser(req);
  const result = await query(
    `select id, full_name as "fullName", email, college, phone, location, rating
     from users where id = $1`,
    [auth.id],
  );

  if (!result.rows[0]) {
    throw Object.assign(new Error("User not found"), { statusCode: 401 });
  }

  return result.rows[0];
}

export function handleError(res: VercelResponse, error: unknown) {
  const status = typeof error === "object" && error && "statusCode" in error ? Number(error.statusCode) : 500;
  const message = error instanceof Error ? error.message : "Something went wrong";
  const publicMessage = message === "DATABASE_URL is not configured"
    ? "Database is not configured. Add DATABASE_URL in Vercel project settings."
    : message;

  return sendJson(res, status || 500, { error: publicMessage });
}
