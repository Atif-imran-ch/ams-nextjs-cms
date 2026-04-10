"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Trash2, AlertTriangle, X } from "lucide-react";

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  title: string;
  message: string;
  itemName?: string;
  isLoading?: boolean;
}

export default function DeleteConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  itemName,
  isLoading: externalLoading = false,
}: DeleteConfirmationModalProps) {
  const [mounted, setMounted] = useState(false);
  const [internalLoading, setInternalLoading] = useState(false);

  const isLoading = externalLoading || internalLoading;

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleConfirm = async () => {
    setInternalLoading(true);
    try {
      await onConfirm();
    } finally {
      setInternalLoading(false);
    }
  };

  if (!mounted || !isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md fade-in">
      <div className="bg-[#1a1a2e] border border-red-500/20 rounded-3xl shadow-2xl max-w-md w-full p-8 animate-in fade-in zoom-in-95 duration-300">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-14 h-14 rounded-2xl bg-red-500/10 flex items-center justify-center shrink-0">
            <AlertTriangle size={30} className="text-red-500" />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-black text-slate-100">{title}</h2>
            <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mt-1">Permanent Action</p>
          </div>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="p-2 text-slate-500 hover:text-white bg-white/5 rounded-xl transition-all hover:bg-white/10"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content Body */}
        <div className="mb-8 p-6 bg-red-500/5 border border-red-500/10 rounded-2xl">
          <p className="text-slate-300 leading-relaxed font-medium">
            {message}
            {itemName && (
              <span className="block mt-2 font-black text-red-400 text-lg">"{itemName}"</span>
            )}
          </p>
          <div className="mt-4 pt-4 border-t border-red-500/10 flex items-center gap-2 text-xs font-bold text-red-500/70 uppercase tracking-tighter">
            <AlertTriangle size={12} /> This cannot be undone
          </div>
        </div>

        {/* Buttons */}
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="py-4 px-6 rounded-2xl font-black uppercase tracking-widest text-xs transition-all bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white disabled:opacity-30"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={isLoading}
            className="py-4 px-6 rounded-2xl font-black uppercase tracking-widest text-xs transition-all bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500/20 hover:border-red-500/40 disabled:opacity-30 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 rounded-full border-2 border-red-500/30 border-t-red-500 animate-spin" />
                Deleting…
              </>
            ) : (
              <>
                <Trash2 size={16} />
                Delete
              </>
            )}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
