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
    console.log("🌐 Fetching Our Makers from:", BACKEND_API_URL);
    const response = await fetch(BACKEND_API_URL, {
      next: { revalidate: 3600 }, // Cache for 1 hour
    });

    if (!response.ok) {
      console.error("❌ Failed to fetch our makers data - Status:", response.status);
      return null;
    }

    const data: OurMakersResponse = await response.json();
    console.log("✅ Our Makers data received:", {
      title: data.data?.title,
      teamMemberCount: data.data?.team_members?.length || 0
    });
    return data.data;
  } catch (error) {
    console.error("❌ Error fetching our makers:", error);
    return null;
  }
}
