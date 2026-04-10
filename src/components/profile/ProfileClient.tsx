"use client";

import { useState, useEffect } from "react";
import { User, Mail, Lock, Shield, PenSquare, Key, Save, AlertCircle, CheckCircle2, ChevronLeft, LayoutDashboard, Globe } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { isAdminRole } from "@/lib/role";

export default function ProfileClient() {
  const { data: session, update } = useSession();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [profile, setProfile] = useState({ name: "", email: "" });
  const [passwords, setPasswords] = useState({ current: "", new: "", confirm: "" });

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch("/api/user/profile");
        if (res.ok) {
          const data = await res.json();
          setProfile({ name: data.name, email: data.email });
        }
      } catch (err) {
        setError("Failed to fetch profile details");
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, []);

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Failed to update profile");
      } else {
        setSuccess("Profile details updated successfully!");
        // Update session client-side
        await update({ name: profile.name, email: profile.email });
        router.refresh();
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwords.new !== passwords.confirm) {
      setError("New passwords do not match");
      return;
    }

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch("/api/user/password", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: passwords.current,
          newPassword: passwords.new,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setSuccess("");
        setError(data.message || "Failed to change password");
      } else {
        setSuccess("Your password has been changed successfully!");
        setPasswords({ current: "", new: "", confirm: "" });
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <div className="w-12 h-12 rounded-full border-4 border-indigo-500/20 border-t-indigo-500 animate-spin" />
        <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Accessing profile…</p>
      </div>
    );
  }

  const isAdmin = isAdminRole(session?.user?.role as string | undefined);

  return (
    <div className="fade-in space-y-12 pb-20">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-white/5">
        <div className="space-y-4">
          <Link
            href={isAdmin ? "/admin/dashboard" : "/"}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 text-slate-400 hover:text-white border border-white/5 hover:border-indigo-500/30 transition-all text-xs font-bold uppercase tracking-widest group"
          >
            <ChevronLeft size={14} className="transition-transform group-hover:-translate-x-1" />
            {isAdmin ? (
              <span className="flex items-center gap-2"><LayoutDashboard size={14} className="text-indigo-400" /> Admin Dashboard</span>
            ) : (
              <span className="flex items-center gap-2"><Globe size={14} className="text-cyan-400" /> Home Page</span>
            )}
          </Link>
          <div>
            <h1 className="text-4xl font-black flex items-center gap-4 text-slate-100 uppercase tracking-tighter">
              <User size={40} className="text-indigo-500" /> Account Settings
            </h1>
            <p className="text-slate-500 mt-2 font-medium">Manage your personal information and security</p>
          </div>
        </div>
        <div className="flex items-center gap-3 px-6 py-4 rounded-3xl bg-indigo-500/5 border border-indigo-500/10">
          <Shield size={20} className="text-indigo-500" />
          <div className="text-xs">
            <p className="text-slate-500 font-bold uppercase tracking-widest leading-none">Security Level</p>
            <p className="text-indigo-400 font-black mt-1 uppercase">High Protection</p>
          </div>
        </div>
      </div>

      {(error || success) && (
        <div className={`flex items-center gap-3 p-5 rounded-2xl border ${error ? "bg-red-500/10 border-red-500/20 text-red-400" : "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"} font-bold`}>
          {error ? <AlertCircle size={20} /> : <CheckCircle2 size={20} />}
          {error || success}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
        {/* Profile Form */}
        <section className="card bg-[#1a1a2e]/40 p-10 border-white/5 shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-5 transition-opacity group-hover:opacity-10 pointer-events-none">
            <PenSquare size={80} />
          </div>
          
          <h2 className="text-xl font-black mb-8 flex items-center gap-3 text-slate-200 uppercase tracking-widest">
            <span className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-500 italic">01</span>
            Profile Information
          </h2>

          <form onSubmit={handleProfileUpdate} className="space-y-6">
            <div>
              <label className="text-xs font-black uppercase tracking-[0.2em] text-slate-500 mb-3 block">Full Legal Name</label>
              <div className="input-with-icon group">
                <User size={18} className="input-icon group-focus-within:text-indigo-500" />
                <input
                  type="text"
                  required
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  placeholder="John Doe"
                  className="input-field"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-black uppercase tracking-[0.2em] text-slate-500 mb-3 block">Primary Email Address</label>
              <div className="input-with-icon group">
                <Mail size={18} className="input-icon group-focus-within:text-indigo-500" />
                <input
                  type="email"
                  required
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  placeholder="john@example.com"
                  className="input-field"
                />
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={saving}
                className="btn-primary w-full py-4 text-xs font-black uppercase tracking-[0.3em] shadow-xl shadow-indigo-500/10 disabled:opacity-50"
              >
                {saving ? "Saving Changes…" : (
                  <span className="flex items-center justify-center gap-2">
                    <Save size={16} /> Save Changes
                  </span>
                )}
              </button>
            </div>
          </form>
        </section>

        {/* Password Form */}
        <section className="card bg-[#1a1a2e]/40 p-10 border-white/5 shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-5 transition-opacity group-hover:opacity-10 pointer-events-none">
            <Lock size={80} />
          </div>

          <h2 className="text-xl font-black mb-8 flex items-center gap-3 text-slate-200 uppercase tracking-widest">
            <span className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center text-orange-500 italic">02</span>
            Security Credentials
          </h2>

          <form onSubmit={handlePasswordUpdate} className="space-y-6">
            <div>
              <label className="text-xs font-black uppercase tracking-[0.2em] text-slate-500 mb-3 block">Current Private Key</label>
              <div className="input-with-icon group">
                <Key size={18} className="input-icon group-focus-within:text-orange-500" />
                <input
                  type="password"
                  required
                  value={passwords.current}
                  onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                  placeholder="••••••••••••"
                  className="input-field"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="text-xs font-black uppercase tracking-[0.2em] text-slate-500 mb-3 block">New Secret</label>
                <div className="input-with-icon group">
                  <Lock size={18} className="input-icon group-focus-within:text-orange-500" />
                  <input
                    type="password"
                    required
                    value={passwords.new}
                    onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
                    placeholder="New password…"
                    className="input-field"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-black uppercase tracking-[0.2em] text-slate-500 mb-3 block">Verify Secret</label>
                <div className="input-with-icon group">
                  <Lock size={18} className="input-icon group-focus-within:text-orange-500" />
                  <input
                    type="password"
                    required
                    value={passwords.confirm}
                    onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                    placeholder="Repeat password…"
                    className="input-field"
                  />
                </div>
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={saving}
                className="btn-secondary w-full py-4 text-xs font-black uppercase tracking-[0.3em] bg-orange-500/5 text-orange-400 border-orange-500/20 hover:bg-orange-500/10 hover:border-orange-500/40 disabled:opacity-50"
              >
                {saving ? "Processing…" : (
                  <span className="flex items-center justify-center gap-2">
                    <Save size={16} /> Update Password
                  </span>
                )}
              </button>
            </div>
          </form>
        </section>
      </div>

      {/* Account Info/Role Card */}
      <div className="card bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border-indigo-500/20 p-10 flex flex-col md:flex-row items-center gap-10">
        <div className="w-24 h-24 rounded-full flex items-center justify-center font-black text-4xl bg-gradient-to-br from-indigo-500 to-purple-500 text-white shadow-2xl ring-8 ring-indigo-500/10">
          {session?.user?.name?.[0]?.toUpperCase()}
        </div>
        <div className="flex-1 text-center md:text-left">
          <h3 className="text-2xl font-black text-white mb-1 uppercase tracking-tight">{session?.user?.name}</h3>
          <p className="text-slate-400 font-bold mb-4">{session?.user?.email}</p>
          <div className="flex flex-wrap justify-center md:justify-start gap-4">
            <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${session?.user?.role === "Admin" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-indigo-500/10 text-indigo-400 border-indigo-500/20"}`}>
              Current Role: {session?.user?.role}
            </span>
            <span className="px-4 py-1.5 rounded-full text-[10px] bg-white/5 text-slate-500 border border-white/10 font-bold uppercase tracking-widest">
              Account ID: {session?.user?.id?.slice(0, 8)}…
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
