import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Send } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Footer from "@/components/Footer";
import { api, getStoredUser, type Conversation, type Message } from "@/lib/api";
import { toast } from "@/hooks/use-toast";

const initials = (name = "User") => name.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase();

const MessagesPage = () => {
  const user = getStoredUser();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    api.conversations()
      .then(({ conversations }) => {
        setConversations(conversations);
        setActiveId(conversations[0]?.id || "");
      })
      .catch((error) => {
        if (getStoredUser()) toast({ title: "Could not load messages", description: error.message });
      });
  }, []);

  useEffect(() => {
    if (!activeId) {
      setMessages([]);
      return;
    }
    api.messages(activeId)
      .then(({ messages }) => setMessages(messages))
      .catch((error) => toast({ title: "Could not load conversation", description: error.message }));
  }, [activeId]);

  const send = async () => {
    if (!input.trim() || !activeId) return;
    try {
      const { message } = await api.sendMessage({ conversationId: activeId, body: input });
      setMessages((current) => [...current, message]);
      setInput("");
    } catch (error) {
      toast({ title: "Could not send message", description: error instanceof Error ? error.message : "Please try again." });
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen">
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold text-foreground">Sign in to view messages</h1>
          <p className="mt-2 text-muted-foreground">Buyer and seller chats are saved after login.</p>
          <Link to="/login"><Button className="mt-6">Sign In</Button></Link>
        </div>
        <Footer />
      </div>
    );
  }

  const activeConversation = conversations.find((conversation) => conversation.id === activeId);

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <h1 className="mb-6 text-2xl font-bold text-foreground">Messages</h1>
        <div className="flex h-[500px] overflow-hidden rounded-xl border bg-card">
          <div className="hidden w-64 shrink-0 border-r md:block">
            {conversations.length === 0 ? (
              <div className="p-4 text-sm text-muted-foreground">No conversations yet.</div>
            ) : conversations.map((conversation) => (
              <button
                key={conversation.id}
                onClick={() => setActiveId(conversation.id)}
                className={`flex w-full items-center gap-3 border-b px-4 py-3 text-left transition-colors hover:bg-muted ${
                  activeId === conversation.id ? "bg-accent" : ""
                }`}
              >
                <Avatar className="h-9 w-9">
                  <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">{initials(conversation.contactName)}</AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground">{conversation.contactName}</p>
                  <p className="truncate text-xs text-muted-foreground">{conversation.lastMessage || conversation.bookTitle || "New conversation"}</p>
                </div>
              </button>
            ))}
          </div>

          <div className="flex flex-1 flex-col">
            <div className="border-b px-4 py-3">
              <p className="text-sm font-semibold text-foreground">{activeConversation?.contactName || "Conversation"}</p>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.length === 0 ? (
                <div className="py-16 text-center text-sm text-muted-foreground">No messages yet.</div>
              ) : messages.map((message) => (
                <div key={message.id} className={`flex ${message.senderId === user.id ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[70%] rounded-2xl px-4 py-2 text-sm ${
                      message.senderId === user.id
                        ? "bg-primary text-primary-foreground rounded-br-md"
                        : "bg-muted text-foreground rounded-bl-md"
                    }`}
                  >
                    {message.body}
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t p-3 flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={activeId ? "Type a message..." : "Start from a book detail page"}
                disabled={!activeId}
                onKeyDown={(e) => e.key === "Enter" && send()}
              />
              <Button size="icon" onClick={send} disabled={!activeId}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default MessagesPage;
