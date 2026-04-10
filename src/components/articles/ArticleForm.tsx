"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { PenLine, ArrowLeft, AlertCircle, Save, Upload, X } from "lucide-react";
import RichTextEditor from "./RichTextEditor";
import LoaderOverlay from "@/components/LoaderOverlay";

interface Category {
  _id: string;
  name: string;
}

interface Props {
  initialData?: {
    _id: string;
    title: string;
    content: string;
    category?: any;
    image?: string;
  };
  categories: Category[];
}

export default function ArticleForm({ initialData, categories }: Props) {
  const router = useRouter();
  const isEdit = !!initialData;

  const [form, setForm] = useState({
    title: initialData?.title || "",
    content: initialData?.content || "",
    category_id: initialData?.category?._id || initialData?.category || "",
  });
  
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(initialData?.image || null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  const setField = (field: string, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Use FormData for file upload
      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("content", form.content);
      formData.append("category", form.category_id);
      if (imageFile) formData.append("image", imageFile);

      const url = isEdit ? `/api/articles/${initialData._id}` : "/api/articles";
      const method = isEdit ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Failed to save article.");
      } else {
        router.push(`/articles/${data.slug || data._id}`);
        router.refresh();
      }
    } catch (err) {
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto fade-in h-full relative">
      <LoaderOverlay show={loading} message={isEdit ? "Saving changes..." : "Publishing article..."} />
      <button onClick={() => router.back()} className="btn-secondary mb-8">
        <ArrowLeft size={15} /> Back
      </button>

      <div className="card bg-[#1a1a2e]/60 p-8 md:p-10 border-white/5">
        <h1 className="text-3xl font-bold flex items-center gap-3 mb-10 text-slate-200">
          <PenLine size={30} className="text-indigo-500" />
          {isEdit ? "Edit Article" : "Write New Article"}
        </h1>

        {error && (
          <div className="flex items-center gap-2 mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400">
            <AlertCircle size={18} /> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <label className="block text-sm font-bold mb-3 text-slate-500 uppercase tracking-wider">Article Title</label>
              <input
                value={form.title}
                onChange={(e) => setField("title", e.target.value)}
                required
                className="input-field text-xl font-bold py-4 focus:ring-2 ring-indigo-500/10"
                placeholder="Enter a compelling title…"
              />
            </div>

            <div>
              <label className="block text-sm font-bold mb-3 text-slate-500 uppercase tracking-wider">Category</label>
              <select
                value={form.category_id}
                onChange={(e) => setField("category_id", e.target.value)}
                className="input-field py-4 font-semibold"
              >
                <option value="">— Select Category —</option>
                {categories.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold mb-3 text-slate-500 uppercase tracking-wider">Cover Image</label>
            <div className="relative">
              <input
                type="file"
                id="article-image"
                className="hidden"
                accept="image/*"
                onChange={handleFileChange}
              />
              <label
                htmlFor="article-image"
                className="flex flex-col items-center justify-center p-12 border-2 border-dashed border-white/10 rounded-2xl cursor-pointer transition-all hover:border-indigo-500/40 hover:bg-white/[0.02] bg-[#0f0f1a]/40"
              >
                {imagePreview ? (
                  <div className="relative w-full text-center">
                    <img src={imagePreview} alt="Preview" className="max-h-[350px] w-auto mx-auto rounded-xl shadow-2xl border border-white/5" />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        clearImage();
                      }}
                      className="absolute -top-3 -right-3 p-2 bg-red-500 rounded-full text-white shadow-xl hover:bg-red-600 transition-colors"
                    >
                      <X size={18} />
                    </button>
                    <p className="mt-4 text-xs font-bold text-indigo-400 tracking-widest uppercase">Click to change image</p>
                  </div>
                ) : (
                  <>
                    <Upload size={48} className="mb-4 text-indigo-500/50" />
                    <span className="text-base font-bold text-slate-300">Upload Image</span>
                    <span className="text-xs mt-2 text-slate-600 font-medium">PNG, JPG or GIF up to 5MB</span>
                  </>
                )}
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold mb-3 text-slate-500 uppercase tracking-wider">Content</label>
            <RichTextEditor
              content={form.content}
              onChange={(html) => setField("content", html)}
            />
          </div>

          <div className="flex gap-4 pt-4">
            <button type="submit" className="btn-primary py-4 px-10 text-base shadow-xl" disabled={loading}>
              <Save size={20} className={loading ? "animate-pulse" : ""} /> {loading ? "Saving…" : isEdit ? "Save Changes" : "Publish Article"}
            </button>
            <button
              type="button"
              className="btn-secondary py-4 px-10 text-base"
              onClick={() => router.back()}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
