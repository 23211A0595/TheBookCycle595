import type { VercelRequest, VercelResponse } from "@vercel/node";
import bcrypt from "bcryptjs";
import { query } from "../lib/db.js";
import { handleError, handleOptions, readString, sendJson, signToken } from "../lib/http.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (handleOptions(req, res)) return;
  if (req.method !== "POST") return sendJson(res, 405, { error: "Method not allowed" });

  try {
    const fullName = readString(req.body.fullName);
    const email = readString(req.body.email).toLowerCase();
    const password = readString(req.body.password);
    const college = readString(req.body.college);

    if (!fullName || !email || password.length < 6) {
      return sendJson(res, 400, { error: "Name, email, and a 6+ character password are required" });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const result = await query(
      `insert into users (full_name, email, password_hash, college)
       values ($1, $2, $3, $4)
       returning id, full_name as "fullName", email`,
      [fullName, email, passwordHash, college || null],
    );
    const user = result.rows[0] as { id: string; fullName: string; email: string };

    return sendJson(res, 201, { user, token: signToken(user) });
  } catch (error) {
    if (error instanceof Error && error.message.includes("duplicate key")) {
      return sendJson(res, 409, { error: "An account with this email already exists" });
    }
    return handleError(res, error);
  }
}
