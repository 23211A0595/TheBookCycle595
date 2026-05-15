import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getCurrentUser, handleError, handleOptions, sendJson } from "../lib/http.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (handleOptions(req, res)) return;
  if (req.method !== "GET") return sendJson(res, 405, { error: "Method not allowed" });

  try {
    return sendJson(res, 200, { user: await getCurrentUser(req) });
  } catch (error) {
    return handleError(res, error);
  }
}
