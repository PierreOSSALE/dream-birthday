// components/animations/base/PageTransition.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";

type PageTransitionProps = {
  children: React.ReactNode;
  durationIn?: number;
  durationOut?: number;
};

export default function PageTransition({
  children,
  durationIn = 0.5,
  durationOut = 0.25,
}: PageTransitionProps) {
  const ref = useRef<HTMLDivElement>(null);

  // Lightweight in-app pathname watcher — replaces `next/navigation`'s `usePathname`
  const [pathname, setPathname] = useState(() =>
    typeof window !== "undefined" ? window.location.pathname : "",
  );

  useEffect(() => {
    if (typeof window === "undefined") return;

    const update = () => setPathname(window.location.pathname);

    // Listen to back/forward navigation
    window.addEventListener("popstate", update);

    // Patch history methods to emit a custom event on SPA navigations
    const origPush = history.pushState;
    const origReplace = history.replaceState;

    const notify = () => window.dispatchEvent(new Event("locationchange"));

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore - assignable for runtime monkeypatching
    history.pushState = function (...args: any[]) {
      const res = origPush.apply(this, args as any);
      notify();
      return res;
    };

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    history.replaceState = function (...args: any[]) {
      const res = origReplace.apply(this, args as any);
      notify();
      return res;
    };

    window.addEventListener("locationchange", update);

    return () => {
      window.removeEventListener("popstate", update);
      window.removeEventListener("locationchange", update);
      // restore originals
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      history.pushState = origPush;
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      history.replaceState = origReplace;
    };
  }, []);
  const [displayedChildren, setDisplayedChildren] = useState(children);
  const hasMounted = useRef(false);
  const prevPathname = useRef(pathname);
  const isAnimating = useRef(false); // ← FIX 1 : évite les doubles animations

  const prefersReduced =
    typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // FIX 2 : fonction d'entrée réutilisable, toujours déclenchée
  const animateIn = () => {
    if (!ref.current) return;
    // Tuer toute animation en cours avant de relancer
    gsap.killTweensOf(ref.current);
    gsap.fromTo(
      ref.current,
      { opacity: 0, y: 8 },
      {
        opacity: 1,
        y: 0,
        duration: durationIn,
        ease: "power2.out",
        onComplete: () => {
          isAnimating.current = false;
        },
      },
    );
  };

  useEffect(() => {
    if (prefersReduced) {
      setDisplayedChildren(children);
      if (ref.current) gsap.set(ref.current, { opacity: 1, y: 0 });
      return;
    }

    if (!hasMounted.current) {
      hasMounted.current = true;
      animateIn();
      return;
    }

    const pathChanged = pathname !== prevPathname.current;
    prevPathname.current = pathname;

    if (!pathChanged) {
      // FIX 3 : même pathname (retour arrière cache Next.js)
      // On met à jour les enfants ET on relance l'animation d'entrée
      setDisplayedChildren(children);
      requestAnimationFrame(() => animateIn());
      return;
    }

    if (isAnimating.current) return; // éviter les doubles triggers
    isAnimating.current = true;

    gsap.killTweensOf(ref.current!);
    gsap.to(ref.current!, {
      opacity: 0,
      y: 8,
      duration: durationOut,
      ease: "power1.out",
      onComplete: () => {
        setDisplayedChildren(children);
        requestAnimationFrame(() => animateIn());
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [children, pathname]);

  return (
    // FIX 4 : on retire style={{opacity:0}} — GSAP.set() avant fromTo suffit
    // et évite le flash blanc si le composant re-rend sans que useEffect tourne
    <div ref={ref}>{displayedChildren}</div>
  );
}
