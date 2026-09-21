/**
 * SEO Keywords Master List for Nyanopan
 * Based on comprehensive keyword research and brand positioning
 */

export const BRAND_KEYWORDS = [
  "Nyanopan",
  "Nyanopan Nepal",
  "Nyanopan Kathmandu",
  "Nyanopan wool",
  "Nyanopan felt",
  "Nyanopan slippers",
  "Nyanopan shoes",
  "Nyanopan bags",
];

export const CORE_POSITIONING = [
  "handmade in Nepal",
  "handmade wool products Nepal",
  "handmade felt products Nepal",
  "wool products Nepal",
  "felt products Nepal",
  "natural wool products Nepal",
  "sustainable wool products",
  "eco friendly products Nepal",
  "fair trade footwear",
  "ethical handmade products",
];

// Category-specific keyword mappings
export const CATEGORY_KEYWORDS: Record<string, string[]> = {
  // Slippers
  slippers: [
    "wool felt slippers",
    "wool slippers",
    "felt slippers",
    "handmade wool slippers",
    "wool slippers Nepal",
    "felt slippers Nepal",
    "handmade felt slippers",
    "natural wool slippers",
    "wool house slippers",
    "wool indoor slippers",
    "sustainable wool slippers",
    "buy wool slippers",
    "wool slippers online",
  ],
  
  // Shoes
  shoes: [
    "wool felt shoes",
    "wool shoes",
    "felt shoes",
    "handmade wool shoes",
    "wool shoes Nepal",
    "felt shoes Nepal",
    "wool footwear",
    "felt footwear",
    "natural wool shoes",
    "sustainable wool shoes",
    "handmade footwear Nepal",
    "buy wool shoes",
    "wool shoes online",
  ],
  
  // Bags
  bags: [
    "wool felt bags",
    "wool bags",
    "felt bags",
    "handmade wool bags",
    "wool bags Nepal",
    "felt bags Nepal",
    "wool tote bags",
    "felt tote bags",
    "wool shoulder bag",
    "felt handbag",
    "sustainable wool bags",
    "buy wool bags",
    "wool bags online",
  ],
  
  // Mattress
  mattress: [
    "wool mattress",
    "natural wool mattress",
    "wool felt mattress",
    "handmade wool mattress",
    "wool mattress Nepal",
    "wool bedding",
    "natural wool bedding",
    "wool floor mattress",
    "sustainable wool mattress",
    "buy wool mattress",
  ],
  
  // Home Décor
  "home-decor": [
    "wool home decor",
    "felt home decor",
    "wool decorations",
    "handmade wool home decor",
    "wool decor Nepal",
    "felt decor Nepal",
    "wool handicrafts",
    "felt handicrafts",
    "sustainable home decor",
    "eco friendly home decor",
  ],
  
  // Keyrings
  keyrings: [
    "wool keyring",
    "felt keyring",
    "handmade wool keyring",
    "handmade felt keyring",
    "wool keychain",
    "felt keychain",
    "wool keyrings Nepal",
    "felt keyrings Nepal",
    "handmade keyrings Nepal",
    "wool keyring gift",
  ],
  
  // Purses
  purses: [
    "wool purse",
    "felt purse",
    "handmade wool purse",
    "handmade felt purse",
    "wool purse Nepal",
    "felt purse Nepal",
    "wool coin purse",
    "felt wallet",
    "wool pouch",
    "buy wool purse",
  ],
};

// Gender-specific keywords
export const GENDER_KEYWORDS: Record<string, string[]> = {
  men: [
    "wool slippers for men",
    "men's wool slippers",
    "wool shoes for men",
    "men's wool shoes",
    "wool bags for men",
  ],
  women: [
    "wool slippers for women",
    "women's wool slippers",
    "wool shoes for women",
    "women's wool shoes",
    "wool bags for women",
  ],
  unisex: [
    "unisex wool slippers",
    "unisex felt slippers",
    "unisex wool shoes",
  ],
  kids: [
    "wool slippers for kids",
    "kids wool slippers",
    "wool shoes for kids",
  ],
};

