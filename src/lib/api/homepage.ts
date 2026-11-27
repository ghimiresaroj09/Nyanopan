import { backendApiUrl, fetchNoStore } from "./backend";

const BACKEND_API_URL = backendApiUrl("homepage/");

export interface HomepageSection1 {
  tag: string;
  image: string;
  title: string;
  description: string;
  quote: string;
}

export interface HomepageFeature {
  title: string;
  intro: string;
}

export interface HomepageSection2 {
  tag: string;
  title: string;
  description: string;
  image: string;
  feature: HomepageFeature[];
}

export interface HomepageSection3 {
  tag: string;
  title: string;
  image: string;
  description: string;
}

export interface HomepageData {
  section1: HomepageSection1;
  section2: HomepageSection2;
  section3: HomepageSection3;
}

export interface HomepageResponse {
  success: boolean;
  message: string;
  data: HomepageData;
}

export async function getHomepage(): Promise<HomepageData | null> {
  try {
    const response = await fetchNoStore(BACKEND_API_URL);

    if (!response.ok) {
      console.error("Failed to fetch homepage data");
      return null;
    }

    const data: HomepageResponse = await response.json();
    return data.data;
  } catch (error) {
    console.error("Error fetching homepage:", error);
    return null;
  }
}
