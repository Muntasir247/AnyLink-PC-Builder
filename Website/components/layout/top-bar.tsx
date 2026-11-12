"use client";

import * as React from "react";
import Link from "next/link";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { Edit2, User, Cpu, Share2 } from "lucide-react";

export interface TopBarProps {
  buildName?: string;
  onBuildNameChange?: (name: string) => void;
  currency?: string;
  onCurrencyChange?: (currency: string) => void;
  isGuest?: boolean;
  onSaveBuildClick?: () => void;
  onExportClick?: () => void;
}

export function TopBar({
  buildName = "Build #1 (Untitled)",
  onBuildNameChange,
  currency = "BDT",
  onCurrencyChange,
  isGuest = true,
  onSaveBuildClick,
  onExportClick,
}: TopBarProps) {
  const [isEditing, setIsEditing] = React.useState(false);
  const [nameValue, setNameValue] = React.useState(buildName);

  React.useEffect(() => {
    setNameValue(buildName);
  }, [buildName]);

  const handleBlur = () => {
    setIsEditing(false);
    if (onBuildNameChange && nameValue.trim()) {
      onBuildNameChange(nameValue.trim());
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleBlur();
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full h-16 border-b border-outline/40 bg-background/80 backdrop-blur-xl transition-colors">
      <div className="flex h-full items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left: Brand & Build Name */}
        <div className="flex items-center gap-4 min-w-0">
          <Link
            href="/"
            className="flex items-center gap-2.5 shrink-0 group focus-visible:outline-none"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-foreground text-background shadow-md">
              <Cpu className="h-4 w-4" />
            </div>
            <span className="font-semibold tracking-tight text-foreground text-base hidden sm:inline-block">
              AnyLink
            </span>
          </Link>

          <span className="text-outline hidden sm:inline-block">/</span>

          {/* Build Name Editor */}
          <div className="flex items-center gap-2 min-w-0">
            {isEditing ? (
              <input
                type="text"
                value={nameValue}
                onChange={(e) => setNameValue(e.target.value)}
                onBlur={handleBlur}
                onKeyDown={handleKeyDown}
                autoFocus
                className="h-8 rounded-lg bg-surface px-2.5 text-sm font-medium text-foreground border border-outline focus:outline-none"
              />
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                aria-label="Edit build name"
                className="group flex items-center gap-1.5 rounded-lg px-2 py-1 text-sm font-medium text-foreground hover:bg-surface/60 transition-colors truncate text-left"
              >
                <span className="truncate">{nameValue}</span>
                <Edit2 className="h-3 w-3 text-on-surface-muted opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
              </button>
            )}
          </div>
        </div>

        {/* Right: Currency Selector, Export, Save Build, Theme Toggle, Account */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Currency Selector */}
          <div className="w-24 sm:w-28">
            <Select
              mono
              aria-label="Select currency"
              value={currency}
              onChange={(e) => onCurrencyChange?.(e.target.value)}
              className="h-9 text-xs"
            >
              <option value="BDT">BDT (৳)</option>
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="GBP">GBP (£)</option>
              <option value="INR">INR (₹)</option>
            </Select>
          </div>

          {/* Export Build Button */}
          {onExportClick && (
            <Button
              variant="glass"
              size="sm"
              onClick={onExportClick}
              className="h-9 text-xs"
            >
              <Share2 className="h-3.5 w-3.5 mr-1.5" />
              <span>Export</span>
            </Button>
          )}

          {/* Save Build Button for Guests */}
          {isGuest && onSaveBuildClick && (
            <Button
              variant="solid"
              size="sm"
              onClick={onSaveBuildClick}
              className="hidden lg:inline-flex h-9 text-xs"
            >
              Save build
            </Button>
          )}

          {/* Theme Toggle */}
          <ThemeToggle />

          {/* Account Profile / Link */}
          <Link href="/login" aria-label="Account">
            <Button
              variant={isGuest ? "glass" : "solid"}
              size="icon"
              className="rounded-full h-9 w-9"
            >
              <User className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