/**
 * Generate keywords for a product based on category and attributes
 */
export function generateProductKeywords(params: {
  categorySlug: string;
  productName: string;
  modelName?: string;
  gender?: string;
  isHandmade?: boolean;
}): string[] {
  const { categorySlug, productName, modelName, gender, isHandmade = true } = params;
  
  const keywords: string[] = [];
  
  // Add brand keywords
  keywords.push(...BRAND_KEYWORDS.slice(0, 3));
  
  // Add category-specific keywords
  const categoryKey = categorySlug.toLowerCase();
  if (CATEGORY_KEYWORDS[categoryKey]) {
    keywords.push(...CATEGORY_KEYWORDS[categoryKey].slice(0, 8));
  }
  
  // Add gender-specific keywords if applicable
  if (gender && GENDER_KEYWORDS[gender.toLowerCase()]) {
    keywords.push(...GENDER_KEYWORDS[gender.toLowerCase()].slice(0, 3));
  }
  
  // Add positioning keywords
  keywords.push(...CORE_POSITIONING.slice(0, 5));
  
  // Add product-specific terms
  if (modelName) {
    keywords.push(`${modelName} Nepal`);
    keywords.push(`handmade ${modelName}`);
  }
  
  return [...new Set(keywords)]; // Remove duplicates
}

/**
 * Generate keywords for a collection page
 */
export function generateCollectionKeywords(params: {
  categoryName: string;
  categorySlug: string;
  gender?: string;
}): string[] {
  const { categoryName, categorySlug, gender } = params;
  
  const keywords: string[] = [];
  
  // Add brand keywords
  keywords.push("Nyanopan", "Nyanopan Nepal");
  
  // Add category-specific keywords
  const categoryKey = categorySlug.toLowerCase();
  if (CATEGORY_KEYWORDS[categoryKey]) {
    keywords.push(...CATEGORY_KEYWORDS[categoryKey]);
  }
  
  // Add gender-specific keywords if applicable
  if (gender && GENDER_KEYWORDS[gender.toLowerCase()]) {
    keywords.push(...GENDER_KEYWORDS[gender.toLowerCase()]);
  }
  
  // Add positioning keywords
  keywords.push(...CORE_POSITIONING);
  
  // Add category + Nepal combinations
  keywords.push(
    `${categoryName} Nepal`,
    `handmade ${categoryName} Nepal`,
    `buy ${categoryName} Nepal`,
    `${categoryName} online Nepal`
  );
  
  return [...new Set(keywords)]; // Remove duplicates
}

/**
 * Generate keywords for content pages
 */
export function generateContentKeywords(pageType: "story" | "sustainability" | "shipping" | "returns"): string[] {
  const baseKeywords = [
    "Nyanopan",
    "Nyanopan Nepal",
    "handmade in Nepal",
    "wool products Nepal",
    "felt products Nepal",
  ];
  
  const specificKeywords: Record<string, string[]> = {
    story: [
      "Nyanopan story",
      "fair trade Nepal",
      "Kathmandu workshop",
      "handmade slippers",
      "artisan crafted",
      "sustainable production",
      "wool felting",
      "ethical fashion",
    ],
    sustainability: [
      "sustainable wool products",
      "eco friendly footwear",
      "natural materials",
      "zero waste production",
      "fair trade Nepal",
      "ethical fashion",
      "sustainable wool",
      "environmentally friendly",
    ],
    shipping: [
      "shipping policy",
      "delivery times",
      "international shipping",
      "Nepal delivery",
      "shipping rates",
    ],
    returns: [
      "return policy",
      "exchange policy",
      "refund policy",
      "30 day returns",
      "product returns",
    ],
  };
  
  return [...baseKeywords, ...specificKeywords[pageType]];
}
