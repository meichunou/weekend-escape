// Optional music: mixes an audio file under an existing render, without re-rendering frames.
//   node mix-audio.mjs path/to/music.mp3 [volume=0.8] [video=weekend-escape-promo.mp4]
// The audio is trimmed to the video length with a 0.5 s fade in and a 1.5 s fade out.
import { execFileSync } from "node:child_process";
import ffmpeg from "ffmpeg-static";
import { fileURLToPath } from "node:url";

export function mixAudio(video, audio, volume = 0.8) {
  const out = video.replace(/\.mp4$/, "-audio.mp4");
  const dur = Number(execFileSync(ffmpeg, ["-i", video, "-f", "null", "-"], { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] }).match(/time=(\d+):(\d+):([\d.]+)/g)?.pop()?.split("=")[1].split(":").reduce((a, b) => a * 60 + Number(b), 0) || 25);
  execFileSync(ffmpeg, [
    "-y", "-loglevel", "error", "-i", video, "-i", audio,
    "-filter_complex", `[1:a]atrim=0:${dur},volume=${volume},afade=t=in:d=0.5,afade=t=out:st=${Math.max(0, dur - 1.5)}:d=1.5[a]`,
    "-map", "0:v", "-map", "[a]", "-c:v", "copy", "-c:a", "aac", "-b:a", "192k", "-shortest", "-movflags", "+faststart", out,
  ]);
  return out;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const [audio, vol, video] = process.argv.slice(2);
  if (!audio) { console.error("usage: node mix-audio.mjs <audio file> [volume] [video]"); process.exit(1); }
  console.log("wrote", mixAudio(video || fileURLToPath(new URL("./weekend-escape-promo.mp4", import.meta.url)), audio, Number(vol || 0.8)));
}
