const steps = [
  { num: 1, title: "Tell Us Your Dream Car", desc: "15-minute discovery call. Tell us what you want, your budget, your timeline, and any must-haves. Zero pressure, zero obligation.", detail: "Free consultation" },
  { num: 2, title: "We Scour the Market", desc: "We research inventory nationwide, compare dealer pricing, identify hidden incentives, and build a shortlist of the best options for you.", detail: "Nationwide search" },
  { num: 3, title: "Expert Negotiation", desc: "We engage dealers directly — dealer principals, not salespeople. We negotiate using real invoice data, holdbacks, and incentive structures.", detail: "Dealer-level intel" },
  { num: 4, title: "Remove Dealer Add-Ons", desc: "We identify and eliminate $2,500-$3,500 in forced dealer add-ons that you'd never know were optional.", detail: "Avg $2,800 removed" },
  { num: 5, title: "Review & Approve", desc: "We present you with a fully itemized deal breakdown — every fee, every dollar, every savings line. You approve before anything moves forward.", detail: "Full transparency" },
  { num: 6, title: "Paperwork Handled", desc: "We manage all contracts, financing paperwork, title work, registration, and DMV processing. You sign digitally from your couch.", detail: "100% digital" },
  { num: 7, title: "Delivery Coordination", desc: "We coordinate pickup or delivery on your schedule. Many clients have their vehicle delivered directly to their driveway.", detail: "Door-to-door" },
  { num: 8, title: "Keys in Hand", desc: "You drive away in your new car. Total time at a dealership: under 45 minutes for pickup, or zero if we deliver.", detail: "Zero stress" },
];

export default function HowItWorksPage() {
  return (
    <div className="pt-20">
      <section className="bg-navy py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-amber text-xs font-semibold uppercase tracking-[0.25em] mb-4">How It Works</p>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4" style={{ fontFamily: "var(--font-display)" }}>
            8 Steps to a Better Deal
          </h1>
          <p className="text-gray-400 text-lg">From discovery call to keys in hand — here&rsquo;s exactly what happens.</p>
        </div>
      </section>

      <section className="py-20 px-4 bg-offwhite">
        <div className="max-w-3xl mx-auto">
          {steps.map((s, i) => (
            <div key={s.num} className={`flex gap-6 mb-12 ${i % 2 === 1 ? "flex-row-reverse text-right" : ""}`}>
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-amber text-navy font-bold text-lg flex items-center justify-center flex-shrink-0">{s.num}</div>
                {i < steps.length - 1 && <div className="w-0.5 flex-1 bg-amber/20 mt-2" />}
              </div>
              <div className="flex-1 pb-4">
                <span className="text-xs text-amber font-semibold uppercase tracking-wider">{s.detail}</span>
                <h3 className="text-xl font-bold text-navy mt-1 mb-2">{s.title}</h3>
                <p className="text-warm-600 text-sm leading-relaxed">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
