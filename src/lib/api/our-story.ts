const BACKEND_API_URL = "https://nyanopan.onrender.com/api/v1/our-story/";

export interface OurStorySection {
  title: string;
  description: string;
  image: string;
}

export interface OurStorySubsection {
  title: string;
  image: string;
  description: string;
}

export interface OurStorySection3 {
  title: string;
  subsections: OurStorySubsection[];
}

export interface OurStoryData {
  title: string;
  description: string;
  section1: OurStorySection;
  section2: OurStorySection;
  section3: OurStorySection3;
}

export interface OurStoryResponse {
  success: boolean;
  message: string;
  data: OurStoryData;
}

export async function getOurStory(): Promise<OurStoryData | null> {
  try {
    const response = await fetch(BACKEND_API_URL, {
      next: { revalidate: 3600 }, // Cache for 1 hour
    });

    if (!response.ok) {
      console.error("Failed to fetch our story data");
      return null;
    }

    const data: OurStoryResponse = await response.json();
    return data.data;
  } catch (error) {
    console.error("Error fetching our story:", error);
    return null;
  }
}
