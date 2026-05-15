import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, MessageSquare, ShoppingBag, Heart, Settings } from "lucide-react";
import BookCard from "@/components/BookCard";
import Footer from "@/components/Footer";
import { books } from "@/lib/data";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const Dashboard = () => {
  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 flex items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarFallback className="bg-primary/10 text-primary text-xl font-bold">RS</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Rahul Sharma</h1>
            <p className="text-sm text-muted-foreground">rahul.sharma@college.edu</p>
          </div>
        </div>

        <Tabs defaultValue="listings">
          <TabsList className="mb-6 w-full justify-start overflow-x-auto">
            <TabsTrigger value="listings" className="gap-1.5"><BookOpen className="h-4 w-4" /> My Listings</TabsTrigger>
            <TabsTrigger value="purchases" className="gap-1.5"><ShoppingBag className="h-4 w-4" /> Purchases</TabsTrigger>
            <TabsTrigger value="wishlist" className="gap-1.5"><Heart className="h-4 w-4" /> Wishlist</TabsTrigger>
            <TabsTrigger value="settings" className="gap-1.5"><Settings className="h-4 w-4" /> Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="listings">
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
              {books.slice(0, 3).map((b) => <BookCard key={b.id} book={b} />)}
            </div>
          </TabsContent>

          <TabsContent value="purchases">
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
              {books.slice(3, 5).map((b) => <BookCard key={b.id} book={b} />)}
            </div>
          </TabsContent>

          <TabsContent value="wishlist">
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
              {books.slice(5, 7).map((b) => <BookCard key={b.id} book={b} />)}
            </div>
          </TabsContent>

          <TabsContent value="settings">
            <div className="max-w-md space-y-4 rounded-xl border bg-card p-6">
              <div>
                <Label>Full Name</Label>
                <Input className="mt-1.5" defaultValue="Rahul Sharma" />
              </div>
              <div>
                <Label>Email</Label>
                <Input className="mt-1.5" defaultValue="rahul.sharma@college.edu" />
              </div>
              <div>
                <Label>Phone</Label>
                <Input className="mt-1.5" defaultValue="+91 98765 43210" />
              </div>
              <Button>Save Changes</Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
      <Footer />
    </div>
  );
};

export default Dashboard;
