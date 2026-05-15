export interface Book {
  id: string;
  title: string;
  author: string;
  price: number;
  condition: "New" | "Like New" | "Used";
  image: string;
  category: string;
  description: string;
  sellerName: string;
  sellerRating: number;
  location: string;
}

export const books: Book[] = [
  {
    id: "1",
    title: "Introduction to Algorithms",
    author: "Thomas H. Cormen",
    price: 450,
    condition: "Like New",
    image: "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400&h=500&fit=crop",
    category: "Computer Science",
    description: "Classic algorithms textbook, 4th edition. Minimal highlighting, no torn pages. Perfect for CS students.",
    sellerName: "Rahul S.",
    sellerRating: 4.8,
    location: "Delhi",
  },
  {
    id: "2",
    title: "Engineering Mathematics",
    author: "B.S. Grewal",
    price: 280,
    condition: "Used",
    image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=500&fit=crop",
    category: "Mathematics",
    description: "Well-used but all pages intact. Some notes in margins that may be helpful.",
    sellerName: "Priya M.",
    sellerRating: 4.5,
    location: "Mumbai",
  },
  {
    id: "3",
    title: "Organic Chemistry",
    author: "Morrison & Boyd",
    price: 350,
    condition: "New",
    image: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=400&h=500&fit=crop",
    category: "Chemistry",
    description: "Brand new, never opened. Received as a gift but already had a copy.",
    sellerName: "Amit K.",
    sellerRating: 5.0,
    location: "Bangalore",
  },
  {
    id: "4",
    title: "Principles of Economics",
    author: "N. Gregory Mankiw",
    price: 320,
    condition: "Like New",
    image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=500&fit=crop",
    category: "Economics",
    description: "8th edition, used for one semester. No marks or highlights.",
    sellerName: "Sneha R.",
    sellerRating: 4.7,
    location: "Pune",
  },
  {
    id: "5",
    title: "Data Structures in C",
    author: "Reema Thareja",
    price: 200,
    condition: "Used",
    image: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400&h=500&fit=crop",
    category: "Computer Science",
    description: "Good condition with some highlighting. Great for beginners learning data structures.",
    sellerName: "Vikram P.",
    sellerRating: 4.3,
    location: "Hyderabad",
  },
  {
    id: "6",
    title: "Physics for Engineers",
    author: "Serway & Jewett",
    price: 400,
    condition: "Like New",
    image: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=400&h=500&fit=crop",
    category: "Physics",
    description: "10th edition, barely used. Includes solution manual.",
    sellerName: "Kavya D.",
    sellerRating: 4.9,
    location: "Chennai",
  },
  {
    id: "7",
    title: "Digital Logic Design",
    author: "Morris Mano",
    price: 180,
    condition: "Used",
    image: "https://images.unsplash.com/photo-1589998059171-988d887df646?w=400&h=500&fit=crop",
    category: "Computer Science",
    description: "5th edition. Some wear on cover but content is clean.",
    sellerName: "Arjun T.",
    sellerRating: 4.1,
    location: "Kolkata",
  },
  {
    id: "8",
    title: "Microeconomics",
    author: "Hal R. Varian",
    price: 290,
    condition: "New",
    image: "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=400&h=500&fit=crop",
    category: "Economics",
    description: "Latest edition, sealed pack. Selling because course was changed.",
    sellerName: "Neha G.",
    sellerRating: 4.6,
    location: "Delhi",
  },
];

export const categories = [
  "All",
  "Computer Science",
  "Mathematics",
  "Physics",
  "Chemistry",
  "Economics",
  "Literature",
  "Engineering",
];

export const testimonials = [
  {
    name: "Ananya Sharma",
    college: "IIT Delhi",
    text: "Found my entire semester's books at half the price! TheBookCycle is a lifesaver for students on a budget.",
    avatar: "AS",
  },
  {
    name: "Rohan Mehta",
    college: "BITS Pilani",
    text: "Sold all my old textbooks in just 2 days. The platform is super easy to use and the messaging feature is great.",
    avatar: "RM",
  },
  {
    name: "Divya Patel",
    college: "NIT Trichy",
    text: "Love the exchange feature! Traded my physics books for chemistry ones with a senior. No money spent!",
    avatar: "DP",
  },
];
