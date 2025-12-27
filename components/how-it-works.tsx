"use client";
import React from "react";
import { Container } from "./container";
import { Heading } from "./heading";
import { Subheading } from "./subheading";
import { motion } from "motion/react";

const steps = [
  {
    number: "01",
    title: "Upload Your Resume or LinkedIn",
    description:
      "Drop in your resume or connect your LinkedIn profile. Takes less than 2 minutes.",
  },
  {
    number: "02",
    title: "We Analyze Your Experience",
    description:
      "Our AI maps your skills, accomplishments, and career trajectory against thousands of career paths.",
  },
  {
    number: "03",
    title: "Get Your Career Match Report",
    description:
      "Receive a personalized report with matched careers, skill gaps, and your 90-day action plan.",
  },
  {
    number: "04",
    title: "Start Taking Action",
    description:
      "Follow your step-by-step roadmap. Land interviews. Make the shift.",
  },
];

export const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-10 md:py-20 lg:py-32">
      <Container>
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Subheading className="mb-4 mx-auto">How It Works</Subheading>
          <Heading>
            From stuck to started <br className="hidden md:block" /> in 4 simple steps.
          </Heading>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="text-6xl font-bold text-neutral-200 dark:text-neutral-700 font-display mb-4">
                {step.number}
              </div>
              <h3 className="text-xl font-bold font-display mb-3">{step.title}</h3>
              <p className="text-neutral-600 dark:text-neutral-400">{step.description}</p>

              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-8 left-full w-full h-0.5 bg-gradient-to-r from-neutral-300 dark:from-neutral-600 to-transparent" />
              )}
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
};
