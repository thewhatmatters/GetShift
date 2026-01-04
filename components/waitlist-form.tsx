"use client";

import { useState } from "react";
import { IconSend, IconCheck, IconLoader2 } from "@tabler/icons-react";
import { cn } from "@/lib/utils";

interface WaitlistFormProps {
  source?: string;
  className?: string;
  inputClassName?: string;
  buttonClassName?: string;
  placeholder?: string;
  onSuccess?: () => void;
}

export function WaitlistForm({
  source = "footer",
  className,
  inputClassName,
  buttonClassName,
  placeholder = "Your email",
  onSuccess,
}: WaitlistFormProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || status === "loading") return;

    setStatus("loading");
    setMessage("");

    try {
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus("success");
        setMessage(data.message || "You're on the list!");
        setEmail("");
        onSuccess?.();
      } else {
        setStatus("error");
        setMessage(data.error || "Something went wrong. Please try again.");
      }
    } catch {
      setStatus("error");
      setMessage("Something went wrong. Please try again.");
    }
  };

  if (status === "success") {
    return (
      <div className={cn("flex flex-col gap-2", className)}>
        <div className="flex items-center gap-2 py-2 px-4 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-md">
          <IconCheck className="size-4" />
          <span className="text-sm font-medium">{message}</span>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={cn("flex flex-col gap-2", className)}>
      <div className="border relative border-neutral-200 flex items-center bg-neutral-100 dark:bg-neutral-800 dark:border-neutral-700 rounded-md">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={placeholder}
          required
          disabled={status === "loading"}
          className={cn(
            "bg-transparent outline-none py-2 pl-4 pr-14 placeholder-neutral-400 text-neutral-600 dark:text-neutral-300 text-sm w-full disabled:opacity-50",
            inputClassName
          )}
        />
        <button
          type="submit"
          disabled={status === "loading" || !email}
          className={cn(
            "cursor-pointer px-4 py-2 rounded-[7px] bg-black dark:bg-white inset-y-0 right-0 absolute disabled:opacity-50 disabled:cursor-not-allowed transition-opacity",
            buttonClassName
          )}
          aria-label="Join waitlist"
        >
          {status === "loading" ? (
            <IconLoader2 className="text-white dark:text-black size-4 animate-spin" />
          ) : (
            <IconSend className="text-white dark:text-black size-4" />
          )}
        </button>
      </div>
      {status === "error" && message && (
        <p className="text-sm text-red-500">{message}</p>
      )}
    </form>
  );
}
