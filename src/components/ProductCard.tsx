import { Link } from "@tanstack/react-router";
import { useCartStore } from "@/stores/cartStore";
import { formatPrice, type ShopifyProduct } from "@/lib/shopify";
import { toast } from "sonner";
import { AddToBasketButton } from "./AddToBasketButton";

export function ProductCard({ product }: { product: ShopifyProduct }) {
  const addItem = useCartStore((s) => s.addItem);
  const isLoading = useCartStore((s) => s.isLoading);
  const variant = product.node.variants.edges[0]?.node;
  const image = product.node.images.edges[0]?.node;
  const price = product.node.priceRange.minVariantPrice;

  const handleAdd = async () => {
    if (!variant) return;
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
    <Link
      to="/product/$handle"
      params={{ handle: product.node.handle }}
      className="group block"
    >
      <article className="relative overflow-hidden rounded-3xl bg-card border border-border/60 shadow-soft transition-all duration-500 hover:shadow-warm hover:-translate-y-1">
        <div className="relative aspect-[4/5] overflow-hidden bg-gradient-pulp">
          {image && (
            <img
              src={image.url}
              alt={image.altText || product.node.title}
              loading="lazy"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          )}
          <div className="absolute bottom-4 right-4">
            <AddToBasketButton
              variant="icon"
              onAdd={handleAdd}
              loading={isLoading}
              disabled={!variant}
              ariaLabel={`Add ${product.node.title} to basket`}
            />
          </div>
        </div>
        <div className="p-5">
          <div className="flex items-baseline justify-between gap-3">
            <h3 className="font-display text-lg leading-tight">{product.node.title}</h3>
            <span className="font-display text-lg text-primary whitespace-nowrap">
              {formatPrice(price.amount, price.currencyCode)}
            </span>
          </div>
          <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
            {product.node.description || "Hand-picked, tree-ripened, shipped within 24 hours."}
          </p>
        </div>
      </article>
    </Link>
  );
}
