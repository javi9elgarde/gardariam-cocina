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
  title: "Cocina Gardariam — Nuestro fuego, nuestro amor",
  description: "El recetario de Javi y Mariam — cada receta, un fuego encendido en Gardariam.",
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
