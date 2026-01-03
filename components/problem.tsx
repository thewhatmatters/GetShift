"use client";
import React from "react";
import { Container } from "./container";
import { Heading } from "./heading";
import { Subheading } from "./subheading";
import { cn } from "@/lib/utils";
import { IconPlus, IconArrowRight } from "@tabler/icons-react";
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
        className="absolute top-4 left-14 z-30 shadow-[0_8px_30px_rgba(0,0,0,0.15)]"
        title="Project Manager"
        industry="Fintech & Payment Systems"
        score={83}
      />
      <CareerShiftCard
        className="absolute top-10 left-7 z-20 bg-neutral-100 border-neutral-300"
        title="UX Researcher"
        industry="Tech"
        score={54}
      />
      <CareerShiftCard
        className="absolute top-16 left-0 z-10 bg-neutral-200 border-neutral-300"
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
  industry = "Fintech & Payment Systems",
  score = 83,
}: {
  className?: string;
  title?: string;
  industry?: string;
  score?: number;
}) => {
  return (
    <div className={cn("bg-white border border-neutral-200 rounded-2xl overflow-hidden shadow-md w-[260px]", className)}>
      {/* Header: Title + Industry + Chart */}
      <div className="flex gap-4 items-start p-4 border-b border-neutral-200">
        <div className="flex-1 flex flex-col gap-1">
          <p className="text-lg font-medium text-neutral-900">{title}</p>
          <p className="text-sm text-neutral-500">{industry}</p>
        </div>
        <CircularProgress value={score} />
      </div>

      {/* Metrics */}
      <div className="flex flex-col gap-2 p-4 border-b border-neutral-200">
        <MetricRow icon={<IconCircleDashed className="size-3" />} label="Salary Median" value="155k" unit="USD" />
        <MetricRow icon={<IconCircleDashed className="size-3" />} label="Open Positions" value="1,247" unit="ALL" />
        <MetricRow icon={<IconCircleDashed className="size-3" />} label="Transition Time" value="90" unit="DAY" />
        <MetricRow icon={<IconCircleDashed className="size-3" />} label="Growth Rate" value="+23%" unit="YOY" valueColor="text-emerald-500" />
      </div>

      {/* Progress Bars */}
      <div className="flex flex-col gap-4 p-4">
        <ProgressBar label="Market Demand" value={0.89} color="bg-orange-500" />
        <ProgressBar label="Skill Readiness" value={0.89} color="bg-teal-600" />
        <ProgressBar label="Success Probability" value={0.69} color="bg-neutral-300" />
      </div>

      {/* CTA */}
      <div className="p-4 pt-0">
        <button className="w-full h-10 bg-neutral-100 hover:bg-neutral-200 rounded-lg flex items-center justify-center gap-2 text-sm font-medium text-neutral-900 transition-colors">
          View Details
          <IconArrowRight className="size-4" />
        </button>
      </div>
    </div>
  );
};

