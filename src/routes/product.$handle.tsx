import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import {
  storefrontApiRequest,
  STOREFRONT_PRODUCT_BY_HANDLE_QUERY,
  formatPrice,
  type ShopifyProduct,
} from "@/lib/shopify";
import { VARIETY_DETAILS, DEFAULT_VARIETY } from "@/lib/variety-details";
import { useCartStore } from "@/stores/cartStore";
import { toast } from "sonner";
import {
  ArrowLeft,
  Loader2,
  Leaf,
  Calendar,
  MapPin,
  Truck,
  Sparkles,
} from "lucide-react";

export const Route = createFileRoute("/product/$handle")({
  head: ({ params }) => ({
    meta: [
      { title: `${params.handle} — Aamrash` },
      { name: "description", content: "Tree-ripened mangoes from Aamrash." },
    ],
  }),
  errorComponent: ErrorComp,
  notFoundComponent: NotFoundComp,
  component: ProductPage,
});

function ErrorComp({ reset }: { error: Error; reset: () => void }) {
  const router = useRouter();
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <p className="font-display text-2xl">Couldn't load this mango</p>
        <Button
          className="mt-4 rounded-full"
          onClick={() => {
            router.invalidate();
            reset();
          }}
        >
          Try again
        </Button>
      </div>
    </div>
  );
}

function NotFoundComp() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <p className="font-display text-2xl">Product not found</p>
        <Button asChild className="mt-4 rounded-full">
          <Link to="/">Back to shop</Link>
        </Button>
      </div>
    </div>
  );
}

