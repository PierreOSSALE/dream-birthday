// src/components/admins/helpers.ts

import type { Birthday, Guest, ShareChannel } from "./types";

export function inviteUrl(slug: string): string {
  return `${window.location.origin}/invite/${slug}`;
}

export function buildMessage(
  guest: Guest,
  channel: ShareChannel,
  birthday?: Pick<Birthday, "celebrant_name" | "event_title"> | null,
  templates?: { whatsapp?: string | null; sms?: string | null; email?: string | null },
): string {
  const url = inviteUrl(guest.slug);
  const celebrant = birthday?.celebrant_name ?? "notre fete";
  const eventTitle = birthday?.event_title ?? "anniversaire";

  const replace = (template: string) =>
    template
      .replace(/\{\{\s*name\s*\}\}/g, guest.name)
      .replace(/\{\{\s*url\s*\}\}/g, url)
      .replace(/\{\{\s*celebrant\s*\}\}/g, celebrant)
      .replace(/\{\{\s*event_title\s*\}\}/g, eventTitle);

  const template =
    (channel === "whatsapp" && templates?.whatsapp) ||
    (channel === "sms" && templates?.sms) ||
    (channel === "email" && templates?.email) ||
    "";

  if (template) return replace(template);

  if (channel === "whatsapp" || channel === "sms") {
    return `Bonjour *${guest.name}* !\n\nVous etes cordialement invite(e) a ${eventTitle} de ${celebrant}. Voici votre invitation personnelle avec votre pass QR :\n\n${url}\n\nA tres bientot !`;
  }

  return `Bonjour ${guest.name},\n\nVous etes cordialement invite(e) a ${eventTitle} de ${celebrant}. Retrouvez votre invitation personnelle et votre pass d'entree ici :\n\n${url}\n\nNous avons hate de vous accueillir !`;
}

export const STATUS_MAP: Record<string, Guest["status"]> = {
  PENDING: "EN ATTENTE",
  CONFIRMED: "CONFIRME",
  DECLINED: "REFUSE",
  "EN ATTENTE": "EN ATTENTE",
  CONFIRME: "CONFIRME",
  REFUSE: "REFUSE",
};
