import React from "react";
import { Container } from "./container";
import { Heading } from "./heading";
import { Subheading } from "./subheading";
import { LoopIcon, UsersIcon, LockIcon } from "@/icons";
import { Button } from "./ui/button";
import { IconCircleCheckFilled } from "@tabler/icons-react";
import Link from "next/link";

export const Pricing = () => {
  return (
    <section id="pricing" className="py-10 md:py-20 lg:py-32 relative overflow-hidden">
      <Container className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        <div className="flex flex-col gap-4">
          <Subheading className="mt-2">
            Trusted by career changers everywhere
          </Subheading>
          <Heading>
            Affordable pricing. <br />
            Easy scaling.
          </Heading>
          <Subheading className="mt-4">
            Start with what you need, upgrade as you grow. Get personalized
            career insights, actionable roadmaps, and expert guidance
            when you&apos;re ready
          </Subheading>
          <ul className="list-none *:flex *:items-center *:gap-2 *:font-medium mt-4 flex flex-col gap-2">
            <li>
              <LockIcon />
              <p>Data Privacy Guaranteed</p>
            </li>
            <li>
              <UsersIcon />
              <p>Personalized Matching</p>
            </li>
            <li>
              <LoopIcon />
              <p>Lifetime Access</p>
            </li>
          </ul>
        </div>

        <div className="flex flex-col gap-4">
          <PricingCard
            price="49"
            description="Perfect for individuals exploring their next career move."
            ctaLink="#"
            ctaText="Get Early Access"
            steps={[
              "5 Career Matches",
              "Basic Skills Analysis",
              "30-Day Action Plan",
              "Email Support",
            ]}
          />
          <PricingCard
            price="79"
            description="Ideal for professionals ready to make a serious career shift."
            ctaLink="#"
            ctaText="Get Early Access"
            steps={[
              "10+ Career Matches",
              "Complete Skills Gap Analysis",
              "90-Day Personalized Roadmap",
              "Resume & LinkedIn Optimization",
              "Priority Support",
            ]}
          />
        </div>
      </Container>
    </section>
  );
};

const PricingCard = ({
  price,
  description,
  ctaLink,
  ctaText,
  steps,
}: {
  price: string;
  description: string;
  ctaLink: string;
  ctaText: string;
  steps: string[];
}) => {
  return (
    <div className="p-4 md:p-8 rounded-2xl bg-neutral-100 dark:bg-neutral-800 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
      <div>
        <Heading>
          ${price}
          <span className="text-neutral-400 text-sm md:text-xl lg:text-3xl">
            /mo
          </span>
        </Heading>
        <Subheading className="mt-4">{description}</Subheading>
        <Button asChild className="mt-4">
          <Link href={ctaLink}>{ctaText}</Link>
        </Button>
      </div>
      <ul className="list-none *:flex *:items-center *:gap-2 *:font-medium mt-4 flex flex-col gap-2">
        {steps.map((step, index) => (
          <Step key={step + index} title={step} />
        ))}
      </ul>
    </div>
  );
};

const Step = ({ title }: { title: string }) => {
  return (
    <li>
      <IconCircleCheckFilled className="size-5 text-neutral-500" />
      <p className="text-sm md:text-base">{title}</p>
    </li>
  );
};
