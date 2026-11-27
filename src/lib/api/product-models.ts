import { backendApiUrl, fetchNoStore } from "./backend";

const BACKEND_API_URL = backendApiUrl("product-models/");

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
    const response = await fetchNoStore(BACKEND_API_URL);

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
