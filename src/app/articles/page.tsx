import Link from "next/link";
import { auth } from "@/auth";
import { isAdminRole } from "@/lib/role";
import { FileText, Plus, Search, Eye, Pencil, Calendar, ChevronLeft, ChevronRight, Filter } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import DeleteArticleButton from "@/components/articles/DeleteArticleButton";

async function getData(page: number = 1, search = "", category = "") {
  try {
    const url = new URL(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/articles`);
    url.searchParams.set("page", String(page));
    if (search) url.searchParams.set("search", search);
    if (category) url.searchParams.set("category", category);

    const res = await fetch(url.toString(), { cache: 'no-store' });
    if (!res.ok) return { data: [], meta: { last_page: 1 } };
    if (!res.headers.get("content-type")?.includes("application/json")) return { data: [], meta: { last_page: 1 } };
    return res.json();
  } catch (error) {
    return { data: [], meta: { last_page: 1 } };
  }
}

async function getCategories() {
  try {
    const res = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/categories`, { cache: 'no-store' });
    if (!res.ok) return [];
    if (!res.headers.get("content-type")?.includes("application/json")) return [];
    return res.json();
  } catch (error) {
    return [];
  }
}

export default async function ArticlesPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; search?: string; category?: string }>;
}) {
  const session = await auth();
  const params = await searchParams;
  const currentPage = parseInt(params.page || "1");
  const { data: articles, meta } = await getData(currentPage, params.search || "", params.category || "");
  const categories = await getCategories();

  const user = session?.user as any;
  const isAdmin = isAdminRole(user?.role as string | undefined);
  const canModify = (authorId: string) => isAdmin || user?.id === authorId;

  const queryParams = new URLSearchParams();
  if (params.search) queryParams.set("search", params.search);
  if (params.category) queryParams.set("category", params.category);
  const queryString = queryParams.toString();

  return (
    <div className="min-h-screen bg-[#0f0f1a]">
      <Navbar />

      <main className="max-w-6xl mx-auto px-6 py-12 space-y-8 fade-in">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3 text-slate-200">
              <FileText size={30} className="text-purple-500" /> Web Community
            </h1>
            <p className="text-slate-500 mt-1 text-sm">Exploring the latest articles and stories</p>
          </div>
          {session && (
            <Link href="/dashboard/articles/create" className="btn-primary">
              <Plus size={16} /> Write Article
            </Link>
          )}
        </div>

        {/* Filters (Simplified for Server Props) */}
        <div className="flex flex-wrap gap-4 items-center">
          <form className="flex flex-wrap gap-4 items-center w-full" action="/articles" method="GET">
            <div className="input-with-icon group flex-1 min-w-[300px]">
              <Search size={16} className="input-icon group-focus-within:text-indigo-500" />
              <input
                name="search"
                defaultValue={params.search}
                placeholder="Search articles..."
                className="input-field"
              />
            </div>

            <div className="input-with-icon group min-w-[180px]">
              <Filter size={15} className="input-icon group-focus-within:text-indigo-500" />
              <select
                name="category"
                defaultValue={params.category || ""}
                className="input-field pl-9 bg-[#0f172a] text-slate-200"
              >
                <option value="">All Categories</option>
                {categories.map((c: any) => (
                  <option key={c._id} value={c._id} className="bg-[#0f172a] text-slate-200">
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <button type="submit" className="btn-secondary h-12 px-6">
              Filter
            </button>
          </form>
        </div>

        {/* Grid */}
        {articles.length === 0 ? (
          <div className="text-center py-24 card bg-[#1a1a2e]/20">
            <FileText size={48} className="mx-auto mb-4 text-slate-800" />
            <p className="text-slate-500">No articles found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((a: any) => (
              <div
                key={a._id}
                className="group card flex flex-col p-0 overflow-hidden hover:border-indigo-500/50 transition-all duration-300 transform hover:-translate-y-1 bg-[#1a1a2e]/40"
              >
                <Link href={`/articles/${a.slug || a._id}`} className="h-48 overflow-hidden relative block">
                  <img
                    src={a.image || `https://picsum.photos/seed/${a._id}/800/600`}
                    alt={a.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f1a] to-transparent opacity-60" />
                  {a.category && (
                    <span className="absolute top-4 left-4 badge badge-user bg-indigo-500/80 text-white backdrop-blur-md">
                      {a.category.name}
                    </span>
                  )}
                </Link>

                <div className="p-6 flex flex-col flex-1">
                  <div className="flex items-center gap-2 mb-3 text-xs text-slate-500">
                    <Calendar size={12} /> {new Date(a.createdAt).toLocaleDateString()}
                  </div>
                  <Link href={`/articles/${a.slug || a._id}`} className="block">
                    <h2 className="text-xl font-bold mb-3 leading-snug group-hover:text-indigo-500 transition-colors line-clamp-2 text-slate-200">
                      {a.title}
                    </h2>
                  </Link>
                  <p className="text-sm flex-1 mb-6 line-clamp-3 text-slate-400 leading-relaxed">
                    {a.content.replace(/<[^>]*>?/gm, '').substring(0, 160)}...
                  </p>

                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/5">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold bg-gradient-to-br from-indigo-500 to-purple-500 text-white">
                        {a.author?.name?.[0]?.toUpperCase()}
                      </div>
                      <span className="text-xs text-slate-500 font-medium">{a.author?.name}</span>
                    </div>

                    <div className="flex gap-2">
                      <Link href={`/articles/${a.slug || a._id}`} className="btn-secondary py-1.5 px-3">
                        <Eye size={14} />
                      </Link>
                      {canModify(a.author?._id || a.author) && (
                        <>
                          <Link href={`/dashboard/articles/${a._id}/edit`} className="btn-secondary py-1.5 px-3">
                            <Pencil size={14} />
                          </Link>
                          <DeleteArticleButton articleId={a._id} articleTitle={a.title} />
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {meta.last_page > 1 && (
          <div className="flex items-center justify-center gap-3 pt-12">
            <Link
              href={`/articles?page=${Math.max(1, currentPage - 1)}${queryString ? `&${queryString}` : ''}`}
              className={`btn-secondary p-2 ${currentPage === 1 ? 'opacity-30 pointer-events-none' : ''}`}
            >
              <ChevronLeft size={20} />
            </Link>

            <div className="flex gap-2">
              {[...Array(meta.last_page)].map((_, i) => (
                <Link
                  key={i + 1}
                  href={`/articles?page=${i + 1}${queryString ? `&${queryString}` : ''}`}
                  className={`w-10 h-10 rounded-lg flex items-center justify-center font-medium transition-all ${
                    currentPage === i + 1
                      ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/30'
                      : 'bg-white/5 text-slate-400 hover:bg-white/10'
                  }`}
                >
                  {i + 1}
                </Link>
              ))}
            </div>

            <Link
              href={`/articles?page=${Math.min(meta.last_page, currentPage + 1)}${queryString ? `&${queryString}` : ''}`}
              className={`btn-secondary p-2 ${currentPage === meta.last_page ? 'opacity-30 pointer-events-none' : ''}`}
            >
              <ChevronRight size={20} />
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}
