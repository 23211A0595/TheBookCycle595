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

const SellBook = () => {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    toast({ title: "Book listed successfully!", description: "Your book is now visible to buyers." });
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
                  Click to upload images
                </div>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label>Book Title</Label>
                <Input required className="mt-1.5" placeholder="e.g. Introduction to Algorithms" />
              </div>
              <div>
                <Label>Author</Label>
                <Input required className="mt-1.5" placeholder="e.g. Thomas Cormen" />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label>Category</Label>
                <Select required>
                  <SelectTrigger className="mt-1.5"><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>
                    {categories.filter(c => c !== "All").map(c => (
                      <SelectItem key={c} value={c}>{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Condition</Label>
                <Select required>
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
              <Label>Description</Label>
              <Textarea className="mt-1.5" rows={3} placeholder="Describe the book's condition, edition, etc." />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label>Price (₹)</Label>
                <Input required type="number" min="1" className="mt-1.5" placeholder="e.g. 300" />
              </div>
              <div>
                <Label>Location</Label>
                <Input required className="mt-1.5" placeholder="e.g. Delhi" />
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
