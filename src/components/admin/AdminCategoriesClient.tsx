"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Tag, Plus, Pencil, Trash2, X, Check, AlertCircle } from "lucide-react";
import DeleteConfirmationModal from "@/components/modals/DeleteConfirmationModal";

interface Category {
  _id: string;
  name: string;
  slug: string;
}

interface Props {
  initialCategories: Category[];
}

export default function AdminCategoriesClient({ initialCategories }: Props) {
  const router = useRouter();
  const [newCat, setNewCat] = useState("");
  const [editId, setEditId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [deleteCat, setDeleteCat] = useState<Category | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleCreate = async () => {
    if (!newCat.trim() || loading) return;
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newCat }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.message || "Failed to create category.");
      } else {
        setNewCat("");
        router.refresh();
      }
    } catch (err) {
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    if (!editName.trim() || loading || !editId) return;
    setLoading(true);

    try {
      const res = await fetch(`/api/categories/${editId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: editName }),
      });

      if (res.ok) {
        setEditId(null);
        router.refresh();
      } else {
        const data = await res.json();
        setError(data.message || "Update failed.");
      }
    } catch (err) {
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteCat) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/categories/${deleteCat._id}`, { method: "DELETE" });
      if (res.ok) {
        setDeleteCat(null);
        router.refresh();
      }
    } catch (err) {
      console.error("Delete failed:", err);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="fade-in space-y-10">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black flex items-center gap-3 text-slate-100">
          <Tag size={32} className="text-cyan-500" /> Category Management
        </h1>
        <p className="text-slate-500 mt-1 font-medium">Organize and manage content taxonomies</p>
      </div>

      {/* Quick Add Section */}
      <div className="card bg-[#1a1a2e]/40 p-8 border-white/5 shadow-2xl">
        <h2 className="text-xs font-black uppercase tracking-widest text-slate-500 mb-6 flex items-center gap-2">
          <Plus size={14} /> Register New Category
        </h2>
        {error && (
          <div className="flex items-center gap-2 mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium">
            <AlertCircle size={15} /> {error}
          </div>
        )}
        <div className="flex gap-4">
          <input
            value={newCat}
            onChange={(e) => setNewCat(e.target.value)}
            placeholder="Search-engine optimized name…"
            className="input-field flex-1 py-4 text-base font-bold bg-[#0f0f1a]/40"
            onKeyDown={(e) => e.key === "Enter" && handleCreate()}
          />
          <button
            className="btn-primary px-10 shadow-xl"
            onClick={handleCreate}
            disabled={loading || !newCat.trim()}
          >
            {loading ? "Registering…" : "Add Category"}
          </button>
        </div>
      </div>

      {/* List Table */}
      <div className="card bg-[#1a1a2e]/40 p-0 overflow-hidden border-white/5 shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/[0.02] border-b border-white/5">
                <th className="px-8 py-5 text-xs font-black uppercase tracking-widest text-slate-500">Taxonomy</th>
                <th className="px-8 py-5 text-xs font-black uppercase tracking-widest text-slate-500">Public Slug</th>
                 <th className="px-8 py-5 text-xs font-black uppercase tracking-widest text-slate-500 w-40">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {initialCategories.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-8 py-12 text-center text-slate-600 font-bold italic underline decoration-indigo-500/20 underline-offset-4">
                    No categories registered. Get started above.
                  </td>
                </tr>
              ) : (
                initialCategories.map((cat) => (
                  <tr key={cat._id} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="px-8 py-5">
                      {editId === cat._id ? (
                        <input
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className="input-field py-2 text-white font-bold"
                          autoFocus
                          onKeyDown={(e) => e.key === "Enter" && handleUpdate()}
                        />
                      ) : (
                        <span className="font-bold text-slate-200 text-lg">{cat.name}</span>
                      )}
                    </td>
                    <td className="px-8 py-5">
                      <span className="text-xs font-black text-cyan-500/50 uppercase tracking-widest bg-cyan-500/5 px-3 py-1 rounded-full border border-cyan-500/10">
                        {cat.slug}
                      </span>
                    </td>
                    <td className="px-8 py-5">
                      {editId === cat._id ? (
                        <div className="flex gap-2">
                          <button
                            className="btn-primary p-2 bg-emerald-500 shadow-lg shadow-emerald-500/20"
                            onClick={handleUpdate}
                            disabled={loading}
                          >
                            <Check size={18} />
                          </button>
                          <button className="btn-secondary p-2" onClick={() => setEditId(null)}>
                            <X size={18} />
                          </button>
                        </div>
                      ) : (
                        <div className="flex gap-2">
                          <button
                            className="btn-secondary p-2 bg-indigo-500/5 hover:bg-indigo-500/10 text-indigo-400"
                            onClick={() => {
                              setEditId(cat._id);
                              setEditName(cat.name);
                            }}
                          >
                            <Pencil size={16} />
                          </button>
                          <button
                            className="btn-danger p-2 bg-red-500/5 hover:bg-red-500/10 text-red-500"
                            onClick={() => setDeleteCat(cat)}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Delete Modal */}
      <DeleteConfirmationModal
        isOpen={!!deleteCat}
        onClose={() => setDeleteCat(null)}
        onConfirm={handleDelete}
        title="Remove Taxonomy"
        message="Are you sure you want to delete this category? This will affect all articles using it."
        itemName={deleteCat?.name}
        isLoading={isDeleting}
      />
    </div>
  );
}
