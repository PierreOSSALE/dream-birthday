// src/components/invite/rsvp-section.tsx
import { Check } from "lucide-react";
import { GoldDivider } from "./ui";
import HoverScale from "@/components/animations/HoverScale";
import SlideReveal from "../animations/SlideReveal";

type RsvpStatus = "CONFIRMED" | "DECLINED" | "PENDING";

interface Props {
  guestName: string;
  status: RsvpStatus;
  name: string;
  busy: boolean;
  onNameChange: (name: string) => void;
  onConfirm: () => void;
  onDecline: () => void;
}

export function RsvpSection({
  guestName,
  status,
  name,
  busy,
  onNameChange,
  onConfirm,
  onDecline,
}: Props) {
  return (
    <section className="px-6 py-16 text-center">
      <SlideReveal direction="down" distance={50} duration={2} delay={0.1}>
        <h2 className="section-title">Votre presence</h2>
        <GoldDivider />
      </SlideReveal>

      {status === "CONFIRMED" ? (
        <SlideReveal direction="down" distance={50} duration={2} delay={0.1}>
          <div className="mt-6 max-w-md mx-auto card-glass rounded-3xl p-8">
            <div className="w-16 h-16 mx-auto rounded-full gradient-gold flex items-center justify-center text-white">
              <Check className="w-8 h-8" />
            </div>
            <p className="font-serif italic text-2xl mt-4">Presence confirmee !</p>
            <p className="text-muted-foreground mt-2">A tres bientot, {guestName}</p>
          </div>
        </SlideReveal>
      ) : status === "DECLINED" ? (
        <SlideReveal direction="down" distance={50} duration={2} delay={0.1}>
          <p className="font-serif italic text-xl mt-6 text-muted-foreground">
            Reponse enregistree. Merci de nous avoir prevenus.
          </p>
        </SlideReveal>
      ) : (
        <div className="mt-6 max-w-sm mx-auto space-y-4">
          <SlideReveal direction="down" distance={50} duration={2} delay={0.1}>
            <input
              value={name}
              onChange={(e) => onNameChange(e.target.value)}
              placeholder="Votre nom complet"
              className="w-full bg-white/80 border border-border rounded-full px-6 py-3 text-center focus:outline-none focus:ring-2 focus:ring-gold"
            />
          </SlideReveal>

          <SlideReveal direction="down" distance={50} duration={2} delay={0.1}>
            <div className="flex flex-col gap-3">
              <HoverScale>
                <button disabled={busy} onClick={onConfirm} className="pill pill-primary disabled:opacity-50">
                  Confirmer ma venue
                </button>
              </HoverScale>
              <HoverScale>
                <button disabled={busy} onClick={onDecline} className="pill pill-outline disabled:opacity-50">
                  Je ne pourrai pas venir
                </button>
              </HoverScale>
            </div>
          </SlideReveal>
        </div>
      )}
    </section>
  );
}
