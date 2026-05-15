import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Upload, ImagePlus } from "lucide-react";
import Footer from "@/components/Footer";
import { categories } from "@/lib/data";
import { toast } from "@/hooks/use-toast";
import { api, getToken } from "@/lib/api";

const SellBook = () => {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    title: "",
    author: "",
    category: "",
    condition: "",
    image: "",
    description: "",
    price: "",
    location: "",
  });

  const update = (key: keyof typeof form, value: string) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!getToken()) {
      toast({ title: "Please sign in first", description: "You need an account before listing a book." });
      return;
    }

    try {
      await api.createBook({
        title: form.title,
        author: form.author,
        category: form.category,
        condition: form.condition as "New" | "Like New" | "Used",
        image: form.image || "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=400&h=500&fit=crop",
        description: form.description,
        price: Number(form.price),
        location: form.location,
      });
      setSubmitted(true);
      toast({ title: "Book listed successfully!", description: "Your book is now visible to buyers." });
    } catch (error) {
      toast({ title: "Could not post listing", description: error instanceof Error ? error.message : "Please try again." });
    }
  };

  return (
    <div className="min-h-screen">
      <div className="container mx-auto max-w-2xl px-4 py-8">
        <h1 className="mb-2 text-2xl font-bold text-foreground">Sell Your Book</h1>
        <p className="mb-8 text-muted-foreground">Fill in the details below to list your book.</p>

        {submitted ? (
          <div className="rounded-xl border bg-card p-10 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-success/10">
              <Upload className="h-8 w-8 text-success" />
            </div>
            <h2 className="text-xl font-semibold text-foreground">Listing Posted!</h2>
            <p className="mt-2 text-muted-foreground">Your book has been listed. Buyers can now find it.</p>
            <Button className="mt-6" onClick={() => setSubmitted(false)}>List Another Book</Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5 rounded-xl border bg-card p-6">
            <div>
              <Label>Book Images</Label>
              <div className="mt-1.5 flex h-32 cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-border bg-muted/50 hover:bg-muted transition-colors">
                <div className="text-center text-sm text-muted-foreground">
                  <ImagePlus className="mx-auto mb-1 h-8 w-8" />
                  Paste an image URL below
                </div>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label>Book Title</Label>
                <Input required className="mt-1.5" placeholder="e.g. Introduction to Algorithms" value={form.title} onChange={(e) => update("title", e.target.value)} />
              </div>
              <div>
                <Label>Author</Label>
                <Input required className="mt-1.5" placeholder="e.g. Thomas Cormen" value={form.author} onChange={(e) => update("author", e.target.value)} />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label>Category</Label>
                <Select required value={form.category} onValueChange={(value) => update("category", value)}>
                  <SelectTrigger className="mt-1.5"><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>
                    {categories.filter((c) => c !== "All").map((c) => (
                      <SelectItem key={c} value={c}>{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Condition</Label>
                <Select required value={form.condition} onValueChange={(value) => update("condition", value)}>
                  <SelectTrigger className="mt-1.5"><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="New">New</SelectItem>
                    <SelectItem value="Like New">Like New</SelectItem>
                    <SelectItem value="Used">Used</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label>Image URL</Label>
              <Input className="mt-1.5" placeholder="Paste an image URL, or leave blank for default" value={form.image} onChange={(e) => update("image", e.target.value)} />
            </div>
            <div>
              <Label>Description</Label>
              <Textarea required className="mt-1.5" rows={3} placeholder="Describe the book's condition, edition, etc." value={form.description} onChange={(e) => update("description", e.target.value)} />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label>Price</Label>
                <Input required type="number" min="1" className="mt-1.5" placeholder="e.g. 300" value={form.price} onChange={(e) => update("price", e.target.value)} />
              </div>
              <div>
                <Label>Location</Label>
                <Input required className="mt-1.5" placeholder="e.g. Delhi" value={form.location} onChange={(e) => update("location", e.target.value)} />
              </div>
            </div>
            <Button type="submit" variant="hero" size="lg" className="w-full gap-2">
              <Upload className="h-4 w-4" /> Post Listing
            </Button>
          </form>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default SellBook;

