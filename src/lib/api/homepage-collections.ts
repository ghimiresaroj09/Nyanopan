import { backendApiUrl } from "./backend";

const BACKEND_API_URL = backendApiUrl("homepage/collections/");

export interface HomepageCollection {
  image: string;
  name: string;
  intro: string;
  link: string;
}

export interface HomepageCollectionsData {
  tag: string;
  title: string;
  description: string;
  collections: HomepageCollection[];
}

export interface HomepageCollectionsResponse {
  success: boolean;
  message: string;
  data: HomepageCollectionsData;
}

export async function getHomepageCollections(): Promise<HomepageCollectionsData | null> {
  try {
    const response = await fetch(BACKEND_API_URL, {
      next: { revalidate: 3600 }, // Cache for 1 hour
    });

    if (!response.ok) {
      console.error("Failed to fetch homepage collections");
      return null;
    }

    const data: HomepageCollectionsResponse = await response.json();
    return data.data;
  } catch (error) {
    console.error("Error fetching homepage collections:", error);
    return null;
  }
}
