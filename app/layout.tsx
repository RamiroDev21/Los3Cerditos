import type { Metadata, Viewport } from "next";
import { Archivo, Kalam } from "next/font/google";
import { brand } from "@/lib/content";
import "./globals.css";

const archivo = Archivo({
  subsets: ["latin"],
  axes: ["wdth"],
  variable: "--font-archivo",
  display: "swap",
});

const kalam = Kalam({
  subsets: ["latin"],
  weight: ["700"],
  variable: "--font-kalam",
  display: "swap",
});

const description =
  "Hamburguesas de carne artesanal, chuzos desgranados, salchipapas, perros calientes y asados al carbón. Mira la carta y haz tu pedido por WhatsApp.";

export const metadata: Metadata = {
  title: `${brand.fullName} — Carta y pedidos`,
  description,
  openGraph: {
    title: brand.fullName,
    description,
    type: "website",
    locale: "es_CO",
    images: [{ url: brand.logo.src, width: brand.logo.width, height: brand.logo.height, alt: brand.fullName }],
  },
};

export const viewport: Viewport = {
  themeColor: "#100a5c",
  colorScheme: "dark",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${archivo.variable} ${kalam.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
        <link rel="preconnect" href="https://images.unsplash.com" />
      </head>
      <body>{children}</body>
    </html>
  );
}
