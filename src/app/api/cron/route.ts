import { db } from "@/lib/db";
import { calculateLeadScore, AI_TEMPLATES, isQuietHours, canSendMessage } from "@/lib/ai-engine";

// Vercel Cron Job — runs every 5 minutes
// Handles: escalation ladder, lead scoring, auto-text, stale deal alerts
export async function GET(req: Request) {
  // Verify cron secret
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const now = Date.now();
    const results = { scored: 0, escalated: 0, autoTexted: 0, reassigned: 0 };

    // Get all active leads
    const activeLeads = await db.customer.findMany({
      where: { step: { lt: 8 } },
      include: { documents: true, messages: { orderBy: { createdAt: "desc" }, take: 5 }, aiAlerts: { orderBy: { createdAt: "desc" }, take: 3 } },
    });

    for (const lead of activeLeads) {
      // 1. Recalculate lead score
      const newScore = calculateLeadScore(lead);
      if (newScore !== lead.leadScore) {
        await db.customer.update({ where: { id: lead.id }, data: { leadScore: newScore } });
        results.scored++;
      }

      // 2. Check response time — escalation ladder
      const lastAgentMsg = lead.messages.find(m => m.sender === "agent" || m.sender === "system");
      const lastCustomerMsg = lead.messages.find(m => m.sender === "customer");
      const leadAge = now - new Date(lead.createdAt).getTime();
      const minutesSinceCreation = leadAge / 60000;

      // Only escalate if no agent has responded
      const agentResponded = lead.messages.some(m => m.sender === "agent");

      if (!agentResponded && !isQuietHours()) {
        // Check how many auto-texts sent today
        const todayAlerts = lead.aiAlerts.filter(a =>
          a.autoTextSent && new Date(a.createdAt).toDateString() === new Date().toDateString()
        ).length;

        // T+4hr: AI auto-text to customer
        if (minutesSinceCreation >= 240 && todayAlerts === 0 && canSendMessage(todayAlerts)) {
          const vehicle = lead.vehicleSpecific || lead.vehicleType || "vehicle";
          const autoText = AI_TEMPLATES.welcome(lead.firstName, vehicle);

          await db.message.create({
            data: { customerId: lead.id, sender: "system", content: autoText },
          });

          await db.aIAlert.create({
            data: {
              customerId: lead.id,
              type: "ai_auto_text",
              message: `AI auto-text sent: ${autoText.slice(0, 80)}...`,
              triggered: true,
              triggeredAt: new Date(),
              autoTextSent: true,
            },
          });

          results.autoTexted++;
        }

        // T+15min: escalation alert
        if (minutesSinceCreation >= 15 && minutesSinceCreation < 30) {
          const existing = lead.aiAlerts.find(a => a.type === "no_response_15m");
          if (!existing) {
            await db.aIAlert.create({
              data: { customerId: lead.id, type: "no_response_15m", message: `Lead ${lead.firstName} ${lead.lastName} waiting 15+ min for response`, triggered: true, triggeredAt: new Date() },
            });
            results.escalated++;
          }
        }

        // T+1hr: SMS alert escalation
        if (minutesSinceCreation >= 60 && minutesSinceCreation < 120) {
          const existing = lead.aiAlerts.find(a => a.type === "no_response_1h");
          if (!existing) {
            await db.aIAlert.create({
              data: { customerId: lead.id, type: "no_response_1h", message: `URGENT: Lead ${lead.firstName} ${lead.lastName} waiting 1+ hour`, triggered: true, triggeredAt: new Date() },
            });
            results.escalated++;
          }
        }

        // T+24hr: flag as unresponsive
        if (minutesSinceCreation >= 1440) {
          const existing = lead.aiAlerts.find(a => a.type === "no_response_24h");
          if (!existing) {
            await db.aIAlert.create({
              data: { customerId: lead.id, type: "no_response_24h", message: `⚠️ UNRESPONSIVE: Lead ${lead.firstName} ${lead.lastName} — 24hrs no activity`, triggered: true, triggeredAt: new Date() },
            });
            results.escalated++;
          }
        }

        // T+48hr: auto-reassign (log it, actual reassignment needs advocate pool)
        if (minutesSinceCreation >= 2880) {
          const existing = lead.aiAlerts.find(a => a.type === "reassigned");
          if (!existing) {
            await db.aIAlert.create({
              data: { customerId: lead.id, type: "reassigned", message: `Lead ${lead.firstName} ${lead.lastName} auto-flagged for reassignment — 48hrs inactivity`, triggered: true, triggeredAt: new Date() },
            });
            results.reassigned++;
          }
        }
      }

      // 3. Smart follow-up: client hasn't logged in 7+ days
      if (lastCustomerMsg) {
        const daysSinceReply = (now - new Date(lastCustomerMsg.createdAt).getTime()) / 86400000;
        if (daysSinceReply > 7 && !isQuietHours()) {
          const todayFollowUps = lead.aiAlerts.filter(a =>
            a.type === "stale_followup" && new Date(a.createdAt).toDateString() === new Date().toDateString()
          ).length;

          if (todayFollowUps === 0) {
            const vehicle = lead.vehicleSpecific || lead.vehicleType || "vehicle";
            await db.message.create({
              data: { customerId: lead.id, sender: "system", content: AI_TEMPLATES.followUp(lead.firstName, vehicle) },
            });
            await db.aIAlert.create({
              data: { customerId: lead.id, type: "stale_followup", message: `AI follow-up sent — no activity in ${Math.floor(daysSinceReply)} days`, triggered: true, triggeredAt: new Date(), autoTextSent: true },
            });
          }
        }
      }
    }

    // ═══ #4 — AUTO FOLLOW-UPS FOR OUTREACH CAMPAIGNS ═══
    const followUpResults = { followUpsSent: 0, campaignsChecked: 0 };

    try {
      const { sendFollowUp } = await import("@/lib/outreach-sender");
      const { buildTimingProfile } = await import("@/lib/dealer-timing");

      // Find active campaigns with pending responses
      const activeCampaigns = await db.outreachCampaign.findMany({
        where: { status: "active" },
        include: {
          responses: {
            where: { status: "pending" },
            include: { dealership: true },
          },
        },
      });

      for (const campaign of activeCampaigns) {
        followUpResults.campaignsChecked++;
        const daysSinceSent = Math.floor(
          (Date.now() - new Date(campaign.sentAt).getTime()) / 86400000
        );

        // Follow-up schedule: Day 1, Day 2, Day 3+
        if (daysSinceSent >= 1 && daysSinceSent <= 3) {
          for (const resp of campaign.responses) {
            if (!resp.dealership?.email) continue;

            // Don't send if we already followed up today
            const lastNote = resp.notes || "";
            const todayStr = new Date().toISOString().split("T")[0];
            if (lastNote.includes(todayStr)) continue;

            // Build timing profile from dealer's past responses
            const dealerResponses = await db.outreachResponse.findMany({
              where: { dealershipId: resp.dealershipId, respondedAt: { not: null } },
              select: { respondedAt: true, createdAt: true, responseTime: true },
              take: 50,
              orderBy: { createdAt: "desc" },
            });
            const timingProfile = buildTimingProfile(resp.dealershipId, dealerResponses);

            const result = await sendFollowUp(
              resp.dealership,
              campaign.vehicleDesc || "Vehicle",
              daysSinceSent,
              campaign.customerId,
              {
                totalDealersContacted: campaign.dealersSent,
                responsesReceived: campaign.dealersResponded,
                timingProfile,
              }
            );

            if (result.sent) {
              await db.outreachResponse.update({
                where: { id: resp.id },
                data: {
                  notes: `${lastNote}\nAuto follow-up #${daysSinceSent} sent ${todayStr}`.trim(),
                },
              });
              followUpResults.followUpsSent++;
            }
          }
        }

        // Close campaign if 3+ days old and no more pending
        if (daysSinceSent > 3) {
          const stillPending = campaign.responses.filter(r => r.status === "pending").length;
          if (stillPending > 0) {
            // Mark remaining as no_response
            await db.outreachResponse.updateMany({
              where: { campaignId: campaign.id, status: "pending" },
              data: { status: "no_response" },
            });
          }
          await db.outreachCampaign.update({
            where: { id: campaign.id },
            data: { status: "completed" },
          });
        }
      }
    } catch (followUpErr: any) {
      console.error("[Cron] Follow-up error:", followUpErr.message);
    }

    // Log to AILearning
    await db.aILearning.create({
      data: {
        category: "cron_run",
        dataPoint: JSON.stringify({ timestamp: new Date().toISOString(), activeLeads: activeLeads.length }),
        outcome: JSON.stringify({ ...results, ...followUpResults }),
      },
    });

    return Response.json({ success: true, ...results, ...followUpResults, checked: activeLeads.length });
  } catch (err: any) {
    console.error("Cron error:", err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}
