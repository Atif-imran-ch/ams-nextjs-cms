"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

interface LoaderOverlayProps {
  show: boolean;
  message?: string;
}

export default function LoaderOverlay({ show, message = "Saving article..." }: LoaderOverlayProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!show || !mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-950/75 backdrop-blur-sm px-4 py-6">
      <div className="w-full max-w-md rounded-[2rem] border border-white/10 bg-[#0d0e18]/95 p-8 text-center shadow-2xl shadow-black/40">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-indigo-500/10 text-indigo-400">
          <div className="h-10 w-10 rounded-full border-4 border-indigo-400/30 border-t-indigo-400 animate-spin" />
        </div>
        <h2 className="text-xl font-bold text-slate-100 mb-2">{message}</h2>
        <p className="text-sm text-slate-500">Please wait while we complete your request.</p>
      </div>
    </div>,
    document.body
  );
}
