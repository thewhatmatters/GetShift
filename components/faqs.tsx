"use client";
import React, { useState } from "react";
import { Container } from "./container";
import { UserChatIcon } from "@/illustrations/general";
import { Heading } from "./heading";
import { IconMinus, IconPlus } from "@tabler/icons-react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

export const FAQs = () => {
  const questions = [
    {
      question: "What is Shift?",
      answer: "Shift is an AI-powered career matching platform that analyzes your experience and shows you exactly what careers you're already qualified for — plus a 90-day plan to land one.",
    },
    {
      question: "Who is Shift built for?",
      answer: "Shift is built for professionals who feel stuck, undervalued, or unsure about their next career move. Whether you're looking to pivot industries, level up, or discover hidden opportunities, Shift is for you.",
    },
    {
      question: "How does Shift work?",
      answer: "Simply upload your resume or connect your LinkedIn profile. Our AI analyzes your experience, skills, and background to identify career paths you're already qualified for, then creates a personalized 90-day roadmap to help you get there.",
    },
    {
      question: "Is there a free trial available?",
      answer:
        "Yes, we offer a 14-day free trial so you can explore all features before committing to a plan.",
    },
    {
      question: "What kind of support do you provide?",
      answer:
        "We provide customer support through email and comprehensive documentation to help you get the most out of Shift. Premium plans include priority support and personalized guidance.",
    },
  ];
  return (
    <section className="py-10 md:py-20 lg:py-32 relative overflow-hidden">
      <Container>
        <UserChatIcon />
        <Heading className="my-10 md:my-20">Frequently Asked Questions</Heading>

        <div className="flex flex-col gap-4">
          {questions.map((question, index) => (
            <Question
              key={index}
              question={question.question}
              answer={question.answer}
            />
          ))}
        </div>
      </Container>
    </section>
  );
};

const Question = ({
  question,
  answer,
}: {
  question: string;
  answer: string;
}) => {
  const [open, setOpen] = useState(false);

  return (
    <button
      onClick={() => setOpen(!open)}
      className="w-full rounded-3xl overflow-hidden bg-neutral-100 dark:bg-neutral-800 p-4 md:p-8"
    >
      <div className="flex items-center justify-between ">
        <h3 className="text-lg md:text-2xl font-bold font-display">
          {question}
        </h3>
        <div className="size-6 rounded-full relative bg-black dark:bg-white flex items-center justify-center">
          <IconMinus
            className={cn(
              "size-6 text-white dark:text-black absolute inset-0 transition-all duration-200",
              open && "scale-0 rotate-90"
            )}
          />
          <IconPlus
            className={cn(
              "size-6 text-white dark:text-black absolute inset-0 scale-0 -rotate-90 transition-all duration-200",
              open && "scale-100 rotate-0"
            )}
          />
        </div>
      </div>
      <motion.div
        initial={false}
        animate={{
          height: open ? "auto" : 0,
          opacity: open ? 1 : 0,
        }}
        exit={{
          height: 0,
          opacity: 0,
        }}
        transition={{
          duration: 0.2,
        }}
        className="overflow-hidden"
      >
        <motion.p
          key={String(open)}
          initial={{
            opacity: 0,
          }}
          animate={{ opacity: 1 }}
          transition={{
            delay: 0.2,
          }}
          className="text-left mt-4 text-neutral-600 dark:text-neutral-200"
        >
          {answer}
        </motion.p>
      </motion.div>
    </button>
  );
};
