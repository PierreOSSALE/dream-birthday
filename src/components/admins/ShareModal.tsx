// src/components/admins/ShareModal.tsx

import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Mail, MessageCircle, User, X } from "lucide-react";
import type { Guest, ShareChannel } from "./types";
import { buildMessage, inviteUrl } from "./helpers";
import { useBirthday } from "./hooks";
import { BsFillSendFill } from "react-icons/bs";

const CHANNELS: {
  id: ShareChannel;
  label: string;
  icon: React.ReactNode;
  desc: string;
}[] = [
  {
    id: "whatsapp",
    label: "WhatsApp",
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
        <path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.126 1.533 5.859L.057 23.786a.5.5 0 0 0 .614.657l6.094-1.597A11.948 11.948 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22a9.944 9.944 0 0 1-5.356-1.553l-.385-.232-3.979 1.043 1.061-3.871-.252-.4A9.956 9.956 0 0 1 2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
      </svg>
    ),
    desc: "Ouvre WhatsApp avec le numero du convive",
  },
  {
    id: "email",
    label: "Email",
    icon: <Mail className="w-5 h-5" />,
    desc: "Ouvre votre client mail avec un brouillon",
  },
  {
    id: "sms",
    label: "SMS",
    icon: <MessageCircle className="w-5 h-5" />,
    desc: "Ouvre l'application SMS",
  },
];

interface ShareModalProps {
  guests: Guest[];
  onClose: () => void;
}

