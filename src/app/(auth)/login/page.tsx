"use client";

import { useState } from "react";
import Link from "next/link";
import { signIn, getSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { BookOpen, Mail, Lock, AlertCircle, LogIn } from "lucide-react";

import { Suspense } from "react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const callbackUrl = searchParams.get("callbackUrl") || "/articles";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
        setError("Invalid credentials. Please try again.");
      } else {
        const session = await getSession();
        const isAdmin = session?.user?.role?.toLowerCase() === "admin";
        const redirectUrl = isAdmin ? "/admin/dashboard" : (callbackUrl || "/articles");
        router.push(redirectUrl);
        router.refresh();
      }
    } catch (err) {
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fade-in w-full max-w-md relative z-10">
      <Link href="/" className="text-center mb-8 block group">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4 transition-transform group-hover:scale-105 bg-gradient-to-br from-indigo-500 to-purple-500 shadow-[0_0_30px_rgba(99,102,241,0.4)]">
          <BookOpen size={28} className="text-white" />
        </div>
        <h1 className="text-3xl font-bold gradient-text">AMS</h1>
        <p className="text-sm mt-1 text-slate-500 font-medium">Article Management System</p>
      </Link>

      <div className="glass rounded-2xl p-8">
        <h2 className="text-xl font-bold mb-6 text-slate-200">Welcome back</h2>

        {error && (
          <div className="flex items-center gap-2 mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400">
            <AlertCircle size={16} />
            <span className="text-sm">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2 text-slate-400">Email</label>
            <div className="input-with-icon group">
              <Mail size={16} className="input-icon group-focus-within:text-indigo-500" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="input-field"
                placeholder="admin@example.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-slate-400">Password</label>
            <div className="input-with-icon group">
              <Lock size={16} className="input-icon group-focus-within:text-indigo-500" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="input-field"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn-primary w-full justify-center py-3 mt-2"
            disabled={loading}
          >
            {loading ? "Signing in…" : <><LogIn size={16} /> Sign In</>}
          </button>
        </form>

        <p className="text-center mt-6 text-sm text-slate-500">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="font-semibold text-indigo-400">Create one</Link>
        </p>
      </div>

      <p className="text-center text-xs mt-6 text-slate-800">
        &copy; {new Date().getFullYear()} AMS. All rights reserved.
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[radial-gradient(ellipse_at_60%_20%,_rgba(99,102,241,0.15)_0%,_transparent_60%),_#0f0f1a]">
      <div className="fixed top-[10%] left-[5%] w-[300px] h-[300px] rounded-full bg-[radial-gradient(circle,_rgba(99,102,241,0.08),_transparent_70%)] pointer-events-none" />
      <div className="fixed bottom-[15%] right-[10%] w-[200px] h-[200px] rounded-full bg-[radial-gradient(circle,_rgba(139,92,246,0.1),_transparent_70%)] pointer-events-none" />
      
      <Suspense fallback={
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-4 border-indigo-500/20 border-t-indigo-500 animate-spin" />
          <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Initialising Portal…</p>
        </div>
      }>
        <LoginForm />
      </Suspense>
    </div>
  );
}
