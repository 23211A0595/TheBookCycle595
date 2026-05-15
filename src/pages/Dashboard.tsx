import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, MessageSquare, ShoppingBag, Heart, Settings } from "lucide-react";
import BookCard from "@/components/BookCard";
import Footer from "@/components/Footer";
import type { Book } from "@/lib/data";
import { books } from "@/lib/data";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api, clearSession, getStoredUser, type User } from "@/lib/api";
import { toast } from "@/hooks/use-toast";

const initials = (name = "User") => name.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase();

const Dashboard = () => {
  const [user, setUser] = useState<User | null>(getStoredUser());
  const [listings, setListings] = useState<Book[]>([]);
  const [purchases, setPurchases] = useState<Book[]>([]);
  const [wishlist, setWishlist] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.dashboard()
      .then((data) => {
        setUser(data.user);
        setListings(data.listings);
        setPurchases(data.purchases);
        setWishlist(data.wishlist);
      })
      .catch((error) => {
        if (!getStoredUser()) {
          toast({ title: "Please sign in", description: "Your dashboard is available after login." });
        } else {
          toast({ title: "Dashboard is using sample data", description: error.message });
          setListings(books.slice(0, 3));
          setPurchases(books.slice(3, 5));
          setWishlist(books.slice(5, 7));
        }
      })
      .finally(() => setLoading(false));
  }, []);

  if (!user && !loading) {
    return (
      <div className="min-h-screen">
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold text-foreground">Sign in to view your dashboard</h1>
          <p className="mt-2 text-muted-foreground">Your listings, purchases, wishlist, and settings will appear here.</p>
          <Link to="/login"><Button className="mt-6">Sign In</Button></Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarFallback className="bg-primary/10 text-primary text-xl font-bold">{initials(user?.fullName)}</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl font-bold text-foreground">{user?.fullName || "Student"}</h1>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
            </div>
          </div>
          <Button
            variant="outline"
            onClick={() => {
              clearSession();
              window.location.href = "#/login";
            }}
          >
            Sign Out
          </Button>
        </div>

        <Tabs defaultValue="listings">
          <TabsList className="mb-6 w-full justify-start overflow-x-auto">
            <TabsTrigger value="listings" className="gap-1.5"><BookOpen className="h-4 w-4" /> My Listings</TabsTrigger>
            <TabsTrigger value="purchases" className="gap-1.5"><ShoppingBag className="h-4 w-4" /> Purchases</TabsTrigger>
            <TabsTrigger value="wishlist" className="gap-1.5"><Heart className="h-4 w-4" /> Wishlist</TabsTrigger>
            <TabsTrigger value="messages" className="gap-1.5"><MessageSquare className="h-4 w-4" /> Messages</TabsTrigger>
            <TabsTrigger value="settings" className="gap-1.5"><Settings className="h-4 w-4" /> Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="listings">
            {listings.length ? (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                {listings.map((b) => <BookCard key={b.id} book={b} />)}
              </div>
            ) : (
              <div className="rounded-xl border bg-card p-8 text-center text-muted-foreground">
                You have not listed any books yet.
              </div>
            )}
          </TabsContent>

          <TabsContent value="purchases">
            {purchases.length ? (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                {purchases.map((b) => <BookCard key={b.id} book={b} />)}
              </div>
            ) : (
              <div className="rounded-xl border bg-card p-8 text-center text-muted-foreground">
                No purchases yet.
              </div>
            )}
          </TabsContent>

          <TabsContent value="wishlist">
            {wishlist.length ? (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                {wishlist.map((b) => <BookCard key={b.id} book={b} />)}
              </div>
            ) : (
              <div className="rounded-xl border bg-card p-8 text-center text-muted-foreground">
                Your wishlist is empty.
              </div>
            )}
          </TabsContent>

          <TabsContent value="messages">
            <Link to="/messages"><Button className="gap-2"><MessageSquare className="h-4 w-4" /> Open Messages</Button></Link>
          </TabsContent>

          <TabsContent value="settings">
            <div className="max-w-md space-y-4 rounded-xl border bg-card p-6">
              <div>
                <Label>Full Name</Label>
                <Input className="mt-1.5" value={user?.fullName || ""} readOnly />
              </div>
              <div>
                <Label>Email</Label>
                <Input className="mt-1.5" value={user?.email || ""} readOnly />
              </div>
              <div>
                <Label>Phone</Label>
                <Input className="mt-1.5" placeholder="Add profile editing next" readOnly />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
      <Footer />
    </div>
  );
};

export default Dashboard;