const CircularProgress = ({ value }: { value: number }) => {
  const radius = 14;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (value / 100) * circumference;

  return (
    <div className="relative size-10">
      <svg className="size-10 -rotate-90" viewBox="0 0 36 36">
        <circle
          cx="18"
          cy="18"
          r={radius}
          fill="none"
          stroke="#e5e5e5"
          strokeWidth="3"
        />
        <circle
          cx="18"
          cy="18"
          r={radius}
          fill="none"
          stroke="#10b981"
          strokeWidth="3"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-sm font-semibold text-neutral-900">
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
  valueColor = "text-neutral-900",
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  unit: string;
  valueColor?: string;
}) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-1 text-neutral-500">
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
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="text-sm text-neutral-500">
          {label}
        </span>
        <span className="text-sm font-medium text-neutral-900">{value.toFixed(2)}</span>
      </div>
      <div className="h-2 bg-neutral-100 rounded-full overflow-hidden">
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
    <div className="perspective-distant h-full flex items-center justify-center">
      <div
        style={{
          transform: "rotateY(15deg) rotateX(15deg) rotateZ(-10deg)",
        }}
        className="w-[85%] bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-700 shadow-2xl flex flex-col overflow-hidden translate-x-4"
      >
      {/* Gantt Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800">
        <span className="text-[10px] font-semibold text-neutral-500 uppercase tracking-wider">Tasks</span>
        <span className="text-[10px] font-semibold text-neutral-500 uppercase tracking-wider">Duration</span>
      </div>

      {/* Phase Header */}
      <div className="px-4 py-2 bg-neutral-100 dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-700">
        <p className="text-[10px] font-bold text-neutral-900 dark:text-white uppercase tracking-wide">
          Experience Phase <span className="font-normal text-neutral-500">(Weeks 5-8)</span>
        </p>
      </div>

      {/* Tasks */}
      <GanttRow status="done" task="Volunteer PM for nonprofit" duration="4 weeks" isChild />
      <GanttRow status="done" task="Lead internal project at work" duration="4 weeks" isChild />
      <GanttRow status="warning" task="Build PM portfolio (3 cases)" duration="3 weeks" isChild />
      <GanttRow status="tbd" task="Document measurable outcomes" duration="2 weeks" isChild />

      {/* Phase Header */}
      <div className="px-4 py-2 bg-neutral-100 dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-700">
        <p className="text-[10px] font-bold text-neutral-900 dark:text-white uppercase tracking-wide">
          Launch Phase <span className="font-normal text-neutral-500">(Weeks 9-12)</span>
        </p>
      </div>

      <GanttRow status="tbd" task="Resume tailored to PM" duration="1 week" isChild />
      <GanttRow status="tbd" task="Interview prep & mock interviews" duration="2 weeks" isChild />
      <GanttRow status="tbd" task="Company research & targeting" duration="Ongoing" isChild />

      {/* Legend */}
      <div className="mt-auto px-4 py-2 border-t border-neutral-200 dark:border-neutral-700 flex items-center gap-4">
        <div className="flex items-center gap-1">
          <div className="size-2 rounded-full bg-emerald-500" />
          <span className="text-[9px] text-neutral-500 uppercase">Done</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="size-2 rounded-full bg-amber-500" />
          <span className="text-[9px] text-neutral-500 uppercase">In Progress</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="size-2 rounded-full bg-neutral-400" />
          <span className="text-[9px] text-neutral-500 uppercase">TBD</span>
        </div>
      </div>
      </div>
    </div>
  );
};

