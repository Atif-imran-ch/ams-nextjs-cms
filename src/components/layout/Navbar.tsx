"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { BookOpen, FileText, PenLine, LogOut, Menu, X, LayoutDashboard } from "lucide-react";
import { useState } from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { isAdminRole } from "@/lib/role";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function Navbar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const user = session?.user;
  const isAdmin = isAdminRole(user?.role as string | undefined);

  const navLinks = [
    { href: "/articles", label: "Articles", icon: FileText },
    { href: "/dashboard/articles/create", label: "Write", icon: PenLine },
  ];

  return (
    <nav className="glass sticky top-0 z-50 border-b border-indigo-500/15">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 bg-gradient-to-br from-indigo-500 to-purple-500">
            <BookOpen size={18} className="text-white" />
          </div>
          <span className="font-bold text-lg gradient-text">AMS</span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-2">
          {navLinks.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "py-2 px-4 transition-all",
                pathname === href ? "btn-primary" : "btn-secondary"
              )}
            >
              <Icon size={15} /> {label}
            </Link>
          ))}
          {isAdmin && (
            <Link
              href="/admin/dashboard"
              className="btn-secondary py-2 px-4 bg-cyan-500/10 text-cyan-400 border-cyan-500/30"
            >
              <LayoutDashboard size={15} /> Admin Panel
            </Link>
          )}
        </div>

        {/* User Actions */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <>
              <Link href="/profile" className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-indigo-500/15 hover:bg-white/10 transition-colors cursor-pointer group/user">
                <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold bg-gradient-to-br from-indigo-500 to-purple-500 text-white shadow-xl transition-transform group-hover/user:scale-110">
                  {user.name?.[0]?.toUpperCase()}
                </div>
                <span className="text-sm text-slate-400 group-hover/user:text-indigo-400 font-bold">{user.name}</span>
              </Link>
              <button onClick={() => signOut()} className="btn-danger py-2 px-3">
                <LogOut size={15} />
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="btn-secondary py-2 px-4">Sign In</Link>
              <Link href="/register" className="btn-primary py-2 px-6">Get Started</Link>
            </>
          )}
        </div>

        {/* Mobile menu button */}
        <button className="md:hidden text-slate-400" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden px-6 pb-4 space-y-2 border-t border-indigo-500/10 fade-in">
          {navLinks.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-3 p-3 rounded-xl hover:bg-indigo-500/10 text-slate-400 hover:text-white transition-all"
            >
              <Icon size={16} /> {label}
            </Link>
          ))}
          {isAdmin && (
            <Link
              href="/admin/dashboard"
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-3 p-3 rounded-xl hover:bg-cyan-500/10 text-cyan-400 transition-all"
            >
              <LayoutDashboard size={16} /> Admin Panel
            </Link>
          )}
          {user && (
            <Link
              href="/profile"
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-3 p-3 rounded-xl hover:bg-indigo-500/10 text-slate-400 hover:text-white transition-all font-bold"
            >
              <PenLine size={16} /> Profile Settings
            </Link>
          )}
          {user ? (
            <button
              onClick={() => signOut()}
              className="flex items-center gap-3 p-3 rounded-xl hover:bg-red-500/10 text-red-500 w-full text-left"
            >
              <LogOut size={16} /> Sign Out
            </button>
          ) : (
            <div className="pt-2 flex flex-col gap-2">
              <Link href="/login" className="btn-secondary w-full justify-center">Sign In</Link>
              <Link href="/register" className="btn-primary w-full justify-center">Get Started</Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
