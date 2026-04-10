"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import {
  BookOpen, LayoutDashboard, FileText, Tag, Users, LogOut, Menu, X, ChevronRight, Globe, User
} from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const navItems = [
  { href: "/admin/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/admin/articles", icon: FileText, label: "Articles" },
  { href: "/admin/categories", icon: Tag, label: "Categories" },
  { href: "/admin/users", icon: Users, label: "Users" },
];

export default function AdminSidebar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const user = session?.user;

  return (
    <>
      {/* Mobile Toggle */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 rounded-xl bg-indigo-500 text-white shadow-lg shadow-indigo-500/20"
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 bg-[#1a1a2e] border-r border-indigo-500/15 transition-transform duration-300 md:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <Link href="/admin/dashboard" className="flex items-center gap-3 px-6 py-8 border-b border-white/5 group">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 bg-gradient-to-br from-indigo-500 to-purple-500">
              <BookOpen size={20} className="text-white" />
            </div>
            <span className="font-bold text-xl gradient-text">AMS Admin</span>
          </Link>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "sidebar-link",
                  pathname === item.href && "active"
                )}
              >
                <item.icon size={18} />
                <span className="flex-1">{item.label}</span>
                <ChevronRight size={14} className="opacity-40" />
              </Link>
            ))}
          </nav>

          {/* User Section */}
          <div className="p-4 border-t border-white/5 space-y-4">
            <Link href="/profile" className="flex items-center gap-3 p-3 rounded-2xl bg-white/[0.03] border border-white/5 hover:bg-indigo-500/10 hover:border-indigo-500/20 transition-all group/profile">
              <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm bg-gradient-to-br from-indigo-500 to-purple-500 text-white shadow-inner transition-transform group-hover/profile:scale-110">
                {user?.name?.[0]?.toUpperCase() ?? "A"}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-slate-200 truncate group-hover/profile:text-indigo-400">{user?.name}</p>
                <p className="text-[10px] text-slate-500 uppercase tracking-widest font-black">View Settings</p>
              </div>
            </Link>

            <button
              onClick={() => signOut()}
              className="sidebar-link w-full text-red-400 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/20"
            >
              <LogOut size={18} />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
