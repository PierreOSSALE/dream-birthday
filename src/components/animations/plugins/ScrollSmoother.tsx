"use client";

import { useEffect, useMemo, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollSmoother, ScrollTrigger } from "@/lib/gsap";

type ScrollSmootherProps = {
  children: React.ReactNode;
  wrapperId?: string;
  contentId?: string;
  smooth?: number;
  smoothTouch?: number;
  effects?: boolean;
  normalizeScroll?: boolean;
  speed?: number;
  paused?: boolean;
};

export default function ScrollSmootherWrapper({
  children,
  wrapperId = "smooth-wrapper",
  contentId = "smooth-content",
  smooth = 1,
  smoothTouch = 0.1,
  effects = true,
  normalizeScroll = true,
  speed = 1,
  paused = false,
}: ScrollSmootherProps) {
  const [enabled, setEnabled] = useState(false);

  const ids = useMemo(
    () => ({ wrapper: `#${wrapperId}`, content: `#${contentId}` }),
    [wrapperId, contentId],
  );

  useEffect(() => {
    const evaluate = () => {
      const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      setEnabled(!prefersReduced && window.innerWidth >= 1024);
    };

    evaluate();
    window.addEventListener("resize", evaluate, { passive: true });
    return () => window.removeEventListener("resize", evaluate);
  }, []);

  useGSAP(() => {
    let smoother: ReturnType<typeof ScrollSmoother.create> | undefined;

    if (enabled) {
      smoother = ScrollSmoother.create({
        wrapper: ids.wrapper,
        content: ids.content,
        smooth,
        smoothTouch,
        effects,
        normalizeScroll,
        speed,
      });

      smoother.paused(paused);
    }

    const revealElements = gsap.utils.toArray<HTMLElement>(".reveal");
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (revealElements.length) {
      if (prefersReduced) {
        gsap.set(revealElements, { autoAlpha: 1, y: 0 });
        return () => smoother?.kill();
      }

      // Don't reset elements that are already visible (e.g., marked by an
      // IntersectionObserver with the `is-visible` class) — otherwise inline
      // styles from GSAP override the class and keep them hidden.
      const toHide = revealElements.filter((el) => !el.classList.contains("is-visible"));

      if (toHide.length) {
        gsap.set(toHide, { autoAlpha: 0, y: 30 });

        toHide.forEach((element) => {
          gsap.to(element, {
            autoAlpha: 1,
            y: 0,
            duration: 0.7,
            ease: "power2.out",
            scrollTrigger: {
              trigger: element,
              start: "top 85%",
              once: true,
            },
          });
        });
      }
    }

    ScrollTrigger.refresh();

    return () => {
      smoother?.kill();
    };
  }, [enabled, ids, smooth, smoothTouch, effects, normalizeScroll, speed, paused, children]);

  return (
    <div id={enabled ? wrapperId : undefined}>
      <div id={enabled ? contentId : undefined}>{children}</div>
    </div>
  );
}
