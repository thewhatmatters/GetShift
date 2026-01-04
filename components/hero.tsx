"use client";
import React from "react";
import { Container } from "./container";
import { Heading } from "./heading";
import { Subheading } from "./subheading";
import { Button } from "./ui/button";
import { HeroDashboardMockup } from "./hero-dashboard-mockup";
import { GradientDivider } from "./gradient-divider";
import { IconArrowRight } from "@tabler/icons-react";
import { useWaitlistModal } from "./waitlist-modal";

export const Hero = () => {
  const { openModal } = useWaitlistModal();

  return (
    <section className="pt-10 md:pt-20 lg:pt-32 relative overflow-hidden">
      <Container>
        <Heading as="h1">
          Your experience is worth more <br className="hidden md:block" /> than you think.
        </Heading>

        <Subheading className="py-8">
          Shift analyzes your experience and shows you exactly what careers you&apos;re
          already qualified for — plus a 90-day plan to land one.
        </Subheading>
        <div className="flex items-center gap-4 flex-wrap">
          <Button onClick={() => openModal("hero")} className="shadow-brand" size="lg">
            Get Early Access
            <IconArrowRight className="size-4" />
          </Button>
        </div>
        <HeroDashboardMockup />
      </Container>
      <GradientDivider />
    </section>
  );
};
