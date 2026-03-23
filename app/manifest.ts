import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "eFTI Portal – Behörig myndighet",
    short_name: "eFTI Portal",
    description: "Elektronisk fraktinformation – sökportal för behöriga myndigheter",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#006ba6",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  };
}
