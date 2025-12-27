import { cn } from "@/lib/utils";
import Link from "next/link";
import React from "react";

export const Logo = ({ className }: { className?: string }) => {
  return (
    <Link href="/" className={cn("flex items-center gap-2", className)}>
      <LogoIcon />
      <span className="text-lg font-bold text-foreground">
        Shift
      </span>
    </Link>
  );
};

export const LogoIcon = (props: React.SVGAttributes<SVGSVGElement>) => {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M12 2L4 6V12C4 16.42 7.46 20.53 12 22C16.54 20.53 20 16.42 20 12V6L12 2Z"
        fill="currentColor"
        fillOpacity="0.2"
      />
      <path
        d="M12 2L4 6V12C4 16.42 7.46 20.53 12 22C16.54 20.53 20 16.42 20 12V6L12 2Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9 12L11 14L15 10"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
