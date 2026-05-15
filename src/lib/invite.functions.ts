import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import QRCode from "qrcode";
import { nanoid } from "nanoid";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

const slugSchema = z
  .string()
  .min(1)
  .max(80)
  .regex(/^[a-zA-Z0-9_-]+$/);

function buildInviteUrl(guestSlug: string) {
  const appUrl = process.env.PUBLIC_APP_URL?.replace(/\/+$/, "");
  return appUrl ? `${appUrl}/invite/${guestSlug}` : `/invite/${guestSlug}`;
}

export const getInvite = createServerFn({ method: "GET" })
  .inputValidator((d: { slug: string }) => ({ slug: slugSchema.parse(d.slug) }))
  .handler(async ({ data }) => {
    const { data: guest, error } = await supabaseAdmin
      .from("guests")
      .select("*, birthday:birthdays(*)")
      .eq("slug", data.slug)
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!guest) throw new Error("Invitation introuvable");

    const { data: messages } = await supabaseAdmin
      .from("guest_messages")
      .select("*")
      .eq("birthday_id", guest.birthday_id)
      .order("created_at", { ascending: false })
      .limit(100);

    return { guest, messages: messages ?? [] };
  });

async function ensureQrCode(guestSlug: string, guestId: string): Promise<string> {
  const { data: existing } = await supabaseAdmin
    .from("guests")
    .select("qr_code")
    .eq("id", guestId)
    .maybeSingle();
  if (existing?.qr_code) return existing.qr_code;

  const inviteUrl = buildInviteUrl(guestSlug);
  const png = await QRCode.toBuffer(inviteUrl, {
    margin: 1,
    width: 600,
    color: { dark: "#0B3FCB", light: "#F8FBFF" },
  });
  const path = `qrcodes/${guestId}.png`;
  const { error: upErr } = await supabaseAdmin.storage
    .from("birthday")
    .upload(path, png, { contentType: "image/png", upsert: true });
  if (upErr) throw new Error(upErr.message);
  const { data: pub } = supabaseAdmin.storage.from("birthday").getPublicUrl(path);
  await supabaseAdmin.from("guests").update({ qr_code: pub.publicUrl }).eq("id", guestId);
  return pub.publicUrl;
}

export const submitRsvp = createServerFn({ method: "POST" })
  .inputValidator((d: { slug: string; status: "CONFIRMED" | "DECLINED"; name?: string }) =>
    z
      .object({
        slug: slugSchema,
        status: z.enum(["CONFIRMED", "DECLINED"]),
        name: z.string().trim().min(1).max(100).optional(),
      })
      .parse(d),
  )
  .handler(async ({ data }) => {
    const { data: guest, error } = await supabaseAdmin
      .from("guests")
      .select("id, name")
      .eq("slug", data.slug)
      .maybeSingle();
    if (error || !guest) throw new Error("Invitation introuvable");

    const update: { status: "CONFIRMED" | "DECLINED"; confirmed_at: string; name?: string } = {
      status: data.status,
      confirmed_at: new Date().toISOString(),
    };
    if (data.name && data.name !== guest.name) update.name = data.name;

    const { error: updateError } = await supabaseAdmin.from("guests").update(update).eq("id", guest.id);
    if (updateError) throw new Error(updateError.message);

    let qrUrl: string | null = null;
    if (data.status === "CONFIRMED") {
      qrUrl = await ensureQrCode(data.slug, guest.id);
    }
    return { ok: true, qrUrl };
  });

export const addMessage = createServerFn({ method: "POST" })
  .inputValidator((d: { slug: string; name: string; content: string }) =>
    z
      .object({
        slug: slugSchema,
        name: z.string().trim().min(1).max(100),
        content: z.string().trim().min(1).max(1000),
      })
      .parse(d),
  )
  .handler(async ({ data }) => {
    const { data: guest } = await supabaseAdmin
      .from("guests")
      .select("birthday_id")
      .eq("slug", data.slug)
      .maybeSingle();
    if (!guest) throw new Error("Invitation introuvable");
    const { data: msg, error } = await supabaseAdmin
      .from("guest_messages")
      .insert({ birthday_id: guest.birthday_id, guest_name: data.name, content: data.content })
      .select()
      .single();
    if (error) throw new Error(error.message);
    return { message: msg };
  });

export const adminListGuests = createServerFn({ method: "GET" }).handler(async () => {
  const { data, error } = await supabaseAdmin
    .from("guests")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return data;
});

export const adminCreateGuest = createServerFn({ method: "POST" })
  .inputValidator((d: { birthdayId: string; name: string; email?: string; phone?: string }) =>
    z
      .object({
        birthdayId: z.string().uuid(),
        name: z.string().trim().min(1).max(100),
        email: z.string().email().max(255).optional().or(z.literal("")),
        phone: z.string().trim().max(40).optional().or(z.literal("")),
      })
      .parse(d),
  )
  .handler(async ({ data }) => {
    const slug = `${data.name.toLowerCase().replace(/[^a-z0-9]/g, "")}-${nanoid(8)}`;
    const { data: guest, error } = await supabaseAdmin
      .from("guests")
      .insert({
        birthday_id: data.birthdayId,
        slug,
        name: data.name,
        email: data.email || null,
        phone: data.phone || null,
      })
      .select()
      .single();
    if (error) throw new Error(error.message);
    return guest;
  });

export const adminDeleteGuest = createServerFn({ method: "POST" })
  .inputValidator((d: { id: string }) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data }) => {
    const { error } = await supabaseAdmin.from("guests").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const adminDeleteMessage = createServerFn({ method: "POST" })
  .inputValidator((d: { id: string }) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data }) => {
    const { error } = await supabaseAdmin.from("guest_messages").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const adminListMessages = createServerFn({ method: "GET" }).handler(async () => {
  const { data, error } = await supabaseAdmin
    .from("guest_messages")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return data;
});

export const adminGetBirthday = createServerFn({ method: "GET" }).handler(async () => {
  const { data, error } = await supabaseAdmin
    .from("birthdays")
    .select("*")
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return data;
});

export const adminUpdateBirthday = createServerFn({ method: "POST" })
  .inputValidator((d: Record<string, unknown>) =>
    z
      .object({
        id: z.string().uuid(),
        celebrant_name: z.string().min(1).max(120),
        event_title: z.string().min(1).max(120),
        date: z.string(),
        venue: z.string().min(1).max(200),
        address: z.string().min(1).max(300),
        map_url: z.string().url().optional().or(z.literal("")),
        invitation_text: z.string().max(2000).optional(),
        whatsapp_template: z.string().max(5000).optional(),
        sms_template: z.string().max(5000).optional(),
        email_template: z.string().max(5000).optional(),
      })
      .parse(d),
  )
  .handler(async ({ data }) => {
    const { id, ...rest } = data;
    const { error } = await supabaseAdmin.from("birthdays").update(rest).eq("id", id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
