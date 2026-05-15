"use client";

import { useMemo, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { useGSAP } from "@gsap/react";

type InfiniteMarqueeProps = {
  children: React.ReactNode;
  duration?: number;
  className?: string;
};

export default function InfiniteMarquee({
  children,
  duration = 18,
  className,
}: InfiniteMarqueeProps) {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReduced = useMemo(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  useGSAP(() => {
    if (!ref.current || prefersReduced) return;

    gsap.to(ref.current, {
      xPercent: -50,
      repeat: -1,
      duration,
      ease: "linear",
    });
  });

  return (
    <div className={`overflow-hidden ${className ?? ""}`}>
      <div ref={ref} className="flex w-max gap-8">
        {children}
        {children}
      </div>
    </div>
  );
}
