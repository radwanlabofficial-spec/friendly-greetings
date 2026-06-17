import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { ShopifyProduct } from "@/lib/shopify";

export interface CartItem {
  lineId: string | null;
  product: ShopifyProduct;
  variantId: string;
  variantTitle: string;
  price: { amount: string; currencyCode: string };
  quantity: number;
  selectedOptions: Array<{ name: string; value: string }>;
}

interface CartStore {
  items: CartItem[];
  cartId: string | null;
  checkoutUrl: string | null;
  isLoading: boolean;
  isSyncing: boolean;
  addItem: (item: Omit<CartItem, "lineId">) => Promise<void>;
  updateQuantity: (variantId: string, quantity: number) => Promise<void>;
  removeItem: (variantId: string) => Promise<void>;
  clearCart: () => void;
  syncCart: () => Promise<void>;
  getCheckoutUrl: () => string | null;
}

// Local cart. Shopify is disconnected; checkout happens on the /checkout route.
export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      cartId: "local-cart",
      checkoutUrl: "/checkout",
      isLoading: false,
      isSyncing: false,

      addItem: async (item) => {
        set({ isLoading: true });
        // Small artificial delay so the success animation reads.
        await new Promise((r) => setTimeout(r, 250));
        const items = get().items;
        const existing = items.find((i) => i.variantId === item.variantId);
        if (existing) {
          set({
            items: items.map((i) =>
              i.variantId === item.variantId
                ? { ...i, quantity: i.quantity + item.quantity }
                : i,
            ),
            isLoading: false,
          });
        } else {
          set({
            items: [...items, { ...item, lineId: item.variantId }],
            isLoading: false,
          });
        }
      },

      updateQuantity: async (variantId, quantity) => {
        if (quantity <= 0) return get().removeItem(variantId);
        set({
          items: get().items.map((i) =>
            i.variantId === variantId ? { ...i, quantity } : i,
          ),
        });
      },

      removeItem: async (variantId) => {
        set({ items: get().items.filter((i) => i.variantId !== variantId) });
      },

      clearCart: () => set({ items: [] }),
      getCheckoutUrl: () => "/checkout",
      syncCart: async () => {},
    }),
    {
      name: "mango-cart",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ items: state.items }),
    },
  ),
);
