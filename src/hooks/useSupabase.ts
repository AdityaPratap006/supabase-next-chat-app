import { createClient } from "@supabase/supabase-js";
import { useEffect, useState } from "react";

const url: string = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const apiKey: string = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

const supabase = createClient(url, apiKey);

export const useSupabase = () => {
  const [session, setSession] = useState(supabase.auth.session());

  useEffect(() => {
    const { data: authSubscription } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setSession(session);
      }
    );

    return () => {
      authSubscription?.unsubscribe();
    };
  }, []);

  return { session, supabase };
};
