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
  // ── SEO de base ──
  title: {
    default: "ECOTRANS — Transfert d'argent Cameroun ↔ Canada | 1% de frais",
    template: "%s | ECOTRANS",
  },
  description:
    "Envoyez de l'argent entre le Cameroun et le Canada avec seulement 1% de frais. Transfert rapide, sécurisé et fiable. Mobile Money, virement bancaire. Rejoignez +2000 utilisateurs.",
  keywords: [
    "transfert argent Cameroun Canada",
    "envoyer argent Cameroun",
    "envoyer argent Canada",
    "transfert argent diaspora",
    "Mobile Money Cameroun",
    "ECOTRANS",
    "transfert argent Afrique",
    "envoyer argent famille Cameroun",
    "frais transfert 1%",
    "transfert rapide Cameroun",
    "wire transfer Cameroon Canada",
    "send money Cameroon",
  ],

  // ── Open Graph (Facebook, LinkedIn, WhatsApp) ──
  openGraph: {
    type: "website",
    locale: "fr_CA",
    url: "https://www.ecotranstubo.ca",
    siteName: "ECOTRANS",
    title: "ECOTRANS — Transfert d'argent Cameroun ↔ Canada | 1% de frais",
    description:
      "Envoyez de l'argent entre le Cameroun et le Canada. 1% de frais, réception en moins de 24h. Rapide, sécurisé, fiable.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "ECOTRANS - Transfert d'argent Cameroun Canada",
      },
    ],
  },

  // ── Twitter Card ──
  twitter: {
    card: "summary_large_image",
    title: "ECOTRANS — Transfert d'argent Cameroun ↔ Canada",
    description:
      "1% de frais. Réception en moins de 24h. Rejoignez +2000 utilisateurs.",
    images: ["/og-image.png"],
  },

  // ── Autres ──
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://www.ecotranstubo.ca",
  },
  verification: {
    // Tu ajouteras le code Google ici (étape 2 du guide)
    // google: "ton-code-verification-google",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className={`${dmSans.variable} ${playfair.variable}`}>
      <head>
        {/* Schema.org JSON-LD pour Google */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FinancialService",
              name: "ECOTRANS",
              description:
                "Service de transfert d'argent entre le Cameroun et le Canada avec 1% de frais.",
              url: "https://www.ecotranstubo.ca",
              areaServed: [
                { "@type": "Country", name: "Canada" },
                { "@type": "Country", name: "Cameroon" },
              ],
              serviceType: "Money Transfer",
              currenciesAccepted: "CAD, XAF",
            }),
          }}
        />
      </head>
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