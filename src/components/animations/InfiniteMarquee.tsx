"use client";

import { useMemo, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { useGSAP } from "@gsap/react";

type InfiniteMarqueeProps = {
  children: React.ReactNode;
  /** Pixels per second — vitesse constante quelle que soit la largeur du contenu */
  speed?: number;
  className?: string;
};

export default function InfiniteMarquee({ children, speed = 80, className }: InfiniteMarqueeProps) {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReduced = useMemo(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  useGSAP(() => {
    if (!ref.current || prefersReduced) return;

    // Les enfants sont dupliqués → la moitié de scrollWidth = largeur réelle du contenu
    const totalWidth = ref.current.scrollWidth / 2;

    // Durée calculée pour une vitesse constante en px/s
    const duration = totalWidth / speed;

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
