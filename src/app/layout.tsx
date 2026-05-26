import type { Metadata } from "next";
import { Inter, Urbanist } from "next/font/google";
import AppToaster from "@/components/ui/AppToaster";
import "./globals.css";

const urbanist = Urbanist({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-urbanist",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "StoryGen – AI-Powered Creativity",
  description: "Generate stunning images and cinematic videos with the power of AI",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${urbanist.variable} ${inter.variable} bg-background font-inter text-text antialiased`}
      >
        {children}
        <AppToaster />
      </body>
    </html>
  );
}
