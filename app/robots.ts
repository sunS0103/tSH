import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = "https://techsmarthire.com";

  return {
    rules: {
      userAgent: "*",
      // Only allow indexing in production
      allow: process.env.NODE_ENV === "production" ? "/" : "",
      disallow: process.env.NODE_ENV === "production" ? "/private/" : "/",
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
