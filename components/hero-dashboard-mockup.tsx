"use client";
import React from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import {
  IconCircleDashed,
  IconArrowRight,
  IconSearch,
  IconHome,
  IconBriefcase,
  IconSettings,
  IconChartBar,
} from "@tabler/icons-react";

export const HeroDashboardMockup = () => {
  return (
    <div className="relative w-full pt-12 pb-20">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        viewport={{ once: true }}
        className="w-full flex justify-center perspective-[2000px]"
      >
        <div
          className="rounded-2xl overflow-hidden shadow-2xl border border-neutral-200 dark:border-white/10"
          style={{
            transform: "rotateX(10deg) rotateY(-5deg)",
            transformStyle: "preserve-3d",
          }}
        >
          <DashboardMockup />
        </div>
      </motion.div>
    </div>
  );
};

const DashboardMockup = () => {
  return (
    <div className="bg-neutral-950 w-[320px] sm:w-[500px] md:w-[700px] lg:w-[900px] h-[400px] sm:h-[450px] md:h-[500px] lg:h-[550px] flex">
      {/* Sidebar */}
      <div className="w-16 bg-neutral-900 border-r border-white/10 flex flex-col items-center py-4 gap-4">
        <div className="size-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-sm">
          S
        </div>
        <div className="flex-1 flex flex-col gap-2 mt-4">
          <SidebarIcon icon={<IconHome className="size-4" />} active />
          <SidebarIcon icon={<IconBriefcase className="size-4" />} />
          <SidebarIcon icon={<IconChartBar className="size-4" />} />
          <SidebarIcon icon={<IconSettings className="size-4" />} />
        </div>
      </div>

      {/* Career Cards Panel */}
      <div className="w-80 bg-neutral-900/50 border-r border-white/10 p-4 overflow-hidden">
        <div className="flex gap-2 mb-4">
          <button className="px-3 py-1.5 bg-neutral-800 rounded-full text-xs text-white">
            Suggested <span className="ml-1 px-1.5 py-0.5 bg-blue-600 rounded-full text-[10px]">4</span>
          </button>
          <button className="px-3 py-1.5 bg-transparent rounded-full text-xs text-neutral-400">
            All <span className="ml-1 px-1.5 py-0.5 bg-neutral-700 rounded-full text-[10px]">12</span>
          </button>
        </div>

        <CareerShiftCardMini
          title="Project Manager"
          industry="Cybersecurity"
          score={67}
          salary="155k"
          positions="1,247"
          growthRate="+23%"
          marketDemand={0.89}
          skillReadiness={0.89}
          successProb={0.69}
        />

        <div className="mt-3 opacity-60">
          <CareerShiftCardMini
            title="UX Researcher"
            industry="Fintech & Payments"
            score={54}
            salary="125k"
            positions="892"
            growthRate="+18%"
            marketDemand={0.75}
            skillReadiness={0.65}
            successProb={0.55}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 overflow-hidden">
        <div className="flex items-center gap-2 text-xs text-neutral-500 mb-4">
          <span>Project Manager</span>
          <span>/</span>
          <span>Jobs</span>
        </div>

        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold text-white">Project Manager</h2>
          <CircularProgressMini value={67} />
        </div>

        <p className="text-sm text-neutral-400 mb-6 max-w-lg">
          Project Managers are organizational leaders who guide cross-functional teams to deliver initiatives on time and within budget.
        </p>

        <div className="flex gap-2 mb-4">
          <span className="px-2 py-1 bg-neutral-800 rounded text-xs text-neutral-300">Overview</span>
          <span className="px-2 py-1 bg-transparent rounded text-xs text-neutral-500">Market Intelligence</span>
          <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-xs">Jobs</span>
        </div>

        <div className="flex gap-2 mb-4">
          <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs flex items-center gap-1">
            Hybrid <span className="text-[10px]">x</span>
          </span>
          <span className="px-2 py-1 bg-purple-500/20 text-purple-400 rounded-full text-xs flex items-center gap-1">
            Senior Level <span className="text-[10px]">x</span>
          </span>
          <div className="flex-1 flex items-center gap-2 px-3 py-1 bg-neutral-800/50 rounded-full">
            <IconSearch className="size-3 text-neutral-500" />
            <span className="text-xs text-neutral-500">Select a tag...</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <JobCard
            title="Project Manager, Quote-To-Order"
            company="Cloudflare"
            location="Austin, TX"
            tags={["Hybrid", "Senior Level"]}
          />
          <JobCard
            title="Project Manager, Platform Services"
            company="Crowdstrike"
            location="Austin, TX"
            tags={["Remote", "Hybrid", "Senior Level"]}
          />
        </div>
      </div>
    </div>
  );
};

