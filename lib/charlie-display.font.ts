import localFont from "next/font/local";

export const displayFont = localFont({
  src: [
    {
      path: "../public/fonts/charlie-display/CharlieDisplay-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/charlie-display/CharlieDisplay-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../public/fonts/charlie-display/CharlieDisplay-Bold.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-charlie-display",
  display: "swap",
  fallback: ["system-ui", "Segoe UI", "sans-serif"],
  adjustFontFallback: false,
});
