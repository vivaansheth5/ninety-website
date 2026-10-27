#!/usr/bin/env node
/**
 * End-to-end smoke test against a running production server.
 *   npm run build && npm start   (in another terminal)
 *   BASE_URL=http://localhost:3000 npm run test:e2e
 *
 * Checks: every route returns 200, every manifest image exists, no horizontal overflow at
 * 320/375/390/430/768/1024/1440, no console errors, and the core shopping flows
 * (quick add, cart drawer, quantity, remove, persistence, search, filters, variants, Buy Now demo).
 */
import { createRequire } from "node:module";
import { readFileSync } from "node:fs";

const require = createRequire(import.meta.url);
const { chromium } = require("playwright");
const BASE = process.env.BASE_URL || "http://localhost:3000";
const manifest = JSON.parse(readFileSync(new URL("../src/data/image-manifest.json", import.meta.url)));
const slugs = Object.keys(manifest);

let failures = 0;
const ok = (cond, msg) => {
  console.log(`${cond ? "✓" : "✗"} ${msg}`);
  if (!cond) failures++;
};

// 1. Routes
const routes = ["/", "/products", "/trending", "/collections", "/about", "/faq", "/contact", "/wishlist", "/sitemap.xml", "/robots.txt",
  ...["tech-gadgets", "charging-power", "desk-setup", "audio-speakers", "lifestyle-essentials", "travel-edc", "grooming-care", "lights-decor", "gifts-unusual"].map((c) => `/collections/${c}`),
  ...["shipping", "returns", "privacy", "terms", "payments"].map((p) => `/policies/${p}`),
  ...slugs.map((s) => `/products/${s}`)];
const statuses = await Promise.all(routes.map(async (r) => [r, (await fetch(BASE + r)).status]));
const bad = statuses.filter(([, s]) => s !== 200);
ok(bad.length === 0, `${routes.length} routes return 200 ${bad.length ? JSON.stringify(bad) : ""}`);
ok((await fetch(`${BASE}/products/does-not-exist`)).status === 404, "unknown product returns 404");

// 2. Images
const imgs = Object.values(manifest).flat();
const imgStatus = await Promise.all(imgs.map(async (i) => [i.src, (await fetch(BASE + i.src, { method: "HEAD" })).status]));
const brokenImgs = imgStatus.filter(([, s]) => s !== 200);
ok(imgs.length === 160 && brokenImgs.length === 0, `${imgs.length} product images resolve ${brokenImgs.length ? JSON.stringify(brokenImgs.slice(0, 5)) : ""}`);
ok(slugs.every((s) => manifest[s].length === 5), "every product has exactly 5 images");

const browser = await chromium.launch();

// 3. Overflow + console errors at all breakpoints
for (const width of [320, 375, 390, 430, 768, 1024, 1440]) {
  const page = await browser.newPage({ viewport: { width, height: 900 } });
  const errors = [];
  page.on("pageerror", (e) => errors.push(String(e)));
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  const over = [];
  for (const r of ["/", "/products", "/products/levitating-racing-display", "/collections/desk-setup", "/faq"]) {
    await page.goto(BASE + r, { waitUntil: "networkidle" });
    const ow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    if (ow > 0) over.push(`${r}:${ow}px`);
  }
  ok(over.length === 0, `no horizontal overflow at ${width}px ${over.join(" ")}`);
  ok(errors.length === 0, `no console errors at ${width}px ${errors.slice(0, 2).join(" | ")}`);
  await page.close();
}

// 4. Shopping flows (mobile)
const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
const page = await ctx.newPage();
await page.goto(`${BASE}/products`, { waitUntil: "networkidle" });
await page.getByRole("button", { name: /^Add Magnetic Levitating Racing Car Display to cart/ }).click();
await page.waitForTimeout(300);
ok((await page.getByRole("button", { name: /Open cart \(1 items\)/ }).count()) === 1, "quick add updates cart count");

await page.getByPlaceholder("Search 32 finds…").fill("speaker");
await page.waitForTimeout(300);
const speakerCount = await page.locator("main ul > li article").count();
ok(speakerCount >= 3 && speakerCount < 32, `search filters grid (${speakerCount} results for "speaker")`);
ok(page.url().includes("q=speaker"), "search state mirrored to URL");
await page.getByPlaceholder("Search 32 finds…").fill("");
await page.getByRole("button", { name: "Lights & Room Decor", pressed: false }).click();
await page.waitForTimeout(300);
const lights = await page.locator("main ul > li article").count();
ok(lights > 0 && lights < 32, `category filter works (${lights})`);

