// Local mock data layer. Shopify has been disconnected — this file keeps the
// same shape (ShopifyProduct + storefrontApiRequest) so the rest of the app
// doesn't have to change. All cart/checkout is now handled locally.

import alphonsoImg from "@/assets/mango-alphonso.jpg";
import himsagarImg from "@/assets/mango-himsagar.jpg";
import kesarImg from "@/assets/mango-kesar.jpg";
import langraImg from "@/assets/mango-langra.jpg";
import heroImg from "@/assets/mango-hero.jpg";

export const SHOPIFY_API_VERSION = "mock";
export const SHOPIFY_STORE_PERMANENT_DOMAIN = "mock.local";

export interface ShopifyProduct {
  node: {
    id: string;
    title: string;
    description: string;
    handle: string;
    priceRange: {
      minVariantPrice: { amount: string; currencyCode: string };
    };
    images: {
      edges: Array<{ node: { url: string; altText: string | null } }>;
    };
    variants: {
      edges: Array<{
        node: {
          id: string;
          title: string;
          price: { amount: string; currencyCode: string };
          availableForSale: boolean;
          selectedOptions: Array<{ name: string; value: string }>;
        };
      }>;
    };
    options: Array<{ name: string; values: string[] }>;
  };
}

const CURRENCY = "BDT";

function makeProduct(opts: {
  handle: string;
  title: string;
  description: string;
  price: number;
  images: { url: string; alt: string }[];
}): ShopifyProduct {
  const variantId = `local:${opts.handle}:1kg`;
  return {
    node: {
      id: `local:${opts.handle}`,
      title: opts.title,
      description: opts.description,
      handle: opts.handle,
      priceRange: {
        minVariantPrice: { amount: opts.price.toFixed(2), currencyCode: CURRENCY },
      },
      images: {
        edges: opts.images.map((img) => ({
          node: { url: img.url, altText: img.alt },
        })),
      },
      variants: {
        edges: [
          {
            node: {
              id: variantId,
              title: "1 kg box",
              price: { amount: opts.price.toFixed(2), currencyCode: CURRENCY },
              availableForSale: true,
              selectedOptions: [{ name: "Size", value: "1 kg" }],
            },
          },
        ],
      },
      options: [{ name: "Size", values: ["1 kg"] }],
    },
  };
}

export const MOCK_PRODUCTS: ShopifyProduct[] = [
  makeProduct({
    handle: "alphonso-mangoes-premium-crate",
    title: "Alphonso — Premium Crate",
    description:
      "The king of mangoes from Ratnagiri. Tree-ripened, fiberless, intensely floral.",
    price: 1450,
    images: [
      { url: alphonsoImg, alt: "Alphonso mangoes" },
      { url: heroImg, alt: "Pile of mangoes" },
    ],
  }),
  makeProduct({
    handle: "himsagar-mangoes-bengals-finest",
    title: "Himsagar — Bengal's Finest",
    description:
      "Custard-soft Bengal mango. Honey-sweet with notes of pineapple and citrus zest.",
    price: 980,
    images: [
      { url: himsagarImg, alt: "Himsagar mangoes" },
      { url: heroImg, alt: "Pile of mangoes" },
    ],
  }),
  makeProduct({
    handle: "langra-mangoes-heritage-harvest",
    title: "Langra — Heritage Harvest",
    description:
      "Green-skinned even when ripe. Tart-sweet, resinous, prized by connoisseurs.",
    price: 1120,
    images: [
      { url: langraImg, alt: "Langra mangoes" },
      { url: heroImg, alt: "Pile of mangoes" },
    ],
  }),
  makeProduct({
    handle: "kesar-mangoes-saffron-of-fruits",
    title: "Kesar — Saffron of Fruits",
    description:
      "Amber pulp from Junagadh. Perfumed with saffron, peach and brown sugar.",
    price: 1280,
    images: [
      { url: kesarImg, alt: "Kesar mangoes" },
      { url: heroImg, alt: "Pile of mangoes" },
    ],
  }),
];

// Minimal API surface so callers don't have to change.
// Returns shapes that mimic the Shopify Storefront GraphQL responses.
export async function storefrontApiRequest(
  query: string,
  variables: Record<string, unknown> = {},
) {
  await new Promise((r) => setTimeout(r, 80)); // tiny latency for skeletons

  if (query.includes("GetProductByHandle") || query.includes("product(handle")) {
    const handle = variables.handle as string;
    const found = MOCK_PRODUCTS.find((p) => p.node.handle === handle);
    return { data: { product: found ? found.node : null } };
  }

  // products list
  return {
    data: {
      products: { edges: MOCK_PRODUCTS },
    },
  };
}

export const STOREFRONT_PRODUCTS_QUERY = `query GetProducts { products }`;
export const STOREFRONT_PRODUCT_BY_HANDLE_QUERY = `query GetProductByHandle { product(handle) }`;

export function formatPrice(amount: string | number, currencyCode: string) {
  const value = typeof amount === "string" ? parseFloat(amount) : amount;
  try {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency: currencyCode,
      maximumFractionDigits: 0,
    }).format(value);
  } catch {
    return `${currencyCode} ${value.toFixed(2)}`;
  }
}