function ProductPage() {
  const { handle } = Route.useParams();
  const addItem = useCartStore((s) => s.addItem);
  const isLoading = useCartStore((s) => s.isLoading);
  const [activeImage, setActiveImage] = useState(0);

  const { data, isLoading: loading } = useQuery({
    queryKey: ["product", handle],
    queryFn: async () => {
      const res = await storefrontApiRequest(STOREFRONT_PRODUCT_BY_HANDLE_QUERY, { handle });
      const p = res?.data?.product;
      return p ? ({ node: p } as ShopifyProduct) : null;
    },
  });

  const product = data;
  const variant = product?.node.variants.edges[0]?.node;
  const images = product?.node.images.edges.map((e) => e.node) || [];
  const details = VARIETY_DETAILS[handle] || DEFAULT_VARIETY;

  const handleAdd = async () => {
    if (!product || !variant) return;
    await addItem({
      product,
      variantId: variant.id,
      variantTitle: variant.title,
      price: variant.price,
      quantity: 1,
      selectedOptions: variant.selectedOptions || [],
    });
    toast.success(`${product.node.title} added to your basket`, {
      position: "top-center",
    });
  };

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

        {loading ? (
          <div className="mt-10 grid lg:grid-cols-2 gap-12">
            <div className="aspect-square rounded-3xl bg-secondary/60 animate-pulse" />
            <div className="space-y-4">
              <div className="h-10 w-3/4 rounded bg-secondary/60 animate-pulse" />
              <div className="h-6 w-1/3 rounded bg-secondary/60 animate-pulse" />
            </div>
          </div>
        ) : !product ? (
          <div className="mt-20 text-center">
            <p className="font-display text-2xl">Product not found</p>
          </div>
        ) : (
          <>
            {/* TOP: Gallery + buy box */}
            <div className="mt-10 grid lg:grid-cols-2 gap-12 items-start">
              {/* GALLERY */}
              <div className="flex flex-col-reverse sm:flex-row gap-4">
                <div className="flex sm:flex-col gap-3 overflow-x-auto sm:overflow-visible">
                  {images.map((img, i) => (
                    <button
                      key={img.url + i}
                      onClick={() => setActiveImage(i)}
                      className={`flex-shrink-0 h-20 w-20 rounded-2xl overflow-hidden border-2 transition-all ${
                        activeImage === i
                          ? "border-primary shadow-soft"
                          : "border-transparent opacity-70 hover:opacity-100"
                      }`}
                      aria-label={`View image ${i + 1}`}
                    >
                      <img
                        src={img.url}
                        alt={img.altText || ""}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                  {/* Accent tile completing the gallery row */}
                  <div
                    className={`flex-shrink-0 h-20 w-20 rounded-2xl bg-gradient-to-br ${details.accent} flex items-center justify-center`}
                    aria-hidden
                  >
                    <Leaf className="h-6 w-6 text-leaf" />
                  </div>
                </div>

                <div
                  className={`relative flex-1 aspect-square overflow-hidden rounded-3xl shadow-warm bg-gradient-to-br ${details.accent}`}
                >
                  {images[activeImage] && (
                    <img
                      key={images[activeImage].url}
                      src={images[activeImage].url}
                      alt={images[activeImage].altText || product.node.title}
                      className="w-full h-full object-cover animate-in fade-in duration-500"
                    />
                  )}
                  <div className="absolute top-4 left-4 inline-flex items-center gap-1.5 rounded-full bg-background/85 backdrop-blur px-3 py-1.5 text-xs">
                    <Sparkles className="w-3 h-3 text-primary" />
                    <span className="font-medium">In season now</span>
                  </div>
                </div>
              </div>

              {/* BUY BOX */}
              <div className="lg:pt-2">
                <span className="text-xs uppercase tracking-widest text-leaf">
                  {details.season}
                </span>
                <h1 className="mt-3 font-display text-4xl sm:text-5xl leading-tight">
                  {product.node.title}
                </h1>
                <p className="mt-3 inline-flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="w-4 h-4" /> {details.origin}
                </p>

                <p className="mt-6 font-display text-4xl text-primary">
                  {variant
                    ? formatPrice(variant.price.amount, variant.price.currencyCode)
                    : ""}
                  <span className="text-sm text-muted-foreground font-sans ml-1">
                    / kg
                  </span>
                </p>

                <p className="mt-6 text-lg leading-relaxed text-foreground/80">
                  {product.node.description}
                </p>

                {/* Tasting notes chips */}
                <div className="mt-7">
                  <p className="text-xs uppercase tracking-widest text-muted-foreground mb-3">
                    Tasting notes
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {details.notes.map((n) => (
                      <span
                        key={n}
                        className="inline-flex items-center rounded-full bg-secondary px-3 py-1.5 text-sm"
                      >
                        {n}
                      </span>
                    ))}
                  </div>
                </div>

                <Button
                  onClick={handleAdd}
                  disabled={isLoading || !variant?.availableForSale}
                  size="lg"
                  className="mt-8 w-full sm:w-auto rounded-full bg-foreground text-background hover:bg-foreground/90 px-10"
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : variant?.availableForSale === false ? (
                    "Sold out"
                  ) : (
                    "Add to basket"
                  )}
                </Button>

                <div className="mt-10 pt-6 border-t border-border/60 grid grid-cols-3 gap-4 text-sm">
                  <SpecMini
                    icon={<Leaf className="w-4 h-4" />}
                    label="Ripening"
                    value="Tree-ripe"
                  />
                  <SpecMini
                    icon={<Calendar className="w-4 h-4" />}
                    label="Picked"
                    value="Today"
                  />
                  <SpecMini
                    icon={<Truck className="w-4 h-4" />}
                    label="Ships"
                    value="Within 24h"
                  />
                </div>
              </div>
            </div>

            {/* STORY + TASTING + PAIRINGS */}
            <section className="mt-24 grid lg:grid-cols-3 gap-10">
              <div className="lg:col-span-2">
                <span className="text-xs uppercase tracking-widest text-leaf">
                  The variety
                </span>
                <h2 className="mt-2 font-display text-3xl sm:text-4xl leading-tight">
                  About the {product.node.title.split("—")[0].trim()}
                </h2>
                <p className="mt-6 text-lg leading-relaxed text-foreground/80">
                  {details.story}
                </p>
              </div>

              <div className="rounded-3xl border border-border/60 bg-card p-7 shadow-soft">
                <p className="text-xs uppercase tracking-widest text-leaf">
                  Pair it with
                </p>
                <ul className="mt-4 space-y-3">
                  {details.pairings.map((p) => (
                    <li
                      key={p}
                      className="flex items-start gap-3 font-display text-lg leading-snug"
                    >
                      <span className="mt-2 h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            {/* NUTRITION + SPECS */}
            <section className="mt-20 grid md:grid-cols-2 gap-6">
              <div className="rounded-3xl bg-gradient-pulp p-8 border border-border/60">
                <div className="flex items-baseline justify-between">
                  <h3 className="font-display text-2xl">Nutrition</h3>
                  <span className="text-xs uppercase tracking-widest text-muted-foreground">
                    per 100 g
                  </span>
                </div>
                <dl className="mt-6 divide-y divide-border/60">
                  {details.nutrition.map((row) => (
                    <div
                      key={row.label}
                      className="flex items-center justify-between py-3"
                    >
                      <dt className="text-sm text-foreground/70">{row.label}</dt>
                      <dd className="font-display text-base">{row.value}</dd>
                    </div>
                  ))}
                </dl>
                <p className="mt-4 text-xs text-muted-foreground">
                  Typical values for raw mango. Actual content varies by variety
                  and ripeness.
                </p>
              </div>

              <div className="rounded-3xl bg-foreground text-background p-8">
                <h3 className="font-display text-2xl">Variety details</h3>
                <dl className="mt-6 divide-y divide-background/15">
                  {details.specs.map((row) => (
                    <div
                      key={row.label}
                      className="flex items-center justify-between py-3"
                    >
                      <dt className="text-sm text-background/70">{row.label}</dt>
                      <dd className="font-display text-base">{row.value}</dd>
                    </div>
                  ))}
                  <div className="flex items-center justify-between py-3">
                    <dt className="text-sm text-background/70">Origin</dt>
                    <dd className="font-display text-base text-right">
                      {details.origin}
                    </dd>
                  </div>
                  <div className="flex items-center justify-between py-3">
                    <dt className="text-sm text-background/70">Season</dt>
                    <dd className="font-display text-base">{details.season}</dd>
                  </div>
                </dl>
              </div>
            </section>
          </>
        )}
      </div>
    </div>
  );
}

function SpecMini({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div>
      <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-secondary text-leaf">
        {icon}
      </span>
      <p className="mt-2 text-xs uppercase tracking-widest text-muted-foreground">
        {label}
      </p>
      <p className="font-display text-base">{value}</p>
    </div>
  );
}
