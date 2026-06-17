import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/Header";
import { ProductCard } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import {
  storefrontApiRequest,
  STOREFRONT_PRODUCTS_QUERY,
  type ShopifyProduct,
} from "@/lib/shopify";
import heroImg from "@/assets/mango-hero.jpg";
import { ArrowRight, Leaf, Truck, Sun } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Aamrash — Tree-ripened mangoes, delivered" },
      {
        name: "description",
        content:
          "Hand-picked Alphonso, Himsagar, Langra and Kesar mangoes. Tree-ripened, shipped within 24 hours of harvest.",
      },
      { property: "og:title", content: "Aamrash — Tree-ripened mangoes, delivered" },
      {
        property: "og:description",
        content: "Hand-picked Alphonso, Himsagar, Langra and Kesar mangoes.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  const { data, isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const res = await storefrontApiRequest(STOREFRONT_PRODUCTS_QUERY, { first: 24, query: null });
      return (res?.data?.products?.edges || []) as ShopifyProduct[];
    },
  });

  const products = data || [];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 pt-12 pb-20 lg:pt-20 lg:pb-32 grid lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-6 relative z-10">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary text-xs uppercase tracking-widest">
              <Leaf className="w-3 h-3 text-leaf" /> Season 2026 · Live
            </span>
            <h1 className="mt-6 font-display text-5xl sm:text-6xl lg:text-7xl leading-[0.95]">
              The summer
              <br />
              <span className="italic text-primary">tastes like</span>
              <br />
              sunshine.
            </h1>
            <p className="mt-6 max-w-md text-lg text-muted-foreground">
              Tree-ripened mangoes from heritage orchards, hand-packed and
              shipped to your door within 24 hours of harvest.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button
                asChild
                size="lg"
                className="rounded-full bg-foreground text-background hover:bg-foreground/90 px-7"
              >
                <a href="#shop">
                  Shop the harvest <ArrowRight className="ml-1 h-4 w-4" />
                </a>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="rounded-full border-foreground/30 hover:bg-secondary px-7"
              >
                <a href="#story">Our story</a>
              </Button>
            </div>

            <div className="mt-12 grid grid-cols-3 gap-6 max-w-md">
              <Stat icon={<Sun className="w-4 h-4" />} label="Tree-ripened" />
              <Stat icon={<Truck className="w-4 h-4" />} label="24h shipping" />
              <Stat icon={<Leaf className="w-4 h-4" />} label="Heritage farms" />
            </div>
          </div>

          <div className="lg:col-span-6 relative">
            <div className="absolute -inset-10 bg-gradient-sunset opacity-40 blur-3xl rounded-full" />
            <div className="relative aspect-square rounded-[2rem] overflow-hidden shadow-warm">
              <img
                src={heroImg}
                alt="Pile of ripe golden Alphonso mangoes"
                width={1600}
                height={1200}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -left-6 bg-card rounded-2xl px-5 py-4 shadow-warm border border-border/60 hidden sm:block">
              <p className="font-display text-2xl text-primary">৳420+</p>
              <p className="text-xs uppercase tracking-widest text-muted-foreground">
                from per kilogram
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SHOP */}
      <section id="shop" className="max-w-7xl mx-auto px-6 py-20">
        <div className="flex items-end justify-between mb-10 flex-wrap gap-4">
          <div>
            <span className="text-xs uppercase tracking-widest text-leaf">
              In season now
            </span>
            <h2 className="mt-2 font-display text-4xl sm:text-5xl">The harvest</h2>
          </div>
          <p className="max-w-sm text-muted-foreground">
            Four varieties, each from a single estate. Pick your favourite — or
            mix a box of all four.
          </p>
        </div>

        {isLoading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="aspect-[4/5] rounded-3xl bg-secondary/60 animate-pulse"
              />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-border p-16 text-center">
            <p className="font-display text-2xl">No mangoes in the orchard yet</p>
            <p className="mt-2 text-muted-foreground">
              Add a product by telling the chat what you want to sell.
            </p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.node.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* STORY */}
      <section id="story" className="bg-gradient-pulp border-y border-border/60">
        <div className="max-w-7xl mx-auto px-6 py-24 grid lg:grid-cols-12 gap-10">
          <div className="lg:col-span-5">
            <span className="text-xs uppercase tracking-widest text-leaf">
              Our story
            </span>
            <h2 className="mt-2 font-display text-4xl sm:text-5xl leading-tight">
              Three generations.
              <br />
              <span className="italic">One obsession.</span>
            </h2>
          </div>
          <div className="lg:col-span-7 lg:pt-2 space-y-5 text-lg text-foreground/80">
            <p>
              Aamrash began in a small Rajshahi orchard in 1958, when our
              grandfather planted his first row of Langra trees. Today, we work
              with twelve family farms across Bengal and Maharashtra — every one
              of them chosen for the soil, the shade, and the patience it takes
              to let a mango ripen on the tree.
            </p>
            <p>
              No cold storage. No carbide. No middlemen. Just fruit picked when
              it's perfect, packed in straw, and sent your way.
            </p>
          </div>
        </div>
      </section>

      {/* SEASON */}
      <section id="season" className="max-w-7xl mx-auto px-6 py-24">
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { m: "May", v: "Himsagar", note: "Honey-sweet, fiberless" },
            { m: "June", v: "Alphonso & Kesar", note: "The peak of the season" },
            { m: "July", v: "Langra", note: "Tangy, aromatic, late-season" },
          ].map((s) => (
            <div
              key={s.m}
              className="rounded-3xl border border-border/60 p-8 bg-card hover:shadow-soft transition-shadow"
            >
              <p className="text-xs uppercase tracking-widest text-leaf">{s.m}</p>
              <p className="mt-3 font-display text-2xl">{s.v}</p>
              <p className="mt-2 text-sm text-muted-foreground">{s.note}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t border-border/60">
        <div className="max-w-7xl mx-auto px-6 py-10 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <p className="flex items-center gap-2">
            <span className="text-base">🥭</span> Aamrash · Tree-ripened since 1958
          </p>
          <p>© {new Date().getFullYear()} Aamrash. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

function Stat({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex flex-col items-start gap-1">
      <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-secondary text-leaf">
        {icon}
      </span>
      <span className="text-xs text-muted-foreground">{label}</span>
    </div>
  );
}
