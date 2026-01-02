"use client";
import React from "react";
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

// Market Intelligence Screen (Top layer) - Light theme
const MarketIntelligenceScreen = () => {
  return (
    <div className="bg-white w-full h-full flex rounded-lg overflow-hidden border border-neutral-200">
      <Sidebar />
      <CareerCardsPanel />

      {/* Main Content - Market Intelligence */}
      <div className="flex-1 bg-white p-8">
        <div className="flex items-center gap-2 text-sm text-neutral-500 mb-6">
          <span>Project Manager</span>
          <span>&gt;</span>
          <span className="text-neutral-900 font-medium">Market Intelligence</span>
        </div>

        <div className="flex items-start justify-between mb-8">
          <div>
            <h2 className="text-3xl font-semibold text-neutral-900">Project Manager</h2>
            <p className="text-base text-neutral-500 mt-2 max-w-xl">
              Project Managers are organizational leaders who guide cross-functional teams to deliver initiatives on time, within budget, and to specification.
            </p>
          </div>
          <CircularProgressLight value={67} />
        </div>

        <div className="flex gap-6 mb-8 border-b border-neutral-200">
          <span className="px-1 py-3 text-base text-neutral-500">Overview</span>
          <span className="px-1 py-3 text-base text-neutral-900 border-b-2 border-neutral-900 font-medium">Market Intelligence</span>
          <span className="px-1 py-3 text-base text-neutral-500">Jobs</span>
        </div>

        <div className="grid grid-cols-4 gap-6 mb-8">
          <StatCard label="Salary Median" value="$155k" change="+12%" />
          <StatCard label="Job Growth" value="+23%" change="+5%" positive />
          <StatCard label="Open Positions" value="1,247" />
          <StatCard label="Avg. Tenure" value="2.3 yrs" />
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="bg-neutral-50 rounded-xl p-6 border border-neutral-200">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-base font-semibold text-neutral-900">Salary Progression</h3>
              <span className="text-sm text-neutral-500">Based on experience level</span>
            </div>
            <SalaryChart />
          </div>

          <div className="space-y-6">
            <div className="bg-neutral-50 rounded-xl p-6 border border-neutral-200">
              <h3 className="text-base font-semibold text-neutral-900 mb-4">Top Companies Hiring</h3>
              <div className="space-y-3">
                <CompanyRow name="Microsoft" location="Remote/Hybrid" />
                <CompanyRow name="Google" location="Mountain View, CA" />
                <CompanyRow name="JPMorgan Chase" location="New York, NY" />
                <CompanyRow name="Cloudflare" location="Austin, TX" />
              </div>
            </div>

            <div className="bg-neutral-50 rounded-xl p-6 border border-neutral-200">
              <h3 className="text-base font-semibold text-neutral-900 mb-4">Geography</h3>
              <div className="space-y-3">
                <GeoRow city="Austin" percent={53} />
                <GeoRow city="New York" percent={23} />
                <GeoRow city="San Francisco" percent={15} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Jobs Screen (Back layer) - Light theme
const JobsScreen = () => {
  return (
    <div className="bg-white w-full h-full flex rounded-lg overflow-hidden border border-neutral-200">
      <Sidebar />
      <CareerCardsPanel />

      {/* Main Content - Jobs */}
      <div className="flex-1 bg-white p-8">
        <div className="flex items-center gap-2 text-sm text-neutral-500 mb-6">
          <span>Project Manager</span>
          <span>&gt;</span>
          <span className="text-neutral-900 font-medium">Jobs</span>
        </div>

        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-3xl font-semibold text-neutral-900">Project Manager</h2>
            <p className="text-base text-neutral-500 mt-2 max-w-xl">
              Project Managers are organizational leaders who guide cross-functional teams.
            </p>
          </div>
          <CircularProgressLight value={67} />
        </div>

        <div className="flex gap-6 mb-6 border-b border-neutral-200">
          <span className="px-1 py-3 text-base text-neutral-500">Overview</span>
          <span className="px-1 py-3 text-base text-neutral-500">Market Intelligence</span>
          <span className="px-1 py-3 text-base text-neutral-900 border-b-2 border-neutral-900 font-medium">Jobs</span>
        </div>

        <div className="flex gap-3 mb-6">
          <span className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm flex items-center gap-2">
            Hybrid <span>×</span>
          </span>
          <span className="px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm flex items-center gap-2">
            Senior Level <span>×</span>
          </span>
          <div className="flex-1 flex items-center gap-3 px-4 py-2 bg-neutral-100 rounded-full">
            <IconSearch className="size-4 text-neutral-400" />
            <span className="text-sm text-neutral-400">Select a tag...</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <JobCardLight title="Project Manager, Quote-To-Order" company="Cloudflare" location="Austin, TX" tags={["Hybrid", "Senior Level"]} color="bg-orange-500" />
          <JobCardLight title="Project Manager, Platform Services" company="Crowdstrike" location="Austin, TX" tags={["Remote", "Hybrid"]} color="bg-red-500" />
          <JobCardLight title="Project Manager, Communication" company="Twilio" location="San Francisco, CA" tags={["Hybrid", "Senior Level"]} color="bg-pink-500" />
          <JobCardLight title="Project Manager, AI" company="Microsoft" location="Remote" tags={["Remote", "Senior Level"]} color="bg-blue-500" />
        </div>

        <div className="flex items-center justify-center gap-3 mt-6">
          <span className="text-sm text-neutral-400">← Previous</span>
          <span className="size-8 flex items-center justify-center bg-neutral-900 text-white text-sm rounded">1</span>
          <span className="size-8 flex items-center justify-center text-neutral-500 text-sm">2</span>
          <span className="size-8 flex items-center justify-center text-neutral-500 text-sm">3</span>
          <span className="text-sm text-neutral-900">Next →</span>
        </div>
      </div>
    </div>
  );
};

// Shared Components - Light sidebar
const Sidebar = () => (
  <div className="w-16 bg-neutral-100 border-r border-neutral-200 flex flex-col items-center py-4 gap-4">
    <div className="size-8 rounded-lg bg-neutral-900 flex items-center justify-center text-white font-bold text-sm">S</div>
    <div className="flex-1 flex flex-col gap-2 mt-4">
      <SidebarIcon icon={<IconHome className="size-4" />} active />
      <SidebarIcon icon={<IconBriefcase className="size-4" />} />
      <SidebarIcon icon={<IconChartBar className="size-4" />} />
      <SidebarIcon icon={<IconSettings className="size-4" />} />
    </div>
  </div>
);

const SidebarIcon = ({ icon, active = false }: { icon: React.ReactNode; active?: boolean }) => (
  <div className={cn("size-10 rounded-lg flex items-center justify-center", active ? "bg-white text-neutral-900 shadow-sm" : "text-neutral-400")}>
    {icon}
  </div>
);

// Light career cards panel
const CareerCardsPanel = () => (
  <div className="w-72 bg-neutral-50 border-r border-neutral-200 p-4">
    <div className="flex gap-2 mb-4">
      <button className="px-3 py-1.5 bg-white border border-neutral-200 rounded-full text-sm text-neutral-900 shadow-sm">
        Suggested <span className="ml-1 px-1.5 py-0.5 bg-neutral-900 text-white rounded-full text-xs">4</span>
      </button>
      <button className="px-3 py-1.5 bg-transparent rounded-full text-sm text-neutral-500">
        All <span className="ml-1 px-1.5 py-0.5 bg-neutral-200 rounded-full text-xs">12</span>
      </button>
    </div>
    <MiniCareerCard title="Project Manager" industry="Cybersecurity" score={67} active />
    <div className="mt-3">
      <MiniCareerCard title="Solutions Architect" industry="Cybersecurity" score={54} />
    </div>
    <div className="mt-3">
      <MiniCareerCard title="UX Researcher" industry="Fintech" score={42} />
    </div>
  </div>
);

const MiniCareerCard = ({ title, industry, score, active = false }: { title: string; industry: string; score: number; active?: boolean }) => (
  <div className={cn("bg-white border rounded-xl p-3 shadow-sm", active ? "border-neutral-900" : "border-neutral-200")}>
    <div className="flex items-start justify-between mb-2">
      <div>
        <p className="text-sm font-medium text-neutral-900">{title}</p>
        <p className="text-xs text-neutral-500">{industry}</p>
      </div>
      <MiniCircularProgress value={score} />
    </div>
    <div className="space-y-1.5 mb-2">
      <MiniMetric label="Salary Median" value="155k" unit="USD" />
      <MiniMetric label="Open Positions" value="1,247" unit="ALL" />
      <MiniMetric label="Growth Rate" value="+23%" unit="YOY" valueColor="text-emerald-600" />
    </div>
    <div className="space-y-2">
      <MiniProgressBar label="Market Demand" value={0.89} color="bg-blue-600" />
      <MiniProgressBar label="Skill Readiness" value={0.65} color="bg-emerald-500" />
      <MiniProgressBar label="Success Probability" value={0.69} color="bg-amber-500" />
    </div>
  </div>
);

const MiniCircularProgress = ({ value }: { value: number }) => {
  const radius = 10;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (value / 100) * circumference;
  return (
    <div className="relative size-7">
      <svg className="size-7 -rotate-90" viewBox="0 0 28 28">
        <circle cx="14" cy="14" r={radius} fill="none" stroke="#e5e5e5" strokeWidth="3" />
        <circle cx="14" cy="14" r={radius} fill="none" stroke="#10b981" strokeWidth="3" strokeDasharray={circumference} strokeDashoffset={strokeDashoffset} strokeLinecap="round" />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-[10px] font-semibold text-neutral-900">{value}</span>
    </div>
  );
};

const MiniMetric = ({ label, value, unit, valueColor = "text-neutral-900" }: { label: string; value: string; unit: string; valueColor?: string }) => (
  <div className="flex items-center justify-between">
    <span className="text-xs text-neutral-500">{label}</span>
    <div className="flex items-end gap-1">
      <span className={cn("text-xs font-medium", valueColor)}>{value}</span>
      <span className="text-[10px] text-neutral-400">{unit}</span>
    </div>
  </div>
);

const MiniProgressBar = ({ label, value, color }: { label: string; value: number; color: string }) => (
  <div className="space-y-1">
    <div className="flex items-center justify-between">
      <span className="text-xs text-neutral-500">{label}</span>
      <span className="text-xs font-medium text-neutral-900">{value.toFixed(2)}</span>
    </div>
    <div className="h-1.5 bg-neutral-200 rounded-full overflow-hidden">
      <div className={cn("h-full rounded-full", color)} style={{ width: `${value * 100}%` }} />
    </div>
  </div>
);

const CircularProgressLight = ({ value }: { value: number }) => {
  const radius = 18;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (value / 100) * circumference;
  return (
    <div className="relative size-14">
      <svg className="size-14 -rotate-90" viewBox="0 0 48 48">
        <circle cx="24" cy="24" r={radius} fill="none" stroke="#e5e5e5" strokeWidth="4" />
        <circle cx="24" cy="24" r={radius} fill="none" stroke="#10b981" strokeWidth="4" strokeDasharray={circumference} strokeDashoffset={strokeDashoffset} strokeLinecap="round" />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-lg font-semibold text-neutral-900">{value}</span>
    </div>
  );
};

const StatCard = ({ label, value, change, positive }: { label: string; value: string; change?: string; positive?: boolean }) => (
  <div className="bg-neutral-50 rounded-xl p-4 border border-neutral-200">
    <p className="text-sm text-neutral-500 mb-2">{label}</p>
    <div className="flex items-end gap-2">
      <span className="text-2xl font-semibold text-neutral-900">{value}</span>
      {change && <span className={cn("text-sm font-medium", positive ? "text-emerald-600" : "text-neutral-500")}>{change}</span>}
    </div>
  </div>
);

const SalaryChart = () => (
  <div className="h-40">
    <div className="relative h-32">
      <svg className="w-full h-full" viewBox="0 0 300 100" preserveAspectRatio="none">
        <path d="M0,90 Q30,85 60,70 T120,50 T180,35 T240,28 T300,22 L300,100 L0,100 Z" fill="url(#blueGrad)" opacity="0.3" />
        <path d="M0,90 Q30,85 60,70 T120,50 T180,35 T240,28 T300,22" fill="none" stroke="#1d4ed8" strokeWidth="3" />
        <defs>
          <linearGradient id="blueGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#1d4ed8" />
            <stop offset="100%" stopColor="#1d4ed8" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute right-1/4 top-1/4 flex flex-col items-center">
        <div className="size-3 bg-blue-600 rounded-full border-2 border-white shadow" />
        <div className="mt-2 px-2 py-1 bg-neutral-900 rounded text-xs text-white">$176k</div>
      </div>
    </div>
    <div className="flex justify-between text-sm text-neutral-400 mt-2">
      <span>Entry</span>
      <span>Mid</span>
      <span>Senior</span>
      <span>Lead</span>
    </div>
  </div>
);

const CompanyRow = ({ name, location }: { name: string; location: string }) => (
  <div className="flex items-center justify-between py-2">
    <div className="flex items-center gap-3">
      <IconBuilding className="size-4 text-neutral-400" />
      <span className="text-sm text-neutral-700">{name}</span>
    </div>
    <span className="text-sm text-neutral-400">{location}</span>
  </div>
);

const GeoRow = ({ city, percent }: { city: string; percent: number }) => (
  <div className="flex items-center gap-3">
    <IconMapPin className="size-4 text-neutral-400" />
    <span className="text-sm text-neutral-700 w-24">{city}</span>
    <div className="flex-1 h-2 bg-neutral-200 rounded-full overflow-hidden">
      <div className="h-full bg-blue-600 rounded-full" style={{ width: `${percent}%` }} />
    </div>
    <span className="text-sm text-neutral-500 w-12 text-right">{percent}%</span>
  </div>
);

const JobCardLight = ({ title, company, location, tags, color }: { title: string; company: string; location: string; tags: string[]; color: string }) => (
  <div className="bg-white border border-neutral-200 rounded-xl p-4 shadow-sm">
    <div className="flex items-start gap-3 mb-3">
      <div className={cn("size-10 rounded-full flex items-center justify-center text-white font-bold", color)}>{company[0]}</div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-neutral-900 truncate">{title}</p>
        <p className="text-sm text-neutral-500">{company} · {location}</p>
      </div>
    </div>
    <div className="flex gap-2 flex-wrap mb-4">
      {tags.map((tag) => (
        <span key={tag} className="px-2 py-1 bg-neutral-100 rounded text-xs text-neutral-600">{tag}</span>
      ))}
    </div>
    <div className="flex gap-3">
      <button className="flex-1 h-9 bg-neutral-100 rounded-lg text-sm text-neutral-600">Save</button>
      <button className="flex-1 h-9 bg-blue-600 rounded-lg text-sm text-white flex items-center justify-center gap-2">
        Apply <IconArrowRight className="size-4" />
      </button>
    </div>
  </div>
);
