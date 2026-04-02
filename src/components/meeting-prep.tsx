"use client";

interface MeetingPrepProps {
  customer: {
    firstName: string; lastName: string; vehicleSpecific?: string | null; budget?: string | null;
    timeline?: string | null; source?: string | null; leadScore: number; step: number;
    createdAt: string | Date; messages?: { sender: string; content: string; createdAt: string | Date }[];
    deskingOffers?: { vehicleDesc?: string | null; otdPrice?: string | null; status: string }[];
    documents?: { docType: string }[];
  };
  appointmentType?: string;
  appointmentTime?: string;
}

export function MeetingPrep({ customer, appointmentType = "Follow-up Call", appointmentTime }: MeetingPrepProps) {
  const daysActive = Math.floor((Date.now() - new Date(customer.createdAt).getTime()) / 86400000);
  const scoreBadge = customer.leadScore >= 80 ? "🔴 HOT" : customer.leadScore >= 50 ? "🟡 WARM" : "⚪ COLD";
  const lastCustomerMsg = customer.messages?.filter(m => m.sender === "customer").sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];
  const pendingOffers = customer.deskingOffers?.filter(o => o.status === "pending" || o.status === "sent_to_client") || [];
  const rejectedOffers = customer.deskingOffers?.filter(o => o.status === "rejected") || [];

  return (
    <div className="bg-white/[0.03] border border-amber/20 rounded-xl overflow-hidden">
      <div className="bg-gradient-to-r from-amber/20 to-transparent px-5 py-3 border-b border-amber/10">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] text-amber font-bold uppercase tracking-wider">📋 Pre-Call Briefing</p>
            <p className="text-sm font-bold text-white">{customer.firstName} {customer.lastName}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-white/40">{appointmentType}</p>
            {appointmentTime && <p className="text-xs text-amber">{appointmentTime}</p>}
          </div>
        </div>
      </div>

      <div className="p-5 space-y-4 text-sm">
        {/* Customer Snapshot */}
        <div>
          <p className="text-[10px] text-white/30 uppercase tracking-wider mb-2">Customer Snapshot</p>
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-white/[0.02] rounded-lg p-2"><span className="text-white/30 text-xs">Vehicle:</span> <span className="text-white text-xs">{customer.vehicleSpecific || "TBD"}</span></div>
            <div className="bg-white/[0.02] rounded-lg p-2"><span className="text-white/30 text-xs">Budget:</span> <span className="text-white text-xs">{customer.budget || "TBD"}</span></div>
            <div className="bg-white/[0.02] rounded-lg p-2"><span className="text-white/30 text-xs">Timeline:</span> <span className="text-white text-xs">{customer.timeline || "TBD"}</span></div>
            <div className="bg-white/[0.02] rounded-lg p-2"><span className="text-white/30 text-xs">Score:</span> <span className="text-white text-xs">{customer.leadScore} {scoreBadge}</span></div>
          </div>
        </div>

        {/* Deal Status */}
        <div>
          <p className="text-[10px] text-white/30 uppercase tracking-wider mb-2">Deal Status</p>
          <p className="text-white/60">Step {customer.step}/8 — Day {daysActive}</p>
          {pendingOffers.length > 0 && <p className="text-amber text-xs mt-1">📋 {pendingOffers.length} pending offer(s): {pendingOffers.map(o => o.otdPrice || "TBD").join(", ")}</p>}
          {rejectedOffers.length > 0 && <p className="text-red-400 text-xs mt-1">❌ {rejectedOffers.length} rejected offer(s)</p>}
        </div>

        {/* Recent Activity */}
        {lastCustomerMsg && (
          <div>
            <p className="text-[10px] text-white/30 uppercase tracking-wider mb-2">Last Customer Message</p>
            <p className="text-white/50 text-xs italic">&ldquo;{lastCustomerMsg.content.slice(0, 120)}...&rdquo;</p>
            <p className="text-white/20 text-[10px] mt-1">{new Date(lastCustomerMsg.createdAt).toLocaleString()}</p>
          </div>
        )}

        {/* AI Suggested Approach */}
        <div className="bg-amber/5 border border-amber/10 rounded-lg p-3">
          <p className="text-[10px] text-amber font-bold uppercase tracking-wider mb-1">🤖 AI Suggested Approach</p>
          <p className="text-white/60 text-xs leading-relaxed">
            {rejectedOffers.length > 0
              ? `Customer has rejected ${rejectedOffers.length} offer(s). Consider bridging the gap with financing options or including extras. Avoid pressuring — focus on value.`
              : customer.step <= 2
              ? `Early stage — build rapport. Ask about specific preferences, color, features. Show enthusiasm about finding the right match.`
              : customer.step <= 5
              ? `Active negotiation. Present numbers confidently. Highlight savings vs MSRP. Mention competing offers if available.`
              : `Final stages. Focus on logistics — paperwork, delivery timeline, any last questions. Keep energy positive.`
            }
          </p>
        </div>

        {/* Talking Points */}
        <div>
          <p className="text-[10px] text-white/30 uppercase tracking-wider mb-2">Talking Points</p>
          <div className="space-y-1">
            <p className="text-xs text-green-400">✓ Savings vs MSRP highlight</p>
            <p className="text-xs text-green-400">✓ Zero dealer add-ons removed</p>
            <p className="text-xs text-green-400">✓ Vehicle availability status</p>
            {customer.documents && customer.documents.length < 3 && <p className="text-xs text-amber">⚠ Missing documents — ask about insurance/income</p>}
            {rejectedOffers.length > 0 && <p className="text-xs text-red-400">✗ Avoid: mentioning rejected offer details</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
