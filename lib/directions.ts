import { brand, contact } from "./content";

/**
 * Turn-by-turn links to the restaurant's exact pin. Each one is a universal link:
 * it opens the native app when installed and the web version otherwise.
 */
const { lat, lng } = contact.geo;
const ll = `${lat},${lng}`;
const label = encodeURIComponent(brand.fullName);

export type DirectionsApp = { id: string; name: string; hint: string; href: string };

export const googleMaps: DirectionsApp = {
  id: "google",
  name: "Google Maps",
  hint: "Ruta en Google Maps",
  href: `https://www.google.com/maps/dir/?api=1&destination=${ll}&travelmode=driving`,
};

export const waze: DirectionsApp = {
  id: "waze",
  name: "Waze",
  hint: "Navegar con Waze",
  href: `https://waze.com/ul?ll=${ll}&navigate=yes`,
};

export const appleMaps: DirectionsApp = {
  id: "apple",
  name: "Apple Maps",
  hint: "Ruta en Mapas de Apple",
  href: `https://maps.apple.com/?daddr=${ll}&q=${label}&dirflg=d`,
};

/** Android only: the system shows every installed map app to choose from. */
export const anyAndroidApp: DirectionsApp = {
  id: "geo",
  name: "Otra app de mapas",
  hint: "Elige entre las apps de tu celular",
  href: `geo:${ll}?q=${ll}(${label})`,
};

export type Platform = "ios" | "android" | "other";

export function detectPlatform(): Platform {
  if (typeof navigator === "undefined") return "other";
  const ua = navigator.userAgent;
  if (/Android/i.test(ua)) return "android";
  // iPadOS reports itself as a Mac; touch support tells them apart.
  if (/iPhone|iPad|iPod/i.test(ua) || (/Macintosh/i.test(ua) && navigator.maxTouchPoints > 1)) return "ios";
  return "other";
}

/** The apps to offer, most native first. */
export function directionsFor(platform: Platform): DirectionsApp[] {
  if (platform === "ios") return [appleMaps, googleMaps, waze];
  if (platform === "android") return [googleMaps, waze, anyAndroidApp];
  const isMac = typeof navigator !== "undefined" && /Macintosh/i.test(navigator.userAgent);
  return isMac ? [googleMaps, appleMaps, waze] : [googleMaps, waze];
}
