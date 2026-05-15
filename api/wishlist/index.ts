import type { VercelRequest, VercelResponse } from "@vercel/node";
import { query } from "../lib/db.js";
import { bookSelect } from "../lib/books.js";
import { handleError, handleOptions, readString, requireUser, sendJson } from "../lib/http.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (handleOptions(req, res)) return;

  try {
    const user = await requireUser(req);

    if (req.method === "GET") {
      const result = await query(
        `${bookSelect}
         join wishlist w on w.book_id = b.id
         where w.user_id = $1
         order by w.created_at desc`,
        [user.id],
      );
      return sendJson(res, 200, { books: result.rows });
    }

    if (req.method === "POST") {
      const bookId = readString(req.body.bookId);
      await query(`insert into wishlist (user_id, book_id) values ($1, $2) on conflict do nothing`, [user.id, bookId]);
      return sendJson(res, 201, { ok: true });
    }

    if (req.method === "DELETE") {
      const bookId = readString(req.query.bookId);
      await query(`delete from wishlist where user_id = $1 and book_id = $2`, [user.id, bookId]);
      return sendJson(res, 200, { ok: true });
    }

    return sendJson(res, 405, { error: "Method not allowed" });
  } catch (error) {
    return handleError(res, error);
  }
}
