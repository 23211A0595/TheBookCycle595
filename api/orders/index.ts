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
         join orders o on o.book_id = b.id
         where o.buyer_id = $1
         order by o.created_at desc`,
        [user.id],
      );
      return sendJson(res, 200, { books: result.rows });
    }

    if (req.method === "POST") {
      const bookId = readString(req.body.bookId);
      const book = await query(`select seller_id from books where id = $1 and status = 'available'`, [bookId]);

      if (!book.rows[0]) {
        return sendJson(res, 404, { error: "Book is not available" });
      }
      if (book.rows[0].seller_id === user.id) {
        return sendJson(res, 400, { error: "You cannot buy your own listing" });
      }

      const result = await query(
        `insert into orders (buyer_id, book_id, seller_id)
         values ($1, $2, $3)
         returning id, status, created_at as "createdAt"`,
        [user.id, bookId, book.rows[0].seller_id],
      );
      await query(`update books set status = 'reserved' where id = $1`, [bookId]);

      return sendJson(res, 201, { order: result.rows[0] });
    }

    return sendJson(res, 405, { error: "Method not allowed" });
  } catch (error) {
    return handleError(res, error);
  }
}
