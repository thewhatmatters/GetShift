"use client";
import React from "react";
import { Container } from "./container";
import { Heading } from "./heading";
import { Subheading } from "./subheading";
import { Button } from "./ui/button";
import Link from "next/link";
import { IconArrowRight } from "@tabler/icons-react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

export const CTA = () => {
  return (
    <section className="py-10 md:py-20 lg:py-32 relative overflow-hidden">
      <Container className="relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto"
        >
          <Heading>
            Ready to see what you&apos;re <br className="hidden md:block" /> really capable of?
          </Heading>
          <Subheading className="mt-6 mb-8 mx-auto">
            Your next career isn&apos;t hiding. It&apos;s waiting for you to claim it.
          </Subheading>
          <Button asChild className="shadow-brand" size="lg">
            <Link href="#pricing">
              Get Shift for $49
              <IconArrowRight className="size-4" />
            </Link>
          </Button>
          <p className="mt-4 text-sm text-neutral-500">
            30-day money-back guarantee
          </p>
        </motion.div>
      </Container>

      {/* Background Grid Effect */}
      <div
        className={cn(
          "absolute -inset-x-[50%] -inset-y-20 -z-10",
          "[background-size:40px_40px]",
          "[background-image:linear-gradient(to_right,var(--color-neutral-100)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-neutral-100)_1px,transparent_1px)]",
          "dark:[background-image:linear-gradient(to_right,var(--color-neutral-800)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-neutral-800)_1px,transparent_1px)]",
          "mask-radial-from-50%"
        )}
      />
    </section>
  );
};
