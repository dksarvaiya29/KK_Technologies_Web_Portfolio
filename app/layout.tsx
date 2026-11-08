import type { Metadata } from "next";
import { Poppins, Montserrat, JetBrains_Mono } from "next/font/google";

import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["600", "700", "800", "900"],
  variable: "--font-montserrat",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "KK Technologies | Full-Service Digital Technology Agency",
  description:
    "KK Technologies is a full-service digital technology agency helping businesses build a stronger digital presence and smoother customer experiences through thoughtful design, websites, automation, and practical technology.",
  keywords: [
    "digital agency",
    "website development",
    "e-commerce",
    "AI chatbot",
    "automation",
    "Rajkot",
    "India",
  ],
  openGraph: {
    title: "KK Technologies | Full-Service Digital Technology Agency",
    description:
      "Thoughtful design, websites, automation, and practical technology for businesses that need a dependable digital presence.",
    type: "website",
    siteName: "KK Technologies",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${poppins.variable} ${montserrat.variable} ${jetbrains.variable}`}
    >
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}