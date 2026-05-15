"use client";

import { useMemo, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { useGSAP } from "@gsap/react";

type TextRevealProps = {
  text: string;
  as?: "h1" | "h2" | "h3" | "p" | "span";
  className?: string;
  stagger?: number;
  duration?: number;
  delay?: number;
  once?: boolean;
  translate?: boolean;
};

export default function TextReveal({
  text,
  as = "h1",
  className,
  stagger = 0.05,
  duration = 0.6,
  delay = 0,
  once = true,
  translate = true,
}: TextRevealProps) {
  const ref = useRef<HTMLHeadingElement>(null);
  const prefersReduced = useMemo(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  useGSAP(
    () => {
      if (!ref.current) return;
      if (prefersReduced) return;

      gsap.fromTo(
        ".letter",
        { y: 18, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration,
          delay,
          stagger,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ref.current,
            start: "top 85%",
            once,
          },
        },
      );
    },
    { scope: ref },
  );

  const Tag = as;

  return (
    <Tag
      ref={ref}
      className={className}
      aria-label={text}
      translate={translate ? "yes" : "no"}
    >
      {translate && (
        <span className="sr-only" translate="yes">
          {text}
        </span>
      )}
      {text.split("").map((l, i) => (
        <span
          key={`${l}-${i}`}
          className="letter inline-block will-change-transform"
          translate="no"
          aria-hidden="true"
        >
          {l === " " ? "\u00A0" : l}
        </span>
      ))}
    </Tag>
  );
}
