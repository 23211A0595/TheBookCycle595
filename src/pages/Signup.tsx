import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BookOpen } from "lucide-react";
import { api, saveSession } from "@/lib/api";
import { toast } from "@/hooks/use-toast";

const Signup = () => {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { user, token } = await api.signup({ fullName, email, password });
      saveSession(token, user);
      toast({ title: "Account created", description: "You can now list, buy, and message sellers." });
      navigate("/dashboard");
    } catch (error) {
      toast({ title: "Could not create account", description: error instanceof Error ? error.message : "Please try again." });
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <Link to="/" className="inline-flex items-center gap-2 mb-4">
            <BookOpen className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold text-foreground">The<span className="text-primary">BookCycle</span></span>
          </Link>
          <p className="text-sm text-muted-foreground">Create your account and start trading books.</p>
        </div>
        <form className="space-y-4" onSubmit={submit}>
          <div>
            <Label>Full Name</Label>
            <Input required className="mt-1.5" placeholder="John Doe" value={fullName} onChange={(e) => setFullName(e.target.value)} />
          </div>
          <div>
            <Label>Email</Label>
            <Input required type="email" className="mt-1.5" placeholder="you@college.edu" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div>
            <Label>Password</Label>
            <Input required minLength={6} type="password" className="mt-1.5" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <Button variant="hero" className="w-full" size="lg">Create Account</Button>
        </form>
        <p className="mt-6 text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link to="/login" className="font-medium text-primary hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;

