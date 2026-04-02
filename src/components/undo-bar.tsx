"use client";

import { useState, useEffect } from "react";

interface UndoAction {
  message: string;
  onUndo: () => void;
}

export function useUndo() {
  const [action, setAction] = useState<UndoAction | null>(null);

  useEffect(() => {
    if (!action) return;
    const timer = setTimeout(() => setAction(null), 5000);
    return () => clearTimeout(timer);
  }, [action]);

  return {
    showUndo: (message: string, onUndo: () => void) => setAction({ message, onUndo }),
    UndoBar: action ? (
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-navy border border-white/10 rounded-xl px-5 py-3 shadow-2xl flex items-center gap-4 animate-slide-in">
        <span className="text-sm text-white">{action.message}</span>
        <button onClick={() => { action.onUndo(); setAction(null); }} className="text-amber font-bold text-sm hover:text-amber-light transition">Undo</button>
        <div className="w-20 h-1 bg-white/10 rounded-full overflow-hidden">
          <div className="h-full bg-amber rounded-full" style={{ animation: "shrink 5s linear forwards" }} />
        </div>
        <style>{`@keyframes shrink { from { width: 100%; } to { width: 0%; } }`}</style>
      </div>
    ) : null,
  };
}
