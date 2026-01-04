"use client";
import React from "react";
import { Logo } from "./logo";
import { Container } from "./container";
import { Subheading } from "./subheading";
import { Button } from "./ui/button";
import Link from "next/link";
import {
  IconBrandLinkedin,
  IconBrandTwitter,
} from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { ModeToggle } from "./mode-toggle";
import { WaitlistForm } from "./waitlist-form";
import { useWaitlistModal } from "./waitlist-modal";

export const Footer = () => {
  const { openModal } = useWaitlistModal();

  return (
    <footer className="border-t perspective-distant overflow-hidden border-neutral-200 dark:border-neutral-800 py-10 md:py-20 lg:py-32 relative">
      <Container className="grid grid-cols-1 lg:grid-cols-3 gap-10 relative z-20">
        <div className="lg:col-span-2 flex flex-col gap-4 items-start">
          <Logo />
          <Subheading>Your experience is worth more than you think.</Subheading>
          <Button onClick={() => openModal("footer-button")} className="shadow-brand">
            Get Early Access
          </Button>
        </div>
        <div className="flex flex-col gap-4">
          <h4 className="text-base font-medium text-neutral-600 dark:text-neutral-400">Join the Waitlist</h4>
          <WaitlistForm source="footer" />
          <Subheading className="text-sm md:text-sm lg:text-sm">
            Be first to access Shift when we launch.
          </Subheading>
        </div>
      </Container>

      <Container className="flex flex-col sm:flex-row justify-between mt-10 relative z-20 gap-4 md:gap-0">
        <p className="text-sm text-neutral-500">
          &copy; {new Date().getFullYear()} Shift. All rights reserved.
        </p>

        <div className="flex md:items-end items-start flex-col gap-4">
          {/* <div className="flex items-center gap-4">
            <div className="flex items-center gap-4 *:text-sm *:text-neutral-500">
              <Link href="/privacy">Privacy Policy</Link>
              <Link href="/terms">Terms of Service</Link>
            </div>
          </div> */}
          <div className="flex items-center gap-4">
            <ModeToggle />
            <Link href="https://twitter.com/randydigital" aria-label="Follow us on Twitter" target="_blank" rel="noopener noreferrer">
              <IconBrandTwitter className="size-4" />
            </Link>
            <Link href="https://www.linkedin.com/company/109513374" aria-label="Connect on LinkedIn" target="_blank" rel="noopener noreferrer">
              <IconBrandLinkedin className="size-4" />
            </Link>
          </div>
        </div>
      </Container>

      <div
        className={cn(
          "flex items-center justify-center gap-20 h-[200%]",
          "absolute -inset-x-[150%] -inset-y-40",
          "[background-size:40px_40px]",
          "[background-image:linear-gradient(to_right,var(--color-neutral-100)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-neutral-100)_1px,transparent_1px)]",
          "dark:[background-image:linear-gradient(to_right,var(--color-neutral-900)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-neutral-900)_1px,transparent_1px)]",
          "mask-radial-from-50%"
        )}
        style={{
          transform: " rotateX(60deg) ",
        }}
      />
    </footer>
  );
};
