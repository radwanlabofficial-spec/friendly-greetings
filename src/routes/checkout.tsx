import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCartStore } from "@/stores/cartStore";
import { formatPrice } from "@/lib/shopify";
import {
  ArrowLeft,
  Check,
  Leaf,
  Lock,
  Minus,
  Plus,
  ShoppingBasket,
  Trash2,
  Truck,
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "Checkout — Aamrash" },
      { name: "description", content: "Complete your order of tree-ripened mangoes." },
    ],
  }),
  component: CheckoutPage,
});

const SHIPPING_FLAT = 120;

function CheckoutPage() {
  const navigate = useNavigate();
  const { items, updateQuantity, removeItem, clearCart } = useCartStore();
  const [placing, setPlacing] = useState(false);
  const [placed, setPlaced] = useState<string | null>(null);

  const subtotal = items.reduce(
    (s, i) => s + parseFloat(i.price.amount) * i.quantity,
    0,
  );
  const currency = items[0]?.price.currencyCode || "BDT";
  const shipping = items.length === 0 ? 0 : SHIPPING_FLAT;
  const total = subtotal + shipping;

  const handlePlace = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;
    setPlacing(true);
    await new Promise((r) => setTimeout(r, 900));
    const orderId = `AAM-${Date.now().toString(36).toUpperCase().slice(-6)}`;
    setPlaced(orderId);
    clearCart();
    setPlacing(false);
    toast.success("Order placed", { position: "top-center" });
  };

  if (placed) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="max-w-2xl mx-auto px-6 py-20 text-center">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-leaf/15 text-leaf mb-6">
            <Check className="h-8 w-8" />
          </div>
          <h1 className="font-display text-4xl sm:text-5xl">Thank you</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Your harvest is on its way. We've sent a confirmation to your inbox.
          </p>
          <div className="mt-8 inline-flex items-center gap-3 rounded-full bg-secondary px-5 py-2 text-sm">
            <span className="uppercase tracking-widest text-xs text-muted-foreground">
              Order
            </span>
            <span className="font-display text-base">{placed}</span>
          </div>
          <div className="mt-10">
            <Button asChild className="rounded-full" size="lg">
              <Link to="/">Continue shopping</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="max-w-6xl mx-auto px-6 py-10">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-4 h-4" /> Back to shop
        </Link>

        <div className="mt-6 mb-10">
          <span className="text-xs uppercase tracking-widest text-leaf">
            Final step
          </span>
          <h1 className="mt-2 font-display text-4xl sm:text-5xl">Checkout</h1>
        </div>

        {items.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-border p-16 text-center">
            <ShoppingBasket className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="font-display text-2xl">Your basket is empty</p>
            <p className="mt-2 text-muted-foreground">
              Add a mango or two before checking out.
            </p>
            <Button asChild className="mt-6 rounded-full">
              <Link to="/">Browse mangoes</Link>
            </Button>
          </div>
        ) : (
          <form
            onSubmit={handlePlace}
            className="grid lg:grid-cols-5 gap-10 items-start"
          >
            {/* DELIVERY + PAYMENT */}
            <div className="lg:col-span-3 space-y-8">
              <section className="rounded-3xl border border-border/60 bg-card p-6 sm:p-8">
                <h2 className="font-display text-2xl">Delivery</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Where should we send your harvest?
                </p>
                <div className="mt-6 grid sm:grid-cols-2 gap-4">
                  <Field id="email" label="Email" type="email" required placeholder="you@example.com" wide />
                  <Field id="firstName" label="First name" required placeholder="Ariana" />
                  <Field id="lastName" label="Last name" required placeholder="Rahman" />
                  <Field id="address" label="Street address" required placeholder="12 Gulshan Ave" wide />
                  <Field id="city" label="City" required placeholder="Dhaka" />
                  <Field id="postcode" label="Postcode" required placeholder="1212" />
                  <Field id="phone" label="Phone" type="tel" required placeholder="+880" wide />
                </div>
              </section>

              <section className="rounded-3xl border border-border/60 bg-card p-6 sm:p-8">
                <div className="flex items-center justify-between">
                  <h2 className="font-display text-2xl">Payment</h2>
                  <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Lock className="h-3 w-3" /> Secured
                  </span>
                </div>
                <div className="mt-6 grid sm:grid-cols-2 gap-4">
                  <Field id="card" label="Card number" required placeholder="4242 4242 4242 4242" wide />
                  <Field id="exp" label="Expiry" required placeholder="MM / YY" />
                  <Field id="cvc" label="CVC" required placeholder="123" />
                </div>
                <p className="mt-4 text-xs text-muted-foreground">
                  Demo checkout — no real charge is made.
                </p>
              </section>
            </div>

            {/* ORDER SUMMARY */}
            <aside className="lg:col-span-2 lg:sticky lg:top-24">
              <div className="rounded-3xl bg-foreground text-background p-6 sm:p-8">
                <h2 className="font-display text-2xl">Your order</h2>
                <ul className="mt-6 space-y-4 divide-y divide-background/15">
                  {items.map((item) => (
                    <li key={item.variantId} className="pt-4 first:pt-0 flex gap-4">
                      <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-background/10 flex-shrink-0">
                        {item.product.node.images?.edges?.[0]?.node && (
                          <img
                            src={item.product.node.images.edges[0].node.url}
                            alt={item.product.node.title}
                            className="w-full h-full object-cover"
                          />
                        )}
                        <span className="absolute -top-2 -right-2 h-5 min-w-5 px-1 rounded-full bg-primary text-primary-foreground text-[11px] flex items-center justify-center">
                          {item.quantity}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-display text-base truncate">
                          {item.product.node.title}
                        </p>
                        <p className="text-xs text-background/60">
                          {item.variantTitle}
                        </p>
                        <div className="mt-2 inline-flex items-center gap-1 rounded-full bg-background/10 p-0.5">
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                            className="h-6 w-6 inline-flex items-center justify-center rounded-full hover:bg-background/15"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="w-6 text-center text-xs">{item.quantity}</span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                            className="h-6 w-6 inline-flex items-center justify-center rounded-full hover:bg-background/15"
                            aria-label="Increase quantity"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-display text-base">
                          {formatPrice(
                            parseFloat(item.price.amount) * item.quantity,
                            item.price.currencyCode,
                          )}
                        </p>
                        <button
                          type="button"
                          onClick={() => removeItem(item.variantId)}
                          className="mt-2 text-background/50 hover:text-background"
                          aria-label="Remove"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>

                <dl className="mt-6 pt-6 border-t border-background/15 space-y-2 text-sm">
                  <Row label="Subtotal" value={formatPrice(subtotal, currency)} />
                  <Row
                    label={
                      <span className="inline-flex items-center gap-1.5">
                        <Truck className="h-3.5 w-3.5" /> Shipping (24h)
                      </span>
                    }
                    value={formatPrice(shipping, currency)}
                  />
                  <div className="flex items-baseline justify-between pt-3 mt-2 border-t border-background/15">
                    <dt className="text-sm uppercase tracking-widest text-background/70">
                      Total
                    </dt>
                    <dd className="font-display text-3xl">
                      {formatPrice(total, currency)}
                    </dd>
                  </div>
                </dl>

                <Button
                  type="submit"
                  disabled={placing}
                  size="lg"
                  className="mt-6 w-full rounded-full bg-gradient-to-r from-primary via-primary to-amber-500 text-primary-foreground hover:brightness-110 h-12"
                >
                  {placing ? "Placing order…" : `Place order · ${formatPrice(total, currency)}`}
                </Button>
                <p className="mt-3 inline-flex items-center gap-1.5 text-[11px] text-background/60">
                  <Leaf className="h-3 w-3" /> Tree-ripened, hand-packed, dispatched within 24h.
                </p>
              </div>
            </aside>
          </form>
        )}
      </div>
    </div>
  );
}

function Field({
  id,
  label,
  type = "text",
  required,
  placeholder,
  wide,
}: {
  id: string;
  label: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
  wide?: boolean;
}) {
  return (
    <div className={wide ? "sm:col-span-2" : ""}>
      <Label htmlFor={id} className="text-xs uppercase tracking-widest text-muted-foreground">
        {label}
      </Label>
      <Input
        id={id}
        type={type}
        required={required}
        placeholder={placeholder}
        className="mt-1.5 rounded-xl bg-background"
      />
    </div>
  );
}

function Row({ label, value }: { label: React.ReactNode; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <dt className="text-background/70">{label}</dt>
      <dd>{value}</dd>
    </div>
  );
}
