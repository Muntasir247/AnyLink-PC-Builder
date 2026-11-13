"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { LayoutDashboard, FolderGit2 } from "lucide-react";

export function Sidebar({ className }: { className?: string }) {
  const pathname = usePathname();

  const links = [
    {
      label: "Dashboard",
      href: "/",
      icon: LayoutDashboard,
      active: pathname === "/",
    },
    {
      label: "My Builds",
      href: "/my-builds",
      icon: FolderGit2,
      active: pathname.startsWith("/my-builds"),
    },
  ];

  return (
    <aside
      className={cn(
        "hidden md:flex flex-col w-56 shrink-0 border-r border-outline/40 bg-background/50 backdrop-blur-xl p-4 transition-colors min-h-[calc(100vh-4rem)]",
        className
      )}
    >
      <nav className="flex flex-col gap-1.5 flex-1">
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-control text-sm font-medium transition-all select-none",
                link.active
                  ? "bg-foreground text-background shadow-md"
                  : "text-on-surface-variant hover:text-foreground hover:bg-surface/50"
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span>{link.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

