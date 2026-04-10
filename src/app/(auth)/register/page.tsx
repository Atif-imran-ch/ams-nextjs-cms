"use client";

import { useState } from "react";
import Link from "next/link";
import { signIn, getSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { BookOpen, Mail, Lock, User, AlertCircle, UserPlus } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "", password_confirmation: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (form.password !== form.password_confirmation) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const contentType = res.headers.get("content-type") || "";
      if (!contentType.includes("application/json")) {
        const text = await res.text();
        console.error("Non-JSON response from /api/auth/register:", text);
        setError("Registration failed (unexpected server response). Please try again.");
        setLoading(false);
        return;
      }

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Registration failed.");
      } else {
        // Auto sign-in after registration
        const authRes = await signIn("credentials", {
          email: form.email,
          password: form.password,
          redirect: false,
        });

        if (authRes?.error) {
          router.push("/login"); // Fallback to login if auto-signin fails
        } else {
          // Get updated session to check role
          const session = await getSession();
          const isAdmin = session?.user?.role?.toLowerCase() === "admin";
          router.push(isAdmin ? "/admin/dashboard" : "/articles");
          router.refresh();
        }
      }
    } catch (err) {
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[radial-gradient(ellipse_at_40%_30%,_rgba(139,92,246,0.12)_0%,_transparent_60%),_#0f0f1a]">
      <div className="fixed top-[20%] right-[5%] w-[280px] h-[280px] rounded-full bg-[radial-gradient(circle,_rgba(6,182,212,0.07),_transparent_70%)] pointer-events-none" />
      <div className="fixed bottom-[10%] left-[8%] w-[200px] h-[200px] rounded-full bg-[radial-gradient(circle,_rgba(99,102,241,0.1),_transparent_70%)] pointer-events-none" />

      <div className="fade-in w-full max-w-md relative z-10">
        <Link href="/" className="text-center mb-8 block group">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4 transition-transform group-hover:scale-105 bg-gradient-to-br from-indigo-500 to-purple-500 shadow-[0_0_30px_rgba(99,102,241,0.4)]">
            <BookOpen size={28} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold gradient-text">AMS</h1>
          <p className="text-sm mt-1 text-slate-500 font-medium">Article Management System</p>
        </Link>

        <div className="glass rounded-2xl p-8">
          <h2 className="text-xl font-bold mb-6 text-slate-200">Create an account</h2>

          {error && (
            <div className="flex items-start gap-2 mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400">
              <AlertCircle size={16} className="mt-0.5 shrink-0" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-slate-400">Full Name</label>
              <div className="input-with-icon group">
                <User size={16} className="input-icon group-focus-within:text-indigo-500" />
                <input
                  type="text"
                  value={form.name}
                  onChange={set("name")}
                  required
                  className="input-field"
                  placeholder="John Doe"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-slate-400">Email</label>
              <div className="input-with-icon group">
                <Mail size={16} className="input-icon group-focus-within:text-indigo-500" />
                <input
                  type="email"
                  value={form.email}
                  onChange={set("email")}
                  required
                  className="input-field"
                  placeholder="john@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-slate-400">Password</label>
              <div className="input-with-icon group">
                <Lock size={16} className="input-icon group-focus-within:text-indigo-500" />
                <input
                  type="password"
                  value={form.password}
                  onChange={set("password")}
                  required
                  className="input-field"
                  placeholder="Min 8 characters"
                  minLength={8}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-slate-400">Confirm Password</label>
              <div className="input-with-icon group">
                <Lock size={16} className="input-icon group-focus-within:text-indigo-500" />
                <input
                  type="password"
                  value={form.password_confirmation}
                  onChange={set("password_confirmation")}
                  required
                  className="input-field"
                  placeholder="Repeat password"
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn-primary w-full justify-center py-3 mt-2"
              disabled={loading}
            >
              {loading ? "Creating account…" : <><UserPlus size={16} /> Create Account</>}
            </button>
          </form>

          <p className="text-center mt-6 text-sm text-slate-500">
            Already have an account?{" "}
            <Link href="/login" className="font-semibold text-indigo-400">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
