const BACKEND_API_URL = "https://nyanopan.onrender.com/api/v1/our-sustainability/";

export interface SustainabilitySection {
  title: string;
  description: string;
  image: string;
}

export interface SustainabilityData {
  title: string;
  description: string;
  sections: SustainabilitySection[];
}

export interface SustainabilityResponse {
  success: boolean;
  message: string;
  data: SustainabilityData;
}

export async function getSustainability(): Promise<SustainabilityData | null> {
  try {
    const response = await fetch(BACKEND_API_URL, {
      next: { revalidate: 3600 }, // Cache for 1 hour
    });

    if (!response.ok) {
      console.error("Failed to fetch sustainability data");
      return null;
    }

    const data: SustainabilityResponse = await response.json();
    return data.data;
  } catch (error) {
    console.error("Error fetching sustainability:", error);
    return null;
  }
}
