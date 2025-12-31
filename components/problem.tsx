"use client";
import React from "react";
import { Container } from "./container";
import { Heading } from "./heading";
import { Subheading } from "./subheading";
import { cn } from "@/lib/utils";
import { IconPlus, IconArrowRight } from "@tabler/icons-react";
import DottedGlowBackground from "@/components/ui/dotted-glow-background";
import { ShieldIllustration } from "@/illustrations/general";
import {
  IconCircleDashedCheck,
  IconClock,
  IconExclamationCircle,
  IconPrison,
  IconRipple,
  IconCheck,
  IconLoader2,
  IconCircleDashed,
} from "@tabler/icons-react";

export const Problem = () => {
  return (
    <Container className="py-10 md:py-20 lg:py-32">
      <div className="flex xl:flex-row flex-col xl:items-baseline-last justify-between gap-10">
        <Heading className="text-center lg:text-left">
          Built for Professionals <br /> Ready to Make a Change.
        </Heading>
        <Subheading className="text-center lg:text-left mx-auto lg:mx-0">
          Shift analyzes your real experience, identifies hidden opportunities,
          and gives you a concrete roadmap. Every insight is personalized,
          every recommendation actionable.
        </Subheading>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 my-10 md:my-20">
        <Card className="rounded-tl-3xl rounded-bl-3xl">
          <CardSkeleton>
            <SkeletonOne />
          </CardSkeleton>
          <CardContent>
            <CardTitle>AI-Powered Career Matching</CardTitle>
            <CardCTA>
              <IconPlus />
            </CardCTA>
          </CardContent>
        </Card>
        <Card>
          <CardSkeleton>
            <SkeletonTwo />
          </CardSkeleton>
          <CardContent>
            <CardTitle>Personalized 90-Day Roadmap</CardTitle>
            <CardCTA>
              <IconPlus />
            </CardCTA>
          </CardContent>
        </Card>
        <Card className="rounded-tr-3xl rounded-br-3xl">
          <CardSkeleton>
            <SkeletonThree />
          </CardSkeleton>
          <CardContent>
            <CardTitle>Skills Analysis & Gap Reports</CardTitle>
            <CardCTA>
              <IconPlus />
            </CardCTA>
          </CardContent>
        </Card>
      </div>
    </Container>
  );
};

const Card = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        "max-w-l mx-auto bg-neutral-50 dark:bg-neutral-800 rounded-lg",
        className
      )}
    >
      {children}
    </div>
  );
};

const CardContent = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        "px-4 md:px-8 md:pb-12 pb-6 flex items-center justify-between",
        className
      )}
    >
      {children}
    </div>
  );
};

const CardCTA = ({
  className,
  children,
  ...rest
}: React.ComponentProps<"button">) => {
  return (
    <button
      className={cn(
        "size-5 md:size-10 shrink-0 rounded-full border border-neutral-200 dark:border-neutral-800 flex items-center justify-center active:scale-[0.98] transition duration-200",
        className
      )}
      {...rest}
    >
      {children}
    </button>
  );
};

const CardTitle = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <h3 className={cn("text-lg md:text-2xl font-bold font-display", className)}>
      {children}
    </h3>
  );
};

const CardSkeleton = ({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        "relative h-80 sm:h-60 md:h-80 overflow-hidden perspective-distant",
        className
      )}
    >
      {children}
    </div>
  );
};

const SkeletonOne = () => {
  return (
    <div className="perspective-distant rotate-z-15 -rotate-y-20 rotate-x-30 scale-100 h-full w-full mask-b-from-70%">
      <CareerShiftCard
        className="absolute top-4 left-14 z-30 shadow-[0_8px_30px_rgba(0,0,0,0.3)]"
        title="Project Manager"
        industry="Cybersecurity"
        score={67}
      />
      <CareerShiftCard
        className="absolute top-10 left-7 z-20 bg-neutral-600"
        title="UX Researcher"
        industry="Tech"
        score={54}
      />
      <CareerShiftCard
        className="absolute top-16 left-0 z-10 bg-neutral-500"
        title="Operations Lead"
        industry="Finance"
        score={42}
      />
    </div>
  );
};

