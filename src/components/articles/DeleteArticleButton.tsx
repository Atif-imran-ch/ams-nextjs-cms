"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Trash2, AlertTriangle, X } from "lucide-react";
import { useRouter } from "next/navigation";
import DeleteConfirmationModal from "@/components/modals/DeleteConfirmationModal";

interface Props {
  articleId: string;
  articleTitle: string;
}

export default function DeleteArticleButton({ articleId, articleTitle }: Props) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/articles/${articleId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        router.push("/articles");
        router.refresh();
      } else if (res.status === 403) {
        alert("You don't have permission to delete this article");
        setIsOpen(false);
      } else {
        alert("Failed to delete article");
      }
    } catch (error) {
      console.error("Delete failed:", error);
      alert("An error occurred while deleting");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="btn-danger py-1.5 px-3 hover:bg-red-500/20"
        title="Delete article"
      >
        <Trash2 size={14} />
      </button>

      <DeleteConfirmationModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onConfirm={handleDelete}
        title="Delete Article"
        message="Are you sure you want to delete this article? This action cannot be undone."
        itemName={articleTitle}
        isLoading={isDeleting}
      />
    </>
  );
}
