// components/animations/base/ScrollZoomImage.tsx
"use client";

import { useMemo, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { useGSAP } from "@gsap/react";
import { optimizeCloudinaryUrl } from "@/lib/utils/cloudinary";

type ScrollZoomImageProps = {
  src: string;
  alt?: string;
  className?: string;
  imgClassName?: string;
  width?: number;
  height?: number;
  loading?: "eager" | "lazy";
  decoding?: "async" | "sync" | "auto";
  fetchPriority?: "high" | "low" | "auto";
};

export default function ScrollZoomImage({
  src,
  alt = "",
  className,
  imgClassName,
  width = 1360,
  height = 910,
  loading = "lazy",
  decoding = "async",
  fetchPriority = "auto",
}: ScrollZoomImageProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const shouldAnimate = useMemo(() => {
    if (typeof window === "undefined") return true;
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    return !prefersReduced;
  }, []);

  const optimizedSrc = useMemo(
    () =>
      optimizeCloudinaryUrl(src, {
        width,
        height,
        quality: "auto",
        fit: "limit",
      }),
    [src, width, height],
  );

  useGSAP(() => {
    if (!wrapperRef.current || !imgRef.current) return;

    // Fade-in du wrapper au mount
    gsap.fromTo(
      wrapperRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.6, ease: "power2.out" },
    );

    if (!shouldAnimate) return;

    // Zoom au scroll
    gsap.to(imgRef.current, {
      scale: 1.5,
      scrollTrigger: {
        trigger: imgRef.current,
        start: "top bottom",
        end: "bottom top",
        scrub: true,
      },
    });
  });

  return (
    <div
      ref={wrapperRef}
      style={{ opacity: 0 }} // ✅ invisible avant GSAP
      className={`overflow-hidden ${className ?? ""}`}
    >
      <img
        ref={imgRef}
        src={optimizedSrc}
        alt={alt}
        width={width}
        height={height}
        loading={loading}
        decoding={decoding}
        fetchPriority={fetchPriority}
        className={`w-full object-cover ${imgClassName ?? ""}`}
      />
    </div>
  );
}
