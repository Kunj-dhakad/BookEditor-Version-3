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

 env: {
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    KD_AWS_REGION: process.env.KD_AWS_REGION,
    KD_AWS_S3_BUCKET_NAME: process.env.KD_AWS_S3_BUCKET_NAME,
    KD_AWS_ACCESS_KEY_ID: process.env.KD_AWS_ACCESS_KEY_ID,
    KD_AWS_SECRET_ACCESS_KEY: process.env.KD_AWS_SECRET_ACCESS_KEY,
    MYSQL_HOST: process.env.MYSQL_HOST,
    MYSQL_USER: process.env.MYSQL_USER,
    MYSQL_PASSWORD: process.env.MYSQL_PASSWORD,
    MYSQL_DATABASE: process.env.MYSQL_DATABASE,
    MODELSLAB_API_KEY: process.env.MODELSLAB_API_KEY,

  },

};

export default nextConfig;
