// src/routes/login.tsx
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { BirthdaySparkle } from "@/components/invite/ui";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Connexion Admin" }] }),
  component: Login,
});

function Login() {
  const nav = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${window.location.origin}/admin` },
        });
        if (error) throw error;
        toast.success("Compte cree. Vous pouvez vous connecter.");
        setMode("signin");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        nav({ to: "/admin" });
      }
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Erreur");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="min-h-screen bg-cream flex items-center justify-center px-6">
      <form onSubmit={submit} className="w-full max-w-sm bg-white rounded-3xl shadow-card p-8">
        <div className="text-center mb-6">
          <BirthdaySparkle className="w-12 h-6 text-gold mx-auto" />
          <h1 className="font-serif italic text-3xl mt-3">Espace Admin</h1>
          <p className="label-caps text-muted-foreground mt-1">
            {mode === "signin" ? "Connexion" : "Creation de compte"}
          </p>
        </div>
        <div className="space-y-3">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full bg-cream border border-border rounded-full px-5 py-3 focus:outline-none focus:ring-2 focus:ring-[var(--gold)]"
          />
          <input
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Mot de passe"
            className="w-full bg-cream border border-border rounded-full px-5 py-3 focus:outline-none focus:ring-2 focus:ring-[var(--gold)]"
          />
        </div>
        <button disabled={busy} type="submit" className="pill pill-primary w-full mt-6 disabled:opacity-50">
          {mode === "signin" ? "Se connecter" : "Creer le compte"}
        </button>
        <button
          type="button"
          onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
          className="block mx-auto mt-4 text-sm text-gold hover:underline"
        >
          {mode === "signin" ? "Creer un compte" : "Deja un compte ? Se connecter"}
        </button>
        <p className="text-xs text-muted-foreground text-center mt-4">
          Le 1er compte cree doit etre promu administrateur dans la base.
        </p>
      </form>
    </main>
  );
}
