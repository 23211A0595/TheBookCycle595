import type { VercelRequest, VercelResponse } from "@vercel/node";
import { query } from "../lib/db.js";
import { bookSelect } from "../lib/books.js";
import { handleError, handleOptions, readString, sendJson } from "../lib/http.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (handleOptions(req, res)) return;
  if (req.method !== "GET") return sendJson(res, 405, { error: "Method not allowed" });

  try {
    const id = readString(req.query.id);
    const result = await query(`${bookSelect} where b.id = $1`, [id]);

    if (!result.rows[0]) {
      return sendJson(res, 404, { error: "Book not found" });
    }

    return sendJson(res, 200, { book: result.rows[0] });
  } catch (error) {
    return handleError(res, error);
  }
}
