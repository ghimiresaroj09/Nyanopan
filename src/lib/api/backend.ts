const configuredBackendUrl = process.env.NEXT_PUBLIC_BACKEND_URL?.trim();

if (!configuredBackendUrl) {
  throw new Error("NEXT_PUBLIC_BACKEND_URL must be set.");
}

const backendUrl = configuredBackendUrl.replace(/\/+$/, "");

export const BACKEND_ORIGIN = new URL(backendUrl).origin;
export const BACKEND_API_BASE_URL = `${backendUrl}/api/v1`;

export function backendApiUrl(path: string): string {
  return `${BACKEND_API_BASE_URL}/${path.replace(/^\/+/, "")}`;
}
