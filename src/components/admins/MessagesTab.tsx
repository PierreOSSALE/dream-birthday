// src/components/admin/MessagesTab.tsx

import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { adminListMessages, adminDeleteMessage } from "@/lib/invite.functions";
import { Trash2 } from "lucide-react";
import type { Msg } from "./types";

export function MessagesTab() {
  const list = useServerFn(adminListMessages);
  const del = useServerFn(adminDeleteMessage);
  const [data, setData] = useState<Msg[]>([]);

  useEffect(() => {
    list({}).then((d) => setData(d as Msg[]));
  }, [list]);

  async function remove(id: string) {
    if (!confirm("Supprimer ce message ?")) return;
    await del({ data: { id } });
    setData((d) => d.filter((m) => m.id !== id));
  }

  if (data.length === 0) {
    return <p className="text-center text-muted-foreground py-8">Aucun message</p>;
  }

  return (
    <ul className="space-y-3">
      {data.map((m) => (
        <li
          key={m.id}
          className="bg-white rounded-2xl shadow-card p-5 flex items-start justify-between gap-4"
        >
          <div>
            <p className="font-serif italic text-lg">"{m.content}"</p>
            <p className="label-caps text-gold mt-2">
              {m.guest_name} · {new Date(m.created_at).toLocaleString("fr-FR")}
            </p>
          </div>
          <button onClick={() => remove(m.id)} className="text-destructive shrink-0">
            <Trash2 className="w-4 h-4" />
          </button>
        </li>
      ))}
    </ul>
  );
}
