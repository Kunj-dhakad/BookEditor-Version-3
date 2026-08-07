import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    rules: {
      "*.svg": {
        loaders: ["@svgr/webpack"],
        as: "*.js",
      },
    },
  },
  webpack(config) {
    const svgRule = config.module.rules.find((rule: { test?: RegExp }) =>
      rule.test?.test?.(".svg"),
    );

    if (svgRule) {
      svgRule.exclude = /\.svg$/i;
    }

    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: [
        {
          loader: "@svgr/webpack",
          options: {
            icon: true,
            svgo: true,
            svgoConfig: {
              plugins: [{ name: "removeViewBox", active: false }],
            },
          },
        },
      ],
    });

    return config;
  },
  images: {
    domains: ["images.pexels.com",
      "cdn.prezentaai.com",
      "images.unsplash.com",
      "cdn.kidsemapireai.com",
      "cdn.prezentiq.com",
      "cdn.demostackai.com",
      "cdn.clawbooksai.com",
    "cdn.publishclawai.com"
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
