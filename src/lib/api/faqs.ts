const API_BASE_URL = "https://nyanopan.onrender.com/api/v1";

export interface FAQ {
  id: string;
  question: string;
  answer: string;
}

export interface FAQCategory {
  id: string;
  name: string;
  faqs: FAQ[];
}

interface PaginatedResponse<T> {
  success: boolean;
  data: { results: T[] };
}

interface StandaloneFAQ extends FAQ {
  category: string;
}

async function fetchJson<T>(path: string): Promise<T | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/${path}/`, {
      next: { revalidate: 3600 },
    });
    if (!response.ok) return null;
    return await response.json() as T;
  } catch (error) {
    console.error(`Error fetching ${path}:`, error);
    return null;
  }
}

export async function getFAQCategories(): Promise<FAQCategory[]> {
  const categoriesResponse = await fetchJson<PaginatedResponse<FAQCategory>>("faq-categories");
  const categories = categoriesResponse?.data?.results;
  if (categories?.length) {
    return categories.map((category) => ({
      ...category,
      faqs: Array.isArray(category.faqs) ? category.faqs : [],
    }));
  }

  const faqResponse = await fetchJson<PaginatedResponse<StandaloneFAQ>>("faqs");
  const grouped = new Map<string, FAQCategory>();
  for (const faq of faqResponse?.data?.results ?? []) {
    const categoryId = faq.category || "general";
    const category = grouped.get(categoryId) ?? {
      id: categoryId,
      name: "Frequently Asked Questions",
      faqs: [],
    };
    category.faqs.push({ id: faq.id, question: faq.question, answer: faq.answer });
    grouped.set(categoryId, category);
  }
  return [...grouped.values()];
}
