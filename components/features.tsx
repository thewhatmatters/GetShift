"use client";
import React from "react";
import { Container } from "./container";
import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import { IconArrowRight, IconCircleDashed } from "@tabler/icons-react";

export const Features = () => {
  return (
    <section id="features" className="py-10 md:py-20 lg:py-32 relative overflow-hidden">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-2 border-y border-neutral-200 dark:border-neutral-800 divide-neutral-200 dark:divide-neutral-800">
          <div className="md:border-r border-b border-neutral-200 dark:border-neutral-800">
            <CardContent>
              <h3 className="text-lg font-bold text-neutral-800 dark:text-neutral-200">
                Career Match Analysis
              </h3>
              <CardDescription>
                AI-powered analysis of your experience to identify 10+ career paths you&apos;re already qualified for.
              </CardDescription>
            </CardContent>
            <CardSkeleton>
              <SkeletonOne />
            </CardSkeleton>
          </div>
          <div className="border-b border-neutral-200 dark:border-neutral-800">
            <CardContent>
              <h3 className="text-lg font-bold text-neutral-800 dark:text-neutral-200">
                90-Day Action Plan
              </h3>
              <CardDescription>
                A personalized roadmap with specific actions, timelines, and milestones to land your target role.
              </CardDescription>
            </CardContent>
            <CardSkeleton className="mask-radial-from-20%">
              <SkeletonTwo />
            </CardSkeleton>
          </div>
          <div className="md:border-r border-b md:border-b-0 border-neutral-200 dark:border-neutral-800">
            <CardContent>
              <h3 className="text-lg font-bold text-neutral-800 dark:text-neutral-200">
                Skill Gap Report
              </h3>
              <CardDescription>
                Know exactly what&apos;s missing — and what you can skip. We highlight the fastest paths.
              </CardDescription>
            </CardContent>
            <CardSkeleton className="mask-radial-from-20% mask-r-from-50%">
              <SkeletonThree />
            </CardSkeleton>
          </div>
          <div className="dark:border-neutral-800">
            <CardContent>
              <h3 className="text-lg font-bold text-neutral-800 dark:text-neutral-200">
                LinkedIn Optimization
              </h3>
              <CardDescription>
                Strategic recommendations to position your profile for career changers.
              </CardDescription>
            </CardContent>
            <CardSkeleton>
              <SkeletonFour />
            </CardSkeleton>
          </div>
        </div>
      </Container>
    </section>
  );
};

const CardContent = ({ children }: { children: React.ReactNode }) => {
  return <div className="p-4 md:p-8">{children}</div>;
};

const CardDescription = ({ children }: { children: React.ReactNode }) => {
  return (
    <p className="text-neutral-600 dark:text-neutral-400 mt-2 max-w-md text-balance">
      {children}
    </p>
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
        "relative h-80 sm:h-60 flex flex-col md:h-80 overflow-hidden",
        className
      )}
    >
      {children}
    </div>
  );
};

// Career Match Analysis - Stacked career cards
const SkeletonOne = () => {
  return (
    <div className="h-full w-full flex items-center justify-center p-4">
      <div className="relative w-[220px] h-[200px]">
        <CareerCard
          className="absolute top-0 left-8 z-30 shadow-lg"
          title="Project Manager"
          industry="Fintech"
          score={83}
        />
        <CareerCard
          className="absolute top-6 left-4 z-20 opacity-80"
          title="UX Researcher"
          industry="Tech"
          score={54}
        />
        <CareerCard
          className="absolute top-12 left-0 z-10 opacity-60"
          title="Operations Lead"
          industry="Finance"
          score={42}
        />
      </div>
    </div>
  );
};

const CareerCard = ({
  className,
  title,
  industry,
  score,
}: {
  className?: string;
  title: string;
  industry: string;
  score: number;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className={cn(
        "bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-xl p-3 w-[200px]",
        className
      )}
    >
      <div className="flex items-start justify-between mb-2">
        <div>
          <p className="text-sm font-semibold text-neutral-900 dark:text-white">{title}</p>
          <p className="text-xs text-neutral-500">{industry}</p>
        </div>
        <MiniScore value={score} />
      </div>
      <div className="space-y-1.5">
        <MiniMetric label="Salary" value="$155k" />
        <MiniMetric label="Open Roles" value="1,247" />
        <MiniMetric label="Growth" value="+23%" valueColor="text-emerald-500" />
      </div>
    </motion.div>
  );
};

