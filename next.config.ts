import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";

/**
 * Content Security Policy.
 * - Dev allows eval (HMR source maps) and ws/wss (hot reload socket).
 * - Production tightens both and upgrades insecure requests.
 * - Images: self plus the Unsplash CDN used by the catalogue.
 */
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: https://images.unsplash.com https://*.googleapis.com https://*.gstatic.com https://res.cloudinary.com",
  "font-src 'self'",
  `connect-src 'self' https://nyanopan.onrender.com${isDev ? " ws: wss:" : ""}`,
  "frame-src 'self' https://www.google.com https://maps.google.com",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'self'",
  ...(isDev ? [] : ["upgrade-insecure-requests"]),
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
];

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
  allowedDevOrigins: ["*.e2b.app", "*.e2b.dev"],
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
  async redirects() {
    return [
      {
        source: "/inside",
        destination: "/collections/all-slippers",
        permanent: true,
      },
      {
        source: "/outside",
        destination: "/collections/all-slippers",
        permanent: true,
      },
      {
        source: "/kids",
        destination: "/collections/all-slippers",
        permanent: true,
      },
      {
        source: "/babies",
        destination: "/collections/all-slippers",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
