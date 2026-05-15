// src/components/invite/event-details-section.tsx
import { Calendar, Clock, MapPin } from "lucide-react";
import { DetailRow } from "./ui";
import { formatFrenchDate, formatFrenchTime } from "@/lib/format";
import { Countdown } from "./Countdown";
import SlideReveal from "../animations/SlideReveal";

interface Props {
  date: string;
  venue: string;
  address: string;
}

export function EventDetailsSection({ date, venue, address }: Props) {
  return (
    <section className="relative overflow-hidden px-4 pt-8 pb-16 md:py-16 max-w-md md:max-w-5xl mx-auto space-y-6 w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <SlideReveal direction="down" distance={50} duration={2} delay={0.1}>
          <DetailRow icon={<Calendar className="w-5 h-5" />} label="Date" value={formatFrenchDate(date)} />
        </SlideReveal>
        <SlideReveal direction="down" distance={50} duration={2} delay={0.1}>
          <DetailRow icon={<Clock className="w-5 h-5" />} label="Heure" value={formatFrenchTime(date)} />
        </SlideReveal>
        <SlideReveal direction="down" distance={50} duration={2} delay={0.1}>
          <DetailRow icon={<MapPin className="w-5 h-5" />} label="Adresse" value={`${venue} - ${address}`} />
        </SlideReveal>
        <SlideReveal direction="down" distance={50} duration={2} delay={0.1}>
          <Countdown target={date} />
        </SlideReveal>
      </div>
    </section>
  );
}
