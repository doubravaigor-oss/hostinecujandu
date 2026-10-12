// Administrace: společný rámec. Pod ním jsou vlastní stránky (jidlo, fotky, akce, hodiny, texty).
import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({
    meta: [
      { title: "Administrace – Hostinec U Jandů" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: () => <Outlet />,
});
