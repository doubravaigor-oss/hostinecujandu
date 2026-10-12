// Administrace: úvodní obrazovka s přehledem, co se dá spravovat.
import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { AdminShell } from "@/components/Admin";
import { obsahQuery, textyObsah } from "@/lib/obsah.functions";
import { jestAdmin } from "@/lib/admin.functions";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({
    meta: [
      { title: "Administrace – Hostinec U Jandů" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Admin,
});

const Casti = [
  {
    to: "/admin/jidlo",
    titulek: "Jídelní a nápojový lístek",
    text: "Přidat položku, přepsat název nebo cenu, smazat, přeskládat pořadí.",
  },
  {
    to: "/admin/fotky",
    titulek: "Fotogalerie",
    text: "Nahrát fotku přímo z telefonu, přepsat popisek, přeskládat, vyndat.",
  },
  {
    to: "/admin/akce",
    titulek: "Akce a oznámení",
    text: "Termín šipek, pozvánka, oznámení – i to, co se pravidelně opakuje.",
  },
  {
    to: "/admin/hodiny",
    titulek: "Otevírací doba",
    text: "Běžné hodiny i mimořádná změna (zavřeno, jen do oběda, otevřeno navíc).",
  },
  {
    to: "/admin/texty",
    titulek: "Texty",
    text: "Žlutý pásek „ještě doplňujeme“ a věta o čerstvých surovinách.",
  },
] as const;

function Admin() {
  const { data: obsah } = useSuspenseQuery(obsahQuery);
  const overit = useServerFn(jestAdmin);
  const [pravo, setPravo] = useState<boolean | null>(null);
  const [email, setEmail] = useState("");
  const texty = textyObsah(obsah);

  useEffect(() => {
    overit()
      .then((v: { admin: boolean }) => setPravo(v.admin))
      .catch(() => setPravo(false));
    supabase.auth.getSession().then(({ data }) => {
      setEmail(data.session?.user.email ?? "");
    });
  }, [overit]);

  return (
    <AdminShell titulek="Vítejte ve správě webu">
      {pravo === false && (
        <p className="mb-3 border-2 border-dashed border-title bg-beer/40 p-2 text-xs font-bold">
          Účet {email} zatím nemá právo něco měnit. Napište do chatu „přidej {email} do
          administrace“ a právo se doplní.
        </p>
      )}
      {pravo === true && (
        <p className="mb-3 text-xs">
          Přihlášen jako <b>{email}</b>. Web naposledy doplněn: <b>{texty.naposledy}</b>.
        </p>
      )}

      <div className="grid gap-2 sm:grid-cols-2">
        {Casti.map((c) => (
          <Link key={c.to} to={c.to} className="frame bg-beer/30 p-2 no-underline">
            <div className="text-base font-bold">{c.titulek} »</div>
            <div className="text-xs">{c.text}</div>
          </Link>
        ))}
      </div>

      <p className="mt-3 text-xs">
        Počítadlo: {obsah.kategorie.length} kategorií,
        {obsah.kategorie.reduce((s, k) => s + k.polozky.length, 0)} položek v lístku,{" "}
        {obsah.fotky.length} fotek, {obsah.aktuality.length} oznámení,{" "}
        {obsah.pravidelne.length} pravidelných akcí, {obsah.hodiny.length} řádků otevírací doby.
      </p>
      <p className="mt-2 text-xs text-muted-foreground">
        Ukládání tady nic navíc nestojí – je to součást webu, žádná placená služba se nepoužívá.
      </p>
    </AdminShell>
  );
}
