import Link from "next/link";
import { auth } from "@/auth";
import { BookOpen, ArrowRight, Zap, Calendar, User as UserIcon } from "lucide-react";
import Navbar from "@/components/layout/Navbar";

async function getArticles() {
  // We can call our internal API or the DB directly since it's a server component.
  // Calling the local API route for simplicity/consistency if possible, 
  // but in Next.js Server Components, it's often better to call the service/DB directly.
  try {
    // For now, I'll fetch via absolute URL if possible, or just use a placeholder
    // To make it truly "Server", I should ideally use a data-access layer.
    // However, I'll use a fetch to the local API for now (absolute URL required in server components)
    const res = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/articles?page=1`, { cache: 'no-store' });
    if (!res.ok) return [];
    const json = await res.json();
    return json.data || [];
  } catch (error) {
    console.error("Failed to fetch articles:", error);
    return [];
  }
}

export default async function LandingPage() {
  const session = await auth();
  const isAuthenticated = !!session;
  const articles = await getArticles();
  const displayArticles = articles.slice(0, 6);

  return (
    <div className="min-h-screen bg-[#0f0f1a]">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden py-28 px-6 text-center">
        {/* Background glows */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] rounded-full bg-[radial-gradient(ellipse,_rgba(99,102,241,0.12)_0%,_transparent_70%)] pointer-events-none" />

        <div className="fade-in max-w-4xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full text-sm font-medium bg-indigo-500/10 border border-indigo-500/25 text-indigo-400">
            <Zap size={14} /> Modern Article Management Platform
          </div>

          <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight text-slate-200">
            Share Your <span className="gradient-text">Stories</span>
            <br />With The World
          </h1>

          <p className="text-lg md:text-xl mb-10 max-w-2xl mx-auto text-slate-500 leading-relaxed">
            A beautiful space to write, read, and engage with high-quality content. Join our thriving community of authors.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <Link href={isAuthenticated ? "/dashboard/articles/create" : "/register"} className="btn-primary py-3 px-8 text-base">
              Start Writing <ArrowRight size={18} />
            </Link>
            {!isAuthenticated && (
              <Link href="/login" className="btn-secondary py-3 px-8 text-base">
                Read Articles
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Featured Articles */}
      <section className="max-w-6xl mx-auto px-6 pb-20">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-3xl font-bold text-slate-200">Featured Articles</h2>
            <p className="text-slate-500 mt-1">Latest insights from our community</p>
          </div>
          <Link href="/articles" className="text-sm font-semibold flex items-center gap-1 text-indigo-500">
            View All <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayArticles.map((article: any) => (
            <Link
              key={article._id}
              href={`/articles/${article.slug || article._id}`}
              className="group card flex flex-col h-full hover:border-indigo-500/50 p-0 overflow-hidden transition-all duration-300 transform hover:-translate-y-1 bg-[#1a1a2e]/40"
            >
              <div className="h-48 overflow-hidden relative">
                <img
                  src={article.image || `https://picsum.photos/seed/${article._id}/800/600`}
                  alt={article.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f1a] to-transparent opacity-60" />
                {article.category && (
                  <span className="absolute top-4 left-4 badge badge-user bg-indigo-500/80 text-white backdrop-blur-md">
                    {article.category.name}
                  </span>
                )}
              </div>
              <div className="p-6 flex flex-col flex-1">
                <div className="flex items-center gap-2 mb-3 text-xs text-slate-500">
                  <Calendar size={12} /> {new Date(article.createdAt).toLocaleDateString()}
                  <span className="w-1 h-1 rounded-full bg-slate-700" />
                  <div className="flex items-center gap-1">
                    <UserIcon size={12} /> {article.author?.name}
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-3 leading-snug group-hover:text-indigo-500 transition-colors line-clamp-2 text-slate-200">
                  {article.title}
                </h3>
                <p className="text-sm line-clamp-3 mb-6 flex-1 text-slate-400 leading-relaxed">
                  {article.content.replace(/<[^>]*>?/gm, '').substring(0, 120)}...
                </p>
                <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/5">
                  <span className="text-sm font-bold flex items-center gap-1 text-indigo-400">
                    Read More <ArrowRight size={14} />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA */}
      {!isAuthenticated && (
        <section className="py-20 px-6 text-center">
          <div className="glass rounded-3xl p-12 max-w-3xl mx-auto bg-gradient-to-br from-indigo-500/10 to-purple-500/5">
            <h2 className="text-3xl font-bold mb-4 gradient-text">Ready to get started?</h2>
            <p className="mb-8 text-slate-500">Join thousands of writers already using AMS to manage their content.</p>
            <Link href="/register" className="btn-primary py-3 px-10 text-base">
              Create Free Account <ArrowRight size={18} />
            </Link>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="text-center py-8 border-t border-indigo-500/10 text-slate-700 text-xs text-muted">
        &copy; {new Date().getFullYear()} AMS — Article Management System. Built with Next.js & MongoDB.
      </footer>
    </div>
  );
}
