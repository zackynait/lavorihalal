import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "LavoriHalal - Trova il tuo lavoro etico in Italia",
  description: "La piattaforma di riferimento per trovare opportunità di lavoro halal in Italia. Connettiamo professionisti musulmani con aziende che condividono i tuoi valori.",
  keywords: ["lavoro halal", "offerte di lavoro", "carriera etica", "lavoro in Italia", "musulmani in Italia", "lavoro remoto"],
  authors: [{ name: 'LavoriHalal Team' }],
  openGraph: {
    title: 'LavoriHalal - Trova il tuo lavoro etico in Italia',
    description: 'Connettiamo professionisti musulmani con opportunità di lavoro halal in Italia.',
    url: 'https://lavorihalal.it',
    siteName: 'LavoriHalal',
    locale: 'it_IT',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it">
      <body className={`${inter.variable} font-sans bg-white`}>
        {children}
      </body>
    </html>
  );
}
