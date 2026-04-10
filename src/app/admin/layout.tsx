import { auth } from "@/auth";
import { redirect } from "next/navigation";
import AdminSidebar from "@/components/layout/AdminSidebar";
import { isAdminRole } from "@/lib/role";
import Link from "next/link";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  // Protect all admin routes
  if (!session || !isAdminRole(session.user.role as string | undefined)) {
    redirect("/login");
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[#0f0f1a]">
      <AdminSidebar />

      {/* Main content header & scroll area */}
      <div className="flex-1 flex flex-col overflow-hidden md:ml-64">
        {/* Top bar header */}
        <header className="flex items-center justify-between px-8 py-5 bg-[#1a1a2e] border-b border-indigo-500/10 shadow-xl shadow-black/20 relative z-30">
          <div className="hidden md:flex items-center gap-3 text-sm font-medium text-slate-500">
            <span className="text-indigo-400 font-bold">AMS Control Panel</span>
            <span className="w-1 h-1 rounded-full bg-slate-700" />
            <span className="text-slate-600">Enterprise Edition</span>
          </div>
          
          <div className="flex items-center gap-4 ml-auto">
            <a 
              href="/" 
              className="btn-secondary py-1.5 px-4 text-xs font-bold bg-indigo-500/5 text-indigo-400 border-indigo-500/20"
            >
              Visit Website
            </a>
            <Link href="/profile" className="flex items-center gap-3 pl-4 border-l border-white/5 hover:opacity-80 transition-opacity group/topuser">
              <div className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs bg-gradient-to-br from-indigo-500 to-purple-500 text-white shadow-lg transition-transform group-hover/topuser:scale-110">
                {session?.user?.name?.[0]?.toUpperCase()}
              </div>
              <span className="text-sm font-bold text-slate-400 hidden sm:block group-hover/topuser:text-white transition-colors">{session?.user?.name}</span>
            </Link>
          </div>
        </header>

        {/* Dynamic page content */}
        <main className="flex-1 overflow-y-auto p-8 relative">
          {/* Subtle background glow */}
          <div className="fixed top-1/4 right-0 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none" />
          <div className="relative z-10">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
