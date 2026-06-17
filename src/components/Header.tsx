import { Link } from "@tanstack/react-router";
import { CartDrawer } from "./CartDrawer";

export function Header() {
  return (
    <header className="sticky top-0 z-40 backdrop-blur-xl bg-background/70 border-b border-border/60">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <span className="text-2xl">🥭</span>
          <span className="font-display text-xl tracking-tight">Aamrash</span>
        </Link>
        <nav className="hidden md:flex items-center gap-8 text-sm">
          <Link
            to="/"
            className="text-foreground/70 hover:text-foreground transition-colors"
          >
            Shop
          </Link>
          <a
            href="#story"
            className="text-foreground/70 hover:text-foreground transition-colors"
          >
            Our story
          </a>
          <a
            href="#season"
            className="text-foreground/70 hover:text-foreground transition-colors"
          >
            In season
          </a>
        </nav>
        <CartDrawer />
      </div>
    </header>
  );
}
