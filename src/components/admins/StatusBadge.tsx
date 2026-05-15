// src/components/admins/StatusBadge.tsx

import type { Guest } from "./types";

const COLORS: Record<string, string> = {
  CONFIRME: "bg-sky-100 text-blue-900",
  CONFIRMED: "bg-sky-100 text-blue-900",
  REFUSE: "bg-slate-200 text-slate-700",
  DECLINED: "bg-slate-200 text-slate-700",
  "EN ATTENTE": "bg-cyan-100 text-cyan-900",
  PENDING: "bg-cyan-100 text-cyan-900",
};

interface StatusBadgeProps {
  status: Guest["status"];
}

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span className={`label-caps px-2 py-1 rounded-full text-[10px] ${COLORS[status] ?? "bg-muted text-muted-foreground"}`}>
      {status}
    </span>
  );
}
