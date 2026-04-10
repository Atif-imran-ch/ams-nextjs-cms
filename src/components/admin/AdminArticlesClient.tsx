"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FileText, Trash2, Eye, Pencil, ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import Link from "next/link";
import DeleteConfirmationModal from "@/components/modals/DeleteConfirmationModal";

interface Article {
  _id: string;
  title: string;
  author?: { name: string };
  category?: { name: string };
  createdAt: string;
  slug?: string;
}

interface Props {
  articles: Article[];
  pagination: {
    page: number;
    last_page: number;
  };
}

export default function AdminArticlesClient({ articles, pagination }: Props) {
  const router = useRouter();
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const [deleteData, setDeleteData] = useState<{ id: string; title: string } | null>(null);

  const handleDelete = async () => {
    if (!deleteData) return;
    
    setLoadingId(deleteData.id);
    try {
      const res = await fetch(`/api/articles/${deleteData.id}`, { method: "DELETE" });
      if (res.ok) {
        setDeleteData(null);
        router.refresh();
      }
    } catch (err) {
      console.error("Delete failed:", err);
    } finally {
      setLoadingId(null);
    }
  };

  const openDeleteModal = (id: string, title: string) => {
    setDeleteData({ id, title });
  };

  return (
    <div className="fade-in space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black flex items-center gap-3 text-slate-100">
            <FileText size={32} className="text-indigo-500" /> Content Repository
          </h1>
          <p className="text-slate-500 mt-1 font-medium">Manage and moderate all community articles</p>
        </div>
      </div>

      {/* Table */}
      <div className="card bg-[#1a1a2e]/40 p-0 overflow-hidden border-white/5 shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/[0.02] border-b border-white/5">
                <th className="px-8 py-5 text-xs font-black uppercase tracking-widest text-slate-500">Article Title</th>
                <th className="px-8 py-5 text-xs font-black uppercase tracking-widest text-slate-500">Author</th>
                <th className="px-8 py-5 text-xs font-black uppercase tracking-widest text-slate-500">Category</th>
                <th className="px-8 py-5 text-xs font-black uppercase tracking-widest text-slate-500">Published</th>
                <th className="px-8 py-5 text-xs font-black uppercase tracking-widest text-slate-500 w-44">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {articles.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-8 py-16 text-center text-slate-600 font-bold">
                    No articles found in the repository.
                  </td>
                </tr>
              ) : (
                articles.map((article) => (
                  <tr key={article._id} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="px-8 py-5 max-w-sm">
                      <span className="font-bold text-slate-200 truncate block">{article.title}</span>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-black bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                          {article.author?.name?.[0]?.toUpperCase()}
                        </div>
                        <span className="text-sm font-medium text-slate-500">{article.author?.name || "Unknown"}</span>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <span className="badge badge-user bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                        {article.category?.name || "Uncategorized"}
                      </span>
                    </td>
                    <td className="px-8 py-5">
                      <span className="text-xs text-slate-600 font-bold flex items-center gap-1.5">
                        <Calendar size={12} /> {new Date(article.createdAt).toLocaleDateString()}
                      </span>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex gap-2">
                        <Link href={`/articles/${article.slug || article._id}`} className="btn-secondary p-2 bg-indigo-500/5 hover:bg-indigo-500/10 text-indigo-400">
                          <Eye size={16} />
                        </Link>
                        <Link href={`/dashboard/articles/${article._id}/edit`} className="btn-secondary p-2 bg-purple-500/5 hover:bg-purple-500/10 text-purple-400">
                          <Pencil size={16} />
                        </Link>
                        <button 
                          onClick={() => openDeleteModal(article._id, article.title)}
                          disabled={loadingId === article._id}
                          className="btn-danger p-2 bg-red-500/5 hover:bg-red-500/10 text-red-500 disabled:opacity-50"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {pagination.last_page > 1 && (
        <div className="flex items-center justify-center gap-3 pt-6">
          <Link
            href={`/admin/articles?page=${Math.max(1, pagination.page - 1)}`}
            className={`btn-secondary p-2 ${pagination.page === 1 ? 'opacity-30 pointer-events-none' : ''}`}
          >
            <ChevronLeft size={20} />
          </Link>
          <div className="flex gap-2">
            {[...Array(pagination.last_page)].map((_, i) => (
              <Link
                key={i + 1}
                href={`/admin/articles?page=${i + 1}`}
                className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold transition-all ${
                  pagination.page === i + 1
                    ? 'bg-indigo-500 text-white shadow-lg'
                    : 'bg-white/5 text-slate-500 hover:bg-white/10'
                }`}
              >
                {i + 1}
              </Link>
            ))}
          </div>
          <Link
            href={`/admin/articles?page=${Math.min(pagination.last_page, pagination.page + 1)}`}
            className={`btn-secondary p-2 ${pagination.page === pagination.last_page ? 'opacity-30 pointer-events-none' : ''}`}
          >
            <ChevronRight size={20} />
          </Link>
        </div>
      )}
      {/* Modal */}
      <DeleteConfirmationModal
        isOpen={!!deleteData}
        onClose={() => setDeleteData(null)}
        onConfirm={handleDelete}
        title="Remove Article"
        message="Are you sure you want to delete this article? This action cannot be undone."
        itemName={deleteData?.title}
        isLoading={loadingId === deleteData?.id}
      />
    </div>
  );
}
