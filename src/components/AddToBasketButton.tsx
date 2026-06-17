import { useState } from "react";
import { Loader2, Check, ShoppingBasket, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Props {
  onAdd: () => Promise<void> | void;
  disabled?: boolean;
  loading?: boolean;
  /** "pill" = large primary CTA on product page, "icon" = floating circle on cards */
  variant?: "pill" | "icon";
  label?: string;
  soldOut?: boolean;
  className?: string;
  ariaLabel?: string;
}

/**
 * Add-to-basket with a three-state animation: idle → loading → success.
 * On success it briefly shows a checkmark + a soft pulse, then resets.
 */
export function AddToBasketButton({
  onAdd,
  disabled,
  loading,
  variant = "pill",
  label = "Add to basket",
  soldOut,
  className,
  ariaLabel,
}: Props) {
  const [justAdded, setJustAdded] = useState(false);

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (disabled || loading || soldOut) return;
    await onAdd();
    setJustAdded(true);
    window.setTimeout(() => setJustAdded(false), 1400);
  };

  if (variant === "icon") {
    return (
      <Button
        onClick={handleClick}
        disabled={disabled || loading || soldOut}
        size="icon"
        aria-label={ariaLabel || label}
        className={cn(
          "relative h-12 w-12 rounded-full shadow-warm transition-all duration-300 overflow-hidden",
          justAdded
            ? "bg-leaf text-background scale-110"
            : "bg-foreground text-background hover:bg-primary hover:scale-110 active:scale-95",
          className,
        )}
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : justAdded ? (
          <Check className="h-5 w-5 animate-in zoom-in-50 duration-200" />
        ) : (
          <Plus className="h-5 w-5 transition-transform group-hover:rotate-90" />
        )}
      </Button>
    );
  }

  return (
    <Button
      onClick={handleClick}
      disabled={disabled || loading || soldOut}
      size="lg"
      aria-label={ariaLabel || label}
      className={cn(
        "group relative overflow-hidden rounded-full px-8 h-12 text-base font-medium",
        "transition-all duration-300 active:scale-[0.98]",
        soldOut
          ? "bg-muted text-muted-foreground"
          : justAdded
            ? "bg-leaf text-background"
            : "bg-gradient-to-r from-primary via-primary to-amber-500 text-primary-foreground hover:shadow-warm hover:brightness-105",
        className,
      )}
    >
      {/* Animated saffron sheen on hover */}
      {!soldOut && !justAdded && (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 group-hover:translate-x-full"
        />
      )}
      <span className="relative inline-flex items-center gap-2">
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Adding…
          </>
        ) : justAdded ? (
          <>
            <Check className="h-5 w-5 animate-in zoom-in-50 duration-200" />
            Added to basket
          </>
        ) : soldOut ? (
          "Sold out"
        ) : (
          <>
            <ShoppingBasket className="h-5 w-5 transition-transform group-hover:-rotate-6" />
            {label}
          </>
        )}
      </span>
    </Button>
  );
}
