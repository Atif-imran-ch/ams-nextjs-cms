import { auth } from "@/auth";
import { LayoutDashboard, Users, FileText, Tag, TrendingUp, Clock, ChevronRight } from "lucide-react";
import Link from "next/link";
import { headers } from "next/headers";

async function getStats() {
  try {
    const h = await headers();
    const cookie = h.get('cookie');
    const res = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/admin/dashboard`, {
      headers: { cookie: cookie || '' },
      cache: 'no-store'
    });
    if (!res.ok) {
      const text = await res.text();
      console.error('Dashboard API error:', res.status, text);
      return { error: `API error: ${res.status} - ${text}` };
    }
    return res.json();
  } catch (error: any) {
    console.error('Dashboard fetch error:', error);
    return { error: `Fetch error: ${error.message}` };
  }
}

export default async function AdminDashboardPage() {
  const data = await getStats();

  if (data?.error) {
    return (
      <div className="text-center py-20 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 font-bold">
        {data.error}
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-20 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 font-bold">
        Failed to load dashboard data. Ensure backend is active.
      </div>
    );
  }

  const stats = [
    { label: "Total Users", value: data.total_users, icon: Users, color: "#6366f1", bg: "rgba(99,102,241,0.12)" },
    { label: "Total Articles", value: data.total_articles, icon: FileText, color: "#8b5cf6", bg: "rgba(139,92,246,0.12)" },
    { label: "Total Categories", value: data.total_categories, icon: Tag, color: "#06b6d4", bg: "rgba(6,182,212,0.12)" },
    { label: "Active Platform", value: "100%", icon: TrendingUp, color: "#10b981", bg: "rgba(16,185,129,0.12)" },
  ];

  return (
    <div className="fade-in space-y-10">
      {/* Page header */}
      <div>
        <h1 className="text-3xl font-black flex items-center gap-3 text-slate-100">
          <LayoutDashboard size={32} className="text-indigo-500" /> Admin Overview
        </h1>
        <p className="text-slate-500 mt-1 font-medium">Monitoring the Article Management System</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((s) => (
          <div key={s.label} className="stat-card group hover:border-[#6366f1]/30">
            <div className="flex items-center justify-between mb-4">
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center transition-all group-hover:scale-110 shadow-lg"
                style={{ background: s.bg, color: s.color }}
              >
                <s.icon size={28} />
              </div>
              <span className="text-4xl font-black tracking-tight" style={{ color: s.color }}>
                {s.value ?? "—"}
              </span>
            </div>
            <p className="text-sm font-bold uppercase tracking-widest text-slate-500">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Recent Activity Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Articles */}
        <div className="card bg-[#1a1a2e]/40">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold flex items-center gap-2 text-slate-200">
              <Clock size={20} className="text-indigo-500" /> Recent Articles
            </h2>
            <Link href="/admin/articles" className="text-xs font-bold text-indigo-400 flex items-center gap-1 hover:underline">
              View All <ChevronRight size={12} />
            </Link>
          </div>
          
          {data.recent_articles?.length === 0 ? (
            <p className="text-center py-10 text-slate-600 font-medium">No articles yet.</p>
          ) : (
            <div className="space-y-4">
              {data.recent_articles?.map((a: any) => (
                <div key={a._id} className="flex items-start gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/5 transition-all hover:bg-white/[0.04] group">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 bg-indigo-500/10 text-indigo-400 group-hover:bg-indigo-500/20">
                    <FileText size={20} />
                  </div>
                  <div className="overflow-hidden flex-1">
                    <p className="text-sm font-bold truncate text-slate-200">{a.title}</p>
                    <p className="text-xs mt-1 text-slate-500">
                      by <span className="text-slate-400">{a.author?.name ?? "Unknown"}</span> &nbsp;&bull;&nbsp; {a.category?.name ?? "Uncategorized"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Users */}
        <div className="card bg-[#1a1a2e]/40">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold flex items-center gap-2 text-slate-200">
              <Users size={20} className="text-purple-500" /> Recent Members
            </h2>
            <Link href="/admin/users" className="text-xs font-bold text-purple-400 flex items-center gap-1 hover:underline">
              Manage Users <ChevronRight size={12} />
            </Link>
          </div>
          
          {data.recent_users?.length === 0 ? (
            <p className="text-center py-10 text-slate-600 font-medium">No users yet.</p>
          ) : (
            <div className="space-y-4">
              {data.recent_users?.map((u: any) => (
                <div key={u._id} className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/5 transition-all hover:bg-white/[0.04]">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-black shrink-0 bg-gradient-to-br from-indigo-500 to-purple-500 text-white shadow-lg">
                    {u.name?.[0]?.toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold truncate text-slate-200">{u.name}</p>
                    <p className="text-xs text-slate-500 truncate">{u.email}</p>
                  </div>
                  <span className={`badge shrink-0 shadow-lg ${u.role === "Admin" ? "badge-admin bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "badge-user bg-indigo-500/10 text-indigo-400 border-indigo-500/20"}`}>
                    {u.role ?? "User"}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
