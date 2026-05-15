"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, SplitText } from "@/lib/gsap";

type SplitType = "chars" | "words" | "lines" | "chars,words,lines";

type AnimationType =
  | "slide-up"
  | "slide-down"
  | "fade"
  | "rotate"
  | "scale"
  | "blur"
  | "lines-mask"
  | "random";

type Props = {
  children: React.ReactNode;

  type?: SplitType;
  animation?: AnimationType;

  duration?: number;
  stagger?: number;
  delay?: number;

  ease?: string;

  triggerOnScroll?: boolean;
  start?: string;
  end?: string;
  scrub?: boolean | number;

  className?: string;
};

export default function SplitTextAnimation({
  children,

  type = "chars",
  animation = "slide-up",

  duration = 1.8,
  stagger = 0.05,
  delay = 0,

  ease = "power3.out",

  triggerOnScroll = false,
  start = "top 85%",
  end,
  scrub = false,

  className,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!ref.current) return;

      let split: SplitText | null = null;
      let tween: gsap.core.Tween | null = null;

      const setup = async () => {
        // attendre les fonts pour éviter glitch
        await document.fonts.ready;

        // cleanup si déjà existant
        split?.revert();
        tween?.kill();

        split = SplitText.create(ref.current!, {
          type,
          linesClass: "split-line",
          autoSplit: true,
        });

        const targets = type.includes("chars")
          ? split.chars
          : type.includes("words")
            ? split.words
            : split.lines;

        const base = {
          duration,
          stagger,
          delay,
          ease,
        };

        const animations: Record<AnimationType, gsap.TweenVars> = {
          "slide-up": {
            y: 100,
            opacity: 0,
          },

          "slide-down": {
            y: -100,
            opacity: 0,
          },

          fade: {
            opacity: 0,
          },

          rotate: {
            rotation: "random(-90,90)",
            y: -50,
            opacity: 0,
          },

          scale: {
            scale: 0.8,
            opacity: 0,
          },

          blur: {
            opacity: 0,
            filter: "blur(10px)",
          },

          random: {
            x: "random(-100,100)",
            y: "random(-100,100)",
            opacity: 0,
          },

          "lines-mask": {
            yPercent: 100,
            opacity: 0,
          },
        };

        const config = {
          ...base,
          ...animations[animation],
        };

        if (triggerOnScroll) {
          tween = gsap.from(targets, {
            ...config,
            scrollTrigger: {
              trigger: ref.current,
              start,
              end,
              scrub,
            },
          });
        } else {
          tween = gsap.from(targets, config);
        }
      };

      setup();

      // resize handler (important pour SplitText)
      const handleResize = () => {
        setup();
      };

      window.addEventListener("resize", handleResize);

      return () => {
        window.removeEventListener("resize", handleResize);
        split?.revert();
        tween?.kill();
      };
    },
    {
      dependencies: [
        type,
        animation,
        duration,
        stagger,
        delay,
        ease,
        triggerOnScroll,
        start,
        end,
        scrub,
      ],
      scope: ref,
    },
  );

  return (
    <div
      ref={ref}
      className={className}
      style={{
        perspective: animation === "rotate" ? "1000px" : undefined,
      }}
    >
      {children}
    </div>
  );
}