const CareerShiftCard = ({
  className,
  title = "Project Manager",
  industry = "Cybersecurity",
  score = 67,
}: {
  className?: string;
  title?: string;
  industry?: string;
  score?: number;
}) => {
  return (
    <div className={cn("bg-neutral-950 dark:bg-neutral-950 border border-white/10 rounded-2xl overflow-hidden shadow-md w-[260px]", className)}>
      {/* Header: Title + Industry + Chart */}
      <div className="flex gap-4 items-start p-4 border-b border-white/10">
        <div className="flex-1 flex flex-col gap-1">
          <p className="text-lg font-medium text-white">{title}</p>
          <p className="text-sm text-neutral-400">{industry}</p>
        </div>
        <CircularProgress value={score} />
      </div>

      {/* Metrics */}
      <div className="flex flex-col gap-2 p-4 border-b border-white/10">
        <MetricRow icon={<IconCircleDashed className="size-3" />} label="Salary Median" value="155k" unit="USD" />
        <MetricRow icon={<IconCircleDashed className="size-3" />} label="Open Positions" value="1,247" unit="ALL" />
        <MetricRow icon={<IconCircleDashed className="size-3" />} label="Transition Time" value="90" unit="DAY" />
        <MetricRow icon={<IconCircleDashed className="size-3" />} label="Growth Rate" value="+23%" unit="YOY" valueColor="text-emerald-500" />
      </div>

      {/* Progress Bars */}
      <div className="flex flex-col gap-4 p-4">
        <ProgressBar label="Market Demand" value={0.89} color="bg-blue-600" />
        <ProgressBar label="Skill Readiness" value={0.45} color="bg-emerald-500" />
        <ProgressBar label="Success Probability" value={0.67} color="bg-amber-500" />
      </div>

      {/* CTA */}
      <div className="p-4 pt-0">
        <button className="w-full h-8 bg-neutral-800 hover:bg-neutral-700 rounded-lg flex items-center justify-center gap-2 text-xs font-medium text-white transition-colors">
          View Details
          <IconArrowRight className="size-4" />
        </button>
      </div>
    </div>
  );
};

const CircularProgress = ({ value }: { value: number }) => {
  const radius = 12;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (value / 100) * circumference;

  return (
    <div className="relative size-8">
      <svg className="size-8 -rotate-90" viewBox="0 0 32 32">
        <circle
          cx="16"
          cy="16"
          r={radius}
          fill="none"
          stroke="#171717"
          strokeWidth="4"
        />
        <circle
          cx="16"
          cy="16"
          r={radius}
          fill="none"
          stroke="#10b981"
          strokeWidth="4"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-xs font-semibold text-white">
        {value}
      </span>
    </div>
  );
};

const MetricRow = ({
  icon,
  label,
  value,
  unit,
  valueColor = "text-white",
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  unit: string;
  valueColor?: string;
}) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-1 text-neutral-400">
        {icon}
        <span className="text-sm">{label}</span>
      </div>
      <div className="flex items-end gap-0.5">
        <span className={cn("text-sm font-medium", valueColor)}>{value}</span>
        <span className="text-[9px] text-neutral-400">{unit}</span>
      </div>
    </div>
  );
};

const ProgressBar = ({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) => {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-sm text-neutral-400 underline decoration-dotted underline-offset-4">
          {label}
        </span>
        <span className="text-sm font-medium text-white">{value.toFixed(2)}</span>
      </div>
      <div className="h-2 bg-neutral-800 rounded-full overflow-hidden">
        <div
          className={cn("h-full rounded-full", color)}
          style={{ width: `${value * 100}%` }}
        />
      </div>
    </div>
  );
};

const SkeletonCard = ({
  icon,
  title,
  description,
  badge,
  className,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  badge: React.ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={cn(
        "max-w-[85%] h-fit my-auto bg-white dark:bg-neutral-900 mx-auto w-full p-3 rounded-2xl border border-neutral-200 dark:border-neutral-700 shadow-2xl",
        className
      )}
    >
      <div className="flex gap-3 items-center">
        {icon}
        <p className="text-xs md:text-sm font-normal text-black dark:text-white">
          {title}
        </p>
        {badge}
      </div>
      <p className="text-[10px] md:text-sm text-neutral-500 dark:text-neutral-400 font-light mt-3">
        {description}
      </p>
      <div className="flex items-center gap-2 flex-wrap mt-4">
        <Tag text="Resume" />
        <Tag text="LinkedIn" />
        <Tag text="Skills" />
      </div>
    </div>
  );
};

const Tag = ({ text }: { text: string }) => {
  return (
    <div className="px-2 text-[10px] md:text-sm py-1 rounded-sm bg-neutral-200 dark:bg-neutral-700">
      {text}
    </div>
  );
};

