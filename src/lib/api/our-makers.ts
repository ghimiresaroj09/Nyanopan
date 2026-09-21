const BACKEND_API_URL = "https://nyanopan.onrender.com/api/v1/our-makers/";

export interface TeamMember {
  name: string;
  image: string;
  role: string;
  intro: string;
}

export interface OurMakersData {
  title: string;
  description: string;
  team_members: TeamMember[];
}

export interface OurMakersResponse {
  success: boolean;
  message: string;
  data: OurMakersData;
}

export async function getOurMakers(): Promise<OurMakersData | null> {
  try {
    const response = await fetch(BACKEND_API_URL, {
      next: { revalidate: 3600 }, // Cache for 1 hour
    });

    if (!response.ok) {
      console.error("Failed to fetch our makers data");
      return null;
    }

    const data: OurMakersResponse = await response.json();
    return data.data;
  } catch (error) {
    console.error("Error fetching our makers:", error);
    return null;
  }
}
