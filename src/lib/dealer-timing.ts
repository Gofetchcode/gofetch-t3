// GoFetch — Dealer Response Timing Intelligence
// Learns WHEN each dealer responds and optimizes send times accordingly.
// No hardcoded weekends/hours — data-driven per dealer.

// ═══ TYPES ═══

export interface DealerTimingProfile {
  dealershipId: string;
  // Response counts by hour (0-23) and day (0=Sun, 6=Sat)
  hourlyResponses: number[];   // length 24
  dailyResponses: number[];    // length 7
  totalResponses: number;
  avgResponseTimeMin: number;
  bestHour: number;            // hour with most responses
  bestDay: number;             // day with most responses
  worstHour: number;
  worstDay: number;
  isWeekendActive: boolean;    // do they respond on weekends?
  peakWindow: { start: number; end: number }; // best hours range
  confidence: "high" | "moderate" | "low" | "none";
}

// Industry defaults — used when we have no data for a dealer
const DEFAULT_PROFILE: Omit<DealerTimingProfile, "dealershipId"> = {
  hourlyResponses: [0,0,0,0,0,0,0,0,2,5,8,6,4,5,7,6,4,3,1,0,0,0,0,0],
  dailyResponses: [1,4,6,5,6,5,3], // Sun-Sat
  totalResponses: 0,
  avgResponseTimeMin: 180,
  bestHour: 10,
  bestDay: 2, // Tuesday
  worstHour: 3,
  worstDay: 0, // Sunday
  isWeekendActive: true,  // assume yes — most dealers work Saturday
  peakWindow: { start: 9, end: 16 },
  confidence: "none",
};

// ═══ BUILD TIMING PROFILE FROM RESPONSE DATA ═══

export function buildTimingProfile(
  dealershipId: string,
  responses: { respondedAt: Date | string | null; createdAt: Date | string; responseTime?: number | null }[]
): DealerTimingProfile {
  if (responses.length === 0) {
    return { dealershipId, ...DEFAULT_PROFILE };
  }

  const hourly = new Array(24).fill(0);
  const daily = new Array(7).fill(0);
  let totalResponseTime = 0;
  let responseCount = 0;

  for (const r of responses) {
    if (!r.respondedAt) continue;
    const dt = new Date(r.respondedAt);
    hourly[dt.getHours()]++;
    daily[dt.getDay()]++;
    responseCount++;

    if (r.responseTime) {
      totalResponseTime += r.responseTime;
    } else {
      totalResponseTime += Math.floor(
        (new Date(r.respondedAt).getTime() - new Date(r.createdAt).getTime()) / 60000
      );
    }
  }

  const bestHour = hourly.indexOf(Math.max(...hourly));
  const worstHour = hourly.indexOf(Math.min(...hourly));
  const bestDay = daily.indexOf(Math.max(...daily));
  const worstDay = daily.indexOf(Math.min(...daily));

  // Weekend activity: did they respond on Saturday or Sunday?
  const weekendResponses = daily[0] + daily[6];
  const isWeekendActive = weekendResponses > 0;

  // Peak window: find consecutive 4-hour block with most responses
  let peakStart = 9;
  let peakMax = 0;
  for (let h = 6; h <= 18; h++) {
    const windowSum = hourly[h] + hourly[h + 1] + (hourly[h + 2] || 0) + (hourly[h + 3] || 0);
    if (windowSum > peakMax) {
      peakMax = windowSum;
      peakStart = h;
    }
  }

  const confidence = responseCount >= 20 ? "high" :
    responseCount >= 10 ? "moderate" :
    responseCount >= 3 ? "low" : "none";

  return {
    dealershipId,
    hourlyResponses: hourly,
    dailyResponses: daily,
    totalResponses: responseCount,
    avgResponseTimeMin: responseCount > 0 ? Math.round(totalResponseTime / responseCount) : 180,
    bestHour,
    bestDay,
    worstHour,
    worstDay,
    isWeekendActive,
    peakWindow: { start: peakStart, end: Math.min(23, peakStart + 4) },
    confidence,
  };
}

