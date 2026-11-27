import type { Metadata } from "next";
import { PwaInstallPage } from "@/components/pwa-install-page";
import { getAppSettings } from "@/lib/app-settings.server";
import { placeholderIcons, type AppSettings } from "@/lib/app-settings";
import { getInstallUrl, type InstallBrand } from "@/lib/pwa-install";
import { fallbackIcons } from "@/lib/pwa-icon-assets";

export const dynamic = "force-dynamic";

const fallbackIconUrls = new Set([
  placeholderIcons.icon192,
  placeholderIcons.icon512,
  fallbackIcons.icon192,
  fallbackIcons.icon512,
]);

function getInstallBrand(settings: AppSettings): InstallBrand {
  return {
    name: settings.appShortName || settings.appName,
    iconUrl: [settings.icon512Url, settings.icon192Url].find(
      (url) => url && !fallbackIconUrls.has(url),
    ) ?? fallbackIcons.icon512,
    themeColor: settings.themeColor,
    backgroundColor: settings.backgroundColor,
    installUrl: getInstallUrl(settings.publicUrl),
  };
}

export async function generateMetadata(): Promise<Metadata> {
  const { name } = getInstallBrand(await getAppSettings());

  return {
    title: `Instalar ${name}`,
    description: `Instale ${name} pela experiência oficial do navegador.`,
    robots: {
      index: true,
      follow: false,
    },
  };
}

export default async function InstallPage() {
  return <PwaInstallPage brand={getInstallBrand(await getAppSettings())} />;
}
