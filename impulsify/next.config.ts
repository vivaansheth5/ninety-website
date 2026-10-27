import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  outputFileTracingRoot: import.meta.dirname,
  poweredByHeader: false,
  images: {
    // Real photography (AVIF/WebP masters) is served through the Next image optimizer.
    formats: ["image/avif", "image/webp"],
    deviceSizes: [360, 480, 640, 828, 1080, 1200],
    imageSizes: [96, 160, 256, 384],
    remotePatterns: [{ protocol: "https", hostname: "cdn.shopify.com" }],
  },
  experimental: { optimizePackageImports: ["lucide-react", "motion"] },
  async headers() {
    return [
      {
        source: "/images/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=604800, stale-while-revalidate=86400" }],
      },
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },
};

export default nextConfig;
