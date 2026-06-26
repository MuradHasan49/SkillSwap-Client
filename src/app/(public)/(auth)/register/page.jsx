"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signUp, signIn } from "@/lib/auth-client";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [image, setImage] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("client");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const validatePassword = (pwd) => {
    if (pwd.length < 6) return "Password must be at least 6 characters long.";
    if (!/[A-Z]/.test(pwd)) return "Password must contain at least one uppercase letter.";
    if (!/[a-z]/.test(pwd)) return "Password must contain at least one lowercase letter.";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) return toast.error("Please fill in required fields.");
    
    const pwdError = validatePassword(password);
    if (pwdError) return toast.error(pwdError);

    setIsLoading(true);
    await signUp.email({
      name,
      email,
      password,
      image: image || undefined,
      initialRole: role,
      fetchOptions: {
        onSuccess: async (ctx) => {
          setIsLoading(false);
          toast.success("Account created successfully!");
          if (role === "client") {
            router.push("/");
          } else {
            router.push(`/dashboard/${role}`);
          }
        },
        onError: (ctx) => {
          setIsLoading(false);
          toast.error(ctx.error.message || "Registration failed");
        },
      },
    });
  };

  const handleGoogleLogin = async () => {
    await signIn.social({
      provider: "google",
      callbackURL: "/", // Google login always creates client, redirects to home
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-900 px-4 py-12">
      <div className="max-w-md w-full bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 border border-gray-100 dark:border-slate-700">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Create Account</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">Join SkillSwap and start today</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-slate-600 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-slate-700 dark:text-white transition-all"
              placeholder="John Doe"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email *</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-slate-600 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-slate-700 dark:text-white transition-all"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Profile Image URL</label>
            <input
              type="url"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-slate-600 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-slate-700 dark:text-white transition-all"
              placeholder="https://example.com/avatar.jpg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Password *</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-slate-600 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-slate-700 dark:text-white transition-all"
              placeholder="••••••••"
            />
            <p className="text-xs text-gray-500 mt-1">Min 6 chars, 1 uppercase, 1 lowercase.</p>
          </div>

          <div className="pt-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">I want to join as a:</label>
            <div className="flex gap-4">
              <label className={`flex-1 cursor-pointer border rounded-xl p-4 flex flex-col items-center gap-2 transition-all ${role === "client" ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300" : "border-gray-200 dark:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-700"}`}>
                <input type="radio" name="role" value="client" checked={role === "client"} onChange={() => setRole("client")} className="hidden" />
                <span className="font-semibold">Client</span>
                <span className="text-xs text-center opacity-80">Hire talent</span>
              </label>
              <label className={`flex-1 cursor-pointer border rounded-xl p-4 flex flex-col items-center gap-2 transition-all ${role === "freelancer" ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300" : "border-gray-200 dark:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-700"}`}>
                <input type="radio" name="role" value="freelancer" checked={role === "freelancer"} onChange={() => setRole("freelancer")} className="hidden" />
                <span className="font-semibold">Freelancer</span>
                <span className="text-xs text-center opacity-80">Find work</span>
              </label>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-lg shadow-md transition-colors flex justify-center items-center"
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Sign Up"}
          </button>
        </form>

        <div className="mt-6 flex items-center">
          <div className="flex-1 border-t border-gray-200 dark:border-slate-600"></div>
          <span className="px-4 text-sm text-gray-500 dark:text-gray-400">or</span>
          <div className="flex-1 border-t border-gray-200 dark:border-slate-600"></div>
        </div>

        <button
          onClick={handleGoogleLogin}
          className="mt-6 w-full flex items-center justify-center gap-2 bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-white hover:bg-gray-50 dark:hover:bg-slate-600 font-medium py-3 px-4 rounded-lg transition-colors"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
          </svg>
          Sign Up with Google (Client Only)
        </button>

        <p className="mt-8 text-center text-sm text-gray-600 dark:text-gray-400">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-indigo-600 hover:text-indigo-500 transition-colors">
            Log In
          </Link>
        </p>
      </div>
    </div>
  );
}
