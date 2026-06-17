import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import {
  storefrontApiRequest,
  STOREFRONT_PRODUCT_BY_HANDLE_QUERY,
  formatPrice,
  type ShopifyProduct,
} from "@/lib/shopify";
import { useCartStore } from "@/stores/cartStore";
import { toast } from "sonner";
import { ArrowLeft, Loader2 } from "lucide-react";

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
  const image = product?.node.images.edges[0]?.node;

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
          <div className="mt-10 grid lg:grid-cols-2 gap-12 items-start">
            <div className="aspect-square overflow-hidden rounded-3xl bg-gradient-pulp shadow-warm">
              {image && (
                <img
                  src={image.url}
                  alt={image.altText || product.node.title}
                  className="w-full h-full object-cover"
                />
              )}
            </div>

            <div className="lg:pt-8">
              <span className="text-xs uppercase tracking-widest text-leaf">
                In season
              </span>
              <h1 className="mt-3 font-display text-4xl sm:text-5xl leading-tight">
                {product.node.title}
              </h1>
              <p className="mt-4 font-display text-3xl text-primary">
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

              <Button
                onClick={handleAdd}
                disabled={isLoading || !variant?.availableForSale}
                size="lg"
                className="mt-8 w-full sm:w-auto rounded-full bg-foreground text-background hover:bg-foreground/90 px-8"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : variant?.availableForSale === false ? (
                  "Sold out"
                ) : (
                  "Add to basket"
                )}
              </Button>

              <div className="mt-10 grid grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-xs uppercase tracking-widest text-muted-foreground">
                    Origin
                  </p>
                  <p className="mt-1 font-display text-base">Heritage estate</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-widest text-muted-foreground">
                    Picked
                  </p>
                  <p className="mt-1 font-display text-base">Tree-ripe</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-widest text-muted-foreground">
                    Ships
                  </p>
                  <p className="mt-1 font-display text-base">Within 24h</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
