// Vydává fotografie, které byly nahrané přes administraci (jsou v soukromém úložišti).
// Otevře jen tu fotku, kterou má hostinec really v seznamu – cizí cestu nevyzradí.
import { createFileRoute } from "@tanstack/react-router";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function typObsahu(cesta: string): string {
  const mala = cesta.toLowerCase();
  if (mala.endsWith(".png")) return "image/png";
  if (mala.endsWith(".gif")) return "image/gif";
  if (mala.endsWith(".webp")) return "image/webp";
  if (mala.endsWith(".avif")) return "image/avif";
  return "image/jpeg";
}

export const Route = createFileRoute("/api/public/fotka/$id")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const id = params.id;
        if (!UUID.test(id)) {
          return new Response("Chybný odkaz", { status: 400 });
        }
        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const { data: radek } = await supabaseAdmin
          .from("fotky")
          .select("storage_path")
          .eq("id", id)
          .maybeSingle();
        if (!radek?.storage_path) {
          return new Response("Fotka nenalezena", { status: 404 });
        }
        const { data: soubor, error } = await supabaseAdmin.storage
          .from("fotky")
          .download(radek.storage_path);
        if (error || !soubor) {
          return new Response("Fotka nenalezena", { status: 404 });
        }
        return new Response(soubor, {
          headers: {
            "Content-Type": typObsahu(radek.storage_path),
            "Cache-Control": "public, max-age=31536000, immutable",
          },
        });
      },
    },
  },
});
