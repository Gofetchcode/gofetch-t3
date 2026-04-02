// GoFetch AI Engine — Self-Learning Loops + Agentic Autonomy

// ═══ AUTONOMY LEVELS ═══
export type AutonomyLevel = 1 | 2 | 3;
export const AUTONOMY_LABELS: Record<AutonomyLevel, { name: string; desc: string }> = {
  1: { name: "Suggest Only", desc: "AI recommends but never executes. Human approves everything." },
  2: { name: "Auto Low-Risk", desc: "AI handles follow-ups, reminders, welcomes. Waits for approval on offers/money." },
  3: { name: "Full Auto", desc: "AI handles everything except payments, contracts, and deletions." },
};

// Actions AI can take per autonomy level
const LEVEL_2_AUTO = ["follow_up_text", "welcome_message", "appointment_reminder", "document_nudge", "status_update"];
const LEVEL_3_AUTO = [...LEVEL_2_AUTO, "step_change", "reassign_lead", "multi_message_sequence", "schedule_appointment", "request_documents"];
const NEVER_AUTO = ["payment", "contract_change", "outreach_blast", "customer_delete", "user_management"];

export function canAutoExecute(action: string, level: AutonomyLevel): boolean {
  if (NEVER_AUTO.includes(action)) return false;
  if (level === 1) return false;
  if (level === 2) return LEVEL_2_AUTO.includes(action);
  if (level === 3) return LEVEL_3_AUTO.includes(action);
  return false;
}

// ═══ SAFETY GUARDRAILS ═══
export function isQuietHours(): boolean {
  const hour = new Date().getHours();
  return hour < 8 || hour >= 21;
}

export function canSendMessage(messageCountToday: number): boolean {
  return messageCountToday < 3; // Max 3 automated per customer per day
}

// ═══ LEAD SCORING ═══
export function calculateLeadScore(customer: {
  budget?: string | null;
  timeline?: string | null;
  vehicleType?: string | null;
  contractSigned: boolean;
  documents?: { length: number };
  messages?: { sender: string }[];
  source?: string | null;
}): number {
  let score = 0;

  // Budget
  if (customer.budget) {
    const b = parseInt(customer.budget.replace(/\D/g, "")) || 0;
    if (b > 80000) score += 25;
    else if (b > 60000) score += 20;
    else if (b > 40000) score += 15;
    else if (b > 20000) score += 10;
    else score += 5;
  }

  // Timeline
  if (customer.timeline === "ASAP") score += 30;
  else if (customer.timeline === "1-2 Weeks") score += 20;
  else if (customer.timeline === "1 Month") score += 10;
  else score += 5;

  // Vehicle type
  if (customer.vehicleType?.includes("Exotic")) score += 20;
  else if (customer.vehicleType?.includes("New")) score += 10;

  // Engagement
  if ((customer.documents?.length || 0) > 0) score += 15;
  if (customer.contractSigned) score += 25;
  if (customer.messages?.some(m => m.sender === "customer")) score += 10;

  // Source
  if (customer.source === "Referral") score += 15;
  else if (customer.source === "Google Ads") score += 10;
  else if (customer.source === "Website") score += 8;
  else score += 5;

  return Math.min(score, 100);
}

export function getScoreBadge(score: number): { emoji: string; label: string; color: string } {
  if (score >= 80) return { emoji: "🔴", label: "Hot", color: "bg-red-500/20 text-red-400" };
  if (score >= 50) return { emoji: "🟡", label: "Warm", color: "bg-amber/20 text-amber" };
  return { emoji: "⚪", label: "Cold", color: "bg-white/10 text-white/40" };
}

// ═══ DEAL HEALTH SCORE ═══
export function calculateDealHealth(customer: {
  step: number;
  createdAt: Date | string;
  messages?: { sender: string; createdAt: Date | string }[];
  deskingOffers?: { status: string }[];
}): { score: number; label: string; color: string; icon: string } {
  let score = 100;
  const daysActive = Math.floor((Date.now() - new Date(customer.createdAt).getTime()) / 86400000);
  const avgDaysPerStep = 3;
  const expectedDays = customer.step * avgDaysPerStep;

  // Penalize if behind schedule
  if (daysActive > expectedDays + 5) score -= 20;
  if (daysActive > expectedDays + 10) score -= 20;

  // Penalize rejected offers
  const rejected = customer.deskingOffers?.filter(o => o.status === "rejected").length || 0;
  score -= rejected * 10;

  // Penalize no recent messages
  const lastMsg = customer.messages?.filter(m => m.sender === "customer").sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];
  if (lastMsg) {
    const daysSinceReply = Math.floor((Date.now() - new Date(lastMsg.createdAt).getTime()) / 86400000);
    if (daysSinceReply > 7) score -= 25;
    else if (daysSinceReply > 3) score -= 10;
  } else {
    score -= 15;
  }

  score = Math.max(0, Math.min(100, score));

  if (score >= 80) return { score, label: "Healthy", color: "text-green-400", icon: "💚" };
  if (score >= 50) return { score, label: "At Risk", color: "text-amber", icon: "💛" };
  return { score, label: "Critical", color: "text-red-400", icon: "❤️" };
}

