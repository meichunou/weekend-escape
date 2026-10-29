// Step 2: render video.html frame by frame (seek(t) → screenshot) and pipe the PNGs into ffmpeg.
//   node render.mjs                         → out/weekend-escape-promo.mp4 (1080x1920)
//   node render.mjs --stills 0.5,6,14,19,24 → out/stills/*.png only (quick review)
//   node render.mjs --audio music.mp3       → also mixes an audio track (see mix-audio.mjs)
import { chromium } from "playwright";
import { spawn } from "node:child_process";
import { mkdir } from "node:fs/promises";
import ffmpeg from "ffmpeg-static";
import { serve, lockToLocal } from "./lib/serve.mjs";
import { mixAudio } from "./mix-audio.mjs";

const FPS = 30, DUR = 25, W = 1080, H = 1920;
const arg = (k) => { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : undefined; };
const OUT = new URL("./", import.meta.url).pathname;
const MP4 = `${OUT}weekend-escape-promo.mp4`;

const { server, origin } = await serve();
const browser = await chromium.launch();
const context = await browser.newContext({ viewport: { width: W, height: H }, deviceScaleFactor: 1 });
await lockToLocal(context, origin);
const page = await context.newPage();
page.on("pageerror", (e) => { console.error("page error:", e.message); process.exitCode = 1; });
await page.goto(`${origin}/promo-video/video.html`, { waitUntil: "networkidle" });
await page.evaluate(() => window.ready);
const stage = page.locator("#stage");

const stills = arg("--stills");
if (stills) {
  await mkdir(`${OUT}stills`, { recursive: true });
  for (const t of stills.split(",").map(Number)) {
    await page.evaluate((t) => seek(t), t);
    await stage.screenshot({ path: `${OUT}stills/t${t.toFixed(2).padStart(5, "0")}.png` });
  }
  console.log("stills written to", `${OUT}stills`);
} else {
  const enc = spawn(ffmpeg, [
    "-y", "-loglevel", "error",
    "-f", "image2pipe", "-framerate", String(FPS), "-c:v", "png", "-i", "-",
    "-c:v", "libx264", "-profile:v", "high", "-preset", "slow", "-crf", "16",
    "-pix_fmt", "yuv420p", "-r", String(FPS), "-movflags", "+faststart", MP4,
  ], { stdio: ["pipe", "inherit", "inherit"] });
  const done = new Promise((ok, ko) => enc.on("close", (c) => (c ? ko(new Error("ffmpeg exit " + c)) : ok())));
  const N = FPS * DUR;
  for (let f = 0; f < N; f++) {
    await page.evaluate((t) => seek(t), f / FPS);
    const png = await stage.screenshot({ type: "png" });
    if (!enc.stdin.write(png)) await new Promise((ok) => enc.stdin.once("drain", ok));
    if (f % 75 === 0) process.stdout.write(`\rframe ${f}/${N}`);
  }
  enc.stdin.end();
  await done;
  console.log(`\nwrote ${MP4}`);
  const audio = arg("--audio");
  if (audio) console.log("wrote", await mixAudio(MP4, audio, Number(arg("--volume") || 0.8)));
}

await browser.close();
server.close();
