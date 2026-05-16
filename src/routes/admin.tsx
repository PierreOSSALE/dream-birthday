// src/routes/admin.tsx

import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useIsAdmin } from "@/hooks/useAuth";
import { LogOut, MessageSquare, PartyPopper, Settings } from "lucide-react";
import { MdOutlineDashboard } from "react-icons/md";
import { FiUsers } from "react-icons/fi";

import { Dashboard } from "@/components/admins/Dashboard";
import { GuestsTab } from "@/components/admins/GuestsTab";
import { MessagesTab } from "@/components/admins/MessagesTab";
import { SettingsTab } from "@/components/admins/SettingsTab";
import type { AdminTab } from "@/components/admins/types";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin - Anniversaire" },
      {
        name: "description",
        content:
          "Espace administrateur - gerer convives, messages et parametres de l'anniversaire.",
      },
    ],
  }),
  component: AdminShell,
});

function AdminShell() {
  const { isAdmin, loading, session } = useIsAdmin();
  const nav = useNavigate();

  useEffect(() => {
    if (!loading && !session) nav({ to: "/login" });
  }, [loading, session, nav]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream">
        <p className="text-muted-foreground">Chargement...</p>
      </div>
    );
  }
  if (!session) return null;
  if (!isAdmin) return <NotAdmin email={session.user.email ?? ""} />;

  return <AdminApp />;
}

function NotAdmin({ email }: { email: string }) {
  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-6 text-center">
      <div className="max-w-md bg-white rounded-3xl shadow-card p-8">
        <h1 className="font-serif italic text-3xl">Acces non autorise</h1>
        <p className="text-muted-foreground mt-3">
          Votre compte ({email}) n'a pas le role administrateur.
        </p>
        <p className="text-sm text-muted-foreground mt-3">
          Demandez a un admin d'ajouter votre <code>user_id</code> a la table{" "}
          <code>user_roles</code> avec le role <code>admin</code>.
        </p>
        <button onClick={() => supabase.auth.signOut()} className="pill pill-outline mt-6">
          Se deconnecter
        </button>
      </div>
    </div>
  );
}

const TABS: { k: AdminTab; label: string; icon: React.ReactNode }[] = [
  { k: "dashboard", label: "Tableau", icon: <MdOutlineDashboard className="text-xl" /> },
  { k: "guests", label: "Convives", icon: <FiUsers className="text-xl" /> },
  { k: "messages", label: "Messages", icon: <MessageSquare className="w-4 h-4" /> },
  { k: "settings", label: "Parametres", icon: <Settings className="w-4 h-4" /> },
];

function AdminApp() {
  const [tab, setTab] = useState<AdminTab>("dashboard");

  return (
    <div className="min-h-screen bg-cream">
      <header className="bg-white border-b border-border">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <PartyPopper className="w-6 h-6 text-gold" />
            <span className="font-serif italic text-lg">Admin anniversaire</span>
          </div>
          <button
            onClick={() => supabase.auth.signOut()}
            className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
          >
            <LogOut className="w-4 h-4" /> Deconnexion
          </button>
        </div>

        <nav className="max-w-6xl mx-auto px-4 flex gap-1 items-center justify-center">
          {TABS.map((t) => (
            <button
              key={t.k}
              onClick={() => setTab(t.k)}
              className={`label-caps inline-flex items-center gap-2 px-3 py-2 border-b-2 transition-colors ${
                tab === t.k
                  ? "border-gold text-gold"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {t.icon}
              <span className="ml-1 hidden sm:inline">{t.label}</span>
            </button>
          ))}
        </nav>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {tab === "dashboard" && <Dashboard />}
        {tab === "guests" && <GuestsTab />}
        {tab === "messages" && <MessagesTab />}
        {tab === "settings" && <SettingsTab />}
      </main>
    </div>
  );
}
