import type { Book } from "@/lib/data";

export interface User {
  id: string;
  fullName: string;
  email: string;
  college?: string;
  phone?: string;
  location?: string;
  rating?: number;
}

export interface Conversation {
  id: string;
  bookId?: string;
  bookTitle?: string;
  contactName: string;
  lastMessage?: string;
  lastMessageAt?: string;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  body: string;
  createdAt: string;
}

const TOKEN_KEY = "thebookcycle_token";
const USER_KEY = "thebookcycle_user";

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function getStoredUser(): User | null {
  const raw = localStorage.getItem(USER_KEY);
  return raw ? JSON.parse(raw) : null;
}

export function saveSession(token: string, user: User) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function clearSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers = new Headers(options.headers);
  const token = getToken();

  if (!headers.has("Content-Type") && options.body) {
    headers.set("Content-Type", "application/json");
  }
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(path, { ...options, headers });
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || "Request failed");
  }

  return data as T;
}

export const api = {
  signup: (payload: { fullName: string; email: string; password: string; college?: string }) =>
    request<{ user: User; token: string }>("/api/auth/signup", { method: "POST", body: JSON.stringify(payload) }),
  login: (payload: { email: string; password: string }) =>
    request<{ user: User; token: string }>("/api/auth/login", { method: "POST", body: JSON.stringify(payload) }),
  me: () => request<{ user: User }>("/api/auth/me"),
  listBooks: (params: URLSearchParams = new URLSearchParams()) =>
    request<{ books: Book[] }>(`/api/books${params.toString() ? `?${params}` : ""}`),
  getBook: (id: string) => request<{ book: Book }>(`/api/books/${id}`),
  createBook: (payload: Omit<Book, "id" | "sellerName" | "sellerRating">) =>
    request<{ book: Book }>("/api/books", { method: "POST", body: JSON.stringify(payload) }),
  addWishlist: (bookId: string) =>
    request<{ ok: true }>("/api/wishlist", { method: "POST", body: JSON.stringify({ bookId }) }),
  createOrder: (bookId: string) =>
    request<{ order: unknown }>("/api/orders", { method: "POST", body: JSON.stringify({ bookId }) }),
  dashboard: () =>
    request<{ user: User; listings: Book[]; purchases: Book[]; wishlist: Book[] }>("/api/dashboard"),
  conversations: () => request<{ conversations: Conversation[] }>("/api/messages"),
  messages: (conversationId: string) => request<{ messages: Message[] }>(`/api/messages?conversationId=${conversationId}`),
  sendMessage: (payload: { conversationId?: string; bookId?: string; body: string }) =>
    request<{ message: Message }>("/api/messages", { method: "POST", body: JSON.stringify(payload) }),
};

