import { useEffect, useState } from "react";

function diff(target: number) {
  const now = Date.now();
  let delta = Math.max(0, target - now);
  const days = Math.floor(delta / 86400000);
  delta -= days * 86400000;
  const hours = Math.floor(delta / 3600000);
  delta -= hours * 3600000;
  const minutes = Math.floor(delta / 60000);
  delta -= minutes * 60000;
  const seconds = Math.floor(delta / 1000);
  return { days, hours, minutes, seconds };
}

export function Countdown({ target }: { target: string | Date }) {
  const ts = typeof target === "string" ? new Date(target).getTime() : target.getTime();
  const [t, setT] = useState(() => diff(ts));
  useEffect(() => {
    const id = setInterval(() => setT(diff(ts)), 1000);
    return () => clearInterval(id);
  }, [ts]);

  const items = [
    { v: t.days, l: "Jours" },
    { v: t.hours, l: "Heures" },
    { v: t.minutes, l: "Minutes" },
    { v: t.seconds, l: "Sec" },
  ];

  return (
    <div className="gradient-gold rounded-3xl p-6 mt-10 md:mt-0 text-white ">
      <p className="label-caps text-center opacity-90">La fete commence dans</p>
      <div className="grid grid-cols-4 gap-2 mt-4">
        {items.map((i) => (
          <div key={i.l} className="text-center">
            <div className="font-serif text-3xl md:text-4xl tabular-nums">
              {String(i.v).padStart(2, "0")}
            </div>
            <div className="label-caps opacity-90 mt-1">{i.l}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
