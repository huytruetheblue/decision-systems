"use client";
import { cn } from "@/lib/utils";

export function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={cn(
        "mx-auto mt-10 pl-6 md:max-w-7xl  sm:px-6 lg:px-8 shadow-lg shadow-gray-500/50 border-gray-300 border border-1 rounded-[16px] p-4 bg-gray-100"
      )}>
      {children}
    </div>
  );
}
