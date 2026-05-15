// src/components/admins/types.ts

export type Guest = {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  slug: string;
  status: "PENDING" | "CONFIRMED" | "DECLINED" | "EN ATTENTE" | "CONFIRME" | "REFUSE";
  confirmed_at: string | null;
  created_at: string;
  qr_code: string | null;
  birthday_id: string;
};

export type Msg = {
  id: string;
  guest_name: string;
  content: string;
  created_at: string;
  birthday_id: string;
};

export type Birthday = {
  id: string;
  celebrant_name: string;
  event_title: string;
  date: string;
  venue: string;
  address: string;
  map_url: string | null;
  invitation_text: string | null;
  whatsapp_template?: string | null;
  sms_template?: string | null;
  email_template?: string | null;
};

export type ShareChannel = "whatsapp" | "email" | "sms" | "copy";

export type AdminTab = "dashboard" | "guests" | "messages" | "settings";
