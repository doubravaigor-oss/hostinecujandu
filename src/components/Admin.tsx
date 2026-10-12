// Společné kousky administrace: horní lišta, tlačítka, pole na text a hlášky.
import { Link, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback, type ReactNode } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

// Uloží a hlásí výsledek. Když se něco nezdaří, napíše proč.
export function useUloziti() {
  const queryClient = useQueryClient();
  return useCallback(
    async (co: Promise<unknown>, hlaska = "Uloženo.") => {
      try {
        await co;
        queryClient.invalidateQueries({ queryKey: ["obsah"] });
        toast.success(hlaska);
        return true;
      } catch (e) {
        toast.error(e instanceof Error ? e.message : "Nepodařilo se uložit.");
        return false;
      }
    },
    [queryClient],
  );
}

const Casti = [
  { to: "/admin", label: "» Úvod administrace" },
  { to: "/admin/jidlo", label: "Jídelní a nápojový lístek" },
  { to: "/admin/fotky", label: "Fotogalerie" },
  { to: "/admin/akce", label: "Akce a oznámení" },
  { to: "/admin/hodiny", label: "Otevírací doba" },
  { to: "/admin/texty", label: "Texty" },
] as const;

export function AdminShell({ titulek, children }: { titulek: string; children: ReactNode }) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  async function odhlasit() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  return (
    <div className="mx-auto max-w-[900px] p-1 sm:p-3">
      <header className="frame paper p-2">
        <div className="text-xs text-muted-foreground">★ správa webu hostince ★</div>
        <h1 className="text-xl sm:text-2xl" style={{ textShadow: "2px 2px 0 var(--beer)" }}>
          ADMINISTRACE – HOSTINEC U JANDŮ
        </h1>
        <nav className="mt-2 flex flex-wrap gap-1">
          {Casti.map((c) => (
            <Link
              key={c.to}
              to={c.to}
              className="retro-btn text-xs"
              activeProps={{ style: { background: "var(--beer)" } }}
            >
              {c.label}
            </Link>
          ))}
          <Link to="/" className="retro-btn text-xs">
            Zpět na web
          </Link>
        </nav>
      </header>

      <section className="frame paper mt-2">
        <h2 className="retro-heading text-base">{titulek}</h2>
        <div className="p-3">{children}</div>
      </section>

      <footer className="frame paper mt-2 p-2 text-center text-xs">
        <span className="text-muted-foreground">
          Co tady uložíte, je hned vidět na veřejném webu.
        </span>{" "}
        <button type="button" onClick={odhlasit} className="retro-btn text-xs">
          Odhlásit se
        </button>
      </footer>
    </div>
  );
}

export function Tlacitko({
  children,
  onClick,
  disabled,
  varhovat,
  vyletky,
}: {
  children: ReactNode;
  onClick: () => void;
  disabled?: boolean;
  varhovat?: string;
  vyletky?: boolean;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => {
        if (varhovat && !window.confirm(varhovat)) return;
        onClick();
      }}
      className={(vyletky ? "retro-btn-big text-sm" : "retro-btn text-xs") + " mt-1"}
    >
      {children}
    </button>
  );
}

export function Polek({
  label,
  hodnota,
  zmena,
  sirka,
  type = "text",
  placeholder,
}: {
  label: string;
  hodnota: string;
  zmena: (v: string) => void;
  sirka?: string;
  type?: string;
  placeholder?: string;
}) {
  return (
    <label className="block text-xs font-bold">
      {label}
      <input
        type={type}
        value={hodnota}
        placeholder={placeholder}
        onChange={(e) => zmena(e.target.value)}
        className={"retro-input mt-0.5 " + (sirka ?? "w-full")}
      />
    </label>
  );
}

export function DlouhePole({
  label,
  hodnota,
  zmena,
  radku = 2,
}: {
  label: string;
  hodnota: string;
  zmena: (v: string) => void;
  radku?: number;
}) {
  return (
    <label className="block text-xs font-bold">
      {label}
      <textarea
        value={hodnota}
        rows={radku}
        onChange={(e) => zmena(e.target.value)}
        className="retro-input mt-0.5 w-full"
      />
    </label>
  );
}

export function Pravida({ deti }: { deti: ReactNode }) {
  return <div className="mt-1 flex flex-wrap gap-1">{deti}</div>;
}
