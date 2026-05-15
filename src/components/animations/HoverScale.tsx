"use client";

import { useRef } from "react";
import { gsap } from "@/lib/gsap";

type HoverScaleProps = {
  children: React.ReactNode;
  scale?: number;
  duration?: number;
  className?: string;
};

export default function HoverScale({
  children,
  scale = 1.05,
  duration = 0.2,
  className,
}: HoverScaleProps) {
  const ref = useRef<HTMLDivElement>(null);

  const enter = () => {
    gsap.to(ref.current, { scale, duration });
  };

  const leave = () => {
    gsap.to(ref.current, { scale: 1, duration });
  };

  return (
    <div
      ref={ref}
      onMouseEnter={enter}
      onMouseLeave={leave}
      className={className}
    >
      {children}
    </div>
  );
}
