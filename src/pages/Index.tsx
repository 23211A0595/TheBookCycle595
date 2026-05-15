import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Search, BookOpen, ArrowRight, Upload, Repeat, ShoppingBag, Shield, Users, Leaf } from "lucide-react";
import BookCard from "@/components/BookCard";
import Footer from "@/components/Footer";
import { books, testimonials } from "@/lib/data";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const steps = [
  { icon: Upload, title: "List Your Book", desc: "Upload photos and details of the book you want to sell or exchange." },
  { icon: Search, title: "Find What You Need", desc: "Browse thousands of textbooks from students across the country." },
  { icon: Repeat, title: "Buy, Sell, or Exchange", desc: "Connect with sellers, negotiate, and complete your transaction." },
];

const reasons = [
  { icon: ShoppingBag, title: "Save Money", desc: "Get textbooks at 50-70% off retail prices." },
  { icon: Shield, title: "Verified Students", desc: "All users are verified students for safe transactions." },
  { icon: Users, title: "Campus Network", desc: "Connect with students from your own campus." },
  { icon: Leaf, title: "Go Green", desc: "Reduce waste by giving books a second life." },
];

const Index = () => {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-secondary/5">
        <div className="container mx-auto px-4 py-20 md:py-32">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl md:text-6xl animate-fade-in">
              Buy, Sell, and Exchange{" "}
              <span className="text-gradient">Books Easily</span>
            </h1>
            <p className="mt-5 text-lg text-muted-foreground md:text-xl animate-fade-in" style={{ animationDelay: "0.1s" }}>
              A smarter way for students to reuse and trade textbooks.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4 animate-fade-in" style={{ animationDelay: "0.2s" }}>
              <Link to="/browse">
                <Button variant="hero" size="lg" className="gap-2">
                  <Search className="h-4 w-4" /> Browse Books
                </Button>
              </Link>
              <Link to="/sell">
                <Button variant="hero-outline" size="lg" className="gap-2">
                  <Upload className="h-4 w-4" /> Sell Your Book
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Books */}
      <section className="container mx-auto px-4 py-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-foreground">Featured Books</h2>
          <Link to="/browse" className="flex items-center gap-1 text-sm font-medium text-primary hover:underline">
            View all <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {books.slice(0, 4).map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-card border-y">
        <div className="container mx-auto px-4 py-16">
          <h2 className="mb-10 text-center text-2xl font-bold text-foreground">How It Works</h2>
          <div className="grid gap-8 md:grid-cols-3">
            {steps.map((step, i) => (
              <div key={i} className="text-center animate-fade-in" style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
                  <step.icon className="h-7 w-7 text-primary" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-foreground">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="mb-10 text-center text-2xl font-bold text-foreground">Why Choose TheBookCycle</h2>
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-4">
          {reasons.map((r, i) => (
            <div key={i} className="rounded-xl border bg-card p-6 text-center shadow-sm hover:shadow-md transition-shadow">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-secondary/10">
                <r.icon className="h-6 w-6 text-secondary" />
              </div>
              <h3 className="mb-1 font-semibold text-foreground">{r.title}</h3>
              <p className="text-sm text-muted-foreground">{r.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-card border-y">
        <div className="container mx-auto px-4 py-16">
          <h2 className="mb-10 text-center text-2xl font-bold text-foreground">Student Testimonials</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {testimonials.map((t, i) => (
              <div key={i} className="rounded-xl border bg-background p-6 shadow-sm">
                <p className="mb-4 text-sm text-muted-foreground italic">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10 bg-primary/10">
                    <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">{t.avatar}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.college}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
