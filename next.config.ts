import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // lucide-react and react-icons are already in Next's default list; these
    // are not, and they're imported across many components.
    optimizePackageImports: [
      "@fortawesome/free-solid-svg-icons",
      "@fortawesome/react-fontawesome",
      "@dnd-kit/core",
      "@dnd-kit/sortable",
      "@dnd-kit/modifiers",
    ],
  },

  images: {
    // `domains` has been deprecated since Next 13.
    remotePatterns: [
      { protocol: "https", hostname: "images.pexels.com" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "cdn.prezentaai.com" },
      { protocol: "https", hostname: "cdn.kidsemapireai.com" },
      { protocol: "https", hostname: "cdn.prezentiq.com" },
      { protocol: "https", hostname: "cdn.demostackai.com" },
      { protocol: "https", hostname: "cdn.clawbooksai.com" },
      { protocol: "https", hostname: "cdn.publishclawai.com" },
    ],
  },

  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: `
            frame-ancestors 'self'
            https://*.prezentaai.com
            http://127.0.0.1:5500
            https://*.kidsemapireai.com
            https://*.prezentiq.com
            https://*.demostackai.com
            https://*.clawbooksai.com
            https://*.publishclawai.com
          `.replace(/\s+/g, " ").trim(),
          },
        ],
      },
    ];
  },
};

export default nextConfig;