// ═══ SENTIMENT DETECTION (simple keyword-based) ═══
export function detectSentiment(text: string): { sentiment: "positive" | "neutral" | "negative" | "frustrated"; emoji: string } {
  const lower = text.toLowerCase();
  const frustrated = ["angry", "frustrated", "terrible", "awful", "worst", "hate", "ridiculous", "scam", "rip off", "waste", "horrible", "disgusting", "unacceptable", "complaint"];
  const negative = ["unhappy", "disappointed", "concern", "issue", "problem", "wrong", "delay", "waiting", "slow", "expensive", "too much", "cancel", "refund"];
  const positive = ["thank", "great", "awesome", "perfect", "excellent", "love", "amazing", "wonderful", "happy", "excited", "appreciate", "fantastic"];

  if (frustrated.some(w => lower.includes(w))) return { sentiment: "frustrated", emoji: "😤" };
  if (negative.some(w => lower.includes(w))) return { sentiment: "negative", emoji: "😟" };
  if (positive.some(w => lower.includes(w))) return { sentiment: "positive", emoji: "😊" };
  return { sentiment: "neutral", emoji: "😐" };
}

// ═══ NEXT-BEST-ACTION ═══
export function getNextBestAction(customer: {
  step: number;
  leadScore: number;
  contractSigned: boolean;
  paid: boolean;
  documents?: { length: number };
  messages?: { sender: string; createdAt: Date | string }[];
  deskingOffers?: { status: string }[];
}): { action: string; icon: string; reason: string } {
  // Check for stale leads
  const lastCustomerMsg = customer.messages?.filter(m => m.sender === "customer").sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];
  const daysSinceReply = lastCustomerMsg ? Math.floor((Date.now() - new Date(lastCustomerMsg.createdAt).getTime()) / 86400000) : 999;

  if (daysSinceReply > 2 && customer.step < 5) return { action: "Send text — no contact in " + daysSinceReply + " days", icon: "💬", reason: "approaching escalation" };
  if (customer.step === 5 && !customer.paid) return { action: "Follow up on payment", icon: "💳", reason: "deal agreed, awaiting payment" };
  if (customer.step >= 5 && (customer.documents?.length || 0) < 2) return { action: "Request missing documents", icon: "📎", reason: "need insurance card to proceed" };
  if (customer.deskingOffers?.some(o => o.status === "rejected")) return { action: "Send revised offer — lower by $1,200", icon: "📋", reason: "client rejected last offer" };
  if (customer.leadScore >= 80 && customer.step < 3) return { action: "Call now — hot lead", icon: "📞", reason: "score " + customer.leadScore + ", engaged recently" };
  if (customer.step === 8) return { action: "Schedule delivery", icon: "🎉", reason: "all paperwork complete" };
  return { action: "Continue working deal", icon: "🔄", reason: "on track" };
}

// ═══ AI AUTO-TEXT TEMPLATES ═══
export const AI_TEMPLATES = {
  welcome: (name: string, vehicle: string) => `Hi ${name}, thanks for reaching out to GoFetch Auto about the ${vehicle}! Your dedicated agent will be in touch shortly. In the meantime, is there anything specific you're looking for?`,
  followUp: (name: string, vehicle: string) => `Hi ${name}, just checking in on your ${vehicle} search. We're actively working on finding the best deal for you. Any updates on your end?`,
  appointmentReminder: (name: string) => `Hi ${name}, reminder about your GoFetch consultation tomorrow. Looking forward to chatting!`,
  offerSent: (name: string, vehicle: string) => `Hi ${name}, great news! We have a new offer for your ${vehicle}. Log into your portal to review it.`,
  dealClosing: (name: string, vehicle: string) => `Hi ${name}, your ${vehicle} is almost ready! Just a few final steps. Check your portal for details.`,
};
