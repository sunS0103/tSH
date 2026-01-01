import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL as string;

  return {
    rules: {
      userAgent: "*",
      // Only allow indexing in production
      allow: process.env.NEXT_PUBLIC_ENV === "production" ? "/" : "",
      disallow: process.env.NEXT_PUBLIC_ENV === "production" ? "/private/" : "/",
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
