const BACKEND_API_URL = "https://nyanopan.onrender.com/api/v1/products/";

export interface ProductImage {
  url: string;
  title: string;
  caption?: string;
  alt: string;
  sortOrder?: number;
}

export interface ProductCategory {
  object: string;
  id: string;
  name: string;
  slug: string;
}

export interface ProductModel {
  object: string;
  id: string;
  name: string;
}

export interface ProductPriceRange {
  min_price: string;
  max_price: string;
}

export interface AttributeValue {
  object: string;
  id: string;
  name: string;
  featureImage?: ProductImage;
  additionalImages?: ProductImage[];
}

export interface ProductAttribute {
  attribute: {
    object: string;
    id: string;
    name: string;
    isActive?: boolean;
  };
  attributeValues: AttributeValue[];
}

export interface ProductVariant {
  id: string;
  name: string;
  sku: string;
  price: number;
  isActive: boolean;
  isSpecialEdition: boolean;
  optionIds: string[];
  attributes: ProductAttribute[];
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  gender: "MEN" | "WOMEN" | "UNISEX" | "KIDS" | "BABY";
  category: ProductCategory;
  model: ProductModel;
  is_featured: boolean;
  price_range: ProductPriceRange;
  primary_image: ProductImage;
  created_at: string;
}

export interface ProductDetail extends Omit<Product, 'primary_image' | 'price_range'> {
  description: string;
  usage_location: "INSIDE" | "OUTSIDE" | "BOTH";
  sole_type: "LEATHER" | "RUBBER";
  attributes: ProductAttribute[];
  feature_image: ProductImage;
  product_images: ProductImage[];
  materials_used: string;
  general_information: string;
  key_features: string[];
  is_active: boolean;
  rating: {
    average: number;
    total: number;
    descriptions: unknown[];
  };
  product_varient_values: ProductVariant[];
}

export interface ProductsResponse {
  success: boolean;
  message: string;
  data: {
    count: number;
    next: string | null;
    previous: string | null;
    results: Product[];
  };
}

export interface ProductDetailResponse {
  success: boolean;
  message: string;
  data: ProductDetail;
}

export type SortOption =
  | "price_asc" | "price" 
  | "price_desc" | "-price"
  | "name_asc" | "name"
  | "name_desc" | "-name"
  | "newest" | "-created_at"
  | "oldest" | "created_at";

export type UsageLocation = "INSIDE" | "OUTSIDE" | "BOTH";
export type SoleType = "LEATHER" | "RUBBER";

export interface GetProductsParams {
  // Filtering
  category?: string;
  gender?: string;
  usage_location?: UsageLocation;
  sole_type?: SoleType;
  is_featured?: boolean;
  min_price?: number;
  max_price?: number;
  model?: string;  // Filter by model slug
  
  // Search
  search?: string;
  
  // Sorting
  ordering?: SortOption;
  
  // Pagination
  limit?: number;
  offset?: number;
  
  // Dynamic attribute filters (attribute_<id>=<value_id>)
  [key: string]: string | number | boolean | undefined;
}

export async function getProducts(params?: GetProductsParams): Promise<Product[]> {
  try {
    const searchParams = new URLSearchParams();
    
    // Filtering parameters
    if (params?.category) {
      searchParams.append('category', params.category);
    }
    if (params?.gender) {
      searchParams.append('gender', params.gender);
    }
    if (params?.usage_location) {
      searchParams.append('usage_location', params.usage_location);
    }
    if (params?.sole_type) {
      searchParams.append('sole_type', params.sole_type);
    }
    if (params?.is_featured !== undefined) {
      searchParams.append('is_featured', params.is_featured.toString());
    }
    if (params?.min_price !== undefined) {
      searchParams.append('min_price', params.min_price.toString());
    }
    if (params?.max_price !== undefined) {
      searchParams.append('max_price', params.max_price.toString());
    }
    if (params?.model) {
      searchParams.append('model', params.model);
    }
    
    // Search parameter
    if (params?.search) {
      searchParams.append('search', params.search);
    }
    
    // Sorting parameter
    if (params?.ordering) {
      searchParams.append('ordering', params.ordering);
    }
    
    // Pagination parameters
    if (params?.limit) {
      searchParams.append('limit', params.limit.toString());
    }
    if (params?.offset) {
      searchParams.append('offset', params.offset.toString());
    }
    
    // Dynamic attribute filters (attribute_<id>=<value_id>)
    if (params) {
      Object.keys(params).forEach(key => {
        if (key.startsWith('attribute_') && params[key]) {
          searchParams.append(key, String(params[key]));
        }
      });
    }

    const url = searchParams.toString() 
      ? `${BACKEND_API_URL}?${searchParams.toString()}`
      : BACKEND_API_URL;

    console.log('🌐 API Call:', url);

    const response = await fetch(url, {
      cache: 'no-store', // Don't cache search results
    });

    if (!response.ok) {
      console.error("Failed to fetch products", response.status);
      return [];
    }

    const data: ProductsResponse = await response.json();
    console.log(`✅ API Response: ${data.data.results.length} products`);
    return data.data.results;
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
}

export async function getFeaturedProducts(limit: number = 4): Promise<Product[]> {
  return getProducts({ is_featured: true, limit });
}


export async function getProduct(slug: string): Promise<ProductDetail | null> {
  try {
    const url = `${BACKEND_API_URL}${slug}/`;

    console.log('🌐 API Call (Product Detail):', url);

    const response = await fetch(url, {
      cache: 'no-store',
    });

    if (!response.ok) {
      console.error(`Failed to fetch product ${slug}`, response.status);
      return null;
    }

    const data: ProductDetailResponse = await response.json();
    console.log(`✅ API Response: Product "${data.data.name}" fetched`);
    return data.data;
  } catch (error) {
    console.error(`Error fetching product ${slug}:`, error);
    return null;
  }
}
