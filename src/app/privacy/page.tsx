export default function PrivacyPage() {
  return (
    <div className="bg-offwhite min-h-screen">
      {/* Hero */}
      <section className="bg-navy text-white py-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h1
            className="text-4xl md:text-5xl mb-4"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Privacy Policy
          </h1>
          <p className="text-white/50 text-sm">Last updated: April 1, 2026</p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 px-6">
        <div className="max-w-3xl mx-auto bg-white rounded-2xl border border-gray-100 shadow-sm p-8 md:p-12">
          <div className="space-y-8 text-warm-600 leading-relaxed text-[15px]">
            <div>
              <p className="mb-4">
                GoFetch Auto LLC (&ldquo;GoFetch Auto,&rdquo; &ldquo;we,&rdquo; &ldquo;us,&rdquo;
                or &ldquo;our&rdquo;) is committed to protecting your privacy. This Privacy Policy
                explains how we collect, use, disclose, and safeguard your information when you use
                our website, client portal, and services.
              </p>
            </div>

            <div>
              <h2 className="text-navy font-bold text-lg mb-3">1. Information We Collect</h2>
              <p className="mb-3"><strong>Personal Information You Provide:</strong></p>
              <ul className="list-disc pl-6 space-y-1 mb-3">
                <li>Contact information (name, email address, phone number)</li>
                <li>Vehicle preferences and purchase criteria</li>
                <li>Financial information related to your vehicle purchase</li>
                <li>Documents uploaded to your client portal</li>
                <li>Electronic signature data</li>
                <li>Communications with our team</li>
              </ul>
              <p className="mb-3"><strong>Automatically Collected Information:</strong></p>
              <ul className="list-disc pl-6 space-y-1">
                <li>IP address and browser type</li>
                <li>Device information and operating system</li>
                <li>Pages visited and time spent on our website</li>
                <li>Referring website addresses</li>
                <li>Cookies and similar tracking technologies</li>
              </ul>
            </div>

            <div>
              <h2 className="text-navy font-bold text-lg mb-3">2. How We Use Your Information</h2>
              <p className="mb-3">We use the information we collect to:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Provide and manage our car buying advocacy services</li>
                <li>Communicate with you about your deal progress</li>
                <li>Process payments and billing</li>
                <li>Negotiate with dealerships on your behalf (using anonymized data)</li>
                <li>Improve our services and user experience</li>
                <li>Send service-related communications and updates</li>
                <li>Comply with legal obligations</li>
              </ul>
            </div>

            <div>
              <h2 className="text-navy font-bold text-lg mb-3">3. Information Sharing &amp; Disclosure</h2>
              <p className="mb-3">We share your information only in the following circumstances:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li><strong>Dealerships:</strong> Anonymized information only &mdash; your name and personal details are never revealed during the negotiation phase</li>
                <li><strong>Payment Processors:</strong> Stripe, Inc. for secure payment processing</li>
                <li><strong>Analytics:</strong> Google Analytics for website improvement (anonymized)</li>
                <li><strong>Legal Requirements:</strong> When required by law, court order, or governmental regulation</li>
              </ul>
              <p className="mt-3 font-semibold text-navy">We do not sell, rent, or trade your personal information to third parties for marketing purposes.</p>
            </div>

            <div>
              <h2 className="text-navy font-bold text-lg mb-3">4. Dual Anonymity System</h2>
              <p>
                GoFetch Auto employs a dual anonymity system during the negotiation process. Dealers
                never receive your personal information during negotiations, and you do not receive
                dealer identity information until the deal is finalized. This protects both parties
                and ensures a fair negotiation process.
              </p>
            </div>

            <div>
              <h2 className="text-navy font-bold text-lg mb-3">5. Data Security</h2>
              <p>
                We implement industry-standard security measures to protect your information,
                including SSL/TLS encryption for data in transit, encrypted storage for data at
                rest, access controls and authentication protocols, and regular security assessments.
                However, no method of electronic transmission or storage is 100% secure, and we
                cannot guarantee absolute security.
              </p>
            </div>

            <div>
              <h2 className="text-navy font-bold text-lg mb-3">6. Cookies &amp; Tracking Technologies</h2>
              <p className="mb-3">We use the following types of cookies:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li><strong>Essential Cookies:</strong> Required for website functionality and security</li>
                <li><strong>Analytics Cookies:</strong> Google Analytics to understand usage patterns and improve our service</li>
              </ul>
              <p className="mt-3">You may disable cookies in your browser settings. Disabling essential cookies may affect website functionality.</p>
            </div>

            <div>
              <h2 className="text-navy font-bold text-lg mb-3">7. Data Retention</h2>
              <p>
                We retain your personal data for 3 years after your last transaction or interaction
                with our services, or until you request deletion, whichever comes first. After this
                period, data is securely deleted or anonymized.
              </p>
            </div>

            <div>
              <h2 className="text-navy font-bold text-lg mb-3">8. Your Rights</h2>
              <p className="mb-3">Depending on your jurisdiction, you may have the right to:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Access the personal data we hold about you</li>
                <li>Request correction of inaccurate data</li>
                <li>Request deletion of your personal data</li>
                <li>Object to or restrict processing of your data</li>
                <li>Request portability of your data</li>
                <li>Withdraw consent at any time</li>
              </ul>
              <p className="mt-3">To exercise any of these rights, contact us at inquiry@gofetchauto.com.</p>
            </div>

            <div>
              <h2 className="text-navy font-bold text-lg mb-3">9. California Residents (CCPA/CPRA)</h2>
              <p className="mb-3">If you are a California resident, you have additional rights under the California Consumer Privacy Act (CCPA) and California Privacy Rights Act (CPRA):</p>
              <ul className="list-disc pl-6 space-y-1">
                <li><strong>Right to Know:</strong> You can request disclosure of the categories and specific pieces of personal information we have collected</li>
                <li><strong>Right to Delete:</strong> You can request deletion of your personal information</li>
                <li><strong>Right to Opt-Out:</strong> You can opt out of the sale or sharing of personal information</li>
                <li><strong>Right to Non-Discrimination:</strong> We will not discriminate against you for exercising your privacy rights</li>
              </ul>
              <p className="mt-3 font-semibold text-navy">We do not sell personal information as defined under the CCPA/CPRA.</p>
            </div>

            <div>
              <h2 className="text-navy font-bold text-lg mb-3">10. European Residents (GDPR)</h2>
              <p className="mb-3">
                If you are located in the European Economic Area (EEA), United Kingdom, or
                Switzerland, you have rights under the General Data Protection Regulation (GDPR):
              </p>
              <ul className="list-disc pl-6 space-y-1">
                <li><strong>Legal Basis:</strong> We process your data based on consent, contractual necessity, or legitimate interest</li>
                <li><strong>Data Transfers:</strong> Your data may be transferred to and processed in the United States. We implement appropriate safeguards for international transfers</li>
                <li><strong>Supervisory Authority:</strong> You have the right to lodge a complaint with your local data protection authority</li>
              </ul>
            </div>

            <div>
              <h2 className="text-navy font-bold text-lg mb-3">11. Children&rsquo;s Privacy</h2>
              <p>
                Our services are not directed to individuals under 18 years of age. We do not
                knowingly collect personal information from children. If we become aware that we have
                collected data from a child, we will take steps to delete it promptly.
              </p>
            </div>

            <div>
              <h2 className="text-navy font-bold text-lg mb-3">12. Changes to This Policy</h2>
              <p>
                We may update this Privacy Policy from time to time. Material changes will be
                communicated via email or a prominent notice on our website. Your continued use of
                our services after changes constitutes acceptance of the updated policy.
              </p>
            </div>

            <div className="pt-6 border-t border-gray-100">
              <h2 className="text-navy font-bold text-lg mb-3">13. Contact Information</h2>
              <p>
                For privacy-related inquiries or to exercise your data rights:<br /><br />
                GoFetch Auto LLC<br />
                Tampa Bay, Florida<br />
                Email: inquiry@gofetchauto.com<br />
                Phone: (352) 410-5889
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