const MiniScore = ({ value }: { value: number }) => {
  const radius = 12;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (value / 100) * circumference;
  return (
    <div className="relative size-8">
      <svg className="size-8 -rotate-90" viewBox="0 0 32 32">
        <circle cx="16" cy="16" r={radius} fill="none" stroke="#e5e5e5" strokeWidth="3" />
        <circle cx="16" cy="16" r={radius} fill="none" stroke="#10b981" strokeWidth="3" strokeDasharray={circumference} strokeDashoffset={strokeDashoffset} strokeLinecap="round" />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-neutral-900 dark:text-white">{value}</span>
    </div>
  );
};

const MiniMetric = ({ label, value, valueColor = "text-neutral-900 dark:text-white" }: { label: string; value: string; valueColor?: string }) => (
  <div className="flex items-center justify-between">
    <span className="text-[10px] text-neutral-500">{label}</span>
    <span className={cn("text-[10px] font-medium", valueColor)}>{value}</span>
  </div>
);

// 90-Day Action Plan - Gantt chart
const SkeletonTwo = () => {
  return (
    <div className="h-full w-full flex items-center justify-center p-4">
      <div className="w-full max-w-[280px] bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-700 shadow-lg overflow-hidden">
        <div className="flex items-center justify-between px-3 py-2 border-b border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800">
          <span className="text-[9px] font-semibold text-neutral-500 uppercase">Tasks</span>
          <span className="text-[9px] font-semibold text-neutral-500 uppercase">Duration</span>
        </div>
        <div className="px-3 py-1.5 bg-neutral-100 dark:bg-neutral-800 border-b border-neutral-100 dark:border-neutral-700">
          <p className="text-[9px] font-bold text-neutral-900 dark:text-white uppercase">Foundation <span className="font-normal text-neutral-500">(Weeks 1-4)</span></p>
        </div>
        <GanttRow status="done" task="Skills assessment" duration="1 week" />
        <GanttRow status="done" task="Resume optimization" duration="2 weeks" />
        <GanttRow status="warning" task="LinkedIn updates" duration="1 week" />
        <div className="px-3 py-1.5 bg-neutral-100 dark:bg-neutral-800 border-b border-neutral-100 dark:border-neutral-700">
          <p className="text-[9px] font-bold text-neutral-900 dark:text-white uppercase">Launch <span className="font-normal text-neutral-500">(Weeks 5-8)</span></p>
        </div>
        <GanttRow status="tbd" task="Network building" duration="Ongoing" />
        <GanttRow status="tbd" task="Interview prep" duration="2 weeks" />
        <div className="px-3 py-1.5 border-t border-neutral-200 dark:border-neutral-700 flex items-center justify-center gap-4">
          <div className="flex items-center gap-1"><div className="size-1.5 rounded-full bg-emerald-500" /><span className="text-[8px] text-neutral-500">Done</span></div>
          <div className="flex items-center gap-1"><div className="size-1.5 rounded-full bg-amber-500" /><span className="text-[8px] text-neutral-500">In Progress</span></div>
          <div className="flex items-center gap-1"><div className="size-1.5 rounded-full bg-neutral-400" /><span className="text-[8px] text-neutral-500">TBD</span></div>
        </div>
      </div>
    </div>
  );
};

const GanttRow = ({ status, task, duration }: { status: "done" | "warning" | "tbd"; task: string; duration: string }) => (
  <div className="flex items-center justify-between px-3 py-1 border-b border-neutral-100 dark:border-neutral-800">
    <div className="flex items-center gap-1.5">
      <div className={cn("size-1.5 rounded-full", status === "done" && "bg-emerald-500", status === "warning" && "bg-amber-500", status === "tbd" && "bg-neutral-400")} />
      <span className="text-[9px] text-neutral-700 dark:text-neutral-300">{task}</span>
    </div>
    <span className="text-[8px] text-neutral-500">{duration}</span>
  </div>
);