// Product page: variant, quantity, add, drawer
await page.goto(`${BASE}/products/glow-earbuds-case`, { waitUntil: "networkidle" });
await page.getByRole("button", { name: /Ice Blue/ }).click();
await page.getByRole("button", { name: "Increase quantity" }).click();
await page.getByRole("button", { name: "Add to Cart" }).first().click();
await page.waitForTimeout(600);
const drawer = page.getByRole("dialog", { name: "Shopping cart" });
ok(await drawer.isVisible(), "cart drawer opens on add");
ok((await drawer.getByText("Ice Blue").count()) === 1, "variant shown in cart");
ok((await drawer.getByText("₹1,598").count()) >= 1, "quantity × price line total");
await drawer.getByRole("button", { name: /Increase quantity of Glow/ }).click();
ok((await drawer.getByText("₹2,397").count()) >= 1, "quantity change updates total");
await drawer.getByRole("button", { name: "Checkout" }).click();
await page.waitForTimeout(800);
ok((await drawer.getByText("Checkout demo mode").count()) === 1, "checkout shows honest demo state (no fake success)");
await page.keyboard.press("Escape");
await page.waitForTimeout(500);
ok(!(await drawer.isVisible()), "Escape closes the drawer");

// Persistence
await page.reload({ waitUntil: "networkidle" });
ok((await page.getByRole("button", { name: /Open cart \(4 items\)/ }).count()) === 1, "cart persists across reloads (localStorage)");

// Remove
await page.getByRole("button", { name: /Open cart/ }).click();
await page.waitForTimeout(500);
await page.getByRole("button", { name: /Remove Glow-in-the-Dark/ }).click();
await page.getByRole("button", { name: /Remove Magnetic Levitating/ }).click();
await page.waitForTimeout(600);
ok((await page.getByText("Nothing here. Yet.").count()) === 1, "removing all lines shows empty state");
await page.keyboard.press("Escape");
await page.waitForTimeout(600); // let the drawer release its scroll lock

// Sticky bar
await page.evaluate(() => window.scrollTo(0, 2000));
await page.waitForTimeout(600);
const barVisible = await page.evaluate(() => [...document.querySelectorAll("[aria-hidden]")].some((e) => e.getAttribute("aria-hidden") === "false" && e.textContent?.includes("Add to Cart")));
ok(barVisible, "sticky mobile purchase bar appears after scrolling past buy buttons");

// Buy now (demo)
await page.evaluate(() => window.scrollTo(0, 0));
await page.getByRole("button", { name: "Buy Now" }).click();
await page.waitForTimeout(800);
ok((await page.getByText("Checkout demo mode").count()) === 1, "Buy Now shows demo state without Shopify");

// Wishlist + search overlay
await page.getByRole("button", { name: /Save Glow-in-the-Dark Earbuds Case to wishlist/ }).first().click();
await page.goto(`${BASE}/wishlist`, { waitUntil: "networkidle" });
ok((await page.getByText("Glow-in-the-Dark Earbuds Case").count()) >= 1, "wishlist persists and renders");
await page.getByRole("button", { name: "Search", exact: true }).click();
await page.waitForTimeout(400);
await page.getByRole("textbox", { name: "Search products" }).fill("cloud");
await page.waitForTimeout(300);
ok((await page.getByRole("dialog", { name: "Search products" }).getByText("Interactive RGB Cloud Lamp").count()) === 1, "search overlay finds products");

// Mobile menu keyboard
await page.keyboard.press("Escape");
await page.getByRole("button", { name: "Open menu" }).click();
await page.waitForTimeout(500);
ok(await page.getByRole("dialog", { name: "Menu" }).isVisible(), "mobile menu opens");
await page.keyboard.press("Escape");

// Reduced motion
const rm = await browser.newPage({ reducedMotion: "reduce", viewport: { width: 390, height: 844 } });
await rm.goto(BASE, { waitUntil: "networkidle" });
await rm.evaluate(() => window.scrollTo(0, document.body.scrollHeight)); await rm.waitForTimeout(300);
const revealed = await rm.evaluate(() => [...document.querySelectorAll("[data-reveal]")].every((e) => getComputedStyle(e).opacity === "1"));
ok(revealed, "reduced motion: all content visible without scroll animations");

await browser.close();
console.log(failures ? `\n${failures} check(s) failed` : "\nAll checks passed");
process.exit(failures ? 1 : 0);
