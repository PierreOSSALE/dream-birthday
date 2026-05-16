// src/components/invite/hero-section.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import birthdayHero from "@/assets/hero-desktop.png";
import birthdayHeroMobile from "@/assets/hero-mobile.png";
import { BirthdaySparkle } from "./ui";
import { IoMdArrowDown } from "react-icons/io";

interface Props {
  celebrantName: string;
  eventTitle: string;
}

export function HeroSection({ celebrantName, eventTitle }: Props) {
  const imageRef = useRef<HTMLImageElement>(null);
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  useEffect(() => {
    if (imageRef.current?.complete) setIsImageLoaded(true);
  }, []);

  const scrollToNext = () => {
    window.scrollTo({ top: window.innerHeight, behavior: "smooth" });
  };

  return (
    <section className="relative h-svh w-full overflow-hidden bg-[#061449]">
      <picture>
        <source media="(max-width: 768px)" srcSet={birthdayHeroMobile as string} />
        <img
          ref={imageRef}
          src={birthdayHero as string}
          alt={`Anniversaire de ${celebrantName}`}
          width={1920}
          height={1080}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
            isImageLoaded ? "opacity-100" : "opacity-0"
          }`}
          loading="eager"
          fetchPriority="high"
          decoding="async"
          onLoad={() => setIsImageLoaded(true)}
        />
      </picture>

      <div className="absolute inset-0 bg-linear-to-b from-[#061449]/60 " />
      {/* <div className="absolute inset-x-0 bottom-0 h-32 bg-linear-to-t from-black/75 via-black/30 to-transparent pointer-events-none" /> */}

      <div className="relative z-50 h-full flex flex-col items-center justify-between py-12 px-6 text-white text-center">
        <BirthdaySparkle className="w-16 h-8 md:mt-10 text-gold-light" />
        <p className="label-caps font-normal mt-6 opacity-85 tracking-[0.3em]">
          CELEBRATION D'ANNIVERSAIRE
        </p>

        <div className="flex-1 flex flex-col items-center justify-center">
          <p className=" text-white mb-4 font-light text-lg">{eventTitle}</p>
          <h1 className="font-serif italic font-normal md:mt-2 text-7xl md:text-8xl leading-none tracking-tight">
            Invitation
          </h1>
        </div>

        <button
          onClick={scrollToNext}
          className="float-anim text-2xl pb-8 cursor-pointer hover:opacity-70 transition-opacity focus:outline-none"
          aria-label="Defiler vers le bas"
        >
          <p className="label-caps tracking-[0.2em] opacity-90">DEFILER</p>
          <IoMdArrowDown className="text-white mt-2 mx-auto" />
        </button>
      </div>
    </section>
  );
}
