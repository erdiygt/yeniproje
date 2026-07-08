import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const regularFont = path.join(
  root,
  "public/fonts/charlie-display/CharlieDisplay-Regular.woff2"
);
const output = path.join(root, "lib/display-font-export.ts");

const hasFonts = fs.existsSync(regularFont);

const content = hasFonts
  ? `/** Auto-generated — Charlie Display dosyaları mevcut */
export { displayFont } from "./charlie-display.font";
`
  : `/** Auto-generated — Charlie Display dosyaları henüz eklenmedi */
export const displayFont = { variable: "" as const };
`;

fs.writeFileSync(output, content, "utf8");
console.log(
  hasFonts
    ? "[fonts] Charlie Display: next/font/local etkin"
    : "[fonts] Charlie Display: dosyalar eksik, sistem fontu kullanılıyor"
);
