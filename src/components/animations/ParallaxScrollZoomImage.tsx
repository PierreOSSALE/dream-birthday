"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";

type ParallaxScrollZoomImageProps = {
  src: string;
  alt?: string;
  speed?: number;
  zoom?: number;
  baseScale?: number;
  height?: number;
  className?: string;
  imgClassName?: string;
  loading?: "eager" | "lazy";
  decoding?: "async" | "sync" | "auto";
  fetchPriority?: "high" | "low" | "auto";
  /**
   * NEW: forwarded to <img> so the browser downloads the right size.
   * Example: "(min-width: 1024px) 50vw, 100vw"
   */
  sizes?: string;
};

export default function ParallaxScrollZoomImage({
  src,
  alt = "",
  speed = 2,
  zoom = 1.4,
  baseScale = 1.1,
  height,
  className,
  imgClassName,
  loading = "lazy",
  decoding = "async",
  fetchPriority = "auto",
  sizes,
}: ParallaxScrollZoomImageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const [loaded, setLoaded] = useState(false); // ← état de chargement

  // Vérifie si l'image est déjà en cache au montage
  useEffect(() => {
    if (imageRef.current?.complete) {
      setLoaded(true);
    }
  }, []);
  const prefersReduced = useMemo(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  useGSAP(
    () => {
      if (!containerRef.current || !imageRef.current) return;
      if (prefersReduced) return;

      const image = imageRef.current;
      const yAmount = 150 * speed;

      gsap.fromTo(
        image,
        { y: -yAmount, scale: baseScale },
        {
          y: yAmount,
          scale: zoom,
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        },
      );
    },
    { scope: containerRef },
  );

  return (
    <div
      ref={containerRef}
      className={`relative w-full overflow-hidden ${className ?? ""}`}
      style={height ? { height, zIndex: 0 } : { zIndex: 0 }}
    >
      <img
        ref={imageRef}
        src={src}
        alt={alt}
        loading={loading}
        decoding={decoding}
        fetchPriority={fetchPriority}
        sizes={sizes}
        onLoad={() => setLoaded(true)} // ← déclenche quand l'image est prête
        className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${
          loaded ? "opacity-100" : "opacity-0"
        } ${prefersReduced ? "" : "will-change-transform"} ${imgClassName ?? ""}`}
        style={{ zIndex: 0, pointerEvents: "none" }}
      />
    </div>
  );
}
