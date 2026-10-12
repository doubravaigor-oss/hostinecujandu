<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->
- All editable site content lives in src/data/hostinec.ts — owner updates via chat, one place to change.
- Standalone games live on /hra and use a client-initialized Matter.js engine; keep physics and animation isolated from public content and SSR.
- Public menus omit empty categories so unfinished admin entries never appear as offers.
