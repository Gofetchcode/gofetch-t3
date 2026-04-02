"use client";

import { useState, useEffect, useRef } from "react";
import { trpc } from "@/lib/trpc";
import Link from "next/link";
import { Confetti } from "@/components/confetti";
import { HelpCenter } from "@/components/help-center";
import { DealReplay } from "@/components/deal-replay";
import { NPSSurvey } from "@/components/nps-survey";
import { ShareableCard } from "@/components/shareable-card";

const STEPS = [
  "Consultation Submitted",
  "Lead Received",
  "Market Research",
  "Negotiating",
  "Client Approval",
  "Deal Agreed",
  "Paperwork & Signing",
  "Delivery Coordination",
  "Keys in Hand",
];

export default function PortalPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [customer, setCustomer] = useState<any>(null);
  const [tab, setTab] = useState<"deal" | "documents" | "payment" | "messages">("deal");
  const [newMessage, setNewMessage] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [payLoading, setPayLoading] = useState(false);
  const [needsPasswordChange, setNeedsPasswordChange] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadMsg, setUploadMsg] = useState("");
  const [selectedDocType, setSelectedDocType] = useState("Other");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");

  const loginMutation = trpc.customer.login.useMutation({
    onSuccess: (data) => {
      if (data.requirePasswordChange) {
        setNeedsPasswordChange(true);
        setCustomer(data.customer);
      } else {
        setCustomer(data.customer);
      }
    },
    onError: (err) => setError(err.message),
  });

  const changePwMutation = trpc.customer.changePassword.useMutation({
    onSuccess: () => {
      setNeedsPasswordChange(false);
      setCustomer({ ...customer, passwordChanged: true });
    },
    onError: (err) => setError(err.message),
  });

  if (!customer) {
    return (
      <div className="min-h-screen flex pt-16">
        {/* LEFT — Dark branding side (60%) */}
        <div className="hidden lg:flex lg:w-3/5 bg-navy relative overflow-hidden items-center justify-center">
          {/* Animated gold particles */}
          <style>{`
            @keyframes drift { 0%{transform:translateY(0) translateX(0);opacity:0} 10%{opacity:1} 90%{opacity:1} 100%{transform:translateY(-100vh) translateX(30px);opacity:0} }
            .particle{position:absolute;width:3px;height:3px;border-radius:50%;background:#D4A23A;animation:drift linear infinite}
          `}</style>
          {Array.from({length:20}).map((_,i) => (
            <div key={i} className="particle" style={{left:`${5+Math.random()*90}%`,bottom:`-5%`,animationDuration:`${8+Math.random()*12}s`,animationDelay:`${Math.random()*10}s`,opacity:0.15+Math.random()*0.3,width:`${2+Math.random()*3}px`,height:`${2+Math.random()*3}px`}} />
          ))}
          <div className="relative text-center px-12 z-10">
            <div className="w-16 h-16 rounded-2xl bg-amber flex items-center justify-center mx-auto mb-8">
              <span className="text-navy font-bold text-3xl" style={{ fontFamily: "var(--font-display)" }}>G</span>
            </div>
            <h2 className="text-4xl font-bold text-white mb-4" style={{ fontFamily: "var(--font-display)" }}>
              Your Deal.<br />Your Dashboard.
            </h2>
            <p className="text-white/50 text-lg max-w-md mx-auto">
              Track every step of your car purchase in real-time.
            </p>
          </div>
        </div>

        {/* RIGHT — Login form (40%) */}
        <div className="w-full lg:w-2/5 bg-white flex items-center justify-center px-6">
          <div className="w-full max-w-sm">
            <div className="lg:hidden flex justify-center mb-6">
              <div className="w-12 h-12 rounded-xl bg-amber flex items-center justify-center">
                <span className="text-navy font-bold text-2xl" style={{ fontFamily: "var(--font-display)" }}>G</span>
              </div>
            </div>
            <h3 className="text-2xl font-bold text-navy mb-1" style={{ fontFamily: "var(--font-display)" }}>Welcome back</h3>
            <p className="text-sm text-muted mb-8">Sign in to your Client Portal</p>

            <div className="space-y-4">
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted text-sm">✉</span>
                <input
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg pl-10 pr-4 py-3 text-navy text-sm focus:border-amber focus:ring-1 focus:ring-amber outline-none transition"
                />
              </div>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted text-sm">🔒</span>
                <input
                  type={showPw ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && loginMutation.mutate({ email, password })}
                  className="w-full border border-gray-200 rounded-lg pl-10 pr-10 py-3 text-navy text-sm focus:border-amber focus:ring-1 focus:ring-amber outline-none transition"
                />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted text-xs hover:text-navy transition">
                  {showPw ? "Hide" : "Show"}
                </button>
              </div>
              {error && <div className="text-red-500 text-sm animate-shake">{error}</div>}
              <button
                onClick={() => { setError(""); loginMutation.mutate({ email, password }); }}
                disabled={loginMutation.isPending}
                className="w-full bg-amber text-navy font-bold py-3.5 rounded-lg hover:bg-amber-light hover:scale-[1.02] transition-all disabled:opacity-50 disabled:scale-100 shadow-md shadow-amber/20"
              >
                {loginMutation.isPending ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-navy/30 border-t-navy rounded-full animate-spin" />
                    Signing in...
                  </span>
                ) : "Log In"}
              </button>
            </div>
            <p className="text-xs text-muted text-center mt-6">
              New client? <Link href="/car-finder" className="text-amber hover:underline">Start a free consultation →</Link>
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Password change screen
  if (needsPasswordChange) {
    return (
      <div className="min-h-screen bg-offwhite flex items-center justify-center px-4 pt-20">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <h3 className="text-xl font-bold text-navy mb-2">Set Your New Password</h3>
          <p className="text-sm text-muted mb-6">Please change your temporary password to continue.</p>
          <div className="space-y-4">
            <input type="password" placeholder="New password (8+ characters)" value={newPw} onChange={(e) => setNewPw(e.target.value)} className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:border-amber outline-none" />
            <input type="password" placeholder="Confirm new password" value={confirmPw} onChange={(e) => setConfirmPw(e.target.value)} className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:border-amber outline-none" />
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button
              onClick={() => {
                if (newPw !== confirmPw) { setError("Passwords don't match"); return; }
                if (newPw.length < 8) { setError("Password must be 8+ characters"); return; }
                changePwMutation.mutate({ email: customer.email, oldPassword: password, newPassword: newPw });
              }}
              className="w-full bg-amber text-navy font-bold py-3 rounded-lg hover:bg-amber-light transition"
            >
              Set Password
            </button>
          </div>
        </div>
      </div>
    );
  }

  const progress = Math.round((customer.step / (STEPS.length - 1)) * 100);

  return (
    <div className="min-h-screen bg-offwhite pt-20">
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Welcome bar */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <p className="text-sm text-muted">Welcome back,</p>
            <h2 className="text-2xl font-bold text-navy">{customer.firstName} {customer.lastName}</h2>
          </div>
          <button onClick={() => setCustomer(null)} className="border border-gray-200 px-4 py-2 rounded-lg text-sm text-muted hover:text-navy transition">Sign Out</button>
        </div>

        {/* Confetti on milestone steps */}
        <Confetti trigger={customer.step === 5 || customer.step === 8} />

        {/* Smart greeting */}
        <div className="bg-gradient-to-r from-amber/10 to-transparent rounded-xl p-4 mb-6 border border-amber/20">
          <p className="text-sm text-navy">
            {new Date().getHours() < 12 ? "Good morning" : new Date().getHours() < 17 ? "Good afternoon" : "Good evening"}, {customer.firstName}!
            {customer.step === 0 && " We've received your consultation and our team is reviewing it."}
            {customer.step >= 1 && customer.step <= 3 && " Your advocate is actively working on your deal."}
            {customer.step === 4 && " Great news — we have a deal for you to review!"}
            {customer.step === 5 && " 🎉 Deal agreed! Time to complete your payment."}
            {customer.step >= 6 && customer.step <= 7 && " We're wrapping up paperwork and coordinating delivery."}
            {customer.step === 8 && " 🎉 Congratulations! Your vehicle has been delivered!"}
          </p>
        </div>

        {/* Glass-morphism stat cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Current Step", value: `${customer.step + 1}/9`, sub: STEPS[customer.step], icon: "📍" },
            { label: "Days Active", value: String(Math.floor((Date.now() - new Date(customer.createdAt).getTime()) / 86400000)), icon: "📅" },
            { label: "Your Agent", value: "GoFetch Auto", icon: "🧑" },
            { label: "Est. Savings", value: "~$3,400", icon: "💰" },
          ].map((s) => (
            <div key={s.label} className="relative overflow-hidden bg-white/70 backdrop-blur-lg rounded-xl p-5 shadow-lg border border-white/50">
              <div className="absolute -top-2 -right-2 text-3xl opacity-10">{s.icon}</div>
              <p className="text-xs text-amber font-semibold uppercase tracking-wider mb-1">{s.label}</p>
              <p className="text-xl font-bold text-navy">{s.value}</p>
              {s.sub && <p className="text-xs text-muted mt-1">{s.sub}</p>}
            </div>
          ))}
        </div>

        {/* Tabs with animated underline */}
        <div className="relative flex border-b border-gray-200 mb-8">
          {(["deal", "documents", "payment", "messages"] as const).map((t, i) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`relative flex-1 py-3 text-sm font-semibold transition-colors ${
                tab === t ? "text-navy" : "text-muted hover:text-navy"
              }`}
            >
              {t === "deal" ? "📍 My Deal" : t === "documents" ? "📄 Documents" : t === "payment" ? "💳 Payment" : "💬 Messages"}
              {tab === t && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber rounded-full transition-all duration-300" />
              )}
              {t === "messages" && (customer.messages?.length || 0) > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-amber text-navy text-[9px] font-bold rounded-full flex items-center justify-center">{customer.messages?.length}</span>
              )}
              {t === "documents" && customer.documents && customer.documents.length < 4 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">!</span>
              )}
            </button>
          ))}
        </div>

        {/* MY DEAL TAB */}
        {tab === "deal" && (
          <div className="space-y-6">
            {/* Journey Map — Snake Path */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h3 className="font-bold text-navy mb-6">Your Journey</h3>
              <div className="relative">
                {STEPS.map((s, i) => {
                  const isComplete = i < customer.step;
                  const isCurrent = i === customer.step;
                  const isRight = i % 2 === 0;
                  return (
                    <div key={i} className={`flex items-center gap-4 mb-1 ${isRight ? "" : "flex-row-reverse"}`}>
                      {/* Content */}
                      <div className={`flex-1 ${isRight ? "text-right pr-4" : "text-left pl-4"}`}>
                        <p className={`text-sm font-medium ${isComplete ? "text-navy" : isCurrent ? "text-amber" : "text-muted"}`}>{s}</p>
                        {isComplete && <p className="text-xs text-green-500">Complete ✓</p>}
                        {isCurrent && <p className="text-xs text-amber font-semibold">In Progress</p>}
                      </div>
                      {/* Node */}
                      <div className="flex flex-col items-center">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all ${
                          isComplete ? "bg-amber border-amber text-navy" :
                          isCurrent ? "bg-amber/20 border-amber text-amber animate-pulse-glow" :
                          "bg-gray-50 border-gray-200 text-muted"
                        }`}>
                          {isComplete ? "✓" : i + 1}
                        </div>
                        {i < STEPS.length - 1 && (
                          <div className={`w-0.5 h-8 ${isComplete ? "bg-amber" : "bg-gray-200 border-dashed"}`} />
                        )}
                      </div>
                      {/* Spacer */}
                      <div className="flex-1" />
                    </div>
                  );
                })}
              </div>
              <div className="mt-4 bg-offwhite rounded-lg p-3 text-center">
                <p className="text-sm text-navy font-medium">{Math.round(progress)}% Complete</p>
                <div className="w-full h-2 bg-gray-200 rounded-full mt-2 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-amber to-amber-light rounded-full animate-path-fill" style={{ maxWidth: `${progress}%` }} />
                </div>
              </div>
            </div>

            {/* Deal details */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h3 className="font-bold text-navy mb-4">Deal Details</h3>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: "Vehicle", value: customer.vehicleSpecific || "Pending" },
                  { label: "Negotiated Price", value: customer.negotiatedPrice || "Pending" },
                  { label: "Your Agent", value: "GoFetch Auto" },
                  { label: "Est. Delivery", value: customer.deliveryDate || "Pending" },
                ].map((d) => (
                  <div key={d.label} className="bg-offwhite rounded-lg p-4 border-t-3 border-amber">
                    <p className="text-xs text-amber font-semibold uppercase tracking-wider mb-1">{d.label}</p>
                    <p className={`text-sm font-medium ${d.value === "Pending" ? "text-muted italic" : "text-navy"}`}>{d.value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Market Comparison */}
            {customer.negotiatedPrice && (
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h3 className="font-bold text-navy mb-4">📊 How Your Deal Compares</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3"><span className="w-24 text-xs text-muted">Your Price</span><div className="flex-1 h-6 bg-green-100 rounded-full"><div className="h-full bg-green-500 rounded-full flex items-center px-3" style={{width:"70%"}}><span className="text-[10px] font-bold text-white">{customer.negotiatedPrice}</span></div></div></div>
                  <div className="flex items-center gap-3"><span className="w-24 text-xs text-muted">Market Avg</span><div className="flex-1 h-6 bg-gray-100 rounded-full"><div className="h-full bg-gray-400 rounded-full flex items-center px-3" style={{width:"85%"}}><span className="text-[10px] font-bold text-white">~$36,200</span></div></div></div>
                  <div className="flex items-center gap-3"><span className="w-24 text-xs text-muted">MSRP</span><div className="flex-1 h-6 bg-gray-100 rounded-full"><div className="h-full bg-gray-300 rounded-full flex items-center px-3" style={{width:"100%"}}><span className="text-[10px] font-bold text-white">~$38,500</span></div></div></div>
                </div>
                <p className="text-sm text-green-600 font-medium mt-4 text-center">You&rsquo;re doing better than 87% of buyers who negotiate on their own</p>
              </div>
            )}

            {/* Desking Offers */}
            {customer.deskingOffers && customer.deskingOffers.length > 0 && (
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h3 className="font-bold text-navy mb-4">Offers from Your Agent</h3>
                <div className="space-y-4">
                  {customer.deskingOffers.filter((o: any) => o.status === "sent_to_client" || o.isRevealed).map((offer: any) => (
                    <div key={offer.id} className="border border-amber/20 rounded-xl p-5 bg-amber/5">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <p className="text-xs text-amber font-semibold uppercase tracking-wider">New Offer from Your GoFetch Agent</p>
                          <p className="text-lg font-bold text-navy mt-1">{offer.vehicleDesc || "Vehicle"}</p>
                        </div>
                        <span className={`text-xs font-medium px-2 py-1 rounded-full ${offer.status === "accepted" ? "bg-green-100 text-green-700" : "bg-amber/20 text-amber-dark"}`}>{offer.status}</span>
                      </div>
                      <div className="grid grid-cols-3 gap-3 mb-4">
                        <div className="bg-white rounded-lg p-3 text-center">
                          <p className="text-[10px] text-muted uppercase">Negotiated</p>
                          <p className="text-lg font-bold text-navy">{offer.negotiatedPrice || "—"}</p>
                        </div>
                        <div className="bg-white rounded-lg p-3 text-center">
                          <p className="text-[10px] text-muted uppercase">OTD Price</p>
                          <p className="text-lg font-bold text-navy">{offer.otdPrice || "—"}</p>
                        </div>
                        <div className="bg-white rounded-lg p-3 text-center">
                          <p className="text-[10px] text-muted uppercase">Your Savings</p>
                          <p className="text-lg font-bold text-green-600">{offer.savings || "—"}</p>
                        </div>
                      </div>
                      {offer.notes && <p className="text-sm text-muted italic mb-4">&ldquo;{offer.notes}&rdquo; — GoFetch Auto</p>}
                      {offer.status === "sent_to_client" && (
                        <div className="flex gap-3">
                          <button className="flex-1 bg-green-500 text-white font-bold py-3 rounded-lg hover:bg-green-600 transition">✅ Accept This Offer</button>
                          <button className="flex-1 border border-gray-200 text-muted font-medium py-3 rounded-lg hover:bg-gray-50 transition">↩ Request Changes</button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Activity Timeline */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h3 className="font-bold text-navy mb-4">Activity Timeline</h3>
              <div className="space-y-4">
                {customer.messages?.slice(0, 5).map((m: any, i: number) => (
                  <div key={m.id || i} className="flex gap-3 items-start">
                    <div className="w-2.5 h-2.5 rounded-full bg-amber mt-1.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs font-bold text-navy">{new Date(m.createdAt).toLocaleDateString()}</p>
                      <p className="text-sm text-muted">{m.content}</p>
                    </div>
                  </div>
                ))}
                {(!customer.messages || customer.messages.length === 0) && (
                  <div className="space-y-4">
                    <div className="flex gap-3 items-start">
                      <div className="w-2.5 h-2.5 rounded-full bg-amber mt-1.5 flex-shrink-0" />
                      <div>
                        <p className="text-xs font-bold text-navy">{new Date(customer.createdAt).toLocaleDateString()}</p>
                        <p className="text-sm text-muted">Your consultation has been received. We&rsquo;ll be in touch shortly.</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* DOCUMENTS TAB */}
        {tab === "documents" && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h3 className="font-bold text-navy mb-4">Upload Documents</h3>

              {/* Doc type pill selector */}
              <div className="flex flex-wrap gap-2 mb-4">
                {["Driver's License", "Insurance", "Proof of Income", "Pre-Approval", "Trade-In Title", "Other"].map((t) => (
                  <button key={t} onClick={() => setSelectedDocType(t)} className={`px-3 py-1.5 text-xs font-medium rounded-full border transition ${selectedDocType === t ? "bg-amber text-navy border-amber" : "border-gray-200 text-muted hover:bg-amber hover:text-navy hover:border-amber"}`}>
                    {t}
                  </button>
                ))}
              </div>

              <div
                className={`border-2 border-dashed rounded-xl p-8 text-center mb-6 transition cursor-pointer relative ${dragOver ? "border-amber bg-amber/5" : "border-amber/30 hover:border-amber/60"}`}
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={async (e) => {
                  e.preventDefault(); setDragOver(false);
                  const file = e.dataTransfer.files[0];
                  if (!file) return;
                  setUploading(true);
                  const fd = new FormData();
                  fd.append("file", file);
                  fd.append("customerId", customer.id);
                  fd.append("docType", selectedDocType);
                  try {
                    await fetch("/api/upload", { method: "POST", body: fd });
                    setUploadMsg("Uploaded successfully!");
                  } catch { setUploadMsg("Upload failed"); }
                  setUploading(false);
                  setTimeout(() => setUploadMsg(""), 3000);
                }}
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  className="hidden"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    setUploading(true);
                    const fd = new FormData();
                    fd.append("file", file);
                    fd.append("customerId", customer.id);
                    fd.append("docType", selectedDocType);
                    try {
                      await fetch("/api/upload", { method: "POST", body: fd });
                      setUploadMsg("Uploaded successfully!");
                    } catch { setUploadMsg("Upload failed"); }
                    setUploading(false);
                    setTimeout(() => setUploadMsg(""), 3000);
                  }}
                />
                {uploading ? (
                  <><span className="w-6 h-6 border-2 border-amber/30 border-t-amber rounded-full animate-spin inline-block mb-2" /><p className="text-sm text-navy font-medium">Uploading...</p></>
                ) : (
                  <><p className="text-3xl mb-2">📎</p><p className="text-sm text-navy font-medium">{dragOver ? "Drop file here" : "Drop files here or click to browse"}</p><p className="text-xs text-muted mt-1">PDF, JPEG, PNG &bull; Max 10MB</p></>
                )}
                {uploadMsg && <p className="text-xs text-green-600 mt-2 font-medium">{uploadMsg}</p>}
              </div>
            {customer.documents?.length > 0 ? (
              <div className="space-y-2">
                {customer.documents.map((d: any) => (
                  <div key={d.id} className="flex items-center justify-between bg-offwhite rounded-lg p-3">
                    <div className="flex items-center gap-3">
                      <span className="text-lg">📎</span>
                      <div>
                        <p className="text-sm font-medium text-navy">{d.originalName || d.fileName}</p>
                        <p className="text-xs text-muted">{d.docType}</p>
                      </div>
                    </div>
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                      d.status === "approved" ? "bg-green-100 text-green-700" :
                      d.status === "under_review" ? "bg-amber/10 text-amber-dark" :
                      "bg-gray-100 text-muted"
                    }`}>
                      {d.status}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted">No documents uploaded yet.</p>
            )}
            </div>

            {/* Required Documents Checklist */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h3 className="font-bold text-navy mb-4">Required Documents</h3>
              <div className="space-y-3">
                {["Driver's License", "Insurance Card", "Proof of Income", "Pre-Approval Letter"].map((doc) => {
                  const uploaded = customer.documents?.some((d: any) => d.docType === doc);
                  return (
                    <div key={doc} className="flex items-center gap-3">
                      <span className={`w-5 h-5 rounded flex items-center justify-center text-xs ${uploaded ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-300"}`}>
                        {uploaded ? "✓" : ""}
                      </span>
                      <span className={`text-sm ${uploaded ? "text-navy" : "text-muted"}`}>{doc}</span>
                      {uploaded && <span className="text-xs text-green-500 ml-auto">Uploaded</span>}
                      {!uploaded && <span className="text-xs text-amber ml-auto cursor-pointer hover:underline">Upload →</span>}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* PAYMENT TAB */}
        {tab === "payment" && (
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 text-center">
            {customer.step < 5 ? (
              <>
                <p className="text-4xl mb-4">💳</p>
                <h3 className="font-bold text-navy text-lg mb-2">No Payment Due Yet</h3>
                <p className="text-sm text-muted max-w-md mx-auto">Payment is only required after we&rsquo;ve negotiated your deal and you&rsquo;ve approved it. You&rsquo;re currently on step {customer.step + 1} of 9.</p>
              </>
            ) : customer.paid ? (
              <>
                <p className="text-4xl mb-4">✅</p>
                <h3 className="font-bold text-navy text-lg mb-2">Payment Complete</h3>
                <p className="text-sm text-muted">Paid {customer.paidAmount} on {customer.paidDate ? new Date(customer.paidDate).toLocaleDateString() : "N/A"}</p>
              </>
            ) : (
              <>
                <p className="text-5xl font-bold text-amber mb-2" style={{ fontFamily: "var(--font-display)" }}>$99</p>
                <p className="text-sm text-muted mb-6">Standard Tier — Car Buying Advocacy</p>
                <button
                  onClick={async () => {
                    setPayLoading(true);
                    try {
                      const res = await fetch("/api/stripe/checkout", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ customerId: customer.id, tier: "standard" }),
                      });
                      const data = await res.json();
                      if (data.url) window.location.href = data.url;
                      else setPayLoading(false);
                    } catch { setPayLoading(false); }
                  }}
                  disabled={payLoading}
                  className="bg-amber text-navy font-bold px-8 py-4 rounded-lg text-lg hover:bg-amber-light transition animate-pulse-glow disabled:opacity-50"
                >
                  {payLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="w-5 h-5 border-2 border-navy/30 border-t-navy rounded-full animate-spin" />
                      Redirecting to Stripe...
                    </span>
                  ) : "Pay Now — Secure Checkout →"}
                </button>
                <div className="flex items-center justify-center gap-3 mt-4 text-xs text-muted">
                  <span>🔒 256-bit SSL</span>
                  <span>|</span>
                  <span>Powered by Stripe</span>
                </div>
              </>
            )}
          </div>
        )}

        {/* MESSAGES TAB */}
        {tab === "messages" && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-4 border-b border-gray-100">
              <h3 className="font-bold text-navy">Messages</h3>
            </div>
            <div className="h-80 overflow-y-auto p-4 space-y-3">
              {customer.messages?.map((m: any) => (
                <div key={m.id} className={`flex ${m.sender === "customer" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-xs rounded-xl px-4 py-2.5 text-sm ${
                    m.sender === "customer"
                      ? "bg-amber text-navy rounded-br-sm"
                      : m.sender === "system"
                      ? "bg-blue-50 text-navy rounded-bl-sm border border-blue-100"
                      : "bg-gray-100 text-navy rounded-bl-sm"
                  }`}>
                    {m.sender === "system" && <p className="text-[10px] font-bold text-blue-500 mb-1">🤖 GoFetch AI</p>}
                    {m.sender === "agent" && <p className="text-[10px] font-bold text-navy/50 mb-1">👤 Your Agent</p>}
                    {m.content}
                    <div className={`text-xs mt-1 ${m.sender === "customer" ? "text-navy/50" : "text-muted"}`}>
                      {new Date(m.createdAt).toLocaleString()}
                    </div>
                  </div>
                </div>
              ))}
              {(!customer.messages || customer.messages.length === 0) && (
                <p className="text-sm text-muted text-center py-8">No messages yet.</p>
              )}
            </div>
            <div className="p-4 border-t border-gray-100 flex gap-2">
              <input
                type="text"
                placeholder="Type a message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="flex-1 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:border-amber outline-none"
              />
              <button className="bg-amber text-navy px-5 py-2.5 rounded-lg font-semibold text-sm hover:bg-amber-light transition">
                Send
              </button>
            </div>
          </div>
        )}

        {/* Deal Replay + NPS Survey + Shareable Card (shown at step 8 — Delivered) */}
        {customer.step === 8 && (
          <div className="space-y-6 mt-6">
            <DealReplay
              events={STEPS.map((s, i) => ({ step: s, date: `Step ${i + 1}`, detail: i < customer.step ? "Completed" : "Pending" }))}
              totalDays={Math.floor((Date.now() - new Date(customer.createdAt).getTime()) / 86400000)}
              avgDays={21}
            />
            <NPSSurvey customerName={customer.firstName} onSubmit={(score, comment) => console.log("NPS:", score, comment)} />
            <ShareableCard vehicle={customer.vehicleSpecific || "vehicle"} savings={customer.negotiatedPrice ? "$4,400" : "~$3,400"} customerName={customer.firstName} />
          </div>
        )}

        {/* Estimated time remaining */}
        {customer.step < 8 && (
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 mt-6 text-center">
            <p className="text-xs text-amber font-semibold uppercase tracking-wider mb-1">Estimated Time Remaining</p>
            <p className="text-lg font-bold text-navy">{Math.max(1, (8 - customer.step) * 3)}-{Math.max(2, (8 - customer.step) * 5)} days</p>
            <p className="text-xs text-muted mt-1">
              {customer.step <= 3 ? "Your agent is actively working on your deal" :
               customer.step <= 5 ? "Almost there — reviewing final offers" :
               "Wrapping up paperwork and coordination"}
            </p>
          </div>
        )}
      </div>

      {/* Help Center */}
      <HelpCenter />
    </div>
  );
}
