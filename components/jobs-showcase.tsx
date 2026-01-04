"use client";
import React from "react";
import { Container } from "./container";
import { Heading } from "./heading";
import { Subheading } from "./subheading";
import { GradientDivider } from "./gradient-divider";
import { motion } from "motion/react";
import Image from "next/image";

export const JobsShowcase = () => {
  return (
    <section className="py-10 md:py-20 lg:py-32 relative overflow-hidden">
      <Container>
        <div className="max-w-xl">
          <Heading className="text-left">
            AI-Powered Insights, <br />
            Real Career Results
          </Heading>

          <Subheading className="py-8 text-left mx-0">
            Get personalized career matches based on your actual experience,
            with clear roadmaps and actionable steps. Every recommendation
            is data-driven and tailored to you.
          </Subheading>
        </div>

        <div className="relative min-h-72 sm:min-h-80 md:min-h-100 lg:min-h-140 w-full pt-16 md:pt-24 perspective-distant translate-x-10 md:translate-x-28">
          {/* Back layer - Market Intelligence */}
          <motion.div
            initial={{ opacity: 0, y: -100 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            viewport={{ once: true }}
            className="perspective-[4000px] shadow-2xl"
          >
            <Image
              src="/marketing/market-intelligence.png"
              alt="Shift Market Intelligence Dashboard"
              height={691}
              width={1229}
              draggable={false}
              className="absolute inset-0 rounded-lg border border-neutral-200 shadow-xl select-none pointer-events-none dark:hidden"
              style={{
                transform: "rotateY(20deg) rotateX(40deg) rotateZ(-20deg)",
              }}
            />
            <Image
              src="/marketing/market-intelligence-dark.png"
              alt="Shift Market Intelligence Dashboard"
              height={691}
              width={1229}
              draggable={false}
              className="absolute inset-0 rounded-lg border border-neutral-700 shadow-xl select-none pointer-events-none hidden dark:block"
              style={{
                transform: "rotateY(20deg) rotateX(40deg) rotateZ(-20deg)",
              }}
            />
          </motion.div>

          {/* Front layer - Jobs */}
          <motion.div
            initial={{ opacity: 0, y: -100 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
            viewport={{ once: true }}
            className="perspective-[4000px] translate-x-20 -translate-y-10 md:-translate-y-20 lg:-translate-y-40"
          >
            <Image
              src="/marketing/jobs.png"
              alt="Shift Jobs Dashboard"
              height={691}
              width={1229}
              draggable={false}
              className="absolute inset-0 -translate-x-10 rounded-lg border border-neutral-200 shadow-xl select-none pointer-events-none dark:hidden"
              style={{
                transform: "rotateY(20deg) rotateX(40deg) rotateZ(-20deg)",
              }}
            />
            <Image
              src="/marketing/jobs-dark.png"
              alt="Shift Jobs Dashboard"
              height={691}
              width={1229}
              draggable={false}
              className="absolute inset-0 -translate-x-10 rounded-lg border border-neutral-700 shadow-xl select-none pointer-events-none hidden dark:block"
              style={{
                transform: "rotateY(20deg) rotateX(40deg) rotateZ(-20deg)",
              }}
            />
          </motion.div>
        </div>
      </Container>
      <GradientDivider />
    </section>
  );
};
