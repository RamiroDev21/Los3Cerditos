/**
 * Datos del negocio y textos del sitio, en un solo lugar.
 * Todo lo que aparece aquí sale de la carta impresa de Los Tres Cerditos.
 * Los productos y precios están en lib/menu.ts.
 *
 * PENDIENTE DE COMPLETAR por el negocio:
 *  - `city`: la carta no dice la ciudad. Al completarla, el enlace "Cómo llegar" la incluye.
 *  - `hours.days`: la carta dice 5 p. m. a 11 p. m., pero no qué días.
 *  - `social`: la carta no trae redes sociales. Cada red que agregues aparece en el pie de página.
 */

export const brand = {
  name: "Los Tres Cerditos",
  fullName: "Los Tres Cerditos Restaurante",
  logo: { src: "/brand/logo-los-tres-cerditos.png", width: 277, height: 242 },
  slogan: "Sabemos lo que es comer bien, siempre querrás más, volverás por más.",
  specialties: ["Hamburguesa", "Desgranado", "Salchipapa", "Perro Caliente"],
} as const;

/**
 * Número que recibe los pedidos de la web por WhatsApp: código de país + número, sin espacios ni "+".
 * Confirmado por el negocio: 302 448 3159.
 */
export const WHATSAPP_NUMBER = "573024483159";

export const contact = {
  /** Números de domicilio de la carta. */
  phones: [
    { display: "302 448 3159", tel: "+573024483159", whatsapp: true },
    { display: "323 231 2013", tel: "+573232312013", whatsapp: false },
    { display: "321 843 0124", tel: "+573218430124", whatsapp: false },
  ],
  address: "Calle 18 #2b-72",
  reference: "Frente al Colegio Pinillos",
  city: "",
  hours: { open: "5:00 p. m.", close: "11:00 p. m.", days: "" },
  social: [] as { label: string; href: string }[],
};

export function mapsUrl() {
  const query = [contact.address, contact.reference.replace(/^Frente al /, "frente al "), contact.city]
    .filter(Boolean)
    .join(", ");
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

export const nav = [
  { label: "Inicio", href: "#top" },
  { label: "Carta", href: "#carta" },
  { label: "Destacados", href: "#destacados" },
  { label: "Nosotros", href: "#nosotros" },
  { label: "Contacto", href: "#contacto" },
] as const;

export const video = {
  src: "/video/burgervideo.mp4",
  fps: 24,
  /** The burger reaches its widest separation at ~4s, then reassembles. Scroll maps 0 → explodeEnd. */
  explodeEnd: 4,
  /**
   * Scroll progress → video seconds. The first second of footage barely moves,
   * so it is compressed: 25% separation begins, 50% layers apart,
   * 75% almost fully exploded, 100% fully exploded.
   */
  timeline: [
    [0, 0],
    [0.25, 1.35],
    [0.5, 2.35],
    [0.75, 3.15],
    [1, 4],
  ] as ReadonlyArray<readonly [number, number]>,
  /** Source crop (px) — trims the bottom strip that carries the generator watermark. */
  crop: { x: 0, y: 0, w: 1280, h: 660 },
  width: 1280,
  height: 720,
} as const;

/**
 * Las capas que se ven en el video, de arriba abajo. El video es ilustrativo
 * (no es un producto puntual de la carta), así que las capas se nombran por lo que se ve.
 */
export const layers = ["Pan", "Tocineta", "Queso", "Carne", "Tocineta", "Lechuga", "Pan"] as const;

export const imageCredits = "Fotos de referencia: Unsplash";