// ═══ SHOULD WE SEND NOW? ═══
// Returns true if current time is a good time to contact this dealer

export function isGoodTimeToSend(profile: DealerTimingProfile): boolean {
  const now = new Date();
  const hour = now.getHours();
  const day = now.getDay();

  // Never send between midnight and 7am
  if (hour < 7) return false;

  // If we have data, use it
  if (profile.confidence !== "none") {
    // Check if this day of week gets responses
    if (profile.dailyResponses[day] === 0 && profile.totalResponses >= 10) {
      return false; // they never respond on this day
    }

    // Check if this hour gets responses
    if (profile.hourlyResponses[hour] === 0 && profile.totalResponses >= 20) {
      // No responses at this hour, but check if we're in the peak window
      if (hour < profile.peakWindow.start || hour > profile.peakWindow.end) {
        return false;
      }
    }

    return true;
  }

  // Fallback: industry defaults — 7am to 8pm any day
  return hour >= 7 && hour <= 20;
}

// ═══ GET OPTIMAL SEND TIME ═══
// Returns the next best time to send to this dealer

export function getOptimalSendTime(profile: DealerTimingProfile): { hour: number; day: number; label: string } {
  const now = new Date();
  const currentHour = now.getHours();
  const currentDay = now.getDay();

  if (profile.confidence === "none") {
    // Default: next business morning at 9am
    const nextHour = currentHour < 9 ? 9 : currentHour < 14 ? 14 : 9;
    const nextDay = nextHour === 9 && currentHour >= 9 ? (currentDay + 1) % 7 : currentDay;
    return {
      hour: nextHour,
      day: nextDay,
      label: `${["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][nextDay]} at ${nextHour > 12 ? nextHour - 12 : nextHour}${nextHour >= 12 ? "PM" : "AM"} (default)`,
    };
  }

  // Find next time slot with high response likelihood
  for (let offset = 0; offset < 48; offset++) {
    const checkHour = (currentHour + offset) % 24;
    const checkDay = (currentDay + Math.floor((currentHour + offset) / 24)) % 7;

    if (checkHour < 7 || checkHour > 20) continue;
    if (profile.dailyResponses[checkDay] === 0 && profile.totalResponses >= 10) continue;

    // Good enough — has responses at this hour or day
    if (profile.hourlyResponses[checkHour] > 0 || profile.confidence === "low") {
      const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
      const ampm = checkHour >= 12 ? "PM" : "AM";
      const displayHour = checkHour > 12 ? checkHour - 12 : checkHour === 0 ? 12 : checkHour;
      return {
        hour: checkHour,
        day: checkDay,
        label: `${dayNames[checkDay]} at ${displayHour}${ampm} (${profile.confidence} confidence)`,
      };
    }
  }

  // Fallback
  return { hour: profile.bestHour, day: profile.bestDay, label: `Best historical: ${profile.bestHour}:00` };
}

// ═══ GENERATE TIMING INSIGHT ═══
// Human-readable insight about a dealer's response pattern

export function getTimingInsight(profile: DealerTimingProfile): string {
  if (profile.confidence === "none") {
    return "No response data yet — using industry defaults.";
  }

  const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const bestDayName = dayNames[profile.bestDay];
  const ampm = profile.bestHour >= 12 ? "PM" : "AM";
  const displayHour = profile.bestHour > 12 ? profile.bestHour - 12 : profile.bestHour;

  const parts: string[] = [];
  parts.push(`Most responsive: ${bestDayName}s around ${displayHour}${ampm}`);
  parts.push(`Avg response: ${profile.avgResponseTimeMin < 60 ? `${profile.avgResponseTimeMin}min` : `${Math.round(profile.avgResponseTimeMin / 60)}hr`}`);

  if (profile.isWeekendActive) {
    parts.push("Active on weekends");
  } else {
    parts.push("Weekday-only responder");
  }

  return parts.join(" | ");
}
