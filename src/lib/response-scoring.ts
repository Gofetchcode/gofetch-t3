// GoFetch Secret Weapon — Response Scoring, Price Intelligence & Competitive Intel

// ═══ RESPONSE SCORING ═══
// Ranks dealer responses by value to the client. Higher = better deal.

export interface ScoredResponse {
  id: string;
  dealershipId: string;
  dealerName: string;
  score: number;          // 0-100 composite score
  rank: number;
  otdPrice: number;
  vin?: string;
  stockNumber?: string;
  responseTimeMin: number;
  distanceMiles?: number;
  dealerResponseRate?: number;
  isPreferred: boolean;
  priceVsAvg: number;     // negative = below avg (good), positive = above
  savingsVsBest: number;
  flags: string[];        // e.g., "BEST_PRICE", "FASTEST_RESPONSE", "PREFERRED"
}

// Configurable weights (defaults — can be overridden from Settings)
export interface ScoringWeights {
  price: number;      // default 35
  responseTime: number; // default 15
  reliability: number;  // default 25
  preferred: number;    // default 15
  distance: number;     // default 10
}

export const DEFAULT_WEIGHTS: ScoringWeights = {
  price: 35,
  responseTime: 15,
  reliability: 25,
  preferred: 15,
  distance: 10,
};

export function scoreResponse(response: {
  otdPrice?: string | null;
  responseTime?: number | null;
  respondedAt?: Date | string | null;
  createdAt: Date | string;
  dealership?: {
    responseRate?: number | null;
    avgResponseTime?: number | null;
    isPreferred?: boolean;
    preferredTier?: string | null;
    latitude?: number | null;
    longitude?: number | null;
    city?: string | null;
  } | null;
}, context: {
  avgPrice: number;
  bestPrice: number;
  maxPrice?: number;
  clientLat?: number;
  clientLng?: number;
  weights?: ScoringWeights;
}): { score: number; flags: string[]; reliabilityScore: number; priceScore: number } {
  const w = context.weights || DEFAULT_WEIGHTS;
  let priceScore = 0;
  let reliabilityScore = 0;
  let timeScore = 0;
  let preferredScore = 0;
  const flags: string[] = [];
  const price = parseFloat((response.otdPrice || "0").replace(/[^0-9.]/g, ""));

  // Price score (0-w.price points) — lower is better
  if (price > 0 && context.avgPrice > 0) {
    const pricePct = price / context.avgPrice;
    if (pricePct <= 0.90) { priceScore = w.price; flags.push("BEST_PRICE"); }
    else if (pricePct <= 0.95) priceScore = w.price * 0.85;
    else if (pricePct <= 1.00) priceScore = w.price * 0.65;
    else if (pricePct <= 1.05) priceScore = w.price * 0.4;
    else priceScore = w.price * 0.1;

    // Bonus: under max budget
    if (context.maxPrice && price <= context.maxPrice) {
      priceScore = Math.min(w.price, priceScore + 3);
      flags.push("UNDER_BUDGET");
    }
  }

  // Response time score (0-w.responseTime points) — faster is better
  const responseMin = response.responseTime ||
    (response.respondedAt ? Math.floor((new Date(response.respondedAt).getTime() - new Date(response.createdAt).getTime()) / 60000) : 9999);

  if (responseMin <= 15) { timeScore = w.responseTime; flags.push("FASTEST_RESPONSE"); }
  else if (responseMin <= 30) timeScore = w.responseTime * 0.8;
  else if (responseMin <= 60) timeScore = w.responseTime * 0.6;
  else if (responseMin <= 120) timeScore = w.responseTime * 0.4;
  else if (responseMin <= 1440) timeScore = w.responseTime * 0.2;
  else timeScore = w.responseTime * 0.05;

  // Dealer reliability (0-w.reliability points) — #1A: increased weight
  const rr = response.dealership?.responseRate ?? 0;
  if (rr >= 0.9) reliabilityScore = w.reliability;
  else if (rr >= 0.75) reliabilityScore = w.reliability * 0.8;
  else if (rr >= 0.5) reliabilityScore = w.reliability * 0.5;
  else if (rr >= 0.3) reliabilityScore = w.reliability * 0.3;

  // Preferred dealer bonus (0-w.preferred points)
  if (response.dealership?.isPreferred) {
    const tier = response.dealership.preferredTier;
    if (tier === "platinum") { preferredScore = w.preferred; flags.push("PLATINUM_PARTNER"); }
    else if (tier === "gold") { preferredScore = w.preferred * 0.8; flags.push("GOLD_PARTNER"); }
    else { preferredScore = w.preferred * 0.5; flags.push("PREFERRED"); }
  }

  const totalScore = Math.min(100, Math.round(priceScore + timeScore + reliabilityScore + preferredScore));

  // #1D: BEST_VALUE flag — combines price + reliability (not just cheapest)
  const valueScore = priceScore + reliabilityScore;
  if (valueScore >= (w.price + w.reliability) * 0.75 && price > 0) {
    flags.push("BEST_VALUE");
  }

  return { score: totalScore, flags, reliabilityScore: Math.round(reliabilityScore), priceScore: Math.round(priceScore) };
}

