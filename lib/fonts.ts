import { Outfit, Plus_Jakarta_Sans } from "next/font/google";

/** Başlıklar — modern geometrik display font */
export const displayFont = Outfit({
  subsets: ["latin", "latin-ext"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-family-display",
  display: "swap",
});

/** Gövde metni — okunaklı, modern UI font */
export const textFont = Plus_Jakarta_Sans({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-family-text",
  display: "swap",
});

export const fontVariables = {
  display: "var(--font-family-display)",
  text: "var(--font-family-text)",
} as const;

export const fontClasses = {
  display: "font-display",
  text: "font-text",
} as const;
