import { backendApiUrl, fetchNoStore } from "./backend";

const BACKEND_API_URL = backendApiUrl("attributes/");

export interface AttributeValue {
  id: string;
  name: string;
}

export interface Attribute {
  id: string;
  name: string;
  requires_image: boolean;
  values: AttributeValue[];
}

export interface AttributesResponse {
  success: boolean;
  message: string;
  data: {
    count: number;
    next: string | null;
    previous: string | null;
    results: Attribute[];
  };
}

export async function getAttributes(): Promise<Attribute[]> {
  try {
    const response = await fetchNoStore(BACKEND_API_URL);

    if (!response.ok) {
      console.error("Failed to fetch attributes", response.status);
      return [];
    }

    const data: AttributesResponse = await response.json();
    return data.data.results;
  } catch (error) {
    console.error("Error fetching attributes:", error);
    return [];
  }
}
