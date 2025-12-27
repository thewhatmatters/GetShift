"use client";
import React from "react";
import { Container } from "./container";
import Link from "next/link";
import { IconSparkles } from "@tabler/icons-react";

export const StickyBar = () => {
  return (
    <div className="bg-primary text-primary-foreground py-2">
      <Container className="flex items-center justify-center gap-2 text-sm">
        <IconSparkles className="size-4" />
        <span>Early Access — $49 (normally $79)</span>
        <Link
          href="#pricing"
          className="underline underline-offset-2 font-medium hover:opacity-80"
        >
          Claim Your Spot
        </Link>
      </Container>
    </div>
  );
};
