// src/components/admins/hooks.ts

import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { adminGetBirthday, adminListGuests } from "@/lib/invite.functions";
import type { Birthday, Guest } from "./types";
import { STATUS_MAP } from "./helpers";

export function useGuests() {
  const list = useServerFn(adminListGuests);
  const [data, setData] = useState<Guest[]>([]);
  const [loading, setLoading] = useState(true);

  const reload = () =>
    list({}).then((d) => {
      const arr = (d as any[] | undefined) ?? [];
      setData(arr.map((it) => ({ ...it, status: STATUS_MAP[it?.status] ?? it?.status })));
      setLoading(false);
    });

  useEffect(() => {
    reload(); // eslint-disable-line react-hooks/exhaustive-deps
  }, []);

  return { data, loading, reload };
}

export function useBirthday() {
  const get = useServerFn(adminGetBirthday);
  const [birthday, setBirthday] = useState<Birthday | null>(null);

  useEffect(() => {
    get({}).then((d) => setBirthday(d as Birthday | null));
  }, [get]);

  return birthday;
}
