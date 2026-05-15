// src/components/invite/venue-section.tsx
import { Navigation } from "lucide-react";
import venueImg from "@/assets/venue.png";
import { GoldDivider } from "./ui";

interface Props {
  venue: string;
  address: string;
  mapUrl?: string | null;
}

export function VenueSection({ venue, address, mapUrl }: Props) {
  const directionsUrl =
    mapUrl ?? `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`;
  const embedMapUrl = `https://maps.google.com/maps?q=${encodeURIComponent(address)}&t=k&z=17&output=embed`;

  return (
    <section className="px-6 pt-16 mx-auto reveal">
      <div className="text-center">
        <h2 className="section-title">Lieu de la fete</h2>
        <GoldDivider />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 px-6 md:py-4 gap-4 md:gap-10 md:mt-16 max-w-md md:max-w-5xl md:mx-auto">
        <div>
          <div className="mt-6 rounded-3xl overflow-hidden transition-transform duration-500 hover:scale-[1.01] cursor-pointer">
            <img src={venueImg} alt={venue} className="w-full h-56 md:h-72 object-cover" />
          </div>
          <p className="text-center text-muted-foreground mt-4">
            {venue}
            <br />
            {address}
          </p>
        </div>
        <div>
          <div className="mt-6 rounded-3xl overflow-hidden">
            <iframe
              src={embedMapUrl}
              width="100%"
              height="300"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full"
              title={`Carte de ${venue}`}
            />
          </div>
          <div className="mt-6">
            <a
              href={directionsUrl}
              target="_blank"
              rel="noreferrer"
              className="pill pill-primary w-full inline-flex items-center justify-center gap-2"
            >
              <Navigation className="w-4 h-4" /> Ouvrir l'itineraire
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