export function rankResponses(
  responses: any[],
  context: { maxPrice?: number; avgPrice?: number; weights?: ScoringWeights }
): ScoredResponse[] {
  const prices = responses
    .map(r => parseFloat((r.otdPrice || "0").replace(/[^0-9.]/g, "")))
    .filter(p => p > 0);

  const avgPrice = context.avgPrice || (prices.length > 0 ? prices.reduce((a, b) => a + b, 0) / prices.length : 0);
  const bestPrice = prices.length > 0 ? Math.min(...prices) : 0;

  const scored = responses.map(r => {
    const price = parseFloat((r.otdPrice || "0").replace(/[^0-9.]/g, ""));
    const { score, flags } = scoreResponse(r, { avgPrice, bestPrice, maxPrice: context.maxPrice, weights: context.weights });
    const responseMin = r.responseTime ||
      (r.respondedAt ? Math.floor((new Date(r.respondedAt).getTime() - new Date(r.createdAt).getTime()) / 60000) : 9999);

    return {
      id: r.id,
      dealershipId: r.dealershipId,
      dealerName: r.dealership?.name || "Unknown",
      score,
      rank: 0,
      otdPrice: price,
      vin: r.vin || undefined,
      stockNumber: r.stockNumber || undefined,
      responseTimeMin: responseMin,
      distanceMiles: undefined,
      dealerResponseRate: r.dealership?.responseRate ?? undefined,
      isPreferred: r.dealership?.isPreferred ?? false,
      priceVsAvg: avgPrice > 0 ? price - avgPrice : 0,
      savingsVsBest: price > 0 ? price - bestPrice : 0,
      flags,
    };
  });

  // Sort by score desc, then price asc
  scored.sort((a, b) => b.score - a.score || a.otdPrice - b.otdPrice);
  scored.forEach((s, i) => s.rank = i + 1);

  // Add rank-based flags
  if (scored.length > 0 && scored[0].otdPrice > 0) {
    if (!scored[0].flags.includes("BEST_PRICE")) scored[0].flags.push("TOP_RANKED");
  }

  return scored;
}

// ═══ PRICE DISCREPANCY / REGIONAL ARBITRAGE (#11) ═══

export interface PriceDiscrepancy {
  localPrice: number;
  remotePrice: number;
  savings: number;
  distanceMiles: number;
  driveTimeMin: number;
  dealerName: string;
  dealerCity: string;
  dealerState: string;
  worthTrip: boolean;
  recommendation: string;
}

export function findPriceDiscrepancies(
  responses: ScoredResponse[],
  dealerDetails: { id: string; city?: string; state?: string; distanceMiles?: number }[],
  thresholdSavings: number = 1500,
  thresholdMiles: number = 100
): PriceDiscrepancy[] {
  const localResponses = responses.filter(r => {
    const detail = dealerDetails.find(d => d.id === r.dealershipId);
    return detail && (detail.distanceMiles ?? 0) <= 50;
  });

  const remoteResponses = responses.filter(r => {
    const detail = dealerDetails.find(d => d.id === r.dealershipId);
    return detail && (detail.distanceMiles ?? 0) > 50;
  });

  if (localResponses.length === 0 || remoteResponses.length === 0) return [];

  const bestLocalPrice = Math.min(...localResponses.filter(r => r.otdPrice > 0).map(r => r.otdPrice));
  const discrepancies: PriceDiscrepancy[] = [];

  for (const remote of remoteResponses) {
    if (remote.otdPrice <= 0) continue;
    const detail = dealerDetails.find(d => d.id === remote.dealershipId);
    if (!detail) continue;

    const savings = bestLocalPrice - remote.otdPrice;
    const distance = detail.distanceMiles ?? 0;
    const driveTime = Math.round(distance * 1.2); // rough estimate: 1.2 min/mile

    if (savings >= thresholdSavings && distance >= thresholdMiles) {
      const savingsPerMile = savings / distance;
      const worthTrip = savingsPerMile >= 10; // $10+ savings per mile driven

      discrepancies.push({
        localPrice: bestLocalPrice,
        remotePrice: remote.otdPrice,
        savings,
        distanceMiles: distance,
        driveTimeMin: driveTime,
        dealerName: remote.dealerName,
        dealerCity: detail.city || "",
        dealerState: detail.state || "",
        worthTrip,
        recommendation: worthTrip
          ? `This dealer in ${detail.city} has the same vehicle for $${savings.toLocaleString()} less — worth the ${Math.round(driveTime / 60)}-hour drive.`
          : `$${savings.toLocaleString()} savings but ${distance} miles away — marginal.`,
      });
    }
  }

  return discrepancies.sort((a, b) => b.savings - a.savings);
}

