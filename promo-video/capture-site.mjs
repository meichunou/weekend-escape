// Step 1: capture the REAL quiz from the local site, state by state (no recordVideo).
// Output: capture/q{1,2,3}.png, capture/q{1,2,3}-picked.png, capture/taps.json
import { chromium } from "playwright";
import { mkdir, writeFile } from "node:fs/promises";
import { serve, lockToLocal, FONT_CSS } from "./lib/serve.mjs";

const OUT = new URL("./capture/", import.meta.url).pathname;
// The answers tapped in the video: €100–€150, Train, Culture.
const PICKS = [1, 0, 1];
const VIEW = { width: 390, height: 844 };

await mkdir(OUT, { recursive: true });
const { server, origin } = await serve();
const browser = await chromium.launch();
const context = await browser.newContext({ viewport: VIEW, deviceScaleFactor: 3, isMobile: true, hasTouch: true, reducedMotion: "reduce" });
await lockToLocal(context, origin);
const page = await context.newPage();

await page.goto(`${origin}/index.html`, { waitUntil: "networkidle" });
await page.addStyleTag({ content: FONT_CSS(`${origin}/promo-video/node_modules/@fontsource`) + "*{transition:none!important;animation:none!important;caret-color:transparent}:focus,:focus-visible{outline:none!important}" });
await page.evaluate(() => document.fonts.ready);
await page.waitForSelector("#quiz-stage .opt");

// Scroll so the quiz card sits nicely in the mobile viewport.
const frame = async () => {
  await page.evaluate(() => {
    const box = document.querySelector("#quiz-box");
    window.scrollTo(0, box.getBoundingClientRect().top + window.scrollY - 150);
  });
  await page.waitForTimeout(250);
};

const taps = [];
for (let q = 0; q < 3; q++) {
  await page.waitForFunction((n) => document.querySelector("#quiz-count")?.textContent.includes(`${n} of 3`), q + 1);
  await page.waitForTimeout(300);
  await frame();
  await page.screenshot({ path: `${OUT}q${q + 1}.png` });
  const opt = page.locator("#quiz-stage .opt").nth(PICKS[q]);
  const b = await opt.boundingBox();
  taps.push({ x: (b.x + b.width / 2) / VIEW.width, y: (b.y + b.height / 2) / VIEW.height, label: (await opt.innerText()).split("\n").map((l) => l.trim()).filter(Boolean)[1] });
  // Show the "picked" state without letting the page advance yet.
  await opt.evaluate((el) => el.classList.add("picked"));
  await page.screenshot({ path: `${OUT}q${q + 1}-picked.png` });
  await opt.evaluate((el) => el.classList.remove("picked"));
  await opt.click();
}
await writeFile(`${OUT}taps.json`, JSON.stringify({ view: VIEW, taps }, null, 2));
console.log("captured", taps);

await browser.close();
server.close();
