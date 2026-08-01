import type { Metadata } from "next";
import { generateSEO } from "@/lib/seo";
import { displayFont, textFont } from "@/lib/fonts";
import { FloatingContactButtons } from "@/components/common/floating-contact-buttons";
import { SmoothScrollProvider } from "@/components/common/smooth-scroll-provider";
import "./globals.css";

export const metadata: Metadata = generateSEO();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="tr"
      data-scroll-behavior="smooth"
      className={`${displayFont.variable} ${textFont.variable} h-full`}
    >
      <body
        className="min-h-full flex flex-col font-text antialiased"
        suppressHydrationWarning
      >
        <SmoothScrollProvider />
        {children}
        <FloatingContactButtons />
      </body>
    </html>
  );
}
