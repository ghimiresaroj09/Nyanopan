const BACKEND_API_URL = "https://nyanopan.onrender.com/api/v1/policies/";

export type PolicyType = "SHIPPING" | "EXCHANGES_RETURNS" | "PRIVACY_POLICY" | "TERMS_CONDITIONS";

export interface Policy {
  id: string;
  type: PolicyType;
  type_display: string;
  title: string;
  content: string;
}

export interface PoliciesResponse {
  success: boolean;
  message: string;
  data: {
    count: number;
    next: string | null;
    previous: string | null;
    results: Policy[];
  };
}

export async function getPolicies(): Promise<Policy[]> {
  try {
    const response = await fetch(BACKEND_API_URL, {
      next: { revalidate: 3600 }, // Cache for 1 hour
    });

    if (!response.ok) {
      console.error("Failed to fetch policies");
      return [];
    }

    const data: PoliciesResponse = await response.json();
    return data.data.results;
  } catch (error) {
    console.error("Error fetching policies:", error);
    return [];
  }
}

export async function getPolicyByType(type: PolicyType): Promise<Policy | null> {
  const policies = await getPolicies();
  return policies.find((policy) => policy.type === type) || null;
}
