import type { Metadata } from "next";
import { DM_Sans, Playfair_Display } from "next/font/google";
import { Toaster } from "react-hot-toast";
import Providers from "@/app/components/providers";
import "./globals.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-body",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-display",
});

export const metadata: Metadata = {
  title: "ECOTRANS — Transfert d'argent Cameroun ↔ Canada",
  description:
    "Envoyez et recevez de l'argent entre le Cameroun et le Canada avec seulement 1% de frais. Rapide, sécurisé, fiable.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className={`${dmSans.variable} ${playfair.variable}`}>
      <body className="font-body antialiased bg-stone-50 text-stone-900">
        <Providers>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                fontFamily: "var(--font-body)",
                borderRadius: "12px",
                background: "#1c1917",
                color: "#fafaf9",
              },
            }}
          />
        </Providers>
      </body>
    </html>
  );
}