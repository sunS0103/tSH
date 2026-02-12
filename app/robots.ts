import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://example.com";

  return {
    rules: {
      userAgent: "*",
      // Only allow indexing in production
      allow: process.env.NEXT_PUBLIC_ENV === "production" ? "/" : "",
      disallow: "/api/",
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
