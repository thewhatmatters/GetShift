"use client";
import React from "react";
import { Container } from "./container";
import { Heading } from "./heading";
import { Subheading } from "./subheading";
import { motion } from "motion/react";

export const FounderNote = () => {
  return (
    <section className="py-10 md:py-20 lg:py-32">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto"
        >
          <div className="bg-neutral-50 dark:bg-neutral-800 rounded-3xl p-8 md:p-12 border border-neutral-200 dark:border-neutral-700">
            <Subheading className="mb-6">A Note from the Founder</Subheading>

            <div className="space-y-4 text-neutral-600 dark:text-neutral-300">
              <p>
                I built Shift because I&apos;ve been where you are.
              </p>
              <p>
                A few years ago, I was stuck in a role that looked great on paper but felt wrong in
                practice. I spent months Googling &quot;what job should I have&quot; and taking personality
                quizzes that told me nothing useful.
              </p>
              <p>
                What I actually needed was someone to look at my experience and say:{" "}
                <em>&quot;Here&apos;s what you&apos;re qualified for. Here&apos;s how to get there.&quot;</em>
              </p>
              <p>
                Shift is that someone.
              </p>
              <p>
                It&apos;s not a career coach. It&apos;s not a personality test. It&apos;s a concrete tool that
                takes your real experience and shows you real paths forward — with a real plan to
                make it happen.
              </p>
              <p className="font-medium text-foreground">
                If you&apos;re ready to stop wondering and start moving, Shift is for you.
              </p>
            </div>

            <div className="mt-8 pt-8 border-t border-neutral-200 dark:border-neutral-700">
              <p className="font-bold font-display text-lg">— [Your Name]</p>
              <p className="text-sm text-neutral-500">Founder, Shift</p>
            </div>
          </div>
        </motion.div>
      </Container>
    </section>
  );
};
