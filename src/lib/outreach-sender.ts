import { Resend } from "resend";
import { generateOutreachEmail, generateADFXML } from "./adf-generator";

const resendKey = (process.env.RESEND_API_KEY || "").replace(/\s+/g, "").trim();
const resend = resendKey ? new Resend(resendKey) : null;

// ═══ SEND OUTREACH EMAIL TO DEALER ═══
export async function sendOutreachEmail(dealer: {
  name: string; email?: string | null;
}, vehicle: string, opts: {
  color?: string; features?: string; budget?: string; timeline?: string; clientId: string;
}): Promise<{ success: boolean; method: string }> {
  if (!dealer.email) return { success: false, method: "no_email" };

  const { subject, body } = generateOutreachEmail({
    dealerName: dealer.name,
    vehicle,
    color: opts.color,
    features: opts.features,
    budget: opts.budget,
    timeline: opts.timeline,
  });

  if (resend) {
    try {
      const result = await resend.emails.send({
        from: "GoFetch Auto <inquiry@gofetchauto.com>",
        to: [dealer.email],
        replyTo: "inquiry@gofetchauto.com",
        subject,
        text: body,
      });
      return { success: !result.error, method: result.error ? `resend_error: ${result.error.message}` : "resend" };
    } catch (err: any) {
      return { success: false, method: `resend_error: ${err.message}` };
    }
  }

  console.log(`[OUTREACH] Would send to ${dealer.email}:\nSubject: ${subject}\n${body.slice(0, 200)}...`);
  return { success: true, method: "logged" };
}

// ═══ SEND ADF/XML TO DEALER CRM ═══
export async function sendADFToDealerCRM(dealer: {
  name: string; email?: string | null;
}, opts: {
  year: string; make: string; model: string; trim?: string;
  budget?: string; timeline?: string; clientId: string;
}): Promise<{ success: boolean; method: string }> {
  if (!dealer.email) return { success: false, method: "no_email" };

  const adfXml = generateADFXML(opts);

  if (resend) {
    try {
      const result = await resend.emails.send({
        from: "GoFetch Auto <inquiry@gofetchauto.com>",
        to: [dealer.email],
        replyTo: "inquiry@gofetchauto.com",
        subject: `ADF Lead — ${opts.year} ${opts.make} ${opts.model} — GoFetch Auto`,
        text: adfXml,
      });
      return { success: !result.error, method: "adf_resend" };
    } catch (err: any) {
      return { success: false, method: `adf_error: ${err.message}` };
    }
  }

  return { success: true, method: "logged" };
}

import { type DealerTimingProfile, isGoodTimeToSend, buildTimingProfile } from "./dealer-timing";

// ═══ FOLLOW-UP ESCALATION (Smart timing — learns dealer patterns) ═══
export async function sendFollowUp(dealer: {
  name: string; email?: string | null;
}, vehicle: string, daysSinceSent: number, clientId: string, context?: {
  totalDealersContacted?: number;
  responsesReceived?: number;
  timingProfile?: DealerTimingProfile;
}): Promise<{ sent: boolean; message: string }> {
  if (!dealer.email) return { sent: false, message: "No email" };

  // Never send between midnight and 7am
  const hour = new Date().getHours();
  if (hour < 7) return { sent: false, message: "Skipped — too early (before 7am)" };

  // Smart timing: check dealer's response patterns if available
  if (context?.timingProfile && !isGoodTimeToSend(context.timingProfile)) {
    return { sent: false, message: `Skipped — not optimal time for this dealer (best: ${context.timingProfile.bestHour}:00)` };
  }

  const dealerCount = context?.totalDealersContacted || 0;
  const responseCount = context?.responsesReceived || 0;

  let subject = "";
  let body = "";

  // 4A: Specific, data-driven follow-up messages
  if (daysSinceSent <= 1) {
    subject = `Following up — ${vehicle} — GoFetch Auto`;
    body = `Hi ${dealer.name} Internet Sales Team,

Following up on our inquiry for a ${vehicle} for our ready-to-purchase client.${dealerCount > 0 ? ` We're evaluating responses from ${dealerCount} dealers in your area.` : ""}

Our client is pre-qualified, funded, and looking to complete this purchase within 7 days. Do you have this vehicle in stock?

Please reply with your best OTD price, stock #, and VIN.

Thank you,
Ricardo Gamon
GoFetch Auto | (352) 410-5889
inquiry@gofetchauto.com`;
  } else if (daysSinceSent <= 2) {
    subject = `Last chance to bid — ${vehicle} — GoFetch Auto`;
    body = `Hi ${dealer.name},

${responseCount > 0
  ? `We've received ${responseCount} competitive offer${responseCount > 1 ? "s" : ""} for this ${vehicle}. We'd love to include ${dealer.name} in the final comparison.`
  : `We're making a decision on the ${vehicle} within 48 hours.`}

Last chance to submit your best OTD price. Our client is ready to move forward with the most competitive offer today.

GoFetch Auto represents 5-15 qualified buyers per month in Tampa Bay. Responsive dealers receive priority lead flow.

Ricardo Gamon
GoFetch Auto | (352) 410-5889`;
  } else {
    subject = `Inquiry closed — ${vehicle} — GoFetch Auto`;
    body = `Hi ${dealer.name},

We've selected a dealer for this ${vehicle} purchase.

For future GoFetch Auto inquiries — we send 5-15 qualified, ready-to-buy clients per month in Tampa Bay — please respond within 24 hours. Responsive dealers receive priority access to new leads before they're sent to the broader network.

Ricardo Gamon
GoFetch Auto | (352) 410-5889`;
  }

  if (resend) {
    try {
      await resend.emails.send({
        from: "GoFetch Auto <inquiry@gofetchauto.com>",
        to: [dealer.email],
        replyTo: "inquiry@gofetchauto.com",
        subject,
        text: body,
      });
    } catch (err: any) {
      return { sent: false, message: `Error: ${err.message}` };
    }
  }

  return { sent: true, message: `Follow-up ${daysSinceSent <= 1 ? "#1" : daysSinceSent <= 2 ? "#2 (final)" : "closing"} sent` };
}

// ═══ VOLUME STATS ═══
export function getVolumeStats(totalDeals: number): string {
  if (totalDeals > 100) return `GoFetch Auto has completed ${totalDeals} deals in Tampa Bay.`;
  if (totalDeals > 50) return `GoFetch Auto has completed ${totalDeals}+ deals.`;
  if (totalDeals > 10) return `GoFetch Auto is an active buyer representation service with ${totalDeals}+ completed deals.`;
  return "GoFetch Auto is a professional car buying advocacy service representing qualified buyers.";
}
