## Animated Mango Sidebar

Add a playful, mango-themed navigation sidebar that overlays all pages. Pure client-side React + Tailwind + CSS animations — fully static, works on Cloudflare Pages with no server runtime.

### What you'll see
- A floating **mango-shaped toggle button** (top-left, fixed) with a soft gradient + leaf icon. Gently bobs/sways idle; scales on hover.
- Click → slides in a sidebar from the left (`slide-in-right` reversed) with a warm mango gradient background (golden-yellow → orange → blush), subtle grain, and a soft glow.
- Nav links: **Home**, **Shop Mangoes**, **Checkout**, plus anchor links to homepage sections (Story, Varieties, FAQ). Each item fades+slides in staggered (50ms apart) with a tiny leaf bullet.
- Active route gets a glossy "ripe" pill highlight; hover grows a leaf accent.
- Decorative animated mango "drops" floating in the sidebar background (CSS keyframes only — no libs).
- Backdrop blur + dimmed overlay; click outside or ESC closes. Body scroll locked when open.
- Fully responsive; on mobile it takes ~85vw, on desktop ~320px.

### Files
- **Create** `src/components/MangoSidebar.tsx` — self-contained component: trigger button, overlay, panel, nav items, animations. Uses `@tanstack/react-router` `Link` + `useRouterState` for active state. Internal `useState` for open/close, `useEffect` for ESC + scroll lock.
- **Edit** `src/routes/__root.tsx` — mount `<MangoSidebar />` inside `RootComponent` so it appears on every route.
- **Edit** `src/index.css` (or wherever Tailwind globals live) — add a few `@keyframes` for mango bob, leaf sway, and floating drops (reuses existing tokens, no new deps).

### Cloudflare-friendly notes
- No server functions, no SSR, no new packages. Pure CSS + React state. Ships as part of the existing static `dist/` bundle.

### Out of scope
- Not replacing the existing top nav; sidebar is additive.
- No new routes; nav items point to existing pages/anchors only.
