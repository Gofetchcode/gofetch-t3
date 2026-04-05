"use client";

import { useState, useEffect } from "react";

export function DarkModeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("gf-dark-mode");
    if (saved === "true" || (!saved && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
      setDark(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggle = () => {
    const next = !dark;
    setDark(next);
    localStorage.setItem("gf-dark-mode", String(next));
    document.documentElement.classList.toggle("dark", next);
  };

  return (
    <button
      onClick={toggle}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium bg-white/10 hover:bg-white/20 text-white transition-all duration-200"
      title={dark ? "Switch to light mode" : "Switch to dark mode"}
    >
      <span className="text-base">{dark ? "\u2600\uFE0F" : "\uD83C\uDF19"}</span>
      <span className="text-xs text-white/70">{dark ? "Light" : "Dark"}</span>
    </button>
  );
}
