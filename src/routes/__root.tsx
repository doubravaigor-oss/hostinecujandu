import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
  type ErrorComponentProps,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";
import { Toaster } from "@/components/ui/sonner";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { Layout } from "@/components/Layout";
import { obsahQuery, hodinyObsah, type Obsah } from "@/lib/obsah.functions";
import { oteviraciDoba } from "@/data/hostinec";
import { supabase } from "@/integrations/supabase/client";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: ErrorComponentProps) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

// ==== Informace pro Google (kartička s adresou, telefonem a hodinami) ====
const CZ_DNY: Record<string, string> = {
  "pondělí": "Monday",
  "úterý": "Tuesday",
  "středa": "Wednesday",
  "čtvrtek": "Thursday",
  "pátek": "Friday",
  "sobota": "Saturday",
  "neděle": "Sunday",
};

function oteviraciProGoogle(hodiny: { den: string; cas: string }[]) {
  const specifikace: {
    "@type": string;
    dayOfWeek: string[];
    opens: string;
    closes: string;
  }[] = [];
  for (const h of hodiny) {
    if (/zav[řr]eno/i.test(h.cas)) continue;
    const cas = h.cas.match(/(\d{1,2}):(\d{2}).*?(\d{1,2}):(\d{2})/);
    if (!cas) continue;
    const dny = h.den
      .split(/[–-]/)
      .map((d) => CZ_DNY[d.trim().toLowerCase()])
      .filter((d): d is string => Boolean(d));
    if (!dny.length) continue;
    const od = cas[1] ?? "0";
    const doHodnoty = cas[3] ?? "0";
    specifikace.push({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: dny,
      opens: `${od.padStart(2, "0")}:${cas[2] ?? "00"}`,
      closes: `${doHodnoty.padStart(2, "0")}:${cas[4] ?? "00"}`,
    });
  }
  return specifikace;
}

function karticka(obsah: Obsah | undefined) {
  const hodiny = obsah ? hodinyObsah(obsah) : oteviraciDoba;
  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": "BarOrPub",
    name: "Hostinec U Jandů",
    telephone: "+420732350877",
    servesCuisine: "Česká hospodská kuchyně",
    sameAs: "https://www.facebook.com/p/Hostinec-u-Jand%C5%AF-100083607960708/",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Náměstí Prokopa Chocholouška 18",
      addressLocality: "Nadějkov",
      addressRegion: "Jihočeský kraj",
      addressCountry: "CZ",
    },
    openingHoursSpecification: oteviraciProGoogle(hodiny),
  });
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  loader: async ({ context }) => {
    const obsah = await context.queryClient.ensureQueryData(obsahQuery);
    return { obsah };
  },
  head: ({ loaderData }) => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Hostinec U Jandů – Nadějkov" },
      { name: "description", content: "Pivnice a tradiční hospodská kuchyně v Nadějkově." },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
    ],
    scripts: [{ type: "application/ld+json", children: karticka(loaderData?.obsah) }],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="cs">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const router = useRouter();

  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((event) => {
      if (event !== "SIGNED_IN" && event !== "SIGNED_OUT" && event !== "USER_UPDATED") return;
      router.invalidate();
      if (event !== "SIGNED_OUT") queryClient.invalidateQueries();
    });
    return () => data.subscription.unsubscribe();
  }, [queryClient, router]);

  return (
    <QueryClientProvider client={queryClient}>
      <Layout>
        <Outlet />
      </Layout>
      <Toaster />
    </QueryClientProvider>
  );
}
