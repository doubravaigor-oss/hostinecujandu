// Ochrana stránek, které vidí jen správci. Kdo není přihlášený, jde na přihlašovací
// stránku. Stránky se načítají až v telefonu/počítači, protože přihlášení
// se drží tam.
import { Outlet, createFileRoute, redirect } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  beforeLoad: async () => {
    const { data } = await supabase.auth.getUser();
    if (!data.user) {
      throw redirect({ to: "/auth" });
    }
  },
  component: () => <Outlet />,
});
