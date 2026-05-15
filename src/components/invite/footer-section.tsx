// src/components/invite/footer-section.tsx
import { PartyPopper } from "lucide-react";
import { BirthdaySparkle } from "./ui";
import SlideReveal from "../animations/SlideReveal";

export function FooterSection() {
  return (
    <section className="px-6 py-20 text-center">
      <SlideReveal direction="down" distance={50} duration={2} delay={0.1}>
        <PartyPopper className="w-8 h-8 text-gold mx-auto" />
        <p className="font-serif italic text-2xl mt-4 max-w-sm mx-auto">
          Nous avons hate de celebrer ce moment avec vous !
        </p>
        <BirthdaySparkle className="w-12 h-6 text-gold mx-auto mt-6" />
      </SlideReveal>
    </section>
  );
}
