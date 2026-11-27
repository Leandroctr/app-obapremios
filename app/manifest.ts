import type { MetadataRoute } from "next";
import { getAppSettings } from "@/lib/app-settings.server";
import { fallbackIcons } from "@/lib/pwa-icon-assets";

export const dynamic = "force-dynamic";

function getMimeType(url: string): string {
  if (url.endsWith(".png")) return "image/png";
  if (url.endsWith(".webp")) return "image/webp";
  return "image/svg+xml";
}

export default async function manifest(): Promise<MetadataRoute.Manifest> {
  const settings = await getAppSettings();

  const icon192Src = settings.icon192Url || fallbackIcons.icon192;
  const icon512Src = settings.icon512Url || fallbackIcons.icon512;

  return {
    name: settings.appName,
    short_name: settings.appShortName,
    description: settings.appDescription,
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: settings.backgroundColor,
    theme_color: settings.themeColor,
    icons: [
      {
        src: icon192Src,
        sizes: "192x192",
        type: getMimeType(icon192Src),
        purpose: "any",
      },
      {
        src: icon512Src,
        sizes: "512x512",
        type: getMimeType(icon512Src),
        purpose: "any",
      },
    ],
  };
}