const Badge = ({
  variant = "success",
  text,
}: {
  variant?: "danger" | "success" | "warning";
  text: string;
}) => {
  return (
    <div
      className={cn(
        "px-1 py-0.5 rounded-full flex border items-center gap-1 w-fit",
        variant === "danger" && "bg-red-300/10 border-red-300 text-red-500",
        variant === "warning" &&
          "bg-yellow-300/10 border-yellow-300 text-yellow-500",
        variant === "success" &&
          "bg-green-300/10 border-green-300 text-green-500"
      )}
    >
      <IconRipple className="size-3" />
      <p className="text-[10px] font-bold">{text}</p>
    </div>
  );
};

const SkeletonTwo = () => {
  return (
    <div
      style={{
        transform: "rotateY(20deg) rotateX(20deg) rotateZ(-20deg)",
      }}
      className={cn(
        "max-w-[85%] group h-full my-auto bg-neutral-100 dark:bg-neutral-900 mx-auto w-full p-3 rounded-2xl border border-neutral-300 dark:border-neutral-700 shadow-2xl flex flex-col mask-radial-from-50% mask-b-from-50%",
        "translate-x-10",
        "[--pattern-fg:var(--color-neutral-950)]/5 dark:[--pattern-fg:var(--color-white)]/10"
      )}
    >
      <div className="flex gap-3 items-center">
        <IconCircleDashedCheck className="size-4" />
        <p className="text-sm font-normal text-black dark:text-white">
          90-Day Action Plan
        </p>
      </div>
      <div className="relative flex-1 bg-neutral-200 dark:bg-neutral-800 dark:border-neutral-700 mt-4 border border-neutral-200 rounded-2xl">
        <Pattern />
        <div className="absolute rounded-2xl translate-x-2 -translate-y-2 group-hover:translate-x-0 group-hover:-translate-y-0 transition-all duration-300 inset-0 bg-white dark:bg-neutral-900 h-full w-full">
          <Row
            icon={<IconCheck className="size-3 stroke-white fill-green-500" />}
            text="Skills Assessment"
            time="Week 1"
          />
          <GradientHr />
          <Row
            icon={<IconCheck className="size-3 stroke-white fill-green-500" />}
            text="Resume Optimization"
            time="Week 2"
          />
          <GradientHr />
          <Row
            icon={<IconCheck className="size-3 stroke-white fill-green-500" />}
            text="LinkedIn Updates"
            time="Week 3"
          />
          <GradientHr />
          <Row
            icon={<IconCheck className="size-3 stroke-white fill-green-500" />}
            text="Networking Strategy"
            time="Week 4"
          />
          <GradientHr />
          <Row
            icon={<IconLoader2 className="size-3 text-white animate-spin" />}
            text="Interview Prep"
            time="Week 5+"
            variant="warning"
          />
        </div>
      </div>
    </div>
  );
};

const GradientHr = () => {
  return (
    <div className="h-px w-full bg-gradient-to-r from-transparent via-neutral-200 dark:via-neutral-800 to-transparent"></div>
  );
};

const Row = ({
  icon,
  text,
  time,
  variant = "success",
}: {
  icon: React.ReactNode;
  text: string;
  time: string;
  variant?: "success" | "warning" | "danger";
}) => {
  return (
    <div className="flex items-center justify-between px-4 py-2">
      <div className="flex items-center gap-2">
        <div
          className={cn(
            "size-4 flex items-center justify-center rounded-full",
            variant === "success" && "bg-green-500",
            variant === "warning" && "bg-yellow-500"
          )}
        >
          {icon}
        </div>
        <p className="text-neutral-500 font-medium text-xs md:text-sm">
          {text}
        </p>
      </div>
      <div className="flex items-center gap-1 text-neutral-400">
        <IconRipple className="size-3" />
        <p className="text-[10px] font-bold">{time}</p>
      </div>
    </div>
  );
};

const Pattern = () => {
  return (
    <div className="absolute inset-0 bg-[image:repeating-linear-gradient(315deg,_var(--pattern-fg)_0,_var(--pattern-fg)_1px,_transparent_0,_transparent_50%)] bg-[size:10px_10px] bg-fixed"></div>
  );
};

const SkeletonThree = () => {
  return (
    <div className="relative h-full w-full flex items-center justify-center">
      <ShieldIllustration />
      <DottedGlowBackground
        className="pointer-events-none mask-radial-to-70% mask-radial-at-center"
        opacity={1}
        gap={10}
        radius={1.6}
        colorLightVar="--color-neutral-500"
        glowColorLightVar="--color-neutral-600"
        colorDarkVar="--color-neutral-500"
        glowColorDarkVar="--color-sky-800"
        backgroundOpacity={0}
        speedMin={0.3}
        speedMax={1.6}
        speedScale={1}
      />
    </div>
  );
};
