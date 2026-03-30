import type { Metadata } from "next";
import { Outfit, Space_Grotesk, Hind_Siliguri, Geist } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const fontOutfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

const fontSpace = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space",
});

const fontHind = Hind_Siliguri({
  subsets: ["bengali", "latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-hind",
});

export const metadata: Metadata = {
  title: "Mediasoft BD | AI Assistant",
  description: "Advanced AI-powered business solutions and POS intelligence",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("font-sans", geist.variable)}>
      <body className={`${fontOutfit.variable} ${fontSpace.variable} ${fontHind.variable} font-outfit antialiased selection:bg-brand-primary/20`}>
        <Toaster position="top-right" reverseOrder={false} />
        {children}
      </body>
    </html>
  );
}
