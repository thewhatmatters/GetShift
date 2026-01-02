import { Hero } from "@/components/hero";
import { Problem } from "@/components/problem";
import { JobsShowcase } from "@/components/jobs-showcase";
import { Features } from "@/components/features";
import { Pricing } from "@/components/pricing";
import { FAQs } from "@/components/faqs";
import { CTA } from "@/components/cta";

export default function Home() {
  return (
    <div className="min-h-screen">
      <Hero />
      <Problem />
      <JobsShowcase />
      <Features />
      <Pricing />
      <FAQs />
      <CTA />
    </div>
  );
}
