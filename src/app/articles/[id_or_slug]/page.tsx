import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { isAdminRole } from "@/lib/role";
import { ArrowLeft, Calendar, User as UserIcon } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import ReactionButtons from "@/components/articles/ReactionButtons";
import CommentSection from "@/components/articles/CommentSection";

async function getArticle(id_or_slug: string) {
  try {
    const res = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/articles/${id_or_slug}`, { cache: 'no-store' });
    if (!res.ok) return null;
    return res.json();
  } catch (error) {
    return null;
  }
}

export default async function ArticleDetailPage({
  params,
}: {
  params: Promise<{ id_or_slug: string }>;
}) {
  const { id_or_slug } = await params;
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  const article = await getArticle(id_or_slug);

  if (!article) {
    return (
      <div className="min-h-screen bg-[#0f0f1a]">
        <Navbar />
        <div className="text-center py-24 text-red-400 font-bold">Article not found.</div>
      </div>
    );
  }

  const user = session?.user;
  const isAdmin = isAdminRole(user?.role as string | undefined);
  const canModify = user?.id === (article.author?._id || article.author) || isAdmin;

  return (
    <div className="min-h-screen bg-[#0f0f1a]">
      <Navbar />

      <main className="max-w-4xl mx-auto px-6 py-12 fade-in">
        <Link href="/articles" className="btn-secondary mb-8">
          <ArrowLeft size={15} /> Back to Articles
        </Link>

        {/* Article Content */}
        <div className="card mb-8 p-8 md:p-10 bg-[#1a1a2e]/60">
          {article.category && (
            <span className="badge badge-user mb-6 inline-block bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
              {article.category.name}
            </span>
          )}

          <h1 className="text-3xl md:text-5xl font-black mb-8 leading-tight text-slate-200">
            {article.title}
          </h1>

          {article.image && (
            <div className="mb-10 rounded-2xl overflow-hidden shadow-2xl border border-white/5 relative aspect-video">
              <img src={article.image} alt={article.title} className="w-full h-full object-cover" />
            </div>
          )}

          <div className="flex items-center gap-4 mb-8 pb-8 border-b border-white/5">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full flex items-center justify-center text-sm font-bold bg-gradient-to-br from-indigo-500 to-purple-500 text-white shadow-lg shadow-indigo-500/20">
                {article.author?.name?.[0]?.toUpperCase()}
              </div>
              <div>
                <p className="text-sm font-bold text-slate-200">{article.author?.name}</p>
                <p className="text-xs flex items-center gap-1.5 text-slate-500 mt-0.5">
                  <Calendar size={12} /> {new Date(article.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
              </div>
            </div>


          </div>

          <div
            className="prose prose-invert max-w-none text-slate-300 leading-loose prose-headings:text-slate-100 prose-blockquote:border-indigo-500 prose-blockquote:bg-indigo-500/5"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />

          <ReactionButtons
            articleId={article._id}
            initialLikes={article.likes_count ?? 0}
            initialDislikes={article.dislikes_count ?? 0}
            totalComments={article.comments?.length ?? 0}
          />
        </div>

        {/* Comments */}
        <CommentSection
          articleId={article._id}
          comments={article.comments || []}
          isAdmin={isAdmin}
        />
      </main>
    </div>
  );
}
