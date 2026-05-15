// src/components/admins/SettingsTab.tsx

import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { adminUpdateBirthday } from "@/lib/invite.functions";
import { useBirthday } from "./hooks";

const DEFAULT_WHATSAPP = `Bonjour *{{name}}* !

Vous etes cordialement invite(e) a {{event_title}} de {{celebrant}}. Voici votre invitation personnelle avec votre pass QR :

{{url}}

A tres bientot !`;

const DEFAULT_SMS = `Bonjour {{name}} ! Vous etes invite(e) a {{event_title}} de {{celebrant}}. Invitation: {{url}}`;

const DEFAULT_EMAIL = `Bonjour {{name}},\n\nVous etes cordialement invite(e) a {{event_title}} de {{celebrant}}. Retrouvez votre invitation personnelle et votre pass d'entree ici :\n\n{{url}}\n\nNous avons hate de vous accueillir !`;

interface FieldProps {
  label: string;
  value: string;
  type?: string;
  onChange: (v: string) => void;
}

function Field({ label, value, type = "text", onChange }: FieldProps) {
  return (
    <label className="block">
      <span className="label-caps text-muted-foreground">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full bg-white border border-border rounded-xl px-4 py-2"
      />
    </label>
  );
}

export function SettingsTab() {
  const birthday = useBirthday();
  const update = useServerFn(adminUpdateBirthday);
  const [form, setForm] = useState<Record<string, string> | null>(null);

  useEffect(() => {
    if (birthday) {
      setForm({
        ...birthday,
        date: new Date(birthday.date).toISOString().slice(0, 16),
        map_url: birthday.map_url ?? "",
        invitation_text: birthday.invitation_text ?? "",
        whatsapp_template: birthday.whatsapp_template || DEFAULT_WHATSAPP,
        sms_template: birthday.sms_template || DEFAULT_SMS,
        email_template: birthday.email_template || DEFAULT_EMAIL,
      });
    }
  }, [birthday]);

  if (!form) return <p className="text-muted-foreground">Chargement...</p>;

  function set(key: string, value: string) {
    setForm((prev) => (prev ? { ...prev, [key]: value } : prev));
  }

  async function save() {
    if (!form) return;
    try {
      await update({
        data: {
          id: form.id,
          celebrant_name: form.celebrant_name,
          event_title: form.event_title,
          date: new Date(form.date).toISOString(),
          venue: form.venue,
          address: form.address,
          map_url: form.map_url,
          invitation_text: form.invitation_text,
          whatsapp_template: form.whatsapp_template,
          sms_template: form.sms_template,
          email_template: form.email_template,
        },
      });
      toast.success("Anniversaire mis a jour");
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Erreur");
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-card p-6 max-w-2xl space-y-4">
      <h2 className="font-serif italic text-2xl">Parametres de l'anniversaire</h2>

      <div className="grid sm:grid-cols-2 gap-3">
        <Field label="Personne fetee" value={form.celebrant_name} onChange={(v) => set("celebrant_name", v)} />
        <Field label="Titre de l'evenement" value={form.event_title} onChange={(v) => set("event_title", v)} />
        <Field label="Date & heure" value={form.date} type="datetime-local" onChange={(v) => set("date", v)} />
        <Field label="Lieu" value={form.venue} onChange={(v) => set("venue", v)} />
      </div>

      <Field label="Adresse" value={form.address} onChange={(v) => set("address", v)} />
      <Field label="URL Google Maps" value={form.map_url} onChange={(v) => set("map_url", v)} />

      <label className="block">
        <span className="label-caps text-muted-foreground">Texte d'invitation</span>
        <textarea
          value={form.invitation_text}
          rows={4}
          onChange={(e) => set("invitation_text", e.target.value)}
          className="mt-1 w-full bg-white border border-border rounded-xl px-4 py-3"
        />
      </label>

      <label className="block">
        <span className="label-caps text-muted-foreground">Modele WhatsApp</span>
        <textarea
          value={form.whatsapp_template}
          rows={4}
          onChange={(e) => set("whatsapp_template", e.target.value)}
          className="mt-1 w-full bg-white border border-border rounded-xl px-4 py-3"
        />
        <p className="text-xs text-muted-foreground mt-1">
          Placeholders: <code>{"{{name}}"}</code>, <code>{"{{url}}"}</code>,{" "}
          <code>{"{{celebrant}}"}</code>, <code>{"{{event_title}}"}</code>
        </p>
      </label>

      <label className="block">
        <span className="label-caps text-muted-foreground">Modele SMS</span>
        <textarea
          value={form.sms_template}
          rows={3}
          onChange={(e) => set("sms_template", e.target.value)}
          className="mt-1 w-full bg-white border border-border rounded-xl px-4 py-3"
        />
      </label>

      <label className="block">
        <span className="label-caps text-muted-foreground">Modele Email</span>
        <textarea
          value={form.email_template}
          rows={4}
          onChange={(e) => set("email_template", e.target.value)}
          className="mt-1 w-full bg-white border border-border rounded-xl px-4 py-3"
        />
      </label>

      <button onClick={save} className="pill pill-primary">
        Enregistrer
      </button>
    </div>
  );
}
