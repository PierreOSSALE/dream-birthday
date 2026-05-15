// src/routes/invite/$slug.tsx
import { useEffect, useState } from "react";
import { createFileRoute, notFound } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { addMessage, getInvite, submitRsvp } from "@/lib/invite.functions";

import { HeroSection } from "@/components/invite/hero-section";
import { WelcomeSection } from "@/components/invite/welcome-section";
import { EventDetailsSection } from "@/components/invite/event-details-section";
import { RsvpSection } from "@/components/invite/rsvp-section";
import { QrPassSection } from "@/components/invite/qr-pass-section";
import { GuestbookSection } from "@/components/invite/guestbook-section";
import { RefreshmentBarSection } from "@/components/invite/refreshment-bar-section";
import { VenueSection } from "@/components/invite/venue-section";
import { FooterSection } from "@/components/invite/footer-section";
import ScrollSmootherWrapper from "@/components/animations/plugins/ScrollSmoother";

export const Route = createFileRoute("/invite/$slug")({
  loader: async ({ params }) => {
    try {
      return await getInvite({ data: { slug: params.slug } });
    } catch {
      throw notFound();
    }
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `Invitation anniversaire - ${loaderData?.guest.birthday.celebrant_name}` },
      {
        name: "description",
        content: `Vous etes invite a l'anniversaire de ${loaderData?.guest.birthday.celebrant_name}.`,
      },
    ],
  }),
  component: InvitePage,
  notFoundComponent: () => (
    <div className="min-h-screen flex items-center justify-center bg-cream px-6 text-center">
      <div>
        <p className="label-caps text-gold">Introuvable</p>
        <h1 className="font-serif italic text-3xl mt-3">Cette invitation n'existe pas</h1>
        <p className="text-muted-foreground mt-2">Verifiez le lien recu.</p>
      </div>
    </div>
  ),
});

function InvitePage() {
  const data = Route.useLoaderData();
  const params = Route.useParams();
  type GuestT = typeof data.guest;
  type MsgT = (typeof data.messages)[number];

  const [guest, setGuest] = useState<GuestT>(data.guest);
  const [messages, setMessages] = useState<MsgT[]>(data.messages);
  const [name, setName] = useState(guest.name);
  const [msgName, setMsgName] = useState(guest.name);
  const [msgContent, setMsgContent] = useState("");
  const [busy, setBusy] = useState(false);

  const submitRsvpFn = useServerFn(submitRsvp);
  const addMessageFn = useServerFn(addMessage);

  useEffect(() => {
    setGuest(data.guest);
    setMessages(data.messages);
    setName(data.guest.name);
    setMsgName(data.guest.name);
    setMsgContent("");
  }, [data.guest, data.messages]);

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("is-visible");
        });
      },
      { threshold: 0.15 },
    );
    document.querySelectorAll(".reveal").forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  const birthday = guest.birthday;

  async function handleRsvp(status: "CONFIRMED" | "DECLINED") {
    setBusy(true);
    try {
      const res = await submitRsvpFn({ data: { slug: params.slug, status, name } });
      setGuest((g: GuestT) => ({
        ...g,
        status,
        name,
        qr_code: res.qrUrl ?? g.qr_code,
        confirmed_at: new Date().toISOString(),
      }));
      toast.success(status === "CONFIRMED" ? "Presence confirmee" : "Reponse enregistree");
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Erreur");
    } finally {
      setBusy(false);
    }
  }

  async function handleMessage() {
    if (!msgContent.trim()) return;
    setBusy(true);
    try {
      const res = await addMessageFn({
        data: {
          slug: params.slug,
          name: msgName.trim() || "Convive",
          content: msgContent.trim(),
        },
      });
      setMessages((m) => [res.message, ...m]);
      setMsgContent("");
      toast.success("Message ajoute au livre d'or");
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Erreur");
    } finally {
      setBusy(false);
    }
  }

  return (
    <ScrollSmootherWrapper>
      <main className="min-h-screen bg-cream font-sans">
        <HeroSection celebrantName={birthday.celebrant_name} eventTitle={birthday.event_title} />

        <WelcomeSection
          celebrantName={birthday.celebrant_name}
          eventTitle={birthday.event_title}
          guestName={guest.name}
          invitationText={birthday.invitation_text}
        />

        <EventDetailsSection date={birthday.date} venue={birthday.venue} address={birthday.address} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16 max-w-md md:max-w-5xl mx-auto">
          <RsvpSection
            guestName={guest.name}
            status={guest.status}
            name={name}
            busy={busy}
            onNameChange={setName}
            onConfirm={() => handleRsvp("CONFIRMED")}
            onDecline={() => handleRsvp("DECLINED")}
          />
          <QrPassSection
            guestName={guest.name}
            inviteSlug={guest.slug}
            qrCode={guest.qr_code}
            status={guest.status}
            birthdayDate={birthday.date}
          />
        </div>

        <GuestbookSection
          messages={messages}
          name={msgName}
          content={msgContent}
          busy={busy}
          onNameChange={setMsgName}
          onContentChange={setMsgContent}
          onSubmit={handleMessage}
        />

        <RefreshmentBarSection />
        <VenueSection venue={birthday.venue} address={birthday.address} mapUrl={birthday.map_url} />
        <FooterSection />
      </main>
    </ScrollSmootherWrapper>
  );
}
