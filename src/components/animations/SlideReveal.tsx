"use client";

import { useRef } from "react";
import { gsap } from "@/lib/gsap";
import { useGSAP } from "@gsap/react";

type SlideRevealProps = {
  children: React.ReactNode;
  direction?: "left" | "right" | "up" | "down";
  distance?: number;
  duration?: number;
  delay?: number;
  variant?: "slide" | "zoom";
  initialScale?: number;
  className?: string;
};

export default function SlideReveal({
  children,
  direction = "left",
  distance = 80,
  duration = 1.8,
  delay = 0,
  variant = "slide",
  initialScale = 0.8,
  className = "",
}: SlideRevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!ref.current) return;

    if (variant === "zoom") {
      gsap.from(ref.current, {
        scale: initialScale,
        opacity: 0,
        duration,
        delay,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ref.current,
          start: "top 60%",
          once: true,
          toggleActions: "play none none none",
        },
      });
      return;
    }

    const x = direction === "left" ? -distance : direction === "right" ? distance : 0;
    const y = direction === "up" ? -distance : direction === "down" ? distance : 0;

    const tween = gsap.from(ref.current, {
      x,
      y,
      opacity: 0,
      duration,
      delay,
      ease: "power3.out",
      scrollTrigger: {
        trigger: ref.current,
        start: "top 80%",
        once: true,
        toggleActions: "play none none none",
      },
    });
    return;
  });

  return (
    <div ref={ref} className={`will-change-transform ${className}`.trim()}>
      {children}
    </div>
  );
}
