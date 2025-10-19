import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Lock, Loader2 } from "lucide-react";
import { signIn } from "@/services/authService";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const AdminLogin = () => {
  const navigate = useNavigate();
  const { session } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (session) {
      navigate("/admin");
    }
  }, [session, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Please enter both email and password");
      return;
    }

    setIsLoading(true);

    try {
      const success = await signIn(email, password);

      if (success) {
        toast.success("Login successful!");
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      }
    } catch (error) {
      toast.error("Login failed. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-purple-300 via-pink-200 to-yellow-200">
      <div className="w-full max-w-md p-10 space-y-8 bg-white rounded-3xl shadow-2xl shadow-purple-300/50">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-purple-700">Admin Login</h1>
          <p className="mt-2 text-gray-600">Enter your credentials to access the admin panel</p>
        </div>

        <form onSubmit={handleLogin} className="mt-8 space-y-6">
          <div className="space-y-5">
            <div>
              <Label htmlFor="email" className="text-purple-700 font-medium">
                Email
              </Label>
              <div className="flex items-center mt-1 border-2 border-purple-300 rounded-xl focus-within:ring-2 focus-within:ring-purple-400 focus-within:border-purple-400 transition">
                <Mail className="h-5 w-5 text-purple-400 ml-3" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="border-none focus-visible:ring-0 focus-visible:ring-offset-0 px-3 py-2 text-purple-700"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="password" className="text-purple-700 font-medium">
                Password
              </Label>
              <div className="flex items-center mt-1 border-2 border-purple-300 rounded-xl focus-within:ring-2 focus-within:ring-purple-400 focus-within:border-purple-400 transition">
                <Lock className="h-5 w-5 text-purple-400 ml-3" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="border-none focus-visible:ring-0 focus-visible:ring-offset-0 px-3 py-2 text-purple-700"
                />
              </div>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-pink-500 hover:to-purple-500 text-white font-bold py-3 rounded-xl shadow-lg transition-all flex justify-center items-center"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Logging in...
              </>
            ) : (
              "Login to Admin Panel"
            )}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
