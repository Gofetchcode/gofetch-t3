import Link from "next/link";

const steps = [
  {
    num: "01",
    title: "Tell Us Your Dream Car",
    desc: "Fill out our quick consultation form with your vehicle preferences, budget, and timeline. Whether you want a specific model or need guidance, we start where you are.",
    detail: "Free consultation",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
      </svg>
    ),
  },
  {
    num: "02",
    title: "We Scour the Market",
    desc: "Our team searches dealer inventories, auction networks, and wholesale channels across the region to find the exact vehicle that matches your criteria — often before it hits public listings.",
    detail: "Nationwide search",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
      </svg>
    ),
  },
  {
    num: "03",
    title: "Expert Negotiation",
    desc: "Using insider knowledge and real invoice data, we negotiate directly with the dealer on your behalf. We know every tactic they use — and exactly how to counter them.",
    detail: "Dealer-level intel",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    num: "04",
    title: "Remove Dealer Add-Ons",
    desc: "Nitrogen tire fills, fabric protection, VIN etching — we strip out the junk fees and inflated add-ons that dealerships slip into contracts. You only pay for what matters.",
    detail: "Avg $2,800 removed",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
      </svg>
    ),
  },
  {
    num: "05",
    title: "Review & Approve",
    desc: "We present you with a complete deal breakdown — the vehicle, the price, every fee, and the total savings. You review at your own pace and approve only when you're confident.",
    detail: "Full transparency",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    num: "06",
    title: "Paperwork Handled",
    desc: "From purchase agreements to financing documents, we coordinate every piece of paperwork so nothing slips through the cracks. You sign — we handle the rest.",
    detail: "100% digital",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
      </svg>
    ),
  },
  {
    num: "07",
    title: "Delivery Coordination",
    desc: "We coordinate pickup or delivery logistics so your new vehicle arrives when and where it's convenient for you. No extra trips, no wasted weekends at the dealership.",
    detail: "Door-to-door",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H18.75m-7.5-9H5.625c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
      </svg>
    ),
  },
  {
    num: "08",
    title: "Keys in Hand",
    desc: "You drive away in your dream car knowing you got the best possible deal — no stress, no regrets, and thousands saved. That's the GoFetch difference.",
    detail: "Zero stress",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" />
      </svg>
    ),
  },
];

export default function HowItWorksPage() {
  return (
    <div className="bg-offwhite">
      {/* Hero */}
      <section className="relative bg-navy text-white py-28 px-6 overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 right-20 w-80 h-80 rounded-full bg-amber blur-3xl" />
        </div>
        <div className="relative max-w-4xl mx-auto text-center">
          <p className="text-amber font-semibold tracking-widest uppercase text-sm mb-4">The Process</p>
          <h1
            className="text-5xl md:text-7xl leading-tight mb-6"
            style={{ fontFamily: "var(--font-display)" }}
          >
            8 Steps to a <span className="text-amber">Better Deal</span>
          </h1>
          <p className="text-lg text-white/70 max-w-2xl mx-auto">
            From first conversation to keys in hand &mdash; here&rsquo;s exactly how we take the
            stress out of buying your next car.
          </p>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto relative">
          {/* Vertical center line (desktop) */}
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-amber/40 via-amber/20 to-amber/40 -translate-x-1/2" />

          <div className="space-y-12 md:space-y-0">
            {steps.map((step, i) => {
              const isLeft = i % 2 === 0;
              return (
                <div key={step.num} className="relative md:py-10">
                  {/* Center dot (desktop) */}
                  <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-amber text-navy items-center justify-center font-bold text-sm z-10 shadow-lg shadow-amber/30 ring-4 ring-offwhite">
                    {step.num}
                  </div>

                  <div className="md:grid md:grid-cols-2 md:gap-20 items-center">
                    {/* Content */}
                    <div
                      className={`${
                        isLeft
                          ? "md:col-start-1 md:text-right md:pr-12"
                          : "md:col-start-2 md:text-left md:pl-12"
                      }`}
                    >
                      <div
                        className={`bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 group ${
                          isLeft ? "md:ml-auto" : ""
                        }`}
                      >
                        <div className={`flex items-center gap-4 mb-5 ${isLeft ? "md:flex-row-reverse" : ""}`}>
                          <span className="md:hidden w-11 h-11 rounded-full bg-amber text-navy flex items-center justify-center font-bold text-sm shrink-0 shadow-md">
                            {step.num}
                          </span>
                          <div className="w-12 h-12 rounded-xl bg-amber/10 text-amber flex items-center justify-center group-hover:bg-amber group-hover:text-navy transition-colors duration-300">
                            {step.icon}
                          </div>
                          <span className="text-xs text-amber font-semibold uppercase tracking-widest">
                            {step.detail}
                          </span>
                        </div>
                        <h3
                          className="text-2xl text-navy mb-3"
                          style={{ fontFamily: "var(--font-display)" }}
                        >
                          {step.title}
                        </h3>
                        <p className="text-warm-600 leading-relaxed text-sm">{step.desc}</p>
                      </div>
                    </div>

                    {/* Empty side */}
                    <div
                      className={`hidden md:block ${
                        isLeft ? "md:col-start-2" : "md:col-start-1 md:row-start-1"
                      }`}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-24 px-6 bg-navy text-white text-center overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full bg-amber blur-3xl" />
        </div>
        <div className="relative max-w-2xl mx-auto">
          <h2
            className="text-3xl md:text-5xl mb-6"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Ready to Get Started?
          </h2>
          <p className="text-white/60 mb-10 text-lg">
            Tell us what you&rsquo;re looking for and let us handle the rest. Your dream car is
            closer than you think.
          </p>
          <Link
            href="/car-finder"
            className="inline-block bg-amber hover:bg-amber-light text-navy font-bold px-10 py-4 rounded-full transition-colors duration-200 shadow-lg shadow-amber/20"
          >
            Find My Car
          </Link>
        </div>
      </section>
    </div>
  );
}
