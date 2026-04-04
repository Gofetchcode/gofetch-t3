export default function TermsPage() {
  return (
    <div className="bg-offwhite min-h-screen">
      {/* Hero */}
      <section className="bg-navy text-white py-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h1
            className="text-4xl md:text-5xl mb-4"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Terms of Service
          </h1>
          <p className="text-white/50 text-sm">Last updated: April 1, 2026</p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 px-6">
        <div className="max-w-3xl mx-auto bg-white rounded-2xl border border-gray-100 shadow-sm p-8 md:p-12">
          <div className="space-y-8 text-warm-600 leading-relaxed text-[15px]">
            <div>
              <h2 className="text-navy font-bold text-lg mb-3">1. Agreement to Terms</h2>
              <p>
                By accessing or using GoFetch Auto LLC (&ldquo;GoFetch Auto,&rdquo;
                &ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;) services, website, or
                client portal, you (&ldquo;Client,&rdquo; &ldquo;you,&rdquo; or &ldquo;your&rdquo;)
                agree to be bound by these Terms of Service. If you do not agree, you may not use
                our services.
              </p>
            </div>

            <div>
              <h2 className="text-navy font-bold text-lg mb-3">2. Description of Service</h2>
              <p>
                GoFetch Auto provides professional car buying advocacy services for consumers and
                businesses. We act as your representative in the vehicle purchasing process,
                including market research, price negotiation, dealer add-on removal, paperwork
                coordination, and delivery logistics. We are not a licensed dealership and do not
                sell, lease, or finance vehicles directly.
              </p>
            </div>

            <div>
              <h2 className="text-navy font-bold text-lg mb-3">3. Service Tiers &amp; Fees</h2>
              <p className="mb-3">Our service fees are structured as follows:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li><strong>Standard Tier:</strong> $199 &mdash; Mainstream brands and models</li>
                <li><strong>Premium Tier:</strong> $299 &mdash; Premium brands (BMW, Mercedes-Benz, Audi, etc.)</li>
                <li><strong>Exotic Tier:</strong> $1,999 &mdash; Exotic and luxury vehicles with concierge service</li>
              </ul>
              <p className="mt-3">
                Fees are due at the &ldquo;Deal Agreed&rdquo; milestone and are non-refundable once
                a deal has been agreed upon by the Client. If we are unable to provide demonstrable
                value exceeding our fee, no fee will be charged.
              </p>
            </div>

            <div>
              <h2 className="text-navy font-bold text-lg mb-3">4. Exclusive Buyer Representation Agreement</h2>
              <p>
                Prior to the commencement of services, you will execute an Exclusive Buyer
                Representation Agreement electronically through our platform. This agreement
                authorizes GoFetch Auto to act as your exclusive representative for the specified
                vehicle purchase. The agreement may be terminated by either party with written
                notice.
              </p>
            </div>

            <div>
              <h2 className="text-navy font-bold text-lg mb-3">5. Client Obligations</h2>
              <p>You agree to: (a) provide accurate and complete information; (b) respond to communications in a timely manner; (c) not engage in independent negotiations with dealers for the same vehicle during the term of our engagement; and (d) make payment of fees when due.</p>
            </div>

            <div>
              <h2 className="text-navy font-bold text-lg mb-3">6. No Guarantee of Savings</h2>
              <p>
                While we use best efforts and industry expertise to negotiate favorable pricing, we
                do not guarantee specific savings amounts. Savings vary based on market conditions,
                vehicle availability, dealer policies, and other factors outside our control.
              </p>
            </div>

            <div>
              <h2 className="text-navy font-bold text-lg mb-3">7. Payment Processing</h2>
              <p>
                All payments are processed securely via Stripe, Inc. We do not store credit card
                numbers or sensitive payment information on our servers. By making a payment, you
                agree to Stripe&rsquo;s terms of service.
              </p>
            </div>

            <div>
              <h2 className="text-navy font-bold text-lg mb-3">8. Limitation of Liability</h2>
              <p>
                To the maximum extent permitted by applicable law, GoFetch Auto LLC&rsquo;s total
                aggregate liability shall not exceed the service fee paid by you. In no event shall
                we be liable for any indirect, incidental, special, consequential, or punitive
                damages, including but not limited to loss of profits, data, or goodwill.
              </p>
            </div>

            <div>
              <h2 className="text-navy font-bold text-lg mb-3">9. Indemnification</h2>
              <p>
                You agree to indemnify and hold harmless GoFetch Auto LLC, its officers, employees,
                and agents from any claims, damages, losses, or expenses arising from your use of
                our services or breach of these terms.
              </p>
            </div>

            <div>
              <h2 className="text-navy font-bold text-lg mb-3">10. Dispute Resolution</h2>
              <p>
                Any dispute arising from these Terms or our services shall first be addressed
                through good-faith negotiation. If unresolved, disputes shall be submitted to
                binding arbitration in Hillsborough County, Florida, under the rules of the
                American Arbitration Association.
              </p>
            </div>

            <div>
              <h2 className="text-navy font-bold text-lg mb-3">11. Governing Law</h2>
              <p>
                These Terms shall be governed by and construed in accordance with the laws of the
                State of Florida, without regard to its conflict of law provisions.
              </p>
            </div>

            <div>
              <h2 className="text-navy font-bold text-lg mb-3">12. Modifications</h2>
              <p>
                We reserve the right to modify these Terms at any time. Material changes will be
                communicated via email or through our website. Continued use of our services after
                changes constitutes acceptance of the revised Terms.
              </p>
            </div>

            <div className="pt-6 border-t border-gray-100">
              <h2 className="text-navy font-bold text-lg mb-3">13. Contact Information</h2>
              <p>
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
