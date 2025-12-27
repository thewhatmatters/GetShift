"use client";
import React, { useEffect, useRef, useState } from "react";
import { Container } from "./container";
import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import { LogoIcon } from "@/components/logo";
import Image from "next/image";
import { ArrowIllustration, ArrowIconReverse } from "@/illustrations/grid";
import {
  FifthIcon,
  FirstIcon,
  FourthIcon,
  RecentActivityIcon,
  SecondIcon,
  ThirdIcon,
} from "@/icons/bento-icons";
import {
  SalesforceIcon,
  HubspotIcon,
  SheetsIcon,
} from "@/icons";
import {
  IconClock,
  IconSettings,
  IconSparkles,
  IconClipboardData,
  IconFileDotsFilled,
  IconFeatherFilled,
  IconPointerUp,
  IconFilter2Search,
} from "@tabler/icons-react";

export const Features = () => {
  return (
    <section id="features" className="py-10 md:py-20 lg:py-32 relative overflow-hidden">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-2 border-y border-neutral-200 dark:border-neutral-800 divide-neutral-200 dark:divide-neutral-800">
          <div className="md:border-r border-b border-neutral-200 dark:border-neutral-800">
            <CardContent>
              <h2 className="text-lg font-bold text-neutral-800 dark:text-neutral-200">
                Career Match Analysis
              </h2>
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
              <h2 className="text-lg font-bold text-neutral-800 dark:text-neutral-200">
                90-Day Action Plan
              </h2>
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
              <h2 className="text-lg font-bold text-neutral-800 dark:text-neutral-200">
                Skill Gap Report
              </h2>
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
              <h2 className="text-lg font-bold text-neutral-800 dark:text-neutral-200">
                LinkedIn Optimization
              </h2>
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
        "relative h-80 sm:h-60 flex flex-col md:h-80 overflow-hidden perspective-distant",
        className
      )}
    >
      {children}
    </div>
  );
};

const SkeletonOne = () => {
  const cardItems = [
    {
      icon: <FirstIcon />,
      iconClassName: "bg-blue-500",
      title: "Personalized Email",
      description: "Personalized Email sent to ••••• @gmail.com",
      badge: (
        <div className="flex gap-1 items-center px-1 py-0.5 rounded-md border border-neutral-200 dark:border-neutral-200/10 dark:bg-neutral-200/10">
          <IconClock className="size-3" />
          <p className="text-[10px] font-bold text-neutral-600 dark:text-neutral-400">
            15s
          </p>
        </div>
      ),
    },
    {
      icon: <SecondIcon />,
      iconClassName: "bg-red-500",
      title: "Peer Review",
      description:
        "Reviewed and approved 2 outputs from Content Drafting Agent",
      badge: (
        <div className="flex gap-1 items-center px-1 py-0.5 rounded-md bg-red-100 border border-red-200 dark:bg-red-100/10 dark:border-red-200/10">
          <p className="text-[10px] font-bold text-red-500">FAILED</p>
        </div>
      ),
    },
    {
      icon: <ThirdIcon />,
      iconClassName: "bg-orange-500",
      title: "Content Drafting",
      description: "Generated draft campaign brief",
      badge: (
        <div className="flex gap-1 items-center px-1 py-0.5 rounded-md bg-orange-100 border border-orange-200 dark:bg-orange-100/10 dark:border-orange-200/10">
          <p className="text-[10px] font-bold text-orange-500">PROCESSING</p>
        </div>
      ),
    },
    {
      icon: <FourthIcon />,
      iconClassName: "bg-black",
      title: "Admin Approval",
      description: "Final approval of marketing copy before publishing",
      badge: (
        <div className="flex gap-1 items-center px-1 py-0.5 rounded-md bg-orange-100 dark:bg-orange-100/10 dark:border-orange-100/10 border border-orange-200">
          <p className="text-[10px] font-bold text-orange-500">PROCESSING</p>
        </div>
      ),
    },
    {
      icon: <FifthIcon />,
      iconClassName: "bg-indigo-500",
      title: "Weekly Campaign Report",
      description: "Generated campaign performance report",
      badge: (
        <div className="flex gap-1 items-center px-1 py-0.5 rounded-md border border-neutral-200 dark:border-neutral-200/10 dark:bg-neutral-200/10">
          <IconClock className="size-3" />
          <p className="text-[10px] font-bold text-neutral-600">2m</p>
        </div>
      ),
    },
    {
      icon: <SecondIcon />,
      iconClassName: "bg-red-500",
      title: "SEO Audit",
      description:
        "Reviewed and approved 2 outputs from Content Drafting Agent",
      badge: (
        <div className="flex gap-1 items-center px-1 py-0.5 rounded-md bg-red-100 border border-red-200 dark:bg-red-100/10 dark:border-red-200/10">
          <p className="text-[10px] font-bold text-red-500">FAILED</p>
        </div>
      ),
    },
    {
      icon: <ThirdIcon />,
      iconClassName: "bg-orange-500",
      title: "Price Monitoring Agent",
      description: "Generated draft campaign brief",
      badge: (
        <div className="flex gap-1 items-center px-1 py-0.5 rounded-md bg-orange-100 border border-orange-200 dark:bg-orange-100/10 dark:border-orange-200/10">
          <p className="text-[10px] font-bold text-orange-500">PROCESSING</p>
        </div>
      ),
    },
  ];
  return (
    <div className="flex-1 rounded-t-3xl gap-2 flex flex-col bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 mx-auto w-full h-full absolute inset-x-10 inset-y-2 pt-2 px-2">
      <Card>
        {cardItems.map((item, idx) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: idx * 0.1 }}
            className="w-full"
          >
            <CardItem
              index={idx}
              key={item.title}
              icon={item.icon}
              iconClassName={item.iconClassName}
              title={item.title}
              description={item.description}
              badge={item.badge}
            />
          </motion.div>
        ))}
      </Card>
    </div>
  );
};

