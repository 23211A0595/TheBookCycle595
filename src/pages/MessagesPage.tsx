import { useState } from "react";
import { Send } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Footer from "@/components/Footer";

interface Message {
  id: number;
  text: string;
  sender: "me" | "other";
}

const initialMessages: Message[] = [
  { id: 1, text: "Hi! Is the Algorithms book still available?", sender: "me" },
  { id: 2, text: "Yes, it's available! Are you from Delhi?", sender: "other" },
  { id: 3, text: "Yes! Can we meet at campus tomorrow?", sender: "me" },
  { id: 4, text: "Sure, let's meet at the library at 2 PM.", sender: "other" },
];

const contacts = [
  { name: "Priya M.", avatar: "PM", lastMsg: "Sure, let's meet at the library" },
  { name: "Amit K.", avatar: "AK", lastMsg: "Is ₹300 okay for you?" },
  { name: "Sneha R.", avatar: "SR", lastMsg: "I'll check and let you know" },
];

const MessagesPage = () => {
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState("");
  const [activeContact, setActiveContact] = useState(0);

  const send = () => {
    if (!input.trim()) return;
    setMessages([...messages, { id: Date.now(), text: input, sender: "me" }]);
    setInput("");
  };

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <h1 className="mb-6 text-2xl font-bold text-foreground">Messages</h1>
        <div className="flex h-[500px] overflow-hidden rounded-xl border bg-card">
          {/* Contacts */}
          <div className="hidden w-64 shrink-0 border-r md:block">
            {contacts.map((c, i) => (
              <button
                key={i}
                onClick={() => setActiveContact(i)}
                className={`flex w-full items-center gap-3 border-b px-4 py-3 text-left transition-colors hover:bg-muted ${
                  activeContact === i ? "bg-accent" : ""
                }`}
              >
                <Avatar className="h-9 w-9">
                  <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">{c.avatar}</AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground">{c.name}</p>
                  <p className="truncate text-xs text-muted-foreground">{c.lastMsg}</p>
                </div>
              </button>
            ))}
          </div>

          {/* Chat */}
          <div className="flex flex-1 flex-col">
            <div className="border-b px-4 py-3">
              <p className="text-sm font-semibold text-foreground">{contacts[activeContact].name}</p>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((m) => (
                <div key={m.id} className={`flex ${m.sender === "me" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[70%] rounded-2xl px-4 py-2 text-sm ${
                      m.sender === "me"
                        ? "bg-primary text-primary-foreground rounded-br-md"
                        : "bg-muted text-foreground rounded-bl-md"
                    }`}
                  >
                    {m.text}
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t p-3 flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type a message..."
                onKeyDown={(e) => e.key === "Enter" && send()}
              />
              <Button size="icon" onClick={send}>
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
