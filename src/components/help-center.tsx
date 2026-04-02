"use client";

import { useState } from "react";

const helpItems = [
  { q: "How do I track my deal?", a: "Click the 'My Deal' tab to see your journey map, current step, and deal details." },
  { q: "How do I upload documents?", a: "Go to the Documents tab, select a document type, then drag & drop or click to upload. We accept PDF, JPEG, PNG up to 10MB." },
  { q: "When do I need to pay?", a: "Payment is only required after we've negotiated your deal and you've approved it (Step 5+). You'll see a 'Pay Now' button in the Payment tab." },
  { q: "How do I accept an offer?", a: "When your agent sends an offer, it appears in the My Deal tab. Click 'Accept This Offer' to proceed, or 'Request Changes' to counter." },
  { q: "How do I message my agent?", a: "Use the Messages tab to send and receive messages from your GoFetch agent." },
  { q: "What happens after I pay?", a: "After payment, your dealer's details are revealed, and your agent coordinates all paperwork and delivery." },
  { q: "Can I change my password?", a: "You were prompted to change your temporary password on first login. Contact us if you need a reset." },
  { q: "How long does the process take?", a: "Most clients go from consultation to keys in hand within 1-3 weeks." },
];

export function HelpCenter() {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState<number | null>(null);

  const filtered = helpItems.filter(h => h.q.toLowerCase().includes(search.toLowerCase()) || h.a.toLowerCase().includes(search.toLowerCase()));

  return (
    <>
      <button onClick={() => setOpen(true)} className="fixed bottom-6 left-6 z-40 w-10 h-10 rounded-full bg-amber text-navy font-bold shadow-lg hover:scale-110 transition-transform text-lg" title="Help Center">?</button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4" onClick={() => setOpen(false)}>
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[80vh] overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-bold text-navy">Help Center</h3>
              <button onClick={() => setOpen(false)} className="text-muted hover:text-navy text-xl">&times;</button>
            </div>
            <div className="p-4">
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search help articles..." className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:border-amber outline-none mb-3" />
              <div className="space-y-1 max-h-[50vh] overflow-y-auto">
                {filtered.map((h, i) => (
                  <div key={i} className="border border-gray-100 rounded-lg overflow-hidden">
                    <button onClick={() => setExpanded(expanded === i ? null : i)} className="w-full flex justify-between items-center px-4 py-3 text-left text-sm font-medium text-navy hover:bg-gray-50">
                      {h.q}
                      <span className={`text-amber transition-transform ${expanded === i ? "rotate-180" : ""}`}>▾</span>
                    </button>
                    {expanded === i && <div className="px-4 pb-3 text-sm text-muted">{h.a}</div>}
                  </div>
                ))}
              </div>
            </div>
            <div className="p-4 border-t border-gray-100 text-center">
              <p className="text-xs text-muted">Still need help? Call <a href="tel:+13524105889" className="text-amber">(352) 410-5889</a></p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
