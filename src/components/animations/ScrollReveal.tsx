"use client";

import { useMemo, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { useGSAP } from "@gsap/react";

type ScrollRevealProps = {
  children: React.ReactNode;
  direction?: "up" | "down";
  distance?: number;
  duration?: number;
  delay?: number;
  once?: boolean;
  start?: string;
};

export default function ScrollReveal({
  children,
  direction = "up",
  distance = 60,
  duration = 0.9,
  delay = 0,
  once = true,
  start = "top 85%",
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReduced = useMemo(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  useGSAP(() => {
    if (!ref.current) return;
    if (prefersReduced) return;

    const y = direction === "up" ? distance : -distance;

    gsap.fromTo(
      ref.current,
      { y, autoAlpha: 0, filter: "blur(4px)" },
      {
        y: 0,
        autoAlpha: 1,
        filter: "blur(0px)",
        duration,
        delay,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ref.current,
          start,
          once,
        },
      },
    );
  });

  return <div ref={ref}>{children}</div>;
}
