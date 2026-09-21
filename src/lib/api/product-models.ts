const BACKEND_API_URL = "https://nyanopan.onrender.com/api/v1/product-models/";

export interface ProductModel {
  id: string;
  name: string;
  slug: string;
  description: string;
}

export interface ProductModelsResponse {
  success: boolean;
  message: string;
  data: {
    count: number;
    next: string | null;
    previous: string | null;
    results: ProductModel[];
  };
}

export async function getProductModels(): Promise<ProductModel[]> {
  try {
    const response = await fetch(BACKEND_API_URL, {
      next: { revalidate: 3600 }, // Cache for 1 hour
    });

    if (!response.ok) {
      console.error("Failed to fetch product models", response.status);
      return [];
    }

    const data: ProductModelsResponse = await response.json();
    return data.data.results;
  } catch (error) {
    console.error("Error fetching product models:", error);
    return [];
  }
}
