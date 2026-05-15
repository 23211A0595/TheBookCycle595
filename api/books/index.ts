import type { VercelRequest, VercelResponse } from "@vercel/node";
import { query } from "../lib/db.js";
import { bookSelect } from "../lib/books.js";
import { handleError, handleOptions, readNumber, readString, requireUser, sendJson } from "../lib/http.js";

const validConditions = new Set(["New", "Like New", "Used"]);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (handleOptions(req, res)) return;

  try {
    if (req.method === "GET") {
      const search = readString(req.query.search);
      const category = readString(req.query.category);
      const condition = readString(req.query.condition);
      const maxPrice = readNumber(req.query.maxPrice, 0);
      const clauses = ["b.status = 'available'"];
      const params: unknown[] = [];

      if (search) {
        params.push(`%${search}%`);
        clauses.push(`(b.title ilike $${params.length} or b.author ilike $${params.length})`);
      }
      if (category && category !== "All") {
        params.push(category);
        clauses.push(`b.category = $${params.length}`);
      }
      if (condition && condition !== "All") {
        params.push(condition);
        clauses.push(`b.condition = $${params.length}`);
      }
      if (maxPrice > 0) {
        params.push(maxPrice);
        clauses.push(`b.price <= $${params.length}`);
      }

      const result = await query(`${bookSelect} where ${clauses.join(" and ")} order by b.created_at desc`, params);
      return sendJson(res, 200, { books: result.rows });
    }

    if (req.method === "POST") {
      const user = await requireUser(req);
      const title = readString(req.body.title);
      const author = readString(req.body.author);
      const price = readNumber(req.body.price);
      const condition = readString(req.body.condition);
      const image = readString(req.body.image, "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=400&h=500&fit=crop");
      const category = readString(req.body.category);
      const description = readString(req.body.description);
      const location = readString(req.body.location);

      if (!title || !author || !price || !validConditions.has(condition) || !category || !description || !location) {
        return sendJson(res, 400, { error: "Please complete all required book fields" });
      }

      const result = await query(
        `insert into books (seller_id, title, author, price, condition, image, category, description, location)
         values ($1, $2, $3, $4, $5, $6, $7, $8, $9)
         returning id`,
        [user.id, title, author, price, condition, image, category, description, location],
      );

      const created = await query(`${bookSelect} where b.id = $1`, [result.rows[0].id]);
      return sendJson(res, 201, { book: created.rows[0] });
    }

    return sendJson(res, 405, { error: "Method not allowed" });
  } catch (error) {
    return handleError(res, error);
  }
}
