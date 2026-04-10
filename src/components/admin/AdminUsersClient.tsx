"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Users, Plus, Pencil, Trash2, X, Check, Shield, Mail, Lock, AlertCircle } from "lucide-react";
import DeleteConfirmationModal from "@/components/modals/DeleteConfirmationModal";

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
}

interface Props {
  initialUsers: User[];
}

export default function AdminUsersClient({ initialUsers }: Props) {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [editUser, setEditUser] = useState<User | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "User" });
  const [deleteUser, setDeleteUser] = useState<User | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const openCreate = () => {
    setEditUser(null);
    setForm({ name: "", email: "", password: "", role: "User" });
    setError("");
    setShowModal(true);
  };

  const openEdit = (u: User) => {
    setEditUser(u);
    setForm({ name: u.name, email: u.email, password: "", role: u.role || "User" });
    setError("");
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const url = editUser ? `/api/admin/users/${editUser._id}` : "/api/auth/register";
      const method = editUser ? "PATCH" : "POST";
      
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editUser ? { name: form.name, email: form.email, role: form.role, password: form.password || undefined } : form),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Operation failed.");
      } else {
        setShowModal(false);
        router.refresh();
      }
    } catch (err) {
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteUser) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/admin/users/${deleteUser._id}`, { method: "DELETE" });
      if (res.ok) {
        setDeleteUser(null);
        router.refresh();
      }
    } catch (err) {
      console.error("Delete failed:", err);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="fade-in space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black flex items-center gap-3 text-slate-100">
            <Users size={32} className="text-indigo-500" /> User Management
          </h1>
          <p className="text-slate-500 mt-1 font-medium">Add, edit and manage platform members</p>
        </div>
        <button className="btn-primary py-3 px-6 shadow-xl" onClick={openCreate}>
          <Plus size={20} /> Add New User
        </button>
      </div>

      {/* Table */}
      <div className="card bg-[#1a1a2e]/40 p-0 overflow-hidden border-white/5 shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/[0.02] border-b border-white/5">
                <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-slate-500">Member</th>
                <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-slate-500">Email Address</th>
                <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-slate-500">Role</th>
                <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-slate-500 w-36">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {initialUsers.map((u) => (
                <tr key={u._id} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm bg-gradient-to-br from-indigo-500 to-purple-500 text-white shadow-lg">
                        {u.name?.[0]?.toUpperCase()}
                      </div>
                      <span className="font-bold text-slate-200">{u.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-slate-500">{u.email}</td>
                  <td className="px-6 py-4">
                    <span className={`badge shadow-lg ${u.role === "Admin" ? "badge-admin bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "badge-user bg-indigo-500/10 text-indigo-400 border-indigo-500/20"}`}>
                      {u.role ?? "User"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button className="btn-secondary p-2 bg-indigo-500/5 hover:bg-indigo-500/10 text-indigo-400" onClick={() => openEdit(u)}>
                        <Pencil size={16} />
                      </button>
                      <button className="btn-danger p-2 bg-red-500/5 hover:bg-red-500/10 text-red-500" onClick={() => setDeleteUser(u)}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md fade-in">
          <div className="w-full max-w-lg rounded-3xl bg-[#1a1a2e] border border-indigo-500/20 shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-white/5 bg-white/[0.01]">
              <h2 className="text-xl font-bold flex items-center gap-3 text-slate-200">
                <Shield size={22} className="text-indigo-500" />
                {editUser ? "Edit Profile" : "Account Setup"}
              </h2>
              <button onClick={() => setShowModal(false)} className="text-slate-500 hover:text-white transition-colors">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              {error && (
                <div className="flex items-center gap-2 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                  <AlertCircle size={18} /> {error}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-500">Name</label>
                  <div className="input-with-icon group">
                    <Users size={16} className="input-icon group-focus-within:text-indigo-500" />
                    <input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} required className="input-field" placeholder="Full Name" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-500">Email</label>
                  <div className="input-with-icon group">
                    <Mail size={16} className="input-icon group-focus-within:text-indigo-500" />
                    <input type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} required className="input-field" placeholder="Email Address" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-500">Role</label>
                  <div className="input-with-icon group">
                    <Shield size={16} className="input-icon group-focus-within:text-indigo-500" />
                    <select value={form.role} onChange={e => setForm(p => ({ ...p, role: e.target.value }))} className="input-field">
                      <option value="User">Standard Member</option>
                      <option value="Admin">Administrator</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-500">Password {editUser && <span className="opacity-40 normal-case">(blank to keep)</span>}</label>
                  <div className="input-with-icon group">
                    <Lock size={16} className="input-icon group-focus-within:text-indigo-500" />
                    <input type="password" value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))} required={!editUser} className="input-field" placeholder="••••••••" minLength={6} />
                  </div>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button type="submit" className="btn-primary py-4 text-base shadow-xl" disabled={loading}>
                  {loading ? "Processing…" : editUser ? "Apply Changes" : "Create Account"}
                </button>
                <button type="button" className="btn-secondary py-4 px-8 text-base" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Delete Confirmation */}
      <DeleteConfirmationModal
        isOpen={!!deleteUser}
        onClose={() => setDeleteUser(null)}
        onConfirm={handleDelete}
        title="Revoke Membership"
        message="Are you sure you want to delete this user? Their account and access will be permanently revoked."
        itemName={deleteUser?.name}
        isLoading={isDeleting}
      />
    </div>
  );
}
