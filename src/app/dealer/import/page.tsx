"use client";

import { useState } from "react";

const FIELDS = ["firstName", "lastName", "email", "phone", "vehicleType", "vehicleSpecific", "budget", "timeline", "source", "notes"];

export default function ImportPage() {
  const [step, setStep] = useState<"upload" | "map" | "preview" | "done">("upload");
  const [rows, setRows] = useState<string[][]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [mapping, setMapping] = useState<Record<string, string>>({});

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      const lines = text.split("\n").map(l => l.split(",").map(c => c.trim().replace(/^"|"$/g, "")));
      setHeaders(lines[0] || []);
      setRows(lines.slice(1).filter(l => l.length > 1));
      setStep("map");
    };
    reader.readAsText(file);
  };

  const handleImport = () => {
    // TODO: send mapped data to API
    setStep("done");
  };

  return (
    <div className="min-h-screen bg-navy text-white pt-20">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-6">Import Leads</h2>

        {step === "upload" && (
          <div className="bg-white/[0.03] border border-white/5 rounded-xl p-10 text-center">
            <p className="text-4xl mb-4">📄</p>
            <h3 className="text-lg font-bold mb-2">Upload CSV File</h3>
            <p className="text-white/40 text-sm mb-6">Upload a CSV file with your lead data. First row should be headers.</p>
            <label className="inline-block bg-amber text-navy font-bold px-6 py-3 rounded-lg cursor-pointer hover:bg-amber-light transition">
              Choose File
              <input type="file" accept=".csv" onChange={handleFile} className="hidden" />
            </label>
          </div>
        )}

        {step === "map" && (
          <div className="bg-white/[0.03] border border-white/5 rounded-xl p-6">
            <h3 className="text-lg font-bold mb-4">Map Columns</h3>
            <p className="text-white/40 text-sm mb-6">Match your CSV columns to GoFetch fields.</p>
            <div className="space-y-3">
              {headers.map((h) => (
                <div key={h} className="flex items-center gap-4">
                  <span className="w-40 text-sm text-white/60 truncate">{h}</span>
                  <span className="text-white/20">→</span>
                  <select value={mapping[h] || ""} onChange={(e) => setMapping({ ...mapping, [h]: e.target.value })} className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm flex-1">
                    <option value="">Skip this column</option>
                    {FIELDS.map(f => <option key={f} value={f}>{f}</option>)}
                  </select>
                </div>
              ))}
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setStep("preview")} className="bg-amber text-navy font-bold px-6 py-3 rounded-lg hover:bg-amber-light transition">Preview Import</button>
              <button onClick={() => setStep("upload")} className="border border-white/10 px-6 py-3 rounded-lg text-white/40 hover:text-white transition">Back</button>
            </div>
          </div>
        )}

        {step === "preview" && (
          <div className="bg-white/[0.03] border border-white/5 rounded-xl p-6">
            <h3 className="text-lg font-bold mb-4">Preview ({rows.length} rows)</h3>
            <div className="overflow-x-auto mb-6">
              <table className="w-full text-sm">
                <thead><tr className="border-b border-white/5">{headers.map(h => <th key={h} className="p-2 text-left text-xs text-white/30">{mapping[h] || <span className="text-white/10">skipped</span>}</th>)}</tr></thead>
                <tbody>
                  {rows.slice(0, 5).map((row, i) => (
                    <tr key={i} className="border-b border-white/5">{row.map((cell, j) => <td key={j} className="p-2 text-white/60">{cell}</td>)}</tr>
                  ))}
                </tbody>
              </table>
              {rows.length > 5 && <p className="text-xs text-white/20 mt-2">...and {rows.length - 5} more rows</p>}
            </div>
            <div className="flex gap-3">
              <button onClick={handleImport} className="bg-amber text-navy font-bold px-6 py-3 rounded-lg hover:bg-amber-light transition">Import {rows.length} Leads</button>
              <button onClick={() => setStep("map")} className="border border-white/10 px-6 py-3 rounded-lg text-white/40 hover:text-white transition">Back</button>
            </div>
          </div>
        )}

        {step === "done" && (
          <div className="bg-white/[0.03] border border-white/5 rounded-xl p-10 text-center">
            <p className="text-5xl mb-4">✅</p>
            <h3 className="text-xl font-bold mb-2">Import Complete!</h3>
            <p className="text-white/40 mb-6">{rows.length} leads imported successfully.</p>
            <a href="/dealer" className="bg-amber text-navy font-bold px-6 py-3 rounded-lg hover:bg-amber-light transition inline-block">Go to CRM</a>
          </div>
        )}
      </div>
    </div>
  );
}
