"use client";

import { useState } from "react";
import { ThumbsUp, ThumbsDown, MessageSquare } from "lucide-react";
import { useRouter } from "next/navigation";

interface Props {
  articleId: string;
  initialLikes: number;
  initialDislikes: number;
  totalComments: number;
}

export default function ReactionButtons({ articleId, initialLikes, initialDislikes, totalComments }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);

  const handleReaction = async (type: "like" | "dislike") => {
    setLoading(type);
    try {
      const res = await fetch("/api/reactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ article_id: articleId, type }),
      });

      if (res.ok) {
        router.refresh();
      }
    } catch (error) {
      console.error("Reaction failed:", error);
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="flex items-center gap-3 mt-10 pt-8 border-t border-white/5">
      <button
        onClick={() => handleReaction("like")}
        disabled={!!loading}
        className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-sm transition-all hover:scale-105 active:scale-95 bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 disabled:opacity-50"
      >
        <ThumbsUp size={18} className={loading === "like" ? "animate-pulse" : ""} /> {initialLikes}
      </button>
      <button
        onClick={() => handleReaction("dislike")}
        disabled={!!loading}
        className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-sm transition-all hover:scale-105 active:scale-95 bg-red-500/10 text-red-400 border border-red-500/25 disabled:opacity-50"
      >
        <ThumbsDown size={18} className={loading === "dislike" ? "animate-pulse" : ""} /> {initialDislikes}
      </button>
      <span className="ml-auto text-sm flex items-center gap-1.5 font-medium text-slate-500">
        <MessageSquare size={16} /> {totalComments} comment{totalComments !== 1 ? "s" : ""}
      </span>
    </div>
  );
}
