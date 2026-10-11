import { createServerFn } from "@tanstack/react-start";
import { createSupabaseServerClient } from "./supabase.server";

export type AuthUser = {
  id: string;
  email: string;
};

export const getSessionUser = createServerFn({ method: "GET" }).handler(async (): Promise<AuthUser | null> => {
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user?.email) return null;
  return { id: data.user.id, email: data.user.email };
});

export const login = createServerFn({ method: "POST" })
  .validator((data: { email: string; password: string }) => data)
  .handler(async ({ data }): Promise<{ ok: boolean; error?: string }> => {
    const email = data.email.trim().toLowerCase();
    const password = data.password;
    if (!email || !password) {
      return { ok: false, error: "Email and password are required" };
    }

    const supabase = createSupabaseServerClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { ok: false, error: "Invalid email or password" };

    return { ok: true };
  });

export const logout = createServerFn({ method: "POST" }).handler(async () => {
  const supabase = createSupabaseServerClient();
  await supabase.auth.signOut();
  return { ok: true };
});
