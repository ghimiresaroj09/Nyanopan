const BACKEND_API_URL = "https://nyanopan.onrender.com/api/v1/categories/";

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
    const response = await fetch(BACKEND_API_URL, {
      next: { revalidate: 3600 }, // Cache for 1 hour
    });

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
