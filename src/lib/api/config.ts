const BACKEND_API_URL = "https://nyanopan.onrender.com/api/v1/configuration/";

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
    const response = await fetch(BACKEND_API_URL, {
      next: { revalidate: 3600 }, // Cache for 1 hour
    });

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

// Fallback configuration if API fails
export const fallbackConfig: SiteConfiguration = {
  company_intro: "Hand-felted slippers shaped from 100% natural mountain wool. Created by fair trade artisans in our Kathmandu workshop, finished with natural calfskin or recycled crepe soles.",
  email: "hello@nyanopan.com",
  phone: "+977 9841234567",
  whatsapp: "9841234567",
  address: "Boudha, Kathmandu, Nepal",
  map_url: "https://maps.app.goo.gl/8UW7RE6zn7euYJ1T6",
  social: {
    facebook: "https://facebook.com",
    instagram: "https://instagram.com",
    tiktok: "https://tiktok.com",
    pinterest: "https://pinterest.com",
  },
};
