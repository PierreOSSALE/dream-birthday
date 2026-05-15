// src/components/admin/GuestsTab.tsx

import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { adminCreateGuest, adminDeleteGuest } from "@/lib/invite.functions";
import { Trash2, Plus, Share2, X, CheckSquare, Square, Users } from "lucide-react";
import type { Guest } from "./types";
import { useBirthday, useGuests } from "./hooks";
import { StatusBadge } from "./StatusBadge";
import { ShareModal } from "./ShareModal";
import { IoArrowRedoCircleSharp } from "react-icons/io5";
import { PiTrashFill } from "react-icons/pi";
import { FiCheckSquare, FiSquare } from "react-icons/fi";

type FilterKey = "TOUT" | "PRESENTS" | "ABSENTS" | "EN ATTENTE";

const FILTER_STATUS: Record<string, Guest["status"]> = {
  PRESENTS: "CONFIRME",
  ABSENTS: "REFUSE",
  "EN ATTENTE": "EN ATTENTE",
};

// ─── Add Guest Form ────────────────────────────────────────────────────────────

interface AddGuestFormProps {
  birthdayId: string;
  onAdded: () => void;
  onClose: () => void;
}

function AddGuestForm({ birthdayId, onAdded, onClose }: AddGuestFormProps) {
  const create = useServerFn(adminCreateGuest);
  const [form, setForm] = useState({ name: "", email: "", phone: "" });

  async function handleAdd() {
    if (!form.name.trim()) return;
    try {
      await create({ data: { birthdayId, ...form } });
      toast.success("Convive ajoute");
      setForm({ name: "", email: "", phone: "" });
      onAdded();
      onClose();
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Erreur");
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-card p-5 grid sm:grid-cols-3 gap-3">
      <input
        placeholder="Nom complet *"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        className="bg-cream border border-border rounded-full px-4 py-2"
      />
      <input
        placeholder="Email"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
        className="bg-cream border border-border rounded-full px-4 py-2"
      />
      <input
        placeholder="Téléphone (+243…)"
        value={form.phone}
        onChange={(e) => setForm({ ...form, phone: e.target.value })}
        className="bg-cream border border-border rounded-full px-4 py-2"
      />
      <button
        onClick={handleAdd}
        className="pill pill-primary bg-gold-light hover:bg-gold sm:col-span-3"
      >
        Creer le convive
      </button>
    </div>
  );
}

// ─── Mobile Guest Card ─────────────────────────────────────────────────────────

interface GuestCardProps {
  guest: Guest;
  selected: boolean;
  onToggle: () => void;
  onShare: () => void;
  onDelete: () => void;
}

function GuestCard({ guest, selected, onToggle, onShare, onDelete }: GuestCardProps) {
  return (
    <div
      className={`bg-white rounded-2xl shadow-card p-4 flex items-start gap-3 transition-all border-2 ${
        selected ? "border-gold" : "border-transparent"
      }`}
    >
      <button onClick={onToggle} className="mt-1 shrink-0">
        {selected ? (
          <CheckSquare className="w-5 h-5 text-gold" />
        ) : (
          <Square className="w-5 h-5 text-muted-foreground" />
        )}
      </button>

      <div className="flex-1 min-w-0">
        <p className="font-medium truncate">{guest.name}</p>
        <p className="text-xs text-muted-foreground truncate">{guest.email ?? "—"}</p>
        <div className="mt-2">
          <StatusBadge status={guest.status} />
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex justify-around  items-end gap-2 shrink-0">
          <button onClick={onShare} className="flex items-center justify-center" title="Partager">
            <IoArrowRedoCircleSharp className="w-6 h-6 text-gold-light" />
          </button>
          <button
            onClick={onDelete}
            className="text-gold-light rounded-full flex items-center justify-center"
            title="Supprimer"
          >
            <PiTrashFill className="w-5.5 h-5.5" />
          </button>
        </div>{" "}
        <a
          href={`/invite/${guest.slug}`}
          target="_blank"
          rel="noreferrer"
          className="text-gold hover:underline text-sm text-center mx-auto font-medium"
        >
          Ouvrir
        </a>
      </div>
    </div>
  );
}

// ─── Desktop Guest Row ─────────────────────────────────────────────────────────

interface GuestRowProps {
  guest: Guest;
  selected: boolean;
  onToggle: () => void;
  onShare: () => void;
  onDelete: () => void;
}

function GuestRow({ guest, selected, onToggle, onShare, onDelete }: GuestRowProps) {
  return (
    <tr
      className={`border-t border-border transition-colors ${
        selected ? "bg-gold/5" : "hover:bg-muted/20"
      }`}
    >
      <td className="p-3">
        <button onClick={onToggle}>
          {selected ? (
            <CheckSquare className="w-5 h-5 text-gold" />
          ) : (
            <Square className="w-5 h-5 text-muted-foreground hover:text-gold" />
          )}
        </button>
      </td>
      <td className="p-3">
        <p className="font-medium">{guest.name}</p>
      </td>
      <td className="p-3">
        <p className="text-xs text-muted-foreground">{guest.email ?? "—"}</p>
        <p className="text-xs text-muted-foreground">{guest.phone ?? "—"}</p>
      </td>
      <td className="p-3">
        <StatusBadge status={guest.status} />
      </td>
      <td className="p-3 text-muted-foreground text-xs">
        {guest.confirmed_at ? new Date(guest.confirmed_at).toLocaleDateString("fr-FR") : "—"}
      </td>
      <td className="p-3 text-right">
        <div className="flex items-center justify-end gap-2">
          <button
            onClick={onShare}
            title="Partager cette invitation"
            className="w-8 h-8 rounded-full gradient-gold text-white flex items-center justify-center hover:opacity-90"
          >
            <IoArrowRedoCircleSharp className="w-3.5 h-3.5" />
          </button>

          <a
            href={`/invite/${guest.slug}`}
            target="_blank"
            rel="noreferrer"
            className="text-gold hover:underline text-xs font-medium"
          >
            Ouvrir
          </a>
          <button onClick={onDelete} title="Supprimer" className="text-destructive">
            <PiTrashFill className="w-4 h-4" />
          </button>
        </div>
      </td>
    </tr>
  );
}

// ─── Floating Selection Bar ────────────────────────────────────────────────────

interface FloatingBarProps {
  count: number;
  onDelete: () => void;
  onClear: () => void;
}

function FloatingBar({ count, onDelete, onClear }: FloatingBarProps) {
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="bg-foreground text-background rounded-2xl shadow-2xl px-5 py-3 flex items-center gap-4">
        <Users className="w-4 h-4 opacity-70" />
        <span className="text-sm font-medium">
          {count} convive{count > 1 ? "s" : ""} selectionne{count > 1 ? "s" : ""}
        </span>
        <div className="w-px h-5 bg-background/20" />
        <button
          onClick={onDelete}
          className="inline-flex items-center gap-2 bg-destructive text-white rounded-xl px-4 py-1.5 text-sm font-medium hover:opacity-90"
        >
          <PiTrashFill className="w-4 h-4" />
          Supprimer
        </button>
        <button onClick={onClear} className="opacity-60 hover:opacity-100">
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

// ─── GuestsTab ────────────────────────────────────────────────────────────────

export function GuestsTab() {
  const { data, loading, reload } = useGuests();
  const birthday = useBirthday();
  const del = useServerFn(adminDeleteGuest);

  const [filter, setFilter] = useState<FilterKey>("TOUT");
  const [adding, setAdding] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [showShare, setShowShare] = useState(false);

  const filtered = data.filter((g) =>
    filter === "TOUT" ? true : g.status === FILTER_STATUS[filter],
  );

  const allSelected = filtered.length > 0 && filtered.every((g) => selected.has(g.id));
  const someSelected = filtered.some((g) => selected.has(g.id));
  const selectedGuests = data.filter((g) => selected.has(g.id));

  function toggleAll() {
    if (allSelected) {
      setSelected((s) => {
        const next = new Set(s);
        filtered.forEach((g) => next.delete(g.id));
        return next;
      });
    } else {
      setSelected((s) => new Set([...s, ...filtered.map((g) => g.id)]));
    }
  }

  function toggleOne(id: string) {
    setSelected((s) => {
      const next = new Set(s);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  function openShareFor(id: string) {
    setSelected(new Set([id]));
    setShowShare(true);
  }

  async function remove(id: string) {
    if (!confirm("Supprimer ce convive ?")) return;
    await del({ data: { id } });
    setSelected((s) => {
      const next = new Set(s);
      next.delete(id);
      return next;
    });
    reload();
  }

  async function removeSelected() {
    if (selected.size === 0) return;
    if (!confirm(`Supprimer ${selected.size} convive${selected.size > 1 ? "s" : ""} ?`)) return;
    const ids = Array.from(selected);
    for (const id of ids) {
      try {
        await del({ data: { id } });
      } catch (e: unknown) {
        console.error(e);
        toast.error("Erreur lors de la suppression");
      }
    }
    setSelected(new Set());
    reload();
  }

  return (
    <div className="space-y-4">
      {/* ── Top bar ── */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2 pb-6">
          {(["TOUT", "PRESENTS", "ABSENTS", "EN ATTENTE"] as FilterKey[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`py-2 px-5 rounded-full text-xs ${
                filter === f
                  ? "pill-primary bg-gold text-white"
                  : "pill-outline bg-white hover:bg-gold/10"
              }`}
            >
              {f}
            </button>
          ))}
          <button
            onClick={() => setAdding((v) => !v)}
            className="py-1.75 px-5 rounded-full pill-primary bg-gold-light hover:bg-gold inline-flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Ajouter
          </button>
        </div>
      </div>

      {/* ── Add form ── */}
      {adding && birthday && (
        <AddGuestForm birthdayId={birthday.id} onAdded={reload} onClose={() => setAdding(false)} />
      )}

      {/* ── Mobile cards ── */}
      <div className="sm:hidden space-y-3">
        <div className="flex items-center justify-between">
          <button
            onClick={toggleAll}
            className="inline-flex items-center gap-2 text-sm text-muted-foreground"
          >
            {allSelected ? (
              <CheckSquare className="w-5 h-5 text-gold" />
            ) : (
              <FiSquare className="w-5 h-5" />
            )}
            {allSelected ? "Tout désélectionner" : "Tout sélectionner"}
          </button>
          {someSelected && (
            <button
              onClick={removeSelected}
              className="py-2 px-4 rounded-full inline-flex items-center gap-2 bg-destructive text-white"
            >
              <PiTrashFill className="w-4 h-4" />
              Supprimer ({selected.size})
            </button>
          )}
        </div>

        {loading ? (
          <p className="p-6 text-center text-muted-foreground">Chargement…</p>
        ) : filtered.length === 0 ? (
          <p className="p-6 text-center text-muted-foreground">Aucun convive</p>
        ) : (
          filtered.map((g) => (
            <GuestCard
              key={g.id}
              guest={g}
              selected={selected.has(g.id)}
              onToggle={() => toggleOne(g.id)}
              onShare={() => openShareFor(g.id)}
              onDelete={() => remove(g.id)}
            />
          ))
        )}
      </div>

      {/* ── Desktop table ── */}
      <div className="hidden sm:block bg-white rounded-2xl shadow-card overflow-hidden">
        {/* Table toolbar */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted/30">
          <button
            onClick={toggleAll}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          >
            {allSelected ? (
              <CheckSquare className="w-5 h-5 text-gold" />
            ) : someSelected ? (
              <div className="w-5 h-5 border-2 border-gold rounded flex items-center justify-center">
                <div className="w-2 h-2 bg-gold rounded-sm" />
              </div>
            ) : (
              <IoArrowRedoCircleSharp className="w-5 h-5" />
            )}
            <span className="label-caps">
              {someSelected
                ? `${selected.size} sélectionné${selected.size > 1 ? "s" : ""}`
                : "Tout sélectionner"}
            </span>
          </button>

          {someSelected && (
            <button
              onClick={removeSelected}
              className="pill inline-flex items-center gap-2 bg-destructive text-white animate-in fade-in slide-in-from-right-2 duration-200"
            >
              <PiTrashFill className="w-4 h-4" />
              Supprimer ({selected.size})
            </button>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left label-caps text-muted-foreground">
              <tr>
                <th className="p-3 w-10" />
                <th className="p-3">Nom</th>
                <th className="p-3">Contact</th>
                <th className="p-3">Statut</th>
                <th className="p-3">Confirmé le</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-muted-foreground">
                    Chargement…
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-muted-foreground">
                    Aucun convive
                  </td>
                </tr>
              ) : (
                filtered.map((g) => (
                  <GuestRow
                    key={g.id}
                    guest={g}
                    selected={selected.has(g.id)}
                    onToggle={() => toggleOne(g.id)}
                    onShare={() => openShareFor(g.id)}
                    onDelete={() => remove(g.id)}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Floating bar ── */}
      {someSelected && !showShare && (
        <FloatingBar
          count={selected.size}
          onDelete={removeSelected}
          onClear={() => setSelected(new Set())}
        />
      )}

      {/* ── Share modal ── */}
      {showShare && selectedGuests.length > 0 && (
        <ShareModal guests={selectedGuests} onClose={() => setShowShare(false)} />
      )}
    </div>
  );
}
