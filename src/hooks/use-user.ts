import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import type { User } from "@/types";

export function useUser(): { data: User | null } {
  const [data, setData] = useState<User | null>(null);

  useEffect(() => {
    void supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session?.user) return;
      const u = session.user;
      setData({
        id: u.id,
        name: u.user_metadata?.full_name ?? u.email ?? "Usuário",
        email: u.email ?? "",
        avatarUrl: u.user_metadata?.avatar_url ?? undefined,
        handle: u.email?.split("@")[0] ?? "user",
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        joinedAt: u.created_at,
      });
    });
  }, []);

  return { data };
}