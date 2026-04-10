"use client";

import { useState } from "react";
import { Send, Trash2, MessageSquare } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

interface Comment {
  _id: string;
  body: string;
  createdAt: string;
  user: {
    _id: string;
    name: string;
    image?: string;
  };
}

interface Props {
  articleId: string;
  comments: Comment[];
  isAdmin: boolean;
}

export default function CommentSection({ articleId, comments, isAdmin }: Props) {
  const { data: session } = useSession();
  const router = useRouter();
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || loading) return;

    setLoading(true);
    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ article_id: articleId, body: newComment }),
      });

      if (res.ok) {
        setNewComment("");
        router.refresh();
      }
    } catch (error) {
      console.error("Comment failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (commentId: string) => {
    if (!confirm("Are you sure you want to delete this comment?")) return;
    
    setDeleting(commentId);
    try {
      const res = await fetch(`/api/comments/${commentId}`, { method: "DELETE" });
      if (res.ok) {
        router.refresh();
      }
    } catch (error) {
      console.error("Delete failed:", error);
    } finally {
      setDeleting(null);
    }
  };

  const currentUser = session?.user;

  return (
    <div className="card space-y-8 bg-[#1a1a2e]/40">
      <h2 className="text-xl font-bold flex items-center gap-2 text-slate-200">
        <MessageSquare size={20} className="text-indigo-500" /> Discussion
      </h2>

      {/* Add comment */}
      {currentUser ? (
        <div className="flex gap-4">
          <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shrink-0 bg-gradient-to-br from-indigo-500 to-purple-500 text-white shadow-lg shadow-indigo-500/20">
            {currentUser.name?.[0]?.toUpperCase() ?? "?"}
          </div>
          <form onSubmit={handleSubmit} className="flex-1 flex gap-2">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              rows={2}
              className="input-field resize-none flex-1 py-3"
              placeholder="Share your thoughts on this story…"
            />
            <button
              type="submit"
              className="btn-primary self-end py-3 px-5"
              disabled={loading || !newComment.trim()}
            >
              <Send size={18} className={loading ? "animate-pulse" : ""} />
            </button>
          </form>
        </div>
      ) : (
        <div className="p-4 rounded-xl border border-dashed border-white/10 text-center bg-white/5">
          <p className="text-sm text-slate-500">
            Please <a href="/login" className="text-indigo-400 font-semibold hover:underline">sign in</a> to join the discussion.
          </p>
        </div>
      )}

      {/* Comments list */}
      {comments.length === 0 ? (
        <div className="text-center py-12 rounded-2xl border border-dashed border-white/5 bg-white/[0.01]">
          <p className="text-sm text-slate-600">No comments yet. Start the conversation!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {comments.map((c) => (
            <div
              key={c._id}
              className="flex gap-4 p-5 rounded-2xl group/comment transition-all border border-white/5 bg-[#0f0f1a]/40 hover:border-indigo-500/20"
            >
              <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold shrink-0 bg-[#16213e] text-indigo-400 border border-indigo-500/10">
                {c.user?.name?.[0]?.toUpperCase()}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-bold text-slate-200">{c.user?.name}</span>
                  <span className="text-[10px] uppercase tracking-wider text-slate-500">
                    {new Date(c.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-[0.95rem] text-slate-400 leading-relaxed font-medium">{c.body}</p>
              </div>
              {(isAdmin || currentUser?.id === c.user?._id) && (
                <button
                  onClick={() => handleDelete(c._id)}
                  disabled={deleting === c._id}
                  className="self-start p-2 rounded-lg text-slate-700 hover:text-red-400 hover:bg-red-400/10 transition-all opacity-0 group-hover/comment:opacity-100 disabled:opacity-50"
                >
                  <Trash2 size={16} className={deleting === c._id ? "animate-spin" : ""} />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
