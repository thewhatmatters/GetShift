"use client";
import { motion } from "motion/react";
import Image from "next/image";

export const HeroDashboardMockup = () => {
  return (
    <div className="relative">
      <div className="relative min-h-72 sm:min-h-80 md:min-h-100 lg:min-h-140 w-full pt-16 md:pt-24 perspective-distant translate-x-10 md:translate-x-28">
        {/* Back layer - Jobs Screen */}
        <motion.div
          initial={{ opacity: 0, y: -100 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          viewport={{ once: true }}
          className="perspective-[4000px] shadow-2xl"
        >
          <Image
            src="/marketing/jobs.png"
            alt="Shift Jobs Dashboard"
            height={691}
            width={1229}
            draggable={false}
            className="absolute inset-0 rounded-lg border border-neutral-200 shadow-xl select-none pointer-events-none"
            style={{
              transform: "rotateY(20deg) rotateX(40deg) rotateZ(-20deg)",
            }}
          />
        </motion.div>

        {/* Front layer - Market Intelligence Screen */}
        <motion.div
          initial={{ opacity: 0, y: -100 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
          viewport={{ once: true }}
          className="perspective-[4000px] translate-x-20 -translate-y-10 md:-translate-y-20 lg:-translate-y-40"
        >
          <Image
            src="/marketing/market-intelligence.png"
            alt="Shift Market Intelligence Dashboard"
            height={691}
            width={1229}
            draggable={false}
            className="absolute inset-0 -translate-x-10 rounded-lg border border-neutral-200 shadow-xl select-none pointer-events-none"
            style={{
              transform: "rotateY(20deg) rotateX(40deg) rotateZ(-20deg)",
            }}
          />
        </motion.div>
      </div>
    </div>
  );
};
