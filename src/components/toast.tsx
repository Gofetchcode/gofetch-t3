"use client";

import { useState, useEffect, createContext, useContext, useCallback } from "react";

type ToastType = "success" | "error" | "info";
interface Toast { id: number; message: string; type: ToastType; }

const ToastContext = createContext<{ toast: (msg: string, type?: ToastType) => void }>({
  toast: () => {},
});

export function useToast() { return useContext(ToastContext); }

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = useCallback((message: string, type: ToastType = "success") => {
    const id = Date.now();
    setToasts((t) => [...t, { id, message, type }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 4000);
  }, []);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-[200] flex flex-col gap-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`px-5 py-3 rounded-xl shadow-xl text-sm font-medium animate-slide-in max-w-sm ${
              t.type === "success" ? "bg-green-500 text-white" :
              t.type === "error" ? "bg-red-500 text-white" :
              "bg-navy text-white border border-white/10"
            }`}
          >
            {t.type === "success" && "✓ "}{t.type === "error" && "✕ "}{t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
