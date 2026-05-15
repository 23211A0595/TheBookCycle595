import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BookOpen } from "lucide-react";
import { api, saveSession } from "@/lib/api";
import { toast } from "@/hooks/use-toast";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { user, token } = await api.login({ email, password });
      saveSession(token, user);
      toast({ title: "Signed in", description: `Welcome back, ${user.fullName}.` });
      navigate("/dashboard");
    } catch (error) {
      toast({ title: "Could not sign in", description: error instanceof Error ? error.message : "Please try again." });
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
          <p className="text-sm text-muted-foreground">Welcome back! Sign in to your account.</p>
        </div>
        <form className="space-y-4" onSubmit={submit}>
          <div>
            <Label>Email</Label>
            <Input required type="email" className="mt-1.5" placeholder="you@college.edu" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div>
            <Label>Password</Label>
            <Input required type="password" className="mt-1.5" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <Button variant="hero" className="w-full" size="lg">Sign In</Button>
        </form>
        <p className="mt-6 text-center text-sm text-muted-foreground">
          Don't have an account?{" "}
          <Link to="/signup" className="font-medium text-primary hover:underline">Sign up</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;

