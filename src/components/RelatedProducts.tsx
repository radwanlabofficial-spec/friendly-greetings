import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  storefrontApiRequest,
  STOREFRONT_PRODUCTS_QUERY,
  formatPrice,
  type ShopifyProduct,
} from "@/lib/shopify";
import { VARIETY_DETAILS, DEFAULT_VARIETY } from "@/lib/variety-details";
import { ArrowRight, Sparkles, Calendar } from "lucide-react";

interface Props {
  currentHandle: string;
}

interface Scored {
  product: ShopifyProduct;
  score: number;
  sharedNotes: string[];
  sharedPairings: string[];
}

const MONTH_MAP: Record<string, number> = {
  january: 0, february: 1, march: 2, april: 3, may: 4, june: 5,
  july: 6, august: 7, september: 8, october: 9, november: 10, december: 11,
};

function isInSeason(season: string): boolean {
  const months = season
    .toLowerCase()
    .match(
      /january|february|march|april|may|june|july|august|september|october|november|december/g
    );
  if (!months || months.length < 2) return true;
  const start = MONTH_MAP[months[0]];
  const end = MONTH_MAP[months[months.length - 1]];
  if (start == null || end == null) return true;
  const now = new Date().getMonth();
  if (start <= end) return now >= start && now <= end;
  return now >= start || now <= end;
}

function AvailabilityBadge({ season }: { season: string }) {
  const inSeason = isInSeason(season);
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium uppercase tracking-wide ${
        inSeason
          ? "bg-leaf/15 text-leaf"
          : "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
      }`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          inSeason ? "bg-leaf" : "bg-amber-500"
        }`}
      />
      {inSeason ? "In season now" : "Seasonal"}
    </span>
  );
}

export function RelatedProducts({ currentHandle }: Props) {
  const { data } = useQuery({
    queryKey: ["all-products-related"],
    queryFn: async () => {
      const res = await storefrontApiRequest(STOREFRONT_PRODUCTS_QUERY, {
        first: 20,
        query: null,
      });
      return (res?.data?.products?.edges as ShopifyProduct[]) || [];
    },
    staleTime: 1000 * 60 * 5,
  });

  if (!data?.length) return null;

  const current = VARIETY_DETAILS[currentHandle] || DEFAULT_VARIETY;
  const currentNotes = new Set(current.notes.map((n) => n.toLowerCase()));
  const currentPairings = new Set(current.pairings.map((p) => p.toLowerCase()));

  const scored: Scored[] = data
    .filter((p) => p.node.handle !== currentHandle)
    .map((product) => {
      const d = VARIETY_DETAILS[product.node.handle] || DEFAULT_VARIETY;
      const sharedNotes = d.notes.filter((n) =>
        currentNotes.has(n.toLowerCase())
      );
      const sharedPairings = d.pairings.filter((p) =>
        currentPairings.has(p.toLowerCase())
      );
      // Notes weigh more (variety similarity); pairings reflect customer affinity.
      const score = sharedNotes.length * 2 + sharedPairings.length * 3;
      return { product, score, sharedNotes, sharedPairings };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  if (!scored.length) return null;

  const topReason = (s: Scored): { label: string; tone: "variety" | "pairing" } => {
    if (s.sharedPairings.length && s.sharedPairings.length >= s.sharedNotes.length / 2) {
      return {
        label: `Pairs with ${s.sharedPairings[0].toLowerCase()}, like this one`,
        tone: "pairing",
      };
    }
    if (s.sharedNotes.length) {
      return {
        label: `Shares ${s.sharedNotes.slice(0, 2).join(" & ").toLowerCase()} notes`,
        tone: "variety",
      };
    }
    return { label: "Another estate favourite", tone: "variety" };
  };

  return (
    <section className="mt-24">
      <div className="flex items-end justify-between gap-6 mb-8">
        <div>
          <span className="text-xs uppercase tracking-widest text-leaf">
            You might also love
          </span>
          <h2 className="mt-2 font-display text-3xl sm:text-4xl leading-tight">
            From the same harvest
          </h2>
        </div>
        <Link
          to="/"
          className="hidden sm:inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          View all <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {scored.map((s) => {
          const p = s.product;
          const details =
            VARIETY_DETAILS[p.node.handle] || DEFAULT_VARIETY;
          const image = p.node.images.edges[0]?.node;
          const price = p.node.priceRange.minVariantPrice;
          const reason = topReason(s);

          return (
            <Link
              key={p.node.id}
              to="/product/$handle"
              params={{ handle: p.node.handle }}
              className="group block"
            >
              <article className="relative overflow-hidden rounded-3xl bg-card border border-border/60 shadow-soft transition-all duration-500 hover:shadow-warm hover:-translate-y-1 h-full flex flex-col">
                <div
                  className={`relative aspect-[5/4] overflow-hidden bg-gradient-to-br ${details.accent}`}
                >
                  {image && (
                    <img
                      src={image.url}
                      alt={image.altText || p.node.title}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  )}
                  <div className="absolute top-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-background/90 backdrop-blur px-3 py-1.5 text-xs max-w-[calc(100%-1.5rem)]">
                    <Sparkles
                      className={`w-3 h-3 flex-shrink-0 ${
                        reason.tone === "pairing"
                          ? "text-leaf"
                          : "text-primary"
                      }`}
                    />
                    <span className="truncate">{reason.label}</span>
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col">
                  <div className="flex items-baseline justify-between gap-3">
                    <h3 className="font-display text-lg leading-tight">
                      {p.node.title}
                    </h3>
                    <span className="font-display text-lg text-primary whitespace-nowrap">
                      {formatPrice(price.amount, price.currencyCode)}
                    </span>
                  </div>
                  <div className="mt-2 flex items-center justify-between gap-2">
                    <p className="text-xs text-muted-foreground">
                      {details.origin}
                    </p>
                    <AvailabilityBadge season={details.season} />
                  </div>
                  <p className="mt-2 inline-flex items-center gap-1.5 text-[11px] text-muted-foreground">
                    <Calendar className="w-3 h-3" />
                    <span>Harvest: {details.season}</span>
                  </p>

                  {(s.sharedNotes.length > 0 || s.sharedPairings.length > 0) && (
                    <div className="mt-4 pt-4 border-t border-border/60 flex flex-wrap gap-1.5">
                      {s.sharedNotes.slice(0, 2).map((n) => (
                        <span
                          key={`n-${n}`}
                          className="inline-flex items-center rounded-full bg-secondary px-2.5 py-1 text-xs"
                        >
                          {n}
                        </span>
                      ))}
                      {s.sharedPairings.slice(0, 1).map((pr) => (
                        <span
                          key={`p-${pr}`}
                          className="inline-flex items-center rounded-full border border-leaf/30 text-leaf px-2.5 py-1 text-xs"
                        >
                          + {pr}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </article>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
