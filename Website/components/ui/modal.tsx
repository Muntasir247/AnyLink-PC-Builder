"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl";
}

export function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  className,
  maxWidth = "lg",
}: ModalProps) {
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  const maxW = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    "2xl": "max-w-2xl",
  }[maxWidth];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-6 overflow-y-auto">
          {/* Blurred Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-background/70 backdrop-blur-md"
            onClick={onClose}
          />

          {/* Floating Glass Modal Container / Mobile Bottom Sheet */}
          <motion.div
            role="dialog"
            aria-modal="true"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 280 }}
            className={cn(
              "relative w-full rounded-t-[24px] sm:rounded-card glass-floating p-5 sm:p-8 z-10 shadow-glass-elevated border-t sm:border border-outline max-h-[88vh] sm:max-h-[90vh] overflow-y-auto",
              maxW,
              className
            )}
          >
            {/* Mobile grab handle */}
            <div className="sm:hidden mx-auto -mt-1 mb-4 h-1.5 w-12 rounded-full bg-outline/80" />

            <button
              onClick={onClose}
              aria-label="Close dialog"
              className="absolute right-4 top-4 rounded-lg p-1.5 text-on-surface-variant hover:text-foreground hover:bg-surface/50 hover:scale-110 active:scale-95 transition-all"
            >
              <X className="h-4 w-4" />
            </button>

            {title && (
              <div className="mb-5 pr-8">
                <h2 className="text-xl font-semibold text-foreground tracking-tight">
                  {title}
                </h2>
                {description && (
                  <p className="mt-1 text-sm text-on-surface-variant">
                    {description}
                  </p>
                )}
              </div>
            )}

            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