const Card = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="shadow-black/10 gap-4 border bg-white dark:bg-neutral-900 border-transparent ring-1 rounded-tl-[16px] ring-black/10 flex flex-col items-start flex-1">
      <div className="flex items-center gap-2 border-b w-full py-2 px-4">
        <RecentActivityIcon />
        <p className="text-sm font-bold text-neutral-800 dark:text-neutral-200">
          Recent Activity
        </p>
      </div>
      {children}
    </div>
  );
};

const CardItem = ({
  icon,
  iconClassName,
  title,
  description,
  badge,
  index,
}: {
  icon: React.ReactNode;
  iconClassName?: string;
  title: string;
  description: string;
  badge: React.ReactNode;
  index: number;
}) => {
  return (
    <div className="flex justify-between items-center w-full pl-4 relative overflow-hidden">
      <div className="items-center gap-2 flex">
        <div
          className={cn(
            "size-5 rounded-sm bg-blue-500 text-white flex items-center justify-center",
            iconClassName
          )}
        >
          {icon}
        </div>
        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          {title}
        </p>
        {badge}
      </div>
      <motion.p className="text-sm text-neutral-500 dark:text-neutral-400 flex-nowrap max-w-[16rem] w-full text-left whitespace-nowrap">
        {description.split("").map((item, idx) => (
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: idx * 0.01 + index * 0.1 }}
            key={idx}
          >
            {item}
          </motion.span>
        ))}
      </motion.p>
    </div>
  );
};

const SkeletonTwo = () => {
  return (
    <div className="flex-1 rounded-t-3xl gap-4 space-y-4 w-full h-full px-8 flex-col items-center justify-center">
      <div className="grid grid-cols-4 gap-2 justify-center max-w-md mx-auto">
        <Item />
        <Item src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1364" />
        <Item src="https://images.unsplash.com/photo-1543610892-0b1f7e6d8ac1?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1287" />
        <Item />
      </div>
      <div className="grid grid-cols-5 gap-2">
        <Item />
        <Item src="https://images.unsplash.com/photo-1654110455429-cf322b40a906?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1760" />
        <Item containerClassName="from-black/50 via-transparent to-black/50">
          <div className="h-full w-full bg-white dark:bg-neutral-900 rounded-[12px] flex items-center justify-center">
            <LogoIcon className="size-12" />
          </div>
        </Item>
        <Item src="https://images.unsplash.com/photo-1527980965255-d3b416303d12?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1760" />
        <Item />
      </div>
      <div className="grid grid-cols-4 justify-center max-w-md mx-auto gap-2">
        <Item />
        <Item src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1287" />
        <Item src="https://images.unsplash.com/photo-1607746882042-944635dfe10e?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=2670" />
        <Item />
      </div>
    </div>
  );
};

