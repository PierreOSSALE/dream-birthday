// src/routes/index.tsx
import { createFileRoute, Link } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { PartyPopper } from "lucide-react";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import coupleImg from "@/assets/hero-desktop.png";
import coupleImgMobile from "@/assets/hero-mobile.jpg";
import { GoldDivider, GoldRings } from "@/components/invite/Decor";
import SlideReveal from "@/components/animations/SlideReveal";
import { useEffect, useRef, useState } from "react";

const getLanding = createServerFn({ method: "GET" }).handler(async () => {
  const { data: birthday } = await supabaseAdmin
    .from("birthdays")
    .select("*")
    .limit(1)
    .maybeSingle();
  const { data: guests } = await supabaseAdmin.from("guests").select("slug, name").limit(6);
  return { birthday, guests: guests ?? [] };
});

export const Route = createFileRoute("/")({
  loader: () => getLanding(),
  head: () => ({
    meta: [
      { title: "Invitations digitales d'anniversaire - Bleu royal" },
      {
        name: "description",
        content:
          "Creez et envoyez des invitations d'anniversaire personnalisees avec RSVP, QR pass et livre d'or.",
      },
    ],
  }),
  component: Landing,
});

function Landing() {
  const { birthday, guests } = Route.useLoaderData();
  const imageRef = useRef<HTMLImageElement>(null);
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  useEffect(() => {
    if (imageRef.current?.complete) {
      setIsImageLoaded(true);
    }
  }, []);

  const scrollToNext = () => {
    const heroHeight = window.innerHeight;
    window.scrollTo({
      top: heroHeight,
      behavior: "smooth",
    });
  };
  return (
    <main className="min-h-screen bg-cream">
      <header className="px-6 py-5 flex items-center justify-between max-w-6xl mx-auto">
        <div className="flex items-center gap-2">
          <PartyPopper className="w-6 h-6 text-gold" />
          <span className="font-serif italic text-lg">Anniversaire</span>
        </div>
        <Link to="/admin" className="label-caps text-gold">
          Admin
        </Link>
      </header>

      <section className="relative h-svh w-full overflow-hidden bg-[#241b17]">
        <picture>
          <source media="(max-width: 768px)" srcSet={coupleImgMobile as string} />
          <img
            ref={imageRef}
            src={coupleImg as string}
            alt={`${birthday?.celebrant_name ?? ""}`}
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
        </picture>{" "}
        <div className="absolute inset-0 bg-linear-to-b from-[#061449]/60 " />
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center text-white">
          <p className="label-caps opacity-95 mt-30 md:mt-40">Invitations digitales</p>
          <h1 className="font-serif italic text-3xl md:text-7xl mt-30 md:mt-30">
            Une invitation à la hauteur de votre personnalité
          </h1>
          <GoldDivider />
          <p className="mt-4 max-w-md mx-auto opacity-90 leading-relaxed">
            Personnalisée pour chaque invité, un RSVP, pass QR, messages de fete et gestion des
            convives pour une celebration d'anniversaire.
          </p>
          {/* {birthday && ( */}
          <Link
            to="/invite/$slug"
            params={{ slug: guests[0]?.slug ?? "" }}
            className="pill pill-primary inline-block mt-8"
          >
            Voir un exemple
          </Link>
          {/* )} */}
        </div>
      </section>

      {birthday && (
        <section className="max-w-3xl mx-auto px-6 py-20">
          <div className="text-center">
            <SlideReveal direction="down" distance={50} duration={2} delay={0.1}>
              <p className="label-caps text-muted-foreground">Anniversaire en cours</p>{" "}
            </SlideReveal>
            <SlideReveal direction="down" distance={50} duration={2} delay={0.1}>
              <h2 className="font-serif italic text-4xl mt-3">{birthday.celebrant_name}</h2>
              <p className="text-gold mt-2">{birthday.event_title}</p>{" "}
            </SlideReveal>
          </div>
          <ul className="mt-10 grid sm:grid-cols-2 gap-3">
            {guests.map((guest: { slug: string; name: string }) => (
              <li key={guest.slug}>
                <Link
                  to="/invite/$slug"
                  params={{ slug: guest.slug }}
                  className="block bg-white rounded-2xl p-5 hover:shadow-soft transition"
                >
                  <p className="font-serif italic text-xl">{guest.name}</p>
                  <p className="label-caps text-gold mt-1">Ouvrir l'invitation</p>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <footer className="text-center py-10 text-muted-foreground text-sm">
        <GoldRings className="w-10 h-5 text-gold mx-auto" />
        <p className="mt-3">Avec amour ♡</p>
      </footer>
    </main>
  );
}
