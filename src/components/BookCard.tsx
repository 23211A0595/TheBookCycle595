import { Star } from "lucide-react";
import { Link } from "react-router-dom";
import type { Book } from "@/lib/data";
import { Badge } from "@/components/ui/badge";

const conditionColor: Record<string, string> = {
  New: "bg-success text-success-foreground",
  "Like New": "bg-primary text-primary-foreground",
  Used: "bg-warning text-warning-foreground",
};

const BookCard = ({ book }: { book: Book }) => (
  <Link
    to={`/book/${book.id}`}
    className="group rounded-xl border bg-card shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden"
  >
    <div className="aspect-[3/4] overflow-hidden bg-muted">
      <img
        src={book.image}
        alt={book.title}
        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        loading="lazy"
      />
    </div>
    <div className="p-4">
      <div className="flex items-start justify-between gap-2 mb-1">
        <h3 className="text-sm font-semibold text-foreground line-clamp-2 leading-snug">
          {book.title}
        </h3>
      </div>
      <p className="text-xs text-muted-foreground mb-2">{book.author}</p>
      <div className="flex items-center justify-between">
        <span className="text-lg font-bold text-primary">₹{book.price}</span>
        <Badge className={`text-[10px] px-2 py-0.5 ${conditionColor[book.condition]}`}>
          {book.condition}
        </Badge>
      </div>
      <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
        <Star className="h-3 w-3 fill-warning text-warning" />
        <span>{book.sellerRating}</span>
        <span className="mx-1">·</span>
        <span>{book.location}</span>
      </div>
    </div>
  </Link>
);

export default BookCard;
