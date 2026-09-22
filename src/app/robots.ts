import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "Mediapartners-Google",
        allow: "/",
      },
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/w/", "/donate/"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
