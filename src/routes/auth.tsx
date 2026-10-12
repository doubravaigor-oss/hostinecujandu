// Přihlášení do správy webu. Tady se přihlásí jen ti, kdo mají právo něco měnit.
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Přihlášení správy – Hostinec U Jandů" },
      { name: "description", content: "Přihlášení pro správu obsahu webu Hostince U Jandů." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Prihlaseni,
});

function Prihlaseni() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [heslo, setHeslo] = useState("");
  const [zprava, setZprava] = useState("");
  const [chyba, setChyba] = useState("");
  const [pracuje, setPracuje] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/admin", replace: true });
    });
  }, [navigate]);

  async function prihlasit() {
    setChyba("");
    setZprava("");
    setPracuje(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password: heslo });
    setPracuje(false);
    if (error) {
      setChyba(
        error.message === "Invalid login credentials"
          ? "Nesprávný e-mail nebo heslo. Zkuste to znovu."
          : "Přihlášení se nezdařilo: " + error.message,
      );
      return;
    }
    navigate({ to: "/admin", replace: true });
  }

  async function registrovat() {
    setChyba("");
    setZprava("");
    if (heslo.length < 8) {
      setChyba("Heslo musí mít aspoň 8 znaků.");
      return;
    }
    setPracuje(true);
    const { data, error } = await supabase.auth.signUp({
      email,
      password: heslo,
      options: { emailRedirectTo: window.location.origin + "/admin" },
    });
    setPracuje(false);
    if (error) {
      setChyba("Nepodařilo se sepsat: " + error.message);
      return;
    }
    if (data.session) {
      navigate({ to: "/admin", replace: true });
      return;
    }
    setZprava(
      "Dobrá, teď se podívejte do schránky " +
        email +
        " (a taky do SPAMu) – pošleme vám odkaz, na který klikněte. Až to uděláte, vraťte se sem a přihlaste se.",
    );
  }

  async function zapomenuteHeslo() {
    setChyba("");
    setZprava("");
    if (!email) {
      setChyba("Nejdřív napište svůj e-mail.");
      return;
    }
    setPracuje(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + "/auth",
    });
    setPracuje(false);
    if (error) {
      setChyba("Nepodařilo se poslat heslo: " + error.message);
      return;
    }
    setZprava("Poslali jsme vám e-mail s odkazem na nové heslo. Mrkněte i do SPAMu.");
  }

  return (
    <section className="frame paper p-3">
      <h2 className="retro-heading -mx-3 -mt-3 mb-3 text-lg">Přihlášení správy webu</h2>
      <p className="mb-3 text-xs">
        Tohle je jen pro majitele hostince. Běžní návštěvníci webu se přihlašovat nemusí.
      </p>

      <label htmlFor="prihlaseni-email" className="block text-xs font-bold">
        Váš e-mail
      </label>
      <input
        id="prihlaseni-email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="retro-input mt-1 mb-2 w-full"
        placeholder="jmeno@email.cz"
        autoComplete="username"
      />

      <label htmlFor="prihlaseni-heslo" className="block text-xs font-bold">
        Heslo
      </label>
      <input
        id="prihlaseni-heslo"
        type="password"
        value={heslo}
        onChange={(e) => setHeslo(e.target.value)}
        className="retro-input mt-1 mb-3 w-full"
        placeholder="••••••••"
        autoComplete="current-password"
        onKeyDown={(e) => {
          if (e.key === "Enter") prihlasit();
        }}
      />

      <div className="flex flex-wrap gap-2">
        <button type="button" onClick={prihlasit} disabled={pracuje} className="retro-btn-big">
          Přihlásit se
        </button>
        <button type="button" onClick={registrovat} disabled={pracuje} className="retro-btn">
          Nový účet (napsat e-mail a heslo)
        </button>
        <button type="button" onClick={zapomenuteHeslo} disabled={pracuje} className="retro-btn">
          Zapomenuté heslo
        </button>
      </div>

      {pracuje && <p className="mt-2 text-xs italic">Chviličku strpení…</p>}
      {zprava && (
        <p className="mt-3 border-2 border-dashed border-accent bg-beer/40 p-2 text-xs">{zprava}</p>
      )}
      {chyba && (
        <p className="mt-3 border-2 border-dashed border-title bg-beer/40 p-2 text-xs font-bold">
          {chyba}
        </p>
      )}

      <p className="mt-4 text-xs">
        <Link to="/">« Zpět na webové stránky hostince</Link>
      </p>
    </section>
  );
}
