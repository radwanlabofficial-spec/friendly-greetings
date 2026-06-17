export interface VarietyDetails {
  origin: string;
  season: string;
  notes: string[]; // tasting notes
  pairings: string[];
  story: string;
  nutrition: { label: string; value: string }[]; // per 100g typical values
  specs: { label: string; value: string }[];
  accent: string; // tailwind background hue class
}

// Editorial details per Shopify product handle.
// Nutrition figures are typical published values for raw mango per 100g (USDA/FAO ranges).
export const VARIETY_DETAILS: Record<string, VarietyDetails> = {
  "alphonso-mangoes-premium-crate": {
    origin: "Ratnagiri & Devgad, Maharashtra",
    season: "Mid-April → early June",
    notes: ["Honey", "Saffron", "Apricot", "Cream"],
    pairings: ["Vanilla ice cream", "Cardamom lassi", "Aged sheep's cheese"],
    story:
      "The Alphonso, or Hapus, is widely called the king of mangoes. Grown in the coastal Konkan belt, it ripens slowly under sea breezes that concentrate its sugars and floral aroma. Sold by the crate of 12 fruit, hand-picked at the precise blush of yellow that signals peak ripeness.",
    nutrition: [
      { label: "Calories", value: "60 kcal" },
      { label: "Carbohydrates", value: "15 g" },
      { label: "Sugars", value: "14 g" },
      { label: "Fibre", value: "1.6 g" },
      { label: "Vitamin C", value: "36 mg (40% DV)" },
      { label: "Vitamin A", value: "54 µg" },
    ],
    specs: [
      { label: "Crate size", value: "12 fruit · ~3 kg" },
      { label: "Fruit weight", value: "220–280 g" },
      { label: "Ripening", value: "Tree-ripened, no carbide" },
      { label: "Shipping", value: "Within 24h of harvest" },
    ],
    accent: "from-amber-200/60 to-orange-300/40",
  },
  "himsagar-mangoes-bengals-finest": {
    origin: "Murshidabad & Malda, West Bengal",
    season: "Mid-May → late June",
    notes: ["Honey", "Pineapple", "Custard", "Citrus zest"],
    pairings: ["Plain yoghurt", "Shortbread", "Sparkling wine"],
    story:
      "Himsagar — literally 'ocean of ice' — is Bengal's most celebrated mango. The flesh is utterly fiberless, the colour a deep saffron, and the flavour leans toward custard and pineapple. Picked at the moment the shoulder softens, packed in straw, and dispatched the same morning.",
    nutrition: [
      { label: "Calories", value: "65 kcal" },
      { label: "Carbohydrates", value: "16 g" },
      { label: "Sugars", value: "15 g" },
      { label: "Fibre", value: "1.8 g" },
      { label: "Vitamin C", value: "44 mg (49% DV)" },
      { label: "Vitamin A", value: "60 µg" },
    ],
    specs: [
      { label: "Box size", value: "1 kg · ~4 fruit" },
      { label: "Fruit weight", value: "250–300 g" },
      { label: "Ripening", value: "Tree-ripened, fiberless" },
      { label: "Shipping", value: "Within 24h of harvest" },
    ],
    accent: "from-lime-200/60 to-amber-200/50",
  },
  "langra-mangoes-heritage-harvest": {
    origin: "Varanasi & Rajshahi heritage orchards",
    season: "Mid-June → late July",
    notes: ["Turpentine resin", "Lime", "Wild honey", "Cracked pepper"],
    pairings: ["Sticky rice", "Goat cheese", "Riesling"],
    story:
      "Langra keeps its green skin even when fully ripe — which has fooled buyers for two centuries. The flesh is pale gold, the aroma piercingly fragrant, and the flavour leans tart-sweet with a resinous finish that connoisseurs prize above any other variety. From single-estate trees averaging 80 years old.",
    nutrition: [
      { label: "Calories", value: "62 kcal" },
      { label: "Carbohydrates", value: "15 g" },
      { label: "Sugars", value: "13 g" },
      { label: "Fibre", value: "2.0 g" },
      { label: "Vitamin C", value: "38 mg (42% DV)" },
      { label: "Vitamin A", value: "48 µg" },
    ],
    specs: [
      { label: "Box size", value: "1 kg · ~3 fruit" },
      { label: "Fruit weight", value: "300–350 g" },
      { label: "Ripening", value: "Stays green when ripe" },
      { label: "Shipping", value: "Within 24h of harvest" },
    ],
    accent: "from-emerald-200/60 to-lime-200/40",
  },
  "kesar-mangoes-saffron-of-fruits": {
    origin: "Junagadh & Talala, Gujarat",
    season: "Late April → mid-June",
    notes: ["Saffron", "Peach", "Brown sugar", "Marigold"],
    pairings: ["Cardamom kulfi", "Roast almonds", "Sauternes"],
    story:
      "Kesar takes its name from saffron — for both its colour and its perfume. Grown at the foothills of Mount Girnar in a unique volcanic soil, the fruit develops an unmistakable amber pulp that lifts every dessert it touches. A favourite for shakes, sorbets, and the classic aamras with hot puris.",
    nutrition: [
      { label: "Calories", value: "63 kcal" },
      { label: "Carbohydrates", value: "15 g" },
      { label: "Sugars", value: "14 g" },
      { label: "Fibre", value: "1.6 g" },
      { label: "Vitamin C", value: "36 mg (40% DV)" },
      { label: "Vitamin A", value: "72 µg" },
    ],
    specs: [
      { label: "Box size", value: "1 kg · ~4 fruit" },
      { label: "Fruit weight", value: "220–260 g" },
      { label: "Ripening", value: "Tree-ripened, deep amber pulp" },
      { label: "Shipping", value: "Within 24h of harvest" },
    ],
    accent: "from-orange-200/60 to-rose-200/40",
  },
};

export const DEFAULT_VARIETY: VarietyDetails = {
  origin: "Heritage orchard",
  season: "In season",
  notes: ["Honey", "Tropical fruit", "Citrus"],
  pairings: ["Yoghurt", "Vanilla ice cream", "Sparkling wine"],
  story:
    "Hand-picked at peak ripeness from a single estate, packed in straw, and shipped within 24 hours of harvest.",
  nutrition: [
    { label: "Calories", value: "60 kcal" },
    { label: "Carbohydrates", value: "15 g" },
    { label: "Sugars", value: "14 g" },
    { label: "Fibre", value: "1.6 g" },
    { label: "Vitamin C", value: "36 mg (40% DV)" },
    { label: "Vitamin A", value: "54 µg" },
  ],
  specs: [
    { label: "Box size", value: "1 kg" },
    { label: "Ripening", value: "Tree-ripened" },
    { label: "Shipping", value: "Within 24h of harvest" },
  ],
  accent: "from-amber-200/60 to-orange-200/40",
};
