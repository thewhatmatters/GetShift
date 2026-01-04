"use client";

import { useState, createContext, useContext, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { WaitlistForm } from "./waitlist-form";

// Context for managing modal state globally
interface WaitlistModalContextType {
  isOpen: boolean;
  openModal: (source?: string) => void;
  closeModal: () => void;
  source: string;
}

const WaitlistModalContext = createContext<WaitlistModalContextType | null>(null);

export function useWaitlistModal() {
  const context = useContext(WaitlistModalContext);
  if (!context) {
    throw new Error("useWaitlistModal must be used within WaitlistModalProvider");
  }
  return context;
}

export function WaitlistModalProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [source, setSource] = useState("modal");

  const openModal = useCallback((src: string = "modal") => {
    setSource(src);
    setIsOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
  }, []);

  return (
    <WaitlistModalContext.Provider value={{ isOpen, openModal, closeModal, source }}>
      {children}
      <WaitlistModal isOpen={isOpen} onClose={closeModal} source={source} />
    </WaitlistModalContext.Provider>
  );
}

function WaitlistModal({
  isOpen,
  onClose,
  source,
}: {
  isOpen: boolean;
  onClose: () => void;
  source: string;
}) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center sm:text-center">
          <DialogTitle className="text-2xl md:text-3xl font-display">
            Get Early Access
          </DialogTitle>
          <DialogDescription>
            Be first to discover careers you&apos;re already qualified for.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <WaitlistForm source={source} />
        </div>

        <p className="text-center text-xs text-neutral-500">
          No spam. Unsubscribe anytime.
        </p>
      </DialogContent>
    </Dialog>
  );
}

// Button component that triggers the modal
export function WaitlistButton({
  children,
  source = "button",
  className,
  asChild,
  ...props
}: {
  children: React.ReactNode;
  source?: string;
  className?: string;
  asChild?: boolean;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const { openModal } = useWaitlistModal();

  return (
    <button
      onClick={() => openModal(source)}
      className={className}
      {...props}
    >
      {children}
    </button>
  );
}
