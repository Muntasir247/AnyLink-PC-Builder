"use client";

import React from "react";

export function BackgroundOrbs() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden select-none"
    >
      {/* Top Left Orb */}
      <div className="absolute -top-40 left-1/4 h-[550px] w-[550px] rounded-full bg-white opacity-[var(--orb-opacity)] blur-[140px] transform-gpu transition-opacity duration-700" />
      {/* Center Right Orb */}
      <div className="absolute top-1/2 right-10 h-[500px] w-[500px] rounded-full bg-white opacity-[var(--orb-opacity)] blur-[150px] transform-gpu transition-opacity duration-700" />
      {/* Bottom Center Orb */}
      <div className="absolute bottom-10 left-1/3 h-[450px] w-[450px] rounded-full bg-white opacity-[var(--orb-opacity)] blur-[130px] transform-gpu transition-opacity duration-700" />
    </div>
  );
}

