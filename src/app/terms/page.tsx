export default function TermsPage() {
  return (
    <div className="pt-20 bg-offwhite min-h-screen">
      <div className="max-w-3xl mx-auto px-4 py-16">
        <h1 className="text-3xl font-bold text-navy mb-2" style={{ fontFamily: "var(--font-display)" }}>Terms of Service</h1>
        <p className="text-sm text-muted mb-8">Last updated: April 2, 2026</p>
        <div className="prose prose-sm text-warm-600 space-y-6">
          <h3 className="text-navy font-bold">1. Agreement to Terms</h3>
          <p>By accessing or using GoFetch Auto services, you agree to these Terms of Service.</p>
          <h3 className="text-navy font-bold">2. Description of Service</h3>
          <p>GoFetch Auto provides professional car buying advocacy for consumers and businesses. We are not a dealership and do not sell vehicles directly.</p>
          <h3 className="text-navy font-bold">3. Service Fees</h3>
          <p>Standard: $99. Premium: $199. Exotic: $1,299. Fees are due at the &ldquo;Deal Agreed&rdquo; milestone. All fees are non-refundable once a deal has been agreed upon.</p>
          <h3 className="text-navy font-bold">4. Exclusive Agreement</h3>
          <p>You will sign an Exclusive Buyer Representation Agreement electronically through our platform before work begins.</p>
          <h3 className="text-navy font-bold">5. No Guarantee of Savings</h3>
          <p>We use best efforts but do not guarantee specific savings. If we cannot provide value, no fee will be charged.</p>
          <h3 className="text-navy font-bold">6. Payment Processing</h3>
          <p>Payments processed via Stripe. We do not store credit card information.</p>
          <h3 className="text-navy font-bold">7. Limitation of Liability</h3>
          <p>Total liability shall not exceed the service fee paid. We are not liable for indirect or consequential damages.</p>
          <h3 className="text-navy font-bold">8. Governing Law</h3>
          <p>Governed by the laws of the State of Florida.</p>
          <h3 className="text-navy font-bold">9. Contact</h3>
          <p>GoFetch Auto LLC &bull; Tampa Bay, Florida &bull; inquiry@gofetchauto.com &bull; (352) 410-5889</p>
        </div>
      </div>
    </div>
  );
}
