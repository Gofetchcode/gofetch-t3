// ADF/XML Lead Generator for Dealer CRM Injection
export function generateADFXML(opts: {
  year: string;
  make: string;
  model: string;
  trim?: string;
  budget?: string;
  timeline?: string;
  clientId: string;
  notes?: string;
}): string {
  const now = new Date().toISOString();
  return `<?ADF VERSION="1.0"?>
<?XML VERSION="1.0"?>
<adf>
  <prospect>
    <requestdate>${now}</requestdate>
    <vehicle interest="buy" status="new">
      <year>${opts.year}</year>
      <make>${opts.make}</make>
      <model>${opts.model}</model>
      ${opts.trim ? `<trim>${opts.trim}</trim>` : ""}
    </vehicle>
    <customer>
      <contact>
        <name part="first">GoFetch Auto</name>
        <name part="last">- Buyer Advocate</name>
        <email>deals+${opts.clientId}@gofetchauto.com</email>
        <phone type="voice">3524105889</phone>
      </contact>
      <comments>Professional car buying advocate representing a qualified, ready-to-purchase client. ${opts.budget ? `Budget: ${opts.budget} OTD.` : ""} ${opts.timeline ? `Timeline: ${opts.timeline}.` : ""} Please respond with best OTD price, stock #, and VIN. We are contacting multiple dealers simultaneously. ${opts.notes || ""}</comments>
    </customer>
    <vendor>
      <contact>
        <name part="full">GoFetch Auto LLC</name>
        <email>inquiry@gofetchauto.com</email>
        <phone>3524105889</phone>
        <url>https://gofetchauto.com</url>
      </contact>
    </vendor>
  </prospect>
</adf>`;
}

// Calculate dealer GoFetch Score
export function calculateDealerScore(dealer: {
  responseRate?: number | null;
  avgResponseTime?: number | null;
  isPreferred?: boolean;
}): number {
  let score = 50;
  if (dealer.responseRate) score += dealer.responseRate * 0.3;
  if (dealer.avgResponseTime) {
    if (dealer.avgResponseTime <= 30) score += 20;
    else if (dealer.avgResponseTime <= 60) score += 10;
    else if (dealer.avgResponseTime <= 120) score += 5;
  }
  if (dealer.isPreferred) score += 15;
  return Math.min(Math.round(score), 100);
}

// Generate outreach email
export function generateOutreachEmail(opts: {
  dealerName: string;
  vehicle: string;
  color?: string;
  features?: string;
  budget?: string;
  timeline?: string;
}): { subject: string; body: string } {
  return {
    subject: `Vehicle Inquiry — ${opts.vehicle} — GoFetch Auto`,
    body: `Hi ${opts.dealerName} Internet Sales Team,

My name is Ricardo Gamon and I represent GoFetch Auto, a professional car buying advocacy service. I am actively sourcing a vehicle for a qualified, ready-to-purchase client.

Vehicle Requested:
• ${opts.vehicle}
${opts.color ? `• Color preference: ${opts.color}` : ""}
${opts.features ? `• Features: ${opts.features}` : ""}
${opts.budget ? `• Client budget: ${opts.budget} OTD (negotiable)` : ""}
${opts.timeline ? `• Timeline: ${opts.timeline}` : "• Timeline: Ready to purchase within 7 days"}

If you have this vehicle in stock or incoming, please reply with:
1. Stock number and VIN
2. Your best out-the-door price
3. Any current incentives or dealer specials
4. Vehicle availability date

We work with multiple dealerships simultaneously and will move forward with the most competitive offer. Our client is pre-qualified and ready to complete the purchase this week.

Thank you,
Ricardo Gamon
GoFetch Auto | (352) 410-5889
inquiry@gofetchauto.com | gofetchauto.com
Florida Licensed Automotive Advocate`,
  };
}
