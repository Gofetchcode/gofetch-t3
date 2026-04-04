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

// ═══ FOLLOW-UP ESCALATION ═══
export async function sendFollowUp(dealer: {
  name: string; email?: string | null;
}, vehicle: string, daysSinceSent: number, clientId: string): Promise<{ sent: boolean; message: string }> {
  if (!dealer.email) return { sent: false, message: "No email" };

  let subject = "";
  let body = "";

  if (daysSinceSent <= 1) {
    subject = `Following up — ${vehicle} — GoFetch Auto`;
    body = `Hi ${dealer.name} Internet Sales Team,\n\nFollowing up on our inquiry for a ${vehicle}. Our client is actively looking to purchase within 7 days. Do you have this vehicle in stock?\n\nPlease reply with your best OTD price, stock #, and VIN.\n\nThank you,\nRicardo Gamon\nGoFetch Auto | (352) 410-5889`;
  } else if (daysSinceSent <= 2) {
    subject = `Final follow-up — ${vehicle} — GoFetch Auto`;
    body = `Hi ${dealer.name},\n\nWe're making a decision on the ${vehicle} within 48 hours. If you have this vehicle available, please respond with your best price today.\n\nWe are working with multiple dealers and will proceed with the most competitive offer.\n\nRicardo Gamon\nGoFetch Auto`;
  } else {
    subject = `Closing inquiry — ${vehicle} — GoFetch Auto`;
    body = `Hi ${dealer.name},\n\nWe've completed this purchase with another dealer. For future GoFetch Auto inquiries, please respond within 24 hours.\n\nGoFetch Auto delivers 10+ qualified, ready-to-buy clients per month in Tampa Bay. Responsive dealers receive priority lead flow.\n\nRicardo Gamon\nGoFetch Auto`;
  }

  if (resend) {
    await resend.emails.send({
      from: "GoFetch Auto <inquiry@gofetchauto.com>",
      to: [dealer.email],
      replyTo: "inquiry@gofetchauto.com",
      subject,
      text: body,
    });
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
