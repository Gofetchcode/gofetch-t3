// Direct HTTP form submission to dealer websites
// No headless browser needed — sends POST requests directly

interface DealerForm {
  dealerId: string;
  dealerName: string;
  formUrl: string;        // The URL the form POSTs to
  method: "POST" | "GET";
  contentType: "form" | "json"; // application/x-www-form-urlencoded or application/json
  fieldMap: {
    firstName: string;    // field name for first name
    lastName: string;     // field name for last name
    email: string;        // field name for email
    phone: string;        // field name for phone
    comments: string;     // field name for comments/message
    [key: string]: string; // any extra fields
  };
  extraFields?: Record<string, string>; // static fields like form tokens, dealer IDs
}

export async function submitDealerForm(
  form: DealerForm,
  inquiry: {
    vehicle: string;
    color?: string;
    features?: string;
    budget?: string;
    timeline?: string;
    clientId: string;
  }
): Promise<{ success: boolean; status: number; dealer: string }> {
  const message = `Professional car buying advocate representing a qualified, ready-to-purchase client.

Vehicle Requested:
• ${inquiry.vehicle}
${inquiry.color ? `• Color preference: ${inquiry.color}` : ""}
${inquiry.features ? `• Features: ${inquiry.features}` : ""}
${inquiry.budget ? `• Client budget: ${inquiry.budget} OTD (negotiable)` : ""}
${inquiry.timeline ? `• Timeline: ${inquiry.timeline}` : "• Timeline: Ready to purchase within 7 days"}

If you have this vehicle in stock or incoming, please reply with:
1. Stock number and VIN
2. Your best out-the-door price
3. Any current incentives or dealer specials
4. Vehicle availability date

We work with multiple dealerships simultaneously and will move forward with the most competitive offer. Our client is pre-qualified and ready to complete the purchase.

Thank you,
Ricardo Gamon
GoFetch Auto | (352) 410-5889
inquiry@gofetchauto.com | gofetchauto.com`;

  const formData: Record<string, string> = {
    [form.fieldMap.firstName]: "GoFetch",
    [form.fieldMap.lastName]: "Auto - Buyer Advocate",
    [form.fieldMap.email]: "inquiry@gofetchauto.com",
    [form.fieldMap.phone]: "3524105889",
    [form.fieldMap.comments]: message,
    ...form.extraFields,
  };

  try {
    let res: Response;
    if (form.contentType === "json") {
      res = await fetch(form.formUrl, {
        method: form.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
    } else {
      const params = new URLSearchParams(formData);
      res = await fetch(form.formUrl, {
        method: form.method,
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: params.toString(),
      });
    }
    return { success: res.ok || res.status < 400, status: res.status, dealer: form.dealerName };
  } catch (err: any) {
    return { success: false, status: 0, dealer: form.dealerName };
  }
}

// ═══ KNOWN DEALER WEBSITE PLATFORMS ═══
// Map once per platform, works for all dealers on that platform

export const PLATFORM_TEMPLATES: Record<string, Omit<DealerForm, "dealerId" | "dealerName" | "formUrl">> = {
  // Dealer.com (Cox Automotive) — ~30% of dealers
  "dealer.com": {
    method: "POST",
    contentType: "form",
    fieldMap: {
      firstName: "firstName",
      lastName: "lastName",
      email: "email",
      phone: "phone",
      comments: "comments",
    },
  },
  // DealerOn — ~15% of dealers
  "dealeron": {
    method: "POST",
    contentType: "form",
    fieldMap: {
      firstName: "first_name",
      lastName: "last_name",
      email: "email",
      phone: "phone",
      comments: "message",
    },
  },
  // Dealer Inspire — ~15% of dealers
  "dealerinspire": {
    method: "POST",
    contentType: "json",
    fieldMap: {
      firstName: "first_name",
      lastName: "last_name",
      email: "email_address",
      phone: "phone_number",
      comments: "comments",
    },
  },
  // DealerFire — ~10% of dealers
  "dealerfire": {
    method: "POST",
    contentType: "form",
    fieldMap: {
      firstName: "firstname",
      lastName: "lastname",
      email: "emailaddress",
      phone: "phonenumber",
      comments: "comments",
    },
  },
  // Generic fallback
  "generic": {
    method: "POST",
    contentType: "form",
    fieldMap: {
      firstName: "first_name",
      lastName: "last_name",
      email: "email",
      phone: "phone",
      comments: "message",
    },
  },
};
