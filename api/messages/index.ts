import type { VercelRequest, VercelResponse } from "@vercel/node";
import { query } from "../lib/db.js";
import { handleError, handleOptions, readString, requireUser, sendJson } from "../lib/http.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (handleOptions(req, res)) return;

  try {
    const user = await requireUser(req);

    if (req.method === "GET") {
      const conversationId = readString(req.query.conversationId);

      if (conversationId) {
        const result = await query(
          `select id, conversation_id as "conversationId", sender_id as "senderId", body, created_at as "createdAt"
           from messages
           where conversation_id = $1
           order by created_at asc`,
          [conversationId],
        );
        return sendJson(res, 200, { messages: result.rows });
      }

      const result = await query(
        `select
           c.id,
           c.book_id as "bookId",
           b.title as "bookTitle",
           case when c.buyer_id = $1 then s.full_name else buyer.full_name end as "contactName",
           m.body as "lastMessage",
           m.created_at as "lastMessageAt"
         from conversations c
         join users s on s.id = c.seller_id
         join users buyer on buyer.id = c.buyer_id
         left join books b on b.id = c.book_id
         left join lateral (
           select body, created_at from messages where conversation_id = c.id order by created_at desc limit 1
         ) m on true
         where c.buyer_id = $1 or c.seller_id = $1
         order by coalesce(m.created_at, c.created_at) desc`,
        [user.id],
      );
      return sendJson(res, 200, { conversations: result.rows });
    }

    if (req.method === "POST") {
      const bookId = readString(req.body.bookId);
      const conversationId = readString(req.body.conversationId);
      const body = readString(req.body.body);

      if (!body) {
        return sendJson(res, 400, { error: "Message cannot be empty" });
      }

      let finalConversationId = conversationId;

      if (!finalConversationId) {
        const book = await query(`select seller_id from books where id = $1`, [bookId]);
        if (!book.rows[0]?.seller_id) {
          return sendJson(res, 404, { error: "Book seller not found" });
        }

        const conversation = await query(
          `insert into conversations (book_id, buyer_id, seller_id)
           values ($1, $2, $3)
           on conflict (book_id, buyer_id, seller_id) do update set book_id = excluded.book_id
           returning id`,
          [bookId, user.id, book.rows[0].seller_id],
        );
        finalConversationId = conversation.rows[0].id;
      }

      const result = await query(
        `insert into messages (conversation_id, sender_id, body)
         values ($1, $2, $3)
         returning id, conversation_id as "conversationId", sender_id as "senderId", body, created_at as "createdAt"`,
        [finalConversationId, user.id, body],
      );

      return sendJson(res, 201, { message: result.rows[0] });
    }

    return sendJson(res, 405, { error: "Method not allowed" });
  } catch (error) {
    return handleError(res, error);
  }
}
