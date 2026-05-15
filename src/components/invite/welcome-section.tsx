// src/components/invite/welcome-section.tsx
import SlideReveal from "../animations/SlideReveal";
import { GoldDivider } from "./ui";

interface Props {
  celebrantName: string;
  eventTitle: string;
  guestName: string;
  invitationText: string | null;
}

export function WelcomeSection({ celebrantName, eventTitle, guestName, invitationText }: Props) {
  return (
    <section className="relative w-full overflow-hidden py-16 px-4 text-center">
      <SlideReveal direction="down" distance={50} duration={2} delay={0.1}>
        <p className="label-caps text-muted-foreground">Bienvenue a la fete</p>
      </SlideReveal>

      <div className="my-8 space-y-3">
        <SlideReveal direction="down" distance={50} duration={2} delay={0.1}>
          <h2 className="section-title">{celebrantName}</h2>
        </SlideReveal>

        <SlideReveal direction="down" distance={50} duration={2} delay={0.1}>
          <p className="font-serif text-2xl text-gold">{eventTitle}</p>
        </SlideReveal>
      </div>

      <SlideReveal direction="down" distance={50} duration={2} delay={0.1}>
        <GoldDivider />
        <p className="font-serif italic text-xl mt-4">Cher(e) {guestName},</p>
      </SlideReveal>

      {invitationText && (
        <SlideReveal direction="down" distance={50} duration={2} delay={0.1}>
          <p className="max-w-md mx-auto mt-4 text-muted-foreground leading-relaxed">
            {invitationText}
          </p>
        </SlideReveal>
      )}
    </section>
  );
}
