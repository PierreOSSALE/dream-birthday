// Animation Fade + Slide (la plus utilisée)

"use client";

import { useRef } from "react";
import { gsap } from "@/lib/gsap";
import { useGSAP } from "@gsap/react";

export default function FadeIn({ children }: { children: React.ReactNode }) {
  const ref = useRef(null);

  useGSAP(() => {
    gsap.from(ref.current, {
      y: 40,
      opacity: 0,
      duration: 1,
      ease: "power3.out",
    });
  });

  return <div ref={ref}>{children}</div>;
}
