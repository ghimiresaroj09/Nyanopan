import { backendApiUrl, fetchNoStore } from "./backend";

const BACKEND_API_URL = backendApiUrl("categories/");

export interface CategoryImage {
  url: string;
  title: string;
  caption: string;
  alt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: CategoryImage;
  product_count: number;
}

export interface CategoriesResponse {
  success: boolean;
  message: string;
  data: {
    count: number;
    next: string | null;
    previous: string | null;
    results: Category[];
  };
}

export async function getCategories(): Promise<Category[]> {
  try {
    const response = await fetchNoStore(BACKEND_API_URL);

    if (!response.ok) {
      console.error("Failed to fetch categories");
      return [];
    }

    const data: CategoriesResponse = await response.json();
    return data.data.results;
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}
