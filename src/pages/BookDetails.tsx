import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { ArrowLeft, Star, Heart, MessageSquare, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Footer from "@/components/Footer";
import { books } from "@/lib/data";
import type { Book } from "@/lib/data";
import { api, getToken } from "@/lib/api";
import { toast } from "@/hooks/use-toast";

const BookDetails = () => {
  const { id } = useParams();
  const [book, setBook] = useState<Book | undefined>(() => books.find((b) => b.id === id));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    setLoading(true);
    api.getBook(id)
      .then(({ book }) => setBook(book))
      .catch(() => setBook(books.find((b) => b.id === id)))
      .finally(() => setLoading(false));
  }, [id]);

  const requireLogin = () => {
    if (!getToken()) {
      toast({ title: "Please sign in first", description: "Create an account or log in to continue." });
      return false;
    }
    return true;
  };

  if (loading) {
    return <div className="container mx-auto px-4 py-20 text-center text-muted-foreground">Loading book...</div>;
  }

  if (!book) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <p className="text-muted-foreground">Book not found.</p>
        <Link to="/browse"><Button variant="link">Back to Browse</Button></Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <Link to="/browse" className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back to Browse
        </Link>

        <div className="mt-4 grid gap-8 md:grid-cols-2">
          <div className="overflow-hidden rounded-xl border bg-muted aspect-[3/4]">
            <img src={book.image} alt={book.title} className="h-full w-full object-cover" />
          </div>

          <div className="flex flex-col">
            <Badge className="mb-3 w-fit">{book.condition}</Badge>
            <h1 className="text-2xl font-bold text-foreground md:text-3xl">{book.title}</h1>
            <p className="mt-1 text-muted-foreground">by {book.author}</p>
            <p className="mt-4 text-3xl font-bold text-primary">₹{book.price}</p>

            <div className="mt-6 space-y-3 text-sm text-muted-foreground">
              <p><span className="font-medium text-foreground">Category:</span> {book.category}</p>
              <p><span className="font-medium text-foreground">Location:</span> {book.location}</p>
              <p><span className="font-medium text-foreground">Description:</span> {book.description}</p>
            </div>

            {/* Seller info */}
            <div className="mt-6 flex items-center gap-3 rounded-xl border bg-muted/50 p-4">
              <Avatar>
                <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                  {book.sellerName.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-semibold text-foreground">{book.sellerName}</p>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Star className="h-3 w-3 fill-warning text-warning" /> {book.sellerRating} rating
                </div>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button
                variant="hero"
                size="lg"
                className="gap-2"
                onClick={() => {
                  if (!requireLogin()) return;
                  api.createOrder(book.id)
                    .then(() => toast({ title: "Purchase request created!", description: "The seller can now confirm the order." }))
                    .catch((error) => toast({ title: "Could not buy this book", description: error.message }));
                }}
              >
                <ShoppingBag className="h-4 w-4" /> Buy Book
              </Button>
              <Link to="/messages">
                <Button
                  variant="outline"
                  size="lg"
                  className="gap-2"
                  onClick={() => {
                    if (!requireLogin()) return;
                    api.sendMessage({ bookId: book.id, body: `Hi, I am interested in "${book.title}". Is it available?` })
                      .catch(() => undefined);
                  }}
                >
                  <MessageSquare className="h-4 w-4" /> Message Seller
                </Button>
              </Link>
              <Button
                variant="ghost"
                size="lg"
                className="gap-2"
                onClick={() => {
                  if (!requireLogin()) return;
                  api.addWishlist(book.id)
                    .then(() => toast({ title: "Added to wishlist!" }))
                    .catch((error) => toast({ title: "Could not update wishlist", description: error.message }));
                }}
              >
                <Heart className="h-4 w-4" /> Wishlist
              </Button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default BookDetails;