const Item = ({
  children,
  className,
  containerClassName,
  src,
}: {
  children?: React.ReactNode;
  className?: string;
  containerClassName?: string;
  src?: string;
}) => {
  return (
    <div
      className={cn(
        "w-full justify-self-center aspect-square rounded-xl border border-dashed border-neutral-200 dark:border-neutral-800 relative p-[1px]",
        "[--pattern-fg:var(--color-neutral-950)]/5 dark:[--pattern-fg:var(--color-neutral)]/10"
      )}
    >
      <motion.div
        initial={{
          opacity: 0,
          filter: "blur(10px)",
        }}
        whileInView={{
          opacity: 1,
          filter: "blur(0px)",
        }}
        transition={{
          duration: Math.random() * 0.8 + 0.2,
          delay: Math.random() * 0.8 + 0.2,
        }}
        className={cn(
          "flex items-center justify-center w-full h-full rounded-[12px] p-[1px] relative z-10",
          src && "bg-gradient-to-br from-blue-500 via-transparent to-blue-500",
          containerClassName
        )}
      >
        {children ?? (
          <>
            {src && (
              <Image
                src={src}
                height={120}
                width={120}
                alt="item"
                className="object-cover aspect-square rounded-[12px] relative z-20"
              />
            )}
          </>
        )}
      </motion.div>
      <div className="absolute inset-0 bg-[image:repeating-linear-gradient(315deg,_var(--pattern-fg)_0,_var(--pattern-fg)_1px,_transparent_0,_transparent_50%)] bg-[size:5px_5px] rounded-xl bg-fixed"></div>
    </div>
  );
};

const SkeletonThree = () => {
  return (
    <div className="flex-1 rounded-t-3xl gap-2 flex flex-col z-20 mx-auto w-full h-full absolute inset-0 pt-2 px-2 perspective-[4000px] max-w-lg">
      <ArrowIllustration className="absolute left-40 -top-4 mx-auto z-30" />
      <ArrowIconReverse className="absolute left-32 -bottom-10 mx-auto blur-[2px]" />
      <div
        className={cn(
          "flex items-center justify-center gap-20 h-[200%]",
          "absolute -inset-x-[150%] -inset-y-40",
          "[background-size:40px_40px]",
          "[background-image:linear-gradient(to_right,var(--color-neutral-200)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-neutral-200)_1px,transparent_1px)]",
          "dark:[background-image:linear-gradient(to_right,var(--color-neutral-700)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-neutral-700)_1px,transparent_1px)]",
          "mask-radial-from-50% mask-t-from-50% mask-b-from-50%"
        )}
        style={{
          transform: "rotateY(20deg) rotateX(50deg) rotateZ(40deg)",
        }}
      >
        <div className="px-4 py-2 rounded-full bg-orange-100 border border-orange-300 text-orange-500 font-medium flex items-center gap-2">
          <IconSettings className="size-4" />
          <span>Processing</span>
        </div>
        <div className="px-4 py-2 rounded-full bg-green-100 border border-green-300 text-green-500 font-medium flex items-center gap-2">
          <IconSparkles className="size-4" />
          <span>Feedback</span>
        </div>
      </div>
    </div>
  );
};