// ═══ COMPETITIVE INTEL / ANONYMIZED BENCHMARKS (#13) ═══

export interface VehicleBenchmark {
  vehicle: string;
  avgOTD: number;
  medianOTD: number;
  p25OTD: number;  // 25th percentile (cheaper deals)
  p75OTD: number;  // 75th percentile (pricier deals)
  totalDeals: number;
  region: string;
  currentPricePosition: string;
  recommendation: string;
}

export function calculateBenchmark(
  currentPrice: number,
  allPrices: number[],
  vehicle: string,
  region: string = "Tampa Bay"
): VehicleBenchmark {
  if (allPrices.length === 0) {
    return {
      vehicle, avgOTD: 0, medianOTD: 0, p25OTD: 0, p75OTD: 0,
      totalDeals: 0, region,
      currentPricePosition: "No data",
      recommendation: "Not enough deal data to benchmark.",
    };
  }

  const sorted = [...allPrices].sort((a, b) => a - b);
  const avg = sorted.reduce((a, b) => a + b, 0) / sorted.length;
  const median = sorted[Math.floor(sorted.length / 2)];
  const p25 = sorted[Math.floor(sorted.length * 0.25)];
  const p75 = sorted[Math.floor(sorted.length * 0.75)];

  let position: string;
  let recommendation: string;

  const pctVsAvg = ((currentPrice - avg) / avg) * 100;

  if (currentPrice <= p25) {
    position = "Excellent — Bottom 25%";
    recommendation = `You're negotiating $${Math.round(avg - currentPrice).toLocaleString()} below the average GoFetch deal for this vehicle. Lock it in.`;
  } else if (currentPrice <= median) {
    position = "Good — Below Median";
    recommendation = `You're below the median price. ${Math.round(pctVsAvg * -1)}% below average across ${sorted.length} deals.`;
  } else if (currentPrice <= p75) {
    position = "Fair — Above Median";
    recommendation = `${Math.round(pctVsAvg)}% above average. ${sorted.length > 5 ? `${Math.round((sorted.length * 0.75))} of ${sorted.length}` : "Most"} GoFetch deals for this vehicle close lower.`;
  } else {
    position = "High — Top 25%";
    recommendation = `You're paying more than 75% of GoFetch deals for this vehicle in ${region}. Push back — the data supports a lower price.`;
  }

  return {
    vehicle, avgOTD: Math.round(avg), medianOTD: Math.round(median),
    p25OTD: Math.round(p25), p75OTD: Math.round(p75),
    totalDeals: sorted.length, region,
    currentPricePosition: position, recommendation,
  };
}

export function generateCompetitiveInsight(
  vehicle: string,
  currentPrice: number,
  benchmarkData: { avgOTD: number; p25OTD: number; p75OTD: number; totalDeals: number; region: string }
): string {
  // #13A: Always show sample size and confidence level
  if (benchmarkData.totalDeals < 3) {
    return `Limited data (${benchmarkData.totalDeals} deal${benchmarkData.totalDeals !== 1 ? "s" : ""}) — building intelligence for this vehicle. Treat estimates with caution.`;
  }

  const confidence = benchmarkData.totalDeals >= 20 ? "high confidence" :
    benchmarkData.totalDeals >= 10 ? "moderate confidence" : "limited data";
  const diff = currentPrice - benchmarkData.avgOTD;
  const absDiff = Math.abs(diff);
  const dataContext = `Based on ${benchmarkData.totalDeals} GoFetch deals in ${benchmarkData.region} (${confidence}).`;

  if (diff < -1000) {
    return `You're negotiating $${absDiff.toLocaleString()} below the average GoFetch deal for this vehicle. Strong position. ${dataContext}`;
  } else if (diff < 0) {
    return `$${absDiff.toLocaleString()} below average. ${Math.round((1 - (currentPrice - benchmarkData.p25OTD) / (benchmarkData.p75OTD - benchmarkData.p25OTD)) * 100)}% of buyers pay more. ${dataContext}`;
  } else if (diff < 500) {
    return `Within $${absDiff.toLocaleString()} of average. ${Math.round(benchmarkData.totalDeals * 0.5)} of ${benchmarkData.totalDeals} deals close between $${benchmarkData.p25OTD.toLocaleString()}-$${benchmarkData.p75OTD.toLocaleString()}. ${dataContext}`;
  } else {
    return `$${absDiff.toLocaleString()} above average. Counter-offer recommended — the data supports a lower price. ${dataContext}`;
  }
}