const SidebarIcon = ({ icon, active = false }: { icon: React.ReactNode; active?: boolean }) => (
  <div
    className={cn(
      "size-10 rounded-lg flex items-center justify-center transition-colors",
      active ? "bg-neutral-800 text-white" : "text-neutral-500 hover:text-neutral-300"
    )}
  >
    {icon}
  </div>
);

const CareerShiftCardMini = ({
  title,
  industry,
  score,
  salary,
  positions,
  growthRate,
  marketDemand,
  skillReadiness,
  successProb,
}: {
  title: string;
  industry: string;
  score: number;
  salary: string;
  positions: string;
  growthRate: string;
  marketDemand: number;
  skillReadiness: number;
  successProb: number;
}) => {
  return (
    <div className="bg-neutral-950 border border-white/10 rounded-xl overflow-hidden">
      <div className="flex items-start justify-between p-3 border-b border-white/10">
        <div>
          <p className="text-sm font-medium text-white">{title}</p>
          <p className="text-xs text-neutral-400">{industry}</p>
        </div>
        <CircularProgressMini value={score} />
      </div>

      <div className="p-3 space-y-1.5 border-b border-white/10">
        <MetricRowMini label="Salary Median" value={salary} unit="USD" />
        <MetricRowMini label="Open Positions" value={positions} unit="ALL" />
        <MetricRowMini label="Growth Rate" value={growthRate} unit="YOY" valueColor="text-emerald-500" />
      </div>

      <div className="p-3 space-y-2">
        <ProgressBarMini label="Market Demand" value={marketDemand} color="bg-blue-600" />
        <ProgressBarMini label="Skill Readiness" value={skillReadiness} color="bg-emerald-500" />
        <ProgressBarMini label="Success Probability" value={successProb} color="bg-amber-500" />
      </div>

      <div className="p-3 pt-0">
        <button className="w-full h-7 bg-neutral-800 rounded-md flex items-center justify-center gap-1.5 text-[10px] font-medium text-white">
          View Details
          <IconArrowRight className="size-3" />
        </button>
      </div>
    </div>
  );
};

const CircularProgressMini = ({ value }: { value: number }) => {
  const radius = 10;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (value / 100) * circumference;

  return (
    <div className="relative size-6">
      <svg className="size-6 -rotate-90" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r={radius} fill="none" stroke="#171717" strokeWidth="3" />
        <circle
          cx="12"
          cy="12"
          r={radius}
          fill="none"
          stroke="#10b981"
          strokeWidth="3"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-[8px] font-semibold text-white">
        {value}
      </span>
    </div>
  );
};

const MetricRowMini = ({
  label,
  value,
  unit,
  valueColor = "text-white",
}: {
  label: string;
  value: string;
  unit: string;
  valueColor?: string;
}) => (
  <div className="flex items-center justify-between">
    <div className="flex items-center gap-1 text-neutral-400">
      <IconCircleDashed className="size-2.5" />
      <span className="text-[10px]">{label}</span>
    </div>
    <div className="flex items-end gap-0.5">
      <span className={cn("text-[10px] font-medium", valueColor)}>{value}</span>
      <span className="text-[7px] text-neutral-500">{unit}</span>
    </div>
  </div>
);

const ProgressBarMini = ({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) => (
  <div className="space-y-1">
    <div className="flex items-center justify-between">
      <span className="text-[10px] text-neutral-400">{label}</span>
      <span className="text-[10px] font-medium text-white">{value.toFixed(2)}</span>
    </div>
    <div className="h-1.5 bg-neutral-800 rounded-full overflow-hidden">
      <div className={cn("h-full rounded-full", color)} style={{ width: `${value * 100}%` }} />
    </div>
  </div>
);

const JobCard = ({
  title,
  company,
  location,
  tags,
}: {
  title: string;
  company: string;
  location: string;
  tags: string[];
}) => (
  <div className="bg-neutral-900 border border-white/10 rounded-lg p-3">
    <div className="flex items-start gap-2 mb-2">
      <div className="size-8 rounded-full bg-orange-500 flex items-center justify-center text-white text-xs font-bold">
        {company[0]}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium text-white truncate">{title}</p>
        <p className="text-[10px] text-neutral-400">{company} - {location}</p>
      </div>
    </div>
    <div className="flex gap-1 flex-wrap mb-2">
      {tags.map((tag) => (
        <span key={tag} className="px-1.5 py-0.5 bg-neutral-800 rounded text-[8px] text-neutral-400">
          {tag}
        </span>
      ))}
    </div>
    <div className="flex gap-2">
      <button className="flex-1 h-6 bg-neutral-800 rounded text-[9px] text-neutral-300">Save</button>
      <button className="flex-1 h-6 bg-blue-600 rounded text-[9px] text-white flex items-center justify-center gap-1">
        Apply <IconArrowRight className="size-2.5" />
      </button>
    </div>
  </div>
);
