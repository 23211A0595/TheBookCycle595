import type { VercelRequest, VercelResponse } from "@vercel/node";
import bcrypt from "bcryptjs";
import { query } from "../lib/db.js";
import { handleError, handleOptions, readString, sendJson, signToken } from "../lib/http.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (handleOptions(req, res)) return;
  if (req.method !== "POST") return sendJson(res, 405, { error: "Method not allowed" });

  try {
    const email = readString(req.body.email).toLowerCase();
    const password = readString(req.body.password);
    const result = await query(
      `select id, full_name as "fullName", email, password_hash as "passwordHash"
       from users where email = $1`,
      [email],
    );
    const user = result.rows[0];

    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      return sendJson(res, 401, { error: "Invalid email or password" });
    }

    const safeUser = { id: user.id, fullName: user.fullName, email: user.email };
    return sendJson(res, 200, { user: safeUser, token: signToken(safeUser) });
  } catch (error) {
    return handleError(res, error);
  }
}