const SkeletonFour = () => {
  const items = [
    {
      title: "Brand & Style",
      icon: <IconClipboardData className="size-4 text-blue-500" />,
      className:
        "bg-blue-100 border border-blue-200 dark:bg-blue-100/10 dark:border-blue-200/10",
      description:
        "Link CRMs, helpdesks, and APIs to give agents secure, role-based access.",
      tags: [
        { text: "Salesforce", icon: <SalesforceIcon className="size-3" /> },
        { text: "Hubspot", icon: <HubspotIcon className="size-3" /> },
        { text: "Sheets", icon: <SheetsIcon className="size-3" /> },
      ],
    },
    {
      title: "Compliance & Policy",
      icon: <IconFileDotsFilled className="size-4 text-green-500" />,
      className:
        "bg-green-100 border border-green-200 dark:bg-green-100/10 dark:border-green-200/10",
      description:
        "Ensure your AI agents follow company policies and regulatory requirements with built-in compliance controls.",
      tags: [
        { text: "Salesforce", icon: <SalesforceIcon className="size-3" /> },
        { text: "Hubspot", icon: <HubspotIcon className="size-3" /> },
        { text: "Sheets", icon: <SheetsIcon className="size-3" /> },
      ],
    },
    {
      title: "Content Safety Filters",
      icon: <IconFeatherFilled className="size-4 text-indigo-500" />,
      className:
        "bg-indigo-100 border border-indigo-200 dark:bg-indigo-100/10 dark:border-indigo-200/10",
      description:
        "Protect your brand from harmful content with built-in safety filters that block sensitive or inappropriate material.",
      tags: [
        { text: "Salesforce", icon: <SalesforceIcon className="size-3" /> },
        { text: "Hubspot", icon: <HubspotIcon className="size-3" /> },
        { text: "Sheets", icon: <SheetsIcon className="size-3" /> },
      ],
    },
    {
      title: "Approval Triggers",
      icon: <IconPointerUp className="size-4 text-neutral-500" />,
      className:
        "bg-neutral-100 border border-neutral-200 dark:bg-neutral-100/10 dark:border-neutral-200/10",
      description:
        "Automatically trigger approvals based on predefined criteria, ensuring timely review and compliance.",
      tags: [
        { text: "Salesforce", icon: <SalesforceIcon className="size-3" /> },
        { text: "Hubspot", icon: <HubspotIcon className="size-3" /> },
        { text: "Sheets", icon: <SheetsIcon className="size-3" /> },
      ],
    },
    {
      title: "Output Quality Checks",
      icon: <IconFilter2Search className="size-4 text-purple-500" />,
      className:
        "bg-purple-100 border border-purple-200 dark:bg-purple-100/10 dark:border-purple-200/10",
      description:
        "Automatically trigger approvals based on predefined criteria, ensuring timely review and compliance.",
      tags: [
        { text: "Salesforce", icon: <SalesforceIcon className="size-3" /> },
        { text: "Hubspot", icon: <HubspotIcon className="size-3" /> },
        { text: "Sheets", icon: <SheetsIcon className="size-3" /> },
      ],
    },
  ];

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const currentIndexRef = useRef(0);

  const [selected, setSelected] = useState(items[0]);

  useEffect(() => {
    startAutoplay();
    return () => stopAutoplay();
  }, []);

  const startAutoplay = () => {
    stopAutoplay();

    intervalRef.current = setInterval(() => {
      currentIndexRef.current = (currentIndexRef.current + 1) % items.length;
      setSelected(items[currentIndexRef.current]);
    }, 2000);
  };

  const stopAutoplay = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };
  return (
    <div>
      <div className="flex gap-4 items-center justify-center max-w-lg mx-auto flex-wrap mb-4">
        {items.map((item, idx) => (
          <button
            key={item.title}
            onClick={() => setSelected(item)}
            className={cn(
              "px-2 py-1 rounded-sm relative text-xs gap-1 cursor-pointer active:scale-98 transition duration-200 flex items-center justify-center opacity-50",
              selected.title === item.title && "opacity-100",
              item.className
            )}
          >
            {selected.title === item.title && (
              <motion.div
                layoutId="selected-item"
                className="absolute inset-0 rounded-[5px] shadow-inner"
              ></motion.div>
            )}
            {item.icon}
            {item.title}
          </button>
        ))}
      </div>
      <div className="flex-1 rounded-t-3xl gap-2 flex flex-col bg-neutral-100 dark:bg-neutral-800 dark:border-neutral-700 border border-neutral-200 max-w-[20rem] lg:max-w-sm mx-auto w-full h-full absolute inset-x-0 p-2">
        <SkeletonFourCard
          topIcon={selected.icon}
          title={selected.title}
          description={selected.description}
          tags={selected.tags}
          className={selected.className}
        />
      </div>
    </div>
  );
};

const SkeletonFourCard = ({
  topIcon,
  title,
  description,
  tags,
  className,
}: {
  topIcon: React.ReactNode;
  title: string;
  description: string;
  tags: { text: string; icon: React.ReactNode }[];
  className?: string;
}) => {
  return (
    <motion.div
      key={title}
      className="p-4 shadow-black/10 gap-4 border bg-white dark:bg-neutral-900 border-transparent ring-1 rounded-[16px] ring-black/10 flex items-start flex-col"
    >
      <div className="flex items-center gap-2">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={cn(
            "size-6 shrink-0 rounded-full flex mt-1 items-center justify-center",
            className
          )}
        >
          {topIcon}
        </motion.div>
        <motion.p
          initial={{ opacity: 0, filter: "blur(10px)" }}
          animate={{
            opacity: 1,
            filter: "blur(0px)",
          }}
          transition={{
            delay: 0.1,
          }}
          className="text-lg font-bold text-neutral-800 dark:text-neutral-200"
        >
          {title}
        </motion.p>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <p className="text-base text-neutral-600">Tone Guidelines</p>
        <p className="text-sm mt-2 mb-4 text-neutral-600 dark:text-neutral-400 rounded-sm border border-neutral-200 dark:border-neutral-200/10 px-2 border-dashed py-1">
          {description}
        </p>
        <div className="mt-2 flex flex-row flex-wrap gap-2">
          {tags.map((tag, idx) => (
            <motion.div
              key={tag.text + idx}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + idx * 0.1 }}
            >
              <Tag key={tag.text + idx} text={tag.text} icon={tag.icon} />
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};

const Tag = ({ text, icon }: { text: string; icon: React.ReactNode }) => {
  return (
    <div className="flex items-center gap-1 w-fit rounded-sm px-1 py-0.5 border border-neutral-200 dark:border-neutral-200/10 text-sm">
      {icon}
      <p className="text-xs text-neutral-500">{text}</p>
    </div>
  );
};
