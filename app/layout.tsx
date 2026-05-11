import type { Metadata } from "next";
import { DM_Sans, Playfair_Display } from "next/font/google";
import { Toaster } from "react-hot-toast";
import Providers from "@/app/components/providers";
import "./globals.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

export const metadata: Metadata = {
  title: "ECOTRANS — Transfert d'argent Cameroun ↔ Canada",
  description:
    "Envoyez et recevez de l'argent entre le Cameroun et le Canada. 1% de frais. Rapide, sécurisé, fiable.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className={`${dmSans.variable} ${playfair.variable}`}>
      <body
        className="antialiased"
        style={{
          fontFamily: "var(--font-body), sans-serif",
          backgroundColor: "#fafaf9",
          color: "#1c1917",
        }}
      >
        <Providers>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                fontFamily: "var(--font-body)",
                borderRadius: "16px",
                background: "#1c1917",
                color: "#fafaf9",
                padding: "14px 20px",
                fontSize: "14px",
                boxShadow: "0 20px 60px rgba(0,0,0,.15)",
              },
            }}
          />
        </Providers>
      </body>
    </html>
  );
}