import type { Metadata } from "next";
import { Cinzel, Outfit } from "next/font/google";
import { AuthProvider } from "@/lib/auth";
import "./globals.css";

const cinzel = Cinzel({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

const outfit = Outfit({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://cocina.gardariam.com"),
  title: "Cocina Gardariam — Nuestro fuego, nuestro amor",
  description: "El recetario de Javi y Mariam — cada receta, un fuego encendido en Gardariam.",
  openGraph: {
    type: "website",
    locale: "es_ES",
    url: "https://cocina.gardariam.com",
    siteName: "Gardariam",
    title: "Cocina Gardariam — Nuestro fuego, nuestro amor",
    description: "El recetario de Javi y Mariam — cada receta, un fuego encendido en Gardariam.",
    images: [{ url: "/og.jpg", width: 1200, height: 630, alt: "Gardariam" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Cocina Gardariam — Nuestro fuego, nuestro amor",
    description: "El recetario de Javi y Mariam — cada receta, un fuego encendido en Gardariam.",
    images: ["/og.jpg"],
  },
};

export const viewport = {
  themeColor: "#4e3315",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${cinzel.variable} ${outfit.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-imperial-charcoal text-parchment">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
