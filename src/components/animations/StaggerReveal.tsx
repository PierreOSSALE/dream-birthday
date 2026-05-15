// Stagger Animation (cascade)
"use client";

import { useRef } from "react";
import { gsap } from "@/lib/gsap";
import { useGSAP } from "@gsap/react";

export default function StaggerReveal({
  children,
}: {
  children: React.ReactNode;
}) {
  const ref = useRef(null);

  useGSAP(
    () => {
      if (!ref.current) return;
      gsap.from(".stagger-item", {
        y: 30,
        opacity: 0,
        stagger: 0.15,
        duration: 1.8,
        scrollTrigger: {
          trigger: ref.current,
          start: "top 85%",
          once: true,
        },
      });
    },
    { scope: ref },
  );

  return <div ref={ref}>{children}</div>;
}
