// src/components/invite/guestbook-section.tsx
import { PaperPlane, GoldDivider } from "./ui";
import InfiniteMarquee from "@/components/animations/InfiniteMarquee";
import HoverScale from "@/components/animations/HoverScale";
import CountUp from "@/components/animations/CountUp";
import ScrollReveal from "@/components/animations/ScrollReveal";
import SlideReveal from "../animations/SlideReveal";

interface Message {
  id: string;
  content: string;
  guest_name: string;
  created_at: string;
}

interface Props {
  messages: Message[];
  name: string;
  content: string;
  busy: boolean;
  onNameChange: (v: string) => void;
  onContentChange: (v: string) => void;
  onSubmit: () => void;
}

/**
 * Vitesse de défilement en pixels/seconde.
 * La même valeur est utilisée sur tous les marquees et sur tous les écrans,
 * ce qui garantit une vitesse visuelle identique quelle que soit la quantité
 * de messages ou la taille de l'écran.
 */
const MARQUEE_SPEED = 80;

export function GuestbookSection({
  messages,
  name,
  content,
  busy,
  onNameChange,
  onContentChange,
  onSubmit,
}: Props) {
  const half = Math.ceil(messages.length / 2);

  return (
    <section className="px-6 py-16 mx-auto">
      <SlideReveal direction="down" distance={50} duration={2} delay={0.1}>
        <div className="text-center">
          <PaperPlane className="w-10 h-10 text-gold mx-auto" />
          <h2 className="section-title mt-3">Messages de fete</h2>
          <GoldDivider />
        </div>
      </SlideReveal>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16 max-w-md md:max-w-5xl mx-auto">
        {/* ── Formulaire ── */}
        <div>
          <div className="mt-6 space-y-3">
            <SlideReveal direction="down" distance={50} duration={2} delay={0.1}>
              <input
                value={name}
                onChange={(e) => onNameChange(e.target.value)}
                placeholder="Votre prenom"
                className="w-full bg-white border border-border rounded-2xl px-5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gold"
              />
            </SlideReveal>
            <SlideReveal direction="down" distance={50} duration={2} delay={0.1}>
              <textarea
                value={content}
                onChange={(e) => onContentChange(e.target.value)}
                rows={3}
                maxLength={1000}
                placeholder="Votre message pour l'anniversaire..."
                className="w-full bg-white border border-border rounded-2xl px-5 py-3 focus:outline-none focus:ring-2 focus:ring-gold resize-none"
              />
            </SlideReveal>
            <SlideReveal direction="down" distance={50} duration={2} delay={0.1}>
              <HoverScale>
                <button
                  disabled={busy || !content.trim()}
                  onClick={onSubmit}
                  className="pill pill-primary w-full"
                >
                  Laisser un message
                </button>
              </HoverScale>
            </SlideReveal>
          </div>

          <SlideReveal direction="down" distance={50} duration={2} delay={0.1}>
            <p className="label-caps text-center text-muted-foreground my-16">
              <CountUp value={messages.length} className="inline-block" /> messages
            </p>
          </SlideReveal>
        </div>

        {/* ── Marquees ── */}
        <ScrollReveal>
          {/* Desktop : ligne du bas (deuxième moitié) */}
          <InfiniteMarquee speed={MARQUEE_SPEED} className="py-8">
            {messages.slice(half).map((m) => (
              <div
                key={`bottom-${m.id}`}
                className="bg-white rounded-lg px-10 p-10 max-w-sm text-center mx-auto shadow-sm"
              >
                <p className="font-serif italic text-2xl">"{m.content}"</p>
                <p className="label-caps text-gold text-sm mt-1">- {m.guest_name}</p>
              </div>
            ))}
          </InfiniteMarquee>
        </ScrollReveal>
      </div>
    </section>
  );
}
