"use client";
import React from "react";
import { Container } from "./container";
import { Heading } from "./heading";
import { Subheading } from "./subheading";
import { Button } from "./ui/button";
import Link from "next/link";
import { LandingImages } from "./landing-images";
import { GradientDivider } from "./gradient-divider";
import { IconArrowRight } from "@tabler/icons-react";

export const Hero = () => {
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
          <Button asChild className="shadow-brand" size="lg">
            <Link href="#pricing">
              Start My Career Shift
              <IconArrowRight className="size-4" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="#how-it-works">See How It Works</Link>
          </Button>
        </div>
        <LandingImages
          firstImageSrc="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1920&q=80"
          secondImageSrc="https://images.unsplash.com/photo-1553028826-f4804a6dba3b?w=1920&q=80"
        />
      </Container>
      <GradientDivider />
    </section>
  );
};