export function ShareModal({ guests, onClose }: ShareModalProps) {
  const [channel, setChannel] = useState<ShareChannel>("whatsapp");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState<Set<string>>(new Set());
  const [preview, setPreview] = useState<Guest | null>(guests[0] ?? null);
  const [selected, setSelected] = useState<Set<string>>(new Set(guests.map((g) => g.id)));
  const backdropRef = useRef<HTMLDivElement>(null);

  const birthday = useBirthday();

  useEffect(() => {
    setSelected(new Set(guests.map((g) => g.id)));
  }, [guests]);

  function handleBackdrop(e: React.MouseEvent) {
    if (e.target === backdropRef.current) onClose();
  }

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  async function sendToOne(guest: Guest) {
    const msg = buildMessage(guest, channel, birthday, {
      whatsapp: birthday?.whatsapp_template,
      sms: birthday?.sms_template,
      email: birthday?.email_template,
    });
    const url = inviteUrl(guest.slug);

    if (channel === "whatsapp") {
      if (!guest.phone) {
        toast.error(`${guest.name} n'a pas de numero de telephone`);
        return;
      }
      window.open(`https://wa.me/${guest.phone.replace(/\D/g, "")}?text=${encodeURIComponent(msg)}`, "_blank");
    } else if (channel === "email") {
      if (!guest.email) {
        toast.error(`${guest.name} n'a pas d'adresse email`);
        return;
      }
      const subject = encodeURIComponent("Votre invitation d'anniversaire personnelle");
      window.open(`mailto:${guest.email}?subject=${subject}&body=${encodeURIComponent(msg)}`, "_blank");
    } else if (channel === "sms") {
      if (!guest.phone) {
        toast.error(`${guest.name} n'a pas de numero`);
        return;
      }
      window.open(`sms:+${guest.phone.replace(/\D/g, "")}?body=${encodeURIComponent(msg)}`, "_blank");
    } else if (channel === "copy") {
      await navigator.clipboard.writeText(url);
      toast.success(`Lien de ${guest.name} copie`);
    }

    setSent((s) => new Set([...s, guest.id]));
  }

  async function sendSelected() {
    setSending(true);
    const toSend = guests.filter((g) => selected.has(g.id) && canSend(g));
    for (const guest of toSend) {
      await sendToOne(guest);
      await new Promise((resolve) => setTimeout(resolve, channel === "copy" ? 0 : 600));
    }
    setSending(false);
    toast.success(`${toSend.length} invitation(s) envoyee(s)`);
  }

  const canSend = (guest: Guest) => {
    if (channel === "whatsapp" || channel === "sms") return !!guest.phone;
    if (channel === "email") return !!guest.email;
    return true;
  };

  const eligibleCount = guests.filter((g) => selected.has(g.id) && canSend(g)).length;

  return (
    <div
      ref={backdropRef}
      onClick={handleBackdrop}
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4"
    >
      <div className="bg-cream w-full sm:max-w-2xl rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col max-h-[92dvh] overflow-hidden">
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-border shrink-0">
          <div>
            <p className="label-caps text-gold">Partager les invitations</p>
            <h2 className="font-serif italic text-2xl mt-0.5">
              {guests.length} convive{guests.length > 1 ? "s" : ""} selectionne{guests.length > 1 ? "s" : ""}
            </h2>
          </div>
          <button onClick={onClose} className="w-9 h-9 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex flex-col sm:flex-row overflow-hidden flex-1 min-h-0">
          <div className="sm:w-56 shrink-0 border-b sm:border-b-0 sm:border-r border-border p-3 py-4 flex sm:flex-col gap-2 overflow-x-auto sm:overflow-x-visible">
            <p className="label-caps text-muted-foreground hidden sm:block mb-2">Canal d'envoi</p>
            {CHANNELS.map((c) => (
              <button
                key={c.id}
                onClick={() => setChannel(c.id)}
                className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-left transition-all whitespace-nowrap sm:whitespace-normal ${
                  channel === c.id ? "gradient-gold text-white shadow-soft" : "bg-white hover:bg-white/80 text-foreground"
                }`}
              >
                {c.icon}
                <div className="hidden sm:block">
                  <p className="font-medium text-sm">{c.label}</p>
                  <p className={`text-xs mt-0.5 ${channel === c.id ? "opacity-80" : "text-muted-foreground"}`}>{c.desc}</p>
                </div>
                <span className="sm:hidden text-sm font-medium">{c.label}</span>
              </button>
            ))}
          </div>

          <div className="flex-1 flex flex-col overflow-hidden">
            {preview && (
              <div className="px-4 pt-4 pb-3 border-b border-border shrink-0">
                <div className="flex-1 overflow-y-auto py-4 space-y-2">
                  {guests.map((guest) => {
                    const ok = canSend(guest);
                    const isSent = sent.has(guest.id);
                    return (
                      <div
                        key={guest.id}
                        onClick={() => setPreview(guest)}
                        className={`flex items-center gap-3 p-3 cursor-pointer transition-all border ${
                          preview?.id === guest.id ? "bg-gold/5" : "bg-white hover:bg-white/80"
                        } ${!ok ? "opacity-50" : ""}`}
                      >
                        <User />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">{guest.name}</p>
                          <p className="text-xs text-muted-foreground truncate">
                            {channel === "whatsapp" || channel === "sms"
                              ? (guest.phone ?? "Pas de telephone")
                              : channel === "email"
                                ? (guest.email ?? "Pas d'email")
                                : inviteUrl(guest.slug).slice(0, 45) + "..."}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          {isSent ? (
                            <span className="label-caps text-emerald-600 text-[10px]">Envoye</span>
                          ) : !ok ? (
                            <span className="label-caps text-red-400 text-[10px]">Manquant</span>
                          ) : null}
                        </div>
                      </div>
                    );
                  })}
                </div>
                <p className="label-caps text-muted-foreground mb-2">Apercu du message</p>
                <textarea
                  readOnly
                  aria-label="Apercu du message"
                  rows={6}
                  value={buildMessage(preview, channel, birthday, {
                    whatsapp: birthday?.whatsapp_template,
                    sms: birthday?.sms_template,
                    email: birthday?.email_template,
                  })}
                  className="bg-white rounded-2xl p-3 text-sm text-muted-foreground font-mono leading-relaxed max-h-44 overflow-y-auto w-full resize-none whitespace-pre-wrap"
                  style={{ whiteSpace: "pre-wrap" }}
                />
              </div>
            )}

            <div className="px-4 pb-4 pt-3 border-t border-border shrink-0 flex items-center justify-center">
              <button
                disabled={sending || eligibleCount === 0}
                onClick={sendSelected}
                className="pill pill-primary inline-flex items-center gap-2 disabled:opacity-50"
              >
                {sending ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    Envoi en cours...
                  </>
                ) : (
                  <>
                    <BsFillSendFill className="w-5 h-5" /> Envoyer
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
