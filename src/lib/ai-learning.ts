import { PrismaClient } from "@prisma/client";

// ═══ LOOP 1: LEAD SCORING RETRAIN ═══
// Analyzes which leads actually converted, adjusts weights
export async function retrainLeadScoring(db: PrismaClient) {
  const closed = await db.customer.findMany({ where: { step: 8 }, select: { budget: true, timeline: true, vehicleType: true, source: true, contractSigned: true, leadScore: true } });
  const lost = await db.customer.findMany({ where: { step: { lt: 3 }, createdAt: { lt: new Date(Date.now() - 60 * 86400000) } }, select: { budget: true, timeline: true, vehicleType: true, source: true, leadScore: true } });

  // Calculate which factors correlate with closing
  const insights: Record<string, { closedCount: number; lostCount: number; weight: number }> = {};

  const track = (key: string, val: string | null | undefined, isClose: boolean) => {
    const k = `${key}:${val || "unknown"}`;
    if (!insights[k]) insights[k] = { closedCount: 0, lostCount: 0, weight: 0 };
    if (isClose) insights[k].closedCount++; else insights[k].lostCount++;
  };

  for (const c of closed) { track("source", c.source, true); track("timeline", c.timeline, true); track("vehicleType", c.vehicleType, true); }
  for (const c of lost) { track("source", c.source, false); track("timeline", c.timeline, false); track("vehicleType", c.vehicleType, false); }

  // Calculate conversion-based weights
  for (const [key, data] of Object.entries(insights)) {
    const total = data.closedCount + data.lostCount;
    if (total > 0) data.weight = Math.round((data.closedCount / total) * 100);
  }

  // Store as new model version
  const version = await db.aIModelVersion.count({ where: { category: "lead_scoring" } }) + 1;
  await db.aIModelVersion.create({
    data: { category: "lead_scoring", version: String(version), weights: insights, accuracy: closed.length > 0 ? (closed.length / (closed.length + lost.length)) * 100 : null, dataPoints: closed.length + lost.length },
  });

  return { version, insights, closedCount: closed.length, lostCount: lost.length };
}

// ═══ LOOP 2: CONTACT TIMING OPTIMIZATION ═══
export async function analyzeContactTiming(db: PrismaClient) {
  const messages = await db.message.findMany({
    where: { sender: { in: ["agent", "system"] } },
    select: { createdAt: true, customerId: true },
  });

  const responses = await db.message.findMany({
    where: { sender: "customer" },
    select: { createdAt: true, customerId: true },
  });

  // Track which outreach times get fastest responses
  const timingData: Record<string, { sent: number; replied: number; avgResponseMin: number }> = {};

  for (const msg of messages) {
    const hour = new Date(msg.createdAt).getHours();
    const day = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][new Date(msg.createdAt).getDay()];
    const key = `${day}_${hour}`;

    if (!timingData[key]) timingData[key] = { sent: 0, replied: 0, avgResponseMin: 0 };
    timingData[key].sent++;

    // Find if customer replied within 4 hours
    const reply = responses.find(r => r.customerId === msg.customerId && new Date(r.createdAt).getTime() > new Date(msg.createdAt).getTime() && new Date(r.createdAt).getTime() - new Date(msg.createdAt).getTime() < 4 * 3600000);
    if (reply) {
      timingData[key].replied++;
      const responseMin = Math.round((new Date(reply.createdAt).getTime() - new Date(msg.createdAt).getTime()) / 60000);
      timingData[key].avgResponseMin = Math.round((timingData[key].avgResponseMin * (timingData[key].replied - 1) + responseMin) / timingData[key].replied);
    }
  }

  // Find best timing slots
  const ranked = Object.entries(timingData)
    .filter(([_, d]) => d.sent >= 3)
    .map(([slot, d]) => ({ slot, responseRate: d.sent > 0 ? Math.round((d.replied / d.sent) * 100) : 0, avgResponseMin: d.avgResponseMin }))
    .sort((a, b) => b.responseRate - a.responseRate);

  await db.aILearning.create({
    data: { category: "contact_timing", dataPoint: JSON.stringify(timingData), outcome: JSON.stringify(ranked.slice(0, 10)) },
  });

  return { bestSlots: ranked.slice(0, 5), totalAnalyzed: messages.length };
}

