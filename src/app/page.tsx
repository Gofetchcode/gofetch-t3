import { Nav } from "@/components/landing/nav";
import { Hero } from "@/components/landing/hero";
import { PainQuotes } from "@/components/landing/pain-quotes";
import { Problem } from "@/components/landing/problem";
import { Comparison } from "@/components/landing/comparison";
import { WhyGoFetch } from "@/components/landing/why-gofetch";
import { HowItWorks } from "@/components/landing/how-it-works";
import { Pricing } from "@/components/landing/pricing";
import { Results } from "@/components/landing/results";
import { Stats } from "@/components/landing/stats";
import { FAQ } from "@/components/landing/faq";
import { CTA } from "@/components/landing/cta";
import { Footer } from "@/components/landing/footer";

export default function Home() {
  return (
    <main>
      <Nav />
      <Hero />
      <PainQuotes />
      <Problem />
      <Comparison />
      <WhyGoFetch />
      <HowItWorks />
      <Pricing />
      <Results />
      <Stats />
      <FAQ />
      <CTA />
      <Footer />
    </main>
  );
}
