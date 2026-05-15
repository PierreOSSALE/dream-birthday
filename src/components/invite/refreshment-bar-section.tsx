// src/components/invite/refreshment-bar-section.tsx
import { CakeSlice, Droplets, Coffee, PartyPopper } from "lucide-react";
import { GoldDivider } from "./ui";
import SlideReveal from "../animations/SlideReveal";

const items = [
  { icon: <CakeSlice className="w-6 h-6 text-gold" />, label: "Gateau", sub: "Moment bougies" },
  { icon: <Droplets className="w-6 h-6 text-gold" />, label: "Cocktails", sub: "Bleu signature et softs" },
  { icon: <Coffee className="w-6 h-6 text-gold" />, label: "Cafe", sub: "Apres le diner" },
  { icon: <PartyPopper className="w-6 h-6 text-gold" />, label: "Ambiance", sub: "Musique toute la soiree" },
];

export function RefreshmentBarSection() {
  return (
    <section className="px-6 py-16 max-w-md mx-auto">
      <SlideReveal direction="down" distance={50} duration={2} delay={0.1}>
        <div className="text-center">
          <h2 className="section-title">Programme de la soiree</h2>
          <GoldDivider />
        </div>
      </SlideReveal>
      <div className="grid grid-cols-2 gap-4 mt-6">
        {items.map((item) => (
          <SlideReveal key={item.label} direction="down" distance={50} duration={2} delay={0.1}>
            <div className="card-glass rounded-2xl p-5 text-center min-h-36">
              <p className="flex justify-center items-center">{item.icon}</p>
              <p className="label-caps mt-3">{item.label}</p>
              <p className="text-sm text-muted-foreground mt-1">{item.sub}</p>
            </div>
          </SlideReveal>
        ))}
      </div>
    </section>
  );
}