// Skill Gap Report - Radar chart
const SkeletonThree = () => {
  return (
    <div className="h-full w-full flex items-center justify-center p-4">
      <div className="w-full max-w-[240px]">
        <RadarChart />
        <div className="flex items-center justify-center gap-4 mt-2">
          <div className="flex items-center gap-1"><div className="size-2 rounded-sm bg-blue-200" /><span className="text-[8px] text-neutral-500">Required</span></div>
          <div className="flex items-center gap-1"><div className="size-2 rounded-sm bg-blue-500" /><span className="text-[8px] text-neutral-500">Your Skills</span></div>
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
    { name: "Agile", required: 0.75, current: 0.4 },
    { name: "Budget", required: 0.7, current: 0.55 },
  ];
  const centerX = 100, centerY = 80, maxRadius = 50, levels = 4;
  const getPoint = (index: number, value: number) => {
    const angle = (Math.PI * 2 * index) / skills.length - Math.PI / 2;
    return { x: centerX + maxRadius * value * Math.cos(angle), y: centerY + maxRadius * value * Math.sin(angle) };
  };
  const getPolygonPoints = (values: number[]) => values.map((v, i) => { const p = getPoint(i, v); return `${p.x},${p.y}`; }).join(" ");
  const gridLevels = Array.from({ length: levels }, (_, i) => (i + 1) / levels);

  return (
    <svg viewBox="0 0 200 160" className="w-full">
      {gridLevels.map((level) => <polygon key={level} points={getPolygonPoints(skills.map(() => level))} fill="none" stroke="currentColor" strokeWidth="1" className="text-neutral-200 dark:text-neutral-700" />)}
      {skills.map((_, i) => { const p = getPoint(i, 1); return <line key={i} x1={centerX} y1={centerY} x2={p.x} y2={p.y} stroke="currentColor" strokeWidth="1" className="text-neutral-200 dark:text-neutral-700" />; })}
      <polygon points={getPolygonPoints(skills.map((s) => s.required))} fill="currentColor" fillOpacity="0.3" stroke="currentColor" strokeWidth="1" className="text-blue-300" />
      <polygon points={getPolygonPoints(skills.map((s) => s.current))} fill="currentColor" fillOpacity="0.6" stroke="currentColor" strokeWidth="2" className="text-blue-500" />
      {skills.map((s, i) => { const p = getPoint(i, s.current); return <circle key={i} cx={p.x} cy={p.y} r="2" fill="currentColor" className="text-blue-600" />; })}
      {skills.map((s, i) => { const p = getPoint(i, 1.3); return <text key={i} x={p.x} y={p.y} textAnchor="middle" dominantBaseline="middle" className="fill-neutral-600 dark:fill-neutral-400 text-[7px]">{s.name}</text>; })}
    </svg>
  );
};

// LinkedIn Optimization - Profile tips
const SkeletonFour = () => {
  const tips = [
    { label: "Headline", status: "done", tip: "Career Transition Ready" },
    { label: "Summary", status: "warning", tip: "Add accomplishments" },
    { label: "Experience", status: "done", tip: "Quantified results" },
    { label: "Skills", status: "tbd", tip: "Add PM skills" },
    { label: "Recommendations", status: "tbd", tip: "Request 3 more" },
  ];
  return (
    <div className="h-full w-full flex items-center justify-center p-4">
      <div className="w-full max-w-[260px] bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-700 shadow-lg overflow-hidden">
        <div className="px-3 py-2 border-b border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800">
          <p className="text-[10px] font-semibold text-neutral-900 dark:text-white">LinkedIn Profile Score</p>
          <div className="flex items-center gap-2 mt-1">
            <div className="flex-1 h-1.5 bg-neutral-200 dark:bg-neutral-700 rounded-full overflow-hidden">
              <div className="h-full bg-blue-500 rounded-full" style={{ width: "68%" }} />
            </div>
            <span className="text-[10px] font-bold text-blue-500">68%</span>
          </div>
        </div>
        <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
          {tips.map((item) => (
            <div key={item.label} className="flex items-center justify-between px-3 py-1.5">
              <div className="flex items-center gap-1.5">
                <div className={cn("size-1.5 rounded-full", item.status === "done" && "bg-emerald-500", item.status === "warning" && "bg-amber-500", item.status === "tbd" && "bg-neutral-400")} />
                <span className="text-[9px] font-medium text-neutral-700 dark:text-neutral-300">{item.label}</span>
              </div>
              <span className="text-[8px] text-neutral-500">{item.tip}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
