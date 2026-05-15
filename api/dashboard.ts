import type { VercelRequest, VercelResponse } from "@vercel/node";
import { query } from "./lib/db.js";
import { bookSelect } from "./lib/books.js";
import { getCurrentUser, handleError, handleOptions, sendJson } from "./lib/http.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (handleOptions(req, res)) return;
  if (req.method !== "GET") return sendJson(res, 405, { error: "Method not allowed" });

  try {
    const user = await getCurrentUser(req);
    const listings = await query(`${bookSelect} where b.seller_id = $1 order by b.created_at desc`, [user.id]);
    const purchases = await query(
      `${bookSelect} join orders o on o.book_id = b.id where o.buyer_id = $1 order by o.created_at desc`,
      [user.id],
    );
    const wishlist = await query(
      `${bookSelect} join wishlist w on w.book_id = b.id where w.user_id = $1 order by w.created_at desc`,
      [user.id],
    );

    return sendJson(res, 200, {
      user,
      listings: listings.rows,
      purchases: purchases.rows,
      wishlist: wishlist.rows,
    });
  } catch (error) {
    return handleError(res, error);
  }
}
