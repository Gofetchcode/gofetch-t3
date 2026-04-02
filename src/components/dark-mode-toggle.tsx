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
      className="p-2 rounded-lg text-sm hover:bg-white/10 transition"
      title={dark ? "Light mode" : "Dark mode"}
    >
      {dark ? "☀️" : "🌙"}
    </button>
  );
}
