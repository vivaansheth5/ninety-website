#!/usr/bin/env node
/**
 * Exports responsive web variants for every product image.
 *
 *   assets/masters/<slug>/0N-<role>.(jpg|jpeg|png|webp|avif|svg)   ← high-res masters (photo wins over svg)
 *   public/images/products/<slug>/0N-<role>-{400,800,1200}.{avif,webp}
 *
 * Also writes a 16px blur placeholder per image and updates src/data/image-manifest.json
 * (src, source: "photo" | "concept", blur). Requires the fonts in scripts/fonts to be
 * installed for crisp SVG text (the script installs them to ~/.local/share/fonts).
 *
 * Usage: node scripts/optimize-images.mjs [slug ...]
 */
import { copyFileSync, existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { execSync } from "node:child_process";
import { homedir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const MASTERS = join(ROOT, "assets/masters");
const OUT = join(ROOT, "public/images/products");
const MANIFEST = join(ROOT, "src/data/image-manifest.json");
const WIDTHS = [400, 800, 1200];
const PHOTO_EXT = ["jpg", "jpeg", "png", "webp", "avif"];

// Make brand fonts available to librsvg (SVG text rendering).
const fontDir = join(homedir(), ".local/share/fonts");
mkdirSync(fontDir, { recursive: true });
let added = false;
for (const f of readdirSync(join(ROOT, "scripts/fonts")).filter((f) => f.endsWith(".ttf"))) {
  if (!existsSync(join(fontDir, f))) { copyFileSync(join(ROOT, "scripts/fonts", f), join(fontDir, f)); added = true; }
}
if (added) try { execSync("fc-cache -f"); } catch { /* fontconfig cache refresh is best-effort */ }

const manifest = JSON.parse(readFileSync(MANIFEST, "utf8"));
const only = process.argv.slice(2);
let count = 0;
let bytes = 0;

async function processProduct(slug, entries) {
  mkdirSync(join(OUT, slug), { recursive: true });
  for (const entry of entries) {
    const file = entry.src.split("/").pop().replace(/-\d+\.(webp|avif)$/, "");
    const photo = PHOTO_EXT.map((e) => join(MASTERS, slug, `${file}.${e}`)).find(existsSync);
    const master = photo ?? join(MASTERS, slug, `${file}.svg`);
    if (!existsSync(master)) throw new Error(`Missing master for ${slug}/${file}`);
    const input = photo ? sharp(master) : sharp(master, { density: 72 }); // SVG masters are authored at 1200px
    const meta = await input.metadata();
    if (photo && (meta.width < 1200 || meta.height < 1200)) console.warn(`! ${slug}/${file}: master is ${meta.width}×${meta.height}, below the 1200px minimum`);
    const base = await input.resize(1200, 1200, { fit: "cover" }).png().toBuffer();
    for (const w of WIDTHS) {
      const img = sharp(base).resize(w, w);
      const avif = await img.clone().avif({ quality: 52, effort: 3 }).toBuffer();
      const webp = await img.clone().webp({ quality: 78, effort: 4 }).toBuffer();
      writeFileSync(join(OUT, slug, `${file}-${w}.avif`), avif);
      writeFileSync(join(OUT, slug, `${file}-${w}.webp`), webp);
      bytes += avif.length + webp.length;
    }
    const blur = await sharp(base).resize(16, 16).webp({ quality: 40 }).toBuffer();
    entry.src = `/images/products/${slug}/${file}-800.webp`;
    entry.master = master.replace(ROOT + "/", "");
    entry.source = photo ? "photo" : "concept";
    entry.status = photo ? "photo-master" : "concept-placeholder: replace with art-directed photography before launch";
    entry.blur = `data:image/webp;base64,${blur.toString("base64")}`;
    count++;
  }
  process.stdout.write(".");
}

const queue = Object.entries(manifest).filter(([slug]) => !only.length || only.includes(slug));
const CONCURRENCY = Math.max(1, Math.min(6, Number(process.env.CONCURRENCY) || 4));
await Promise.all(Array.from({ length: CONCURRENCY }, async () => {
  while (queue.length) await processProduct(...queue.shift());
}));
writeFileSync(MANIFEST, JSON.stringify(manifest, null, 2) + "\n");
console.log(`\nOptimised ${count} images → ${(bytes / 1024 / 1024).toFixed(1)} MB of web variants.`);
