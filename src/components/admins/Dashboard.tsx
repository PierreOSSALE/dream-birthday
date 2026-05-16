// src/components/admins/Dashboard.tsx

import { useGuests } from "./hooks";
import CountUp from "@/components/animations/CountUp";
import HoverScale from "@/components/animations/HoverScale";

function Stat({
  label,
  value,
  accent,
}: {
  label: string;
  value: number | string;
  accent?: boolean;
}) {
  return (
    <HoverScale>
      <div
        className={`rounded-2xl shadow-card p-6 ${accent ? "gradient-gold text-white" : "bg-white"}`}
      >
        <p className={`label-caps ${accent ? "opacity-90" : "text-muted-foreground"}`}>{label}</p>
        <p className="font-serif text-4xl mt-2">
          {typeof value === "number" ? (
            // key={value} force CountUp à se re-monter quand la donnée arrive en async
            <CountUp key={value} value={value} />
          ) : (
            value
          )}
        </p>
      </div>
    </HoverScale>
  );
}

export function Dashboard() {
  const { data, loading } = useGuests();

  const total = data.length;
  const confirmed = data.filter((g) => g.status === "CONFIRME").length;
  const declined = data.filter((g) => g.status === "REFUSE").length;
  const pending = total - confirmed - declined;
  const pct = total ? Math.round((confirmed / total) * 100) : 0;

  if (loading) {
    return <div className="text-center py-12 text-muted-foreground label-caps">Chargement…</div>;
  }

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <Stat label="Total convives" value={total} />
      <Stat label="Confirmés" value={`${confirmed} (${pct}%)`} accent />
      <Stat label="Déclinés" value={declined} />
      <Stat label="En attente" value={pending} />
      <div className="sm:col-span-2 lg:col-span-4 bg-white rounded-2xl shadow-card p-6">
        <p className="label-caps text-muted-foreground">Progression des confirmations</p>
        <div className="mt-3 h-3 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full gradient-gold transition-all duration-700"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
    </div>
  );
}
