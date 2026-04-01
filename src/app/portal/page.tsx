"use client";

import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Nav } from "@/components/landing/nav";

const STEPS = [
  "Lead Sent", "Lead Received", "Working", "Negotiating",
  "Client Approval", "Deal Agreed", "Paperwork Sent & Signed",
  "Scheduled for Pickup", "Delivered",
];

export default function PortalPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [customer, setCustomer] = useState<any>(null);

  const loginMutation = trpc.customer.login.useMutation({
    onSuccess: (data) => setCustomer(data.customer),
    onError: (err) => setError(err.message),
  });

  const handleLogin = () => {
    setError("");
    loginMutation.mutate({ email, password });
  };

  if (!customer) {
    return (
      <>
        <Nav />
        <div className="min-h-screen flex items-center justify-center px-4 pt-20">
          <div className="w-full max-w-sm bg-navy-light border border-white/[0.06] rounded-2xl p-8">
            <h3 className="text-xl font-semibold text-cream text-center mb-2">Customer Portal</h3>
            <p className="text-sm text-cream/40 text-center mb-6">Track your deal, review documents, and manage payments.</p>
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-cream text-sm mb-3 focus:border-amber focus:outline-none"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-cream text-sm mb-3 focus:border-amber focus:outline-none"
            />
            {error && <p className="text-red-400 text-sm mb-3">{error}</p>}
            <button
              onClick={handleLogin}
              disabled={loginMutation.isPending}
              className="w-full bg-amber text-navy font-semibold py-3 rounded-lg hover:bg-amber-light transition disabled:opacity-50"
            >
              {loginMutation.isPending ? "Logging in..." : "Log In"}
            </button>
          </div>
        </div>
      </>
    );
  }

  const progress = Math.round((customer.step / (STEPS.length - 1)) * 100);

  return (
    <>
      <Nav />
      <div className="max-w-4xl mx-auto px-4 pt-24 pb-12">
        <div className="flex justify-between items-center mb-6">
          <div>
            <p className="text-sm text-cream/40">Welcome back,</p>
            <h2 className="text-xl font-bold text-cream">{customer.name}</h2>
          </div>
          <button
            onClick={() => setCustomer(null)}
            className="border border-white/10 px-4 py-2 rounded-lg text-sm text-cream/50 hover:text-cream transition"
          >
            Logout
          </button>
        </div>

        {/* Progress */}
        <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-6 mb-6">
          <h3 className="font-semibold text-cream mb-3">Your Vehicle Progress</h3>
          <div className="w-full h-2 bg-white/10 rounded-full mb-3">
            <div className="h-full bg-amber rounded-full transition-all" style={{ width: `${progress}%` }} />
          </div>
          <div className="flex justify-between text-xs text-cream/30">
            <span>Lead Sent</span>
            <span>Delivered</span>
          </div>
          <p className="text-sm text-amber font-medium mt-2">Current: {STEPS[customer.step]}</p>
        </div>

        {/* Deal Details */}
        <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-6 mb-6">
          <h3 className="font-semibold text-cream mb-4">Deal Details</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {[
              { label: "Vehicle", value: customer.vehicle || "Pending", icon: "🚗" },
              { label: "Negotiated Price", value: customer.price || "Pending", icon: "💰" },
              { label: "Your Savings", value: customer.savings || "Pending", icon: "⭐" },
              { label: "Your Agent", value: customer.agent || "Assigned", icon: "🧑" },
              { label: "Est. Delivery", value: customer.delivery || "Pending", icon: "📅" },
              { label: "Status", value: STEPS[customer.step], icon: "⏳" },
            ].map((d) => (
              <div key={d.label} className="bg-white/[0.02] rounded-lg p-4">
                <div className="text-xs text-cream/30 uppercase tracking-wider mb-1">{d.label}</div>
                <div className="text-sm font-medium text-cream">{d.icon} {d.value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Documents */}
        <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-6">
          <h3 className="font-semibold text-cream mb-3">Your Documents</h3>
          {customer.files?.length > 0 ? (
            <div className="space-y-2">
              {customer.files.map((f: any) => (
                <div key={f.id} className="flex items-center gap-3 text-sm text-cream/60">
                  <span>📄</span>
                  <span>{f.fileName}</span>
                  <span className="text-cream/20 text-xs">{f.fileType}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-cream/30">No documents uploaded yet.</p>
          )}
        </div>
      </div>
    </>
  );
}