// ═══ LOOP 3: MESSAGE EFFECTIVENESS ═══
export async function analyzeMessageEffectiveness(db: PrismaClient) {
  const agentMessages = await db.message.findMany({
    where: { sender: { in: ["agent", "system"] } },
    select: { id: true, content: true, createdAt: true, customerId: true },
    orderBy: { createdAt: "desc" },
    take: 500,
  });

  const customerReplies = await db.message.findMany({
    where: { sender: "customer" },
    select: { createdAt: true, customerId: true },
  });

  const patterns: Record<string, { sent: number; gotReply: number }> = {
    "includes_price": { sent: 0, gotReply: 0 },
    "includes_name": { sent: 0, gotReply: 0 },
    "short_under_160": { sent: 0, gotReply: 0 },
    "long_over_300": { sent: 0, gotReply: 0 },
    "includes_question": { sent: 0, gotReply: 0 },
    "includes_emoji": { sent: 0, gotReply: 0 },
  };

  for (const msg of agentMessages) {
    const content = msg.content;
    const gotReply = customerReplies.some(r => r.customerId === msg.customerId && new Date(r.createdAt).getTime() > new Date(msg.createdAt).getTime() && new Date(r.createdAt).getTime() - new Date(msg.createdAt).getTime() < 24 * 3600000);

    if (/\$\d/.test(content)) { patterns.includes_price.sent++; if (gotReply) patterns.includes_price.gotReply++; }
    if (content.length < 160) { patterns.short_under_160.sent++; if (gotReply) patterns.short_under_160.gotReply++; }
    if (content.length > 300) { patterns.long_over_300.sent++; if (gotReply) patterns.long_over_300.gotReply++; }
    if (/\?/.test(content)) { patterns.includes_question.sent++; if (gotReply) patterns.includes_question.gotReply++; }
    if (/[😊🎉👋✅🚗💰]/.test(content)) { patterns.includes_emoji.sent++; if (gotReply) patterns.includes_emoji.gotReply++; }
  }

  const insights = Object.entries(patterns)
    .filter(([_, d]) => d.sent >= 5)
    .map(([pattern, d]) => ({ pattern, responseRate: Math.round((d.gotReply / d.sent) * 100), sampleSize: d.sent }))
    .sort((a, b) => b.responseRate - a.responseRate);

  await db.aILearning.create({
    data: { category: "message_effectiveness", dataPoint: JSON.stringify(patterns), outcome: JSON.stringify(insights) },
  });

  return insights;
}

// ═══ LOOP 4: OFFER PRICING OPTIMIZATION ═══
export async function analyzeOfferPricing(db: PrismaClient) {
  const offers = await db.deskingOffer.findMany({
    where: { status: { in: ["accepted", "rejected"] } },
    select: { msrp: true, negotiatedPrice: true, otdPrice: true, status: true, vehicleDesc: true },
  });

  if (offers.length < 5) return { message: "Not enough data yet", offersAnalyzed: offers.length };

  let acceptedAvgDiscount = 0;
  let rejectedAvgDiscount = 0;
  let acceptedCount = 0;
  let rejectedCount = 0;

  for (const o of offers) {
    const msrp = parseFloat((o.msrp || "0").replace(/\D/g, ""));
    const negotiated = parseFloat((o.negotiatedPrice || "0").replace(/\D/g, ""));
    if (msrp <= 0 || negotiated <= 0) continue;
    const discount = Math.round(((msrp - negotiated) / msrp) * 100);
    if (o.status === "accepted") { acceptedAvgDiscount += discount; acceptedCount++; }
    else { rejectedAvgDiscount += discount; rejectedCount++; }
  }

  const result = {
    acceptedAvgDiscount: acceptedCount > 0 ? Math.round(acceptedAvgDiscount / acceptedCount) : 0,
    rejectedAvgDiscount: rejectedCount > 0 ? Math.round(rejectedAvgDiscount / rejectedCount) : 0,
    sweetSpot: acceptedCount > 0 ? `${Math.round(acceptedAvgDiscount / acceptedCount) - 2}%-${Math.round(acceptedAvgDiscount / acceptedCount) + 2}% below MSRP` : "Need more data",
    totalOffers: offers.length,
    acceptanceRate: Math.round((acceptedCount / offers.length) * 100),
  };

  await db.aIModelVersion.create({
    data: { category: "offer_pricing", version: String(Date.now()), weights: result, accuracy: result.acceptanceRate, dataPoints: offers.length },
  });

  return result;
}

