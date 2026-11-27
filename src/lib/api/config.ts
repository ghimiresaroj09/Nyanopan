import { backendApiUrl, fetchNoStore } from "./backend";

const BACKEND_API_URL = backendApiUrl("configuration/");

export interface SiteConfiguration {
  company_intro: string;
  email: string;
  phone: string;
  whatsapp: string;
  address: string;
  map_url: string;
  social: {
    facebook: string;
    instagram: string;
    tiktok: string;
    pinterest: string;
  };
}

export async function getSiteConfiguration(): Promise<SiteConfiguration | null> {
  try {
    const response = await fetchNoStore(BACKEND_API_URL);

    if (!response.ok) {
      console.error("Failed to fetch configuration");
      return null;
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error("Error fetching configuration:", error);
    return null;
  }
}