const GanttRow = ({
  status,
  task,
  duration,
  isChild = false,
}: {
  status: "done" | "warning" | "tbd";
  task: string;
  duration: string;
  isChild?: boolean;
}) => {
  return (
    <div className="flex items-center justify-between px-4 py-1.5 border-b border-neutral-100 dark:border-neutral-800">
      <div className="flex items-center gap-2">
        <div
          className={cn(
            "size-2 rounded-full shrink-0",
            status === "done" && "bg-emerald-500",
            status === "warning" && "bg-amber-500",
            status === "tbd" && "bg-neutral-400"
          )}
        />
        <span className={cn(
          "text-[10px] text-neutral-700 dark:text-neutral-300 truncate max-w-[140px]",
          isChild && "pl-1"
        )}>
          {task}
        </span>
      </div>
      <span className="text-[9px] text-neutral-500 whitespace-nowrap">{duration}</span>
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
    <div className="perspective-distant h-full flex items-center justify-center">
      <div
        style={{
          transform: "rotateY(-15deg) rotateX(15deg) rotateZ(10deg)",
        }}
        className="w-[85%] bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-700 shadow-2xl overflow-hidden -translate-x-4"
      >
        {/* Card Header */}
        <div className="px-4 py-3 border-b border-neutral-200 dark:border-neutral-700">
          <p className="text-xs font-semibold text-neutral-900 dark:text-white">Skills Gap Analysis</p>
          <p className="text-[10px] text-neutral-500 mt-0.5">Project Manager Role</p>
        </div>

        {/* Chart */}
        <div className="px-2 py-2">
          <RadarChart />
        </div>

        {/* Legend */}
        <div className="px-4 py-2 border-t border-neutral-200 dark:border-neutral-700 flex items-center justify-center gap-6">
          <div className="flex items-center gap-1.5">
            <div className="size-2 rounded-sm bg-blue-200" />
            <span className="text-[9px] text-neutral-500">Required</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="size-2 rounded-sm bg-blue-500" />
            <span className="text-[9px] text-neutral-500">Your Skills</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const RadarChart = () => {
  const skills = [
    { name: "Leadership", required: 0.9, current: 0.75 },
    { name: "Communication", required: 0.95, current: 0.85 },
    { name: "Risk Mgmt", required: 0.8, current: 0.5 },
    { name: "Stakeholders", required: 0.85, current: 0.7 },
    { name: "Agile/Scrum", required: 0.75, current: 0.4 },
    { name: "Budgeting", required: 0.7, current: 0.55 },
  ];

  const centerX = 140;
  const centerY = 120;
  const maxRadius = 80;
  const levels = 4;

  // Calculate point position on radar
  const getPoint = (index: number, value: number) => {
    const angle = (Math.PI * 2 * index) / skills.length - Math.PI / 2;
    const radius = maxRadius * value;
    return {
      x: centerX + radius * Math.cos(angle),
      y: centerY + radius * Math.sin(angle),
    };
  };

  // Generate polygon points string
  const getPolygonPoints = (values: number[]) => {
    return values
      .map((value, index) => {
        const point = getPoint(index, value);
        return `${point.x},${point.y}`;
      })
      .join(" ");
  };

  // Grid levels
  const gridLevels = Array.from({ length: levels }, (_, i) => (i + 1) / levels);

  return (
    <svg viewBox="0 0 280 240" className="w-full">
      {/* Grid circles/polygons */}
      {gridLevels.map((level) => (
        <polygon
          key={level}
          points={getPolygonPoints(skills.map(() => level))}
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          className="text-neutral-200 dark:text-neutral-700"
        />
      ))}

      {/* Axis lines */}
      {skills.map((_, index) => {
        const point = getPoint(index, 1);
        return (
          <line
            key={index}
            x1={centerX}
            y1={centerY}
            x2={point.x}
            y2={point.y}
            stroke="currentColor"
            strokeWidth="1"
            className="text-neutral-200 dark:text-neutral-700"
          />
        );
      })}

      {/* Required skills area (light) */}
      <polygon
        points={getPolygonPoints(skills.map((s) => s.required))}
        fill="currentColor"
        fillOpacity="0.3"
        stroke="currentColor"
        strokeWidth="1.5"
        className="text-blue-300 dark:text-blue-400"
      />

      {/* Current skills area (dark) */}
      <polygon
        points={getPolygonPoints(skills.map((s) => s.current))}
        fill="currentColor"
        fillOpacity="0.6"
        stroke="currentColor"
        strokeWidth="2"
        className="text-blue-500 dark:text-blue-500"
      />

      {/* Data points for current skills */}
      {skills.map((skill, index) => {
        const point = getPoint(index, skill.current);
        return (
          <circle
            key={index}
            cx={point.x}
            cy={point.y}
            r="3"
            fill="currentColor"
            className="text-blue-600 dark:text-blue-400"
          />
        );
      })}

      {/* Labels */}
      {skills.map((skill, index) => {
        const point = getPoint(index, 1.25);
        const isTop = index === 0;
        const isBottom = index === 3;
        return (
          <text
            key={index}
            x={point.x}
            y={point.y}
            textAnchor="middle"
            dominantBaseline={isTop ? "auto" : isBottom ? "hanging" : "middle"}
            className="fill-neutral-600 dark:fill-neutral-400 text-[9px] font-medium"
          >
            {skill.name}
          </text>
        );
      })}
    </svg>
  );
};