// ═══ LOOP 5: DEAL VELOCITY PREDICTION ═══
export async function analyzeDealVelocity(db: PrismaClient) {
  const delivered = await db.customer.findMany({
    where: { step: 8 },
    select: { createdAt: true, updatedAt: true, vehicleType: true, isFleet: true, budget: true },
  });

  if (delivered.length < 3) return { message: "Not enough data", dealsAnalyzed: delivered.length };

  const velocities = delivered.map(d => ({
    days: Math.ceil((new Date(d.updatedAt).getTime() - new Date(d.createdAt).getTime()) / 86400000),
    type: d.vehicleType,
    isFleet: d.isFleet,
  }));

  const avgDays = Math.round(velocities.reduce((s, v) => s + v.days, 0) / velocities.length);
  const fleetAvg = velocities.filter(v => v.isFleet).length > 0 ? Math.round(velocities.filter(v => v.isFleet).reduce((s, v) => s + v.days, 0) / velocities.filter(v => v.isFleet).length) : null;
  const retailAvg = velocities.filter(v => !v.isFleet).length > 0 ? Math.round(velocities.filter(v => !v.isFleet).reduce((s, v) => s + v.days, 0) / velocities.filter(v => !v.isFleet).length) : null;

  const result = { avgDays, fleetAvg, retailAvg, dealsAnalyzed: delivered.length, fastest: Math.min(...velocities.map(v => v.days)), slowest: Math.max(...velocities.map(v => v.days)) };

  await db.aIModelVersion.create({
    data: { category: "deal_velocity", version: String(Date.now()), weights: result, accuracy: null, dataPoints: delivered.length },
  });

  return result;
}

// ═══ LOOP 6: DEALER INTELLIGENCE UPDATE ═══
export async function updateDealerIntelligence(db: PrismaClient) {
  const responses = await db.outreachResponse.findMany({
    include: { dealership: true },
  });

  const dealerStats: Record<string, { total: number; responded: number; totalResponseTime: number; prices: number[] }> = {};

  for (const r of responses) {
    const dId = r.dealershipId;
    if (!dealerStats[dId]) dealerStats[dId] = { total: 0, responded: 0, totalResponseTime: 0, prices: [] };
    dealerStats[dId].total++;
    if (r.status === "responded") {
      dealerStats[dId].responded++;
      if (r.responseTime) dealerStats[dId].totalResponseTime += r.responseTime;
      if (r.otdPrice) { const price = parseFloat(r.otdPrice.replace(/\D/g, "")); if (price > 0) dealerStats[dId].prices.push(price); }
    }
  }

  let updated = 0;
  for (const [dealerId, stats] of Object.entries(dealerStats)) {
    const responseRate = stats.total > 0 ? Math.round((stats.responded / stats.total) * 100) : 0;
    const avgResponseTime = stats.responded > 0 ? Math.round(stats.totalResponseTime / stats.responded) : null;

    await db.dealership.update({
      where: { id: dealerId },
      data: { responseRate, avgResponseTime },
    });
    updated++;
  }

  await db.aILearning.create({
    data: { category: "dealer_intelligence", dataPoint: JSON.stringify({ dealersAnalyzed: Object.keys(dealerStats).length }), outcome: JSON.stringify({ updated }) },
  });

  return { dealersAnalyzed: Object.keys(dealerStats).length, updated };
}

// ═══ LOOP 7: CO-PILOT FEEDBACK LOGGING ═══
export async function logCoPilotFeedback(db: PrismaClient, question: string, answer: string, feedback: "helpful" | "wrong" | "perfect") {
  await db.aILearning.create({
    data: {
      category: "copilot",
      dataPoint: JSON.stringify({ question, answer }),
      outcome: JSON.stringify({ feedback }),
      feedback,
      usedInModel: feedback === "perfect",
    },
  });
}

// ═══ MASTER RETRAIN (called by weekly cron) ═══
export async function masterRetrain(db: PrismaClient) {
  const results = {
    leadScoring: await retrainLeadScoring(db),
    contactTiming: await analyzeContactTiming(db),
    messageEffectiveness: await analyzeMessageEffectiveness(db),
    offerPricing: await analyzeOfferPricing(db),
    dealVelocity: await analyzeDealVelocity(db),
    dealerIntelligence: await updateDealerIntelligence(db),
  };

  await db.aILearning.create({
    data: { category: "master_retrain", dataPoint: JSON.stringify({ timestamp: new Date().toISOString() }), outcome: JSON.stringify(results) },
  });

  return results;
}
