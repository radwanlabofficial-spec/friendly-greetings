import { useEffect, useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { Menu, X, Home, ShoppingBag, ShoppingCart, Leaf, BookOpen, HelpCircle, Sparkles } from "lucide-react";

type NavItem = {
  label: string;
  to?: string;
  href?: string;
  icon: React.ComponentType<{ className?: string }>;
};

const items: NavItem[] = [
  { label: "Home", to: "/", icon: Home },
  { label: "Our Story", href: "/#story", icon: BookOpen },
  { label: "Varieties", href: "/#varieties", icon: Leaf },
  { label: "Shop Mangoes", href: "/#shop", icon: ShoppingBag },
  { label: "FAQ", href: "/#faq", icon: HelpCircle },
  { label: "Checkout", to: "/checkout", icon: ShoppingCart },
];

export function MangoSidebar() {
  const [open, setOpen] = useState(false);
  const { location } = useRouterState();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (open) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => { document.body.style.overflow = prev; };
    }
  }, [open]);

  // close on route change
  useEffect(() => { setOpen(false); }, [location.pathname]);

  const isActive = (item: NavItem) => {
    if (item.to) return location.pathname === item.to && !location.hash;
    if (item.href?.startsWith("/#")) return location.pathname === "/" && location.hash === item.href.slice(1);
    return false;
  };

  return (
    <>
      {/* Floating mango trigger */}
      <button
        type="button"
        aria-label={open ? "Close menu" : "Open menu"}
        onClick={() => setOpen((v) => !v)}
        className="fixed left-4 top-4 z-[60] grid h-14 w-14 place-items-center rounded-full shadow-warm transition-transform hover:scale-110 active:scale-95 animate-mango-bob"
        style={{ background: "var(--gradient-sunset)" }}
      >
        <span className="absolute -top-1 -right-1 text-leaf animate-leaf-sway">
          <Leaf className="h-4 w-4 rotate-45 fill-current" />
        </span>
        {open ? (
          <X className="h-6 w-6 text-primary-foreground" />
        ) : (
          <Menu className="h-6 w-6 text-primary-foreground" />
        )}
      </button>

      {/* Backdrop */}
      <div
        onClick={() => setOpen(false)}
        className={`fixed inset-0 z-[55] bg-foreground/40 backdrop-blur-sm transition-opacity duration-300 ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        aria-hidden="true"
      />

      {/* Panel */}
      <aside
        aria-hidden={!open}
        className={`fixed left-0 top-0 z-[58] h-full w-[85vw] max-w-[340px] overflow-hidden shadow-warm transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{ background: "var(--gradient-sunset)" }}
      >
        {/* Floating mango drops */}
        <span className="pointer-events-none absolute -left-10 top-24 h-32 w-32 rounded-full bg-sun/40 blur-2xl animate-mango-float" />
        <span className="pointer-events-none absolute right-[-3rem] top-1/2 h-40 w-40 rounded-full bg-primary/40 blur-3xl animate-mango-float-slow" />
        <span className="pointer-events-none absolute -bottom-10 left-1/3 h-28 w-28 rounded-full bg-accent/50 blur-2xl animate-mango-float" />

        <div className="relative flex h-full flex-col p-6 pt-24">
          <div className="mb-8">
            <div className="flex items-center gap-2 text-primary-foreground/80">
              <Sparkles className="h-4 w-4" />
              <span className="text-xs uppercase tracking-[0.2em]">Aamrash</span>
            </div>
            <h2 className="mt-2 font-display text-3xl text-primary-foreground">
              Ripe & ready
            </h2>
          </div>

          <nav className="flex flex-col gap-1">
            {items.map((item, i) => {
              const Icon = item.icon;
              const active = isActive(item);
              const className = `group relative flex items-center gap-3 rounded-2xl px-4 py-3 text-base font-medium transition-all ${
                active
                  ? "bg-background/90 text-foreground shadow-soft"
                  : "text-primary-foreground hover:bg-background/20"
              } ${open ? "animate-item-in" : "opacity-0"}`;
              const style = { animationDelay: `${120 + i * 60}ms` } as React.CSSProperties;
              const inner = (
                <>
                  <span
                    className={`grid h-8 w-8 place-items-center rounded-full transition-transform group-hover:scale-110 ${
                      active ? "bg-primary text-primary-foreground" : "bg-background/30 text-primary-foreground"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                  </span>
                  <span className="flex-1">{item.label}</span>
                  <Leaf
                    className={`h-4 w-4 transition-all ${
                      active ? "text-leaf opacity-100" : "text-primary-foreground/60 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0"
                    }`}
                  />
                </>
              );
              return item.to ? (
                <Link key={item.label} to={item.to} className={className} style={style} onClick={() => setOpen(false)}>
                  {inner}
                </Link>
              ) : (
                <a key={item.label} href={item.href} className={className} style={style} onClick={() => setOpen(false)}>
                  {inner}
                </a>
              );
            })}
          </nav>

          <div className="mt-auto pt-8">
            <div className="rounded-2xl bg-background/15 p-4 backdrop-blur-sm">
              <p className="font-display text-lg text-primary-foreground">
                Tree-ripened. Hand-picked.
              </p>
              <p className="mt-1 text-xs text-primary-foreground/80">
                Shipped within 24 hours of harvest.
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

export default MangoSidebar;
