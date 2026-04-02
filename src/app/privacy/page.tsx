export default function PrivacyPage() {
  return (
    <div className="pt-20 bg-offwhite min-h-screen">
      <div className="max-w-3xl mx-auto px-4 py-16">
        <h1 className="text-3xl font-bold text-navy mb-2" style={{ fontFamily: "var(--font-display)" }}>Privacy Policy</h1>
        <p className="text-sm text-muted mb-8">Last updated: April 2, 2026</p>
        <div className="prose prose-sm text-warm-600 space-y-6">
          <h3 className="text-navy font-bold">1. Information We Collect</h3>
          <p>We collect personal information you provide: name, email, phone, vehicle preferences, financial information related to your car purchase, and documents you upload to your portal.</p>
          <h3 className="text-navy font-bold">2. How We Use Your Information</h3>
          <p>To provide car buying advocacy services, communicate with you about your deal, process payments, improve our services, and comply with legal obligations.</p>
          <h3 className="text-navy font-bold">3. Information Sharing</h3>
          <p>We share your information only with: dealerships (anonymized — your name is never revealed during negotiation), payment processors (Stripe), and as required by law.</p>
          <h3 className="text-navy font-bold">4. Data Security</h3>
          <p>We use industry-standard encryption (SSL/TLS) for data in transit and at rest. We implement a dual anonymity system to protect your identity during negotiations.</p>
          <h3 className="text-navy font-bold">5. Your Rights</h3>
          <p>You may request access to, correction of, or deletion of your personal data. Contact us at inquiry@gofetchauto.com.</p>
          <h3 className="text-navy font-bold">6. Cookies</h3>
          <p>We use essential cookies for functionality and analytics cookies (Google Analytics) to improve our service. You may disable cookies in your browser settings.</p>
          <h3 className="text-navy font-bold">7. Data Retention</h3>
          <p>We retain your data for 3 years after your last transaction, or until you request deletion, whichever comes first.</p>
          <h3 className="text-navy font-bold">8. California Residents (CCPA)</h3>
          <p>California residents have the right to know, delete, and opt-out of the sale of personal information. We do not sell personal information.</p>
          <h3 className="text-navy font-bold">9. Contact</h3>
          <p>GoFetch Auto LLC &bull; Tampa Bay, Florida &bull; inquiry@gofetchauto.com &bull; (352) 410-5889</p>
        </div>
      </div>
    </div>
  );
}
