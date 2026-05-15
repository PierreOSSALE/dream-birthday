"use client";

import { useRef } from "react";
import { gsap } from "@/lib/gsap";
import { useGSAP } from "@gsap/react";

type CountUpProps = {
  value: number;
  suffix?: string;
  duration?: number;
  className?: string;
};

export default function CountUp({
  value,
  suffix = "",
  duration = 1.5,
  className,
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);

  useGSAP(() => {
    const counter = { val: 0 };

    gsap.to(counter, {
      val: value,
      duration,
      ease: "power3.out",
      scrollTrigger: {
        trigger: ref.current,
        start: "top 85%",
        once: true,
      },
      onUpdate: () => {
        if (!ref.current) return;
        ref.current.textContent = `${Math.round(counter.val)}${suffix}`;
      },
    });
  });

  return (
    <span ref={ref} className={className}>
      {`0${suffix}`}
    </span>
  );
}
