"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { LayoutDashboard, FolderGit2, User } from "lucide-react";

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
    {
      label: "Profile",
      href: "/profile",
      icon: User,
      active: pathname.startsWith("/profile"),
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
                "group relative flex items-center gap-3 px-3.5 py-2.5 rounded-control text-sm font-medium transition-all duration-200 select-none",
                link.active
                  ? "bg-foreground text-background shadow-md scale-[1.01]"
                  : "text-on-surface-variant hover:text-foreground hover:bg-surface/60 hover:translate-x-1"
              )}
            >
              <Icon className="h-4 w-4 shrink-0 transition-transform duration-200 group-hover:scale-110" />
              <span>{link.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
