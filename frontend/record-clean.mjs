// Records a CLEAN screencast (no captions/cards) with actions timed to the
// voiceover beats (see video/src/captions.ts). Remotion adds synced captions.
import { chromium } from "playwright";
import fs from "node:fs";

const W = 1280, H = 720;
const BASE = process.argv[2] || "http://localhost:4173/";

const browser = await chromium.launch({ channel: "msedge" });
const context = await browser.newContext({
  viewport: { width: W, height: H },
  recordVideo: { dir: "video-tmp", size: { width: W, height: H } },
});
const page = await context.newPage();
const errs = [];
page.on("pageerror", (e) => errs.push(e.message));

const t0 = Date.now();
const until = async (s) => {
  const ms = t0 + s * 1000 - Date.now();
  if (ms > 0) await page.waitForTimeout(ms);
};
const clickByName = async (re) => {
  const b = page.getByRole("button", { name: re }).first();
  await b.scrollIntoViewIfNeeded();
  await b.click();
};

await page.goto(BASE, { waitUntil: "networkidle" });

// intro + problem (0–21): stay on the hero
await until(19);
await page.locator("#demo").scrollIntoViewIfNeeded();

// mint (21–46): generate the proof in the browser
await until(27);
await clickByName(/Generate proof/i);

// verify on-chain (46–60)
await until(46);
await clickByName(/Verify on Stellar/i);

// x402 gate (60–73): within cap, then over cap
await until(61);
await clickByName(/Pay \d+ XLM/i);
await until(68);
await page.getByRole("button", { name: /Pay \d+ XLM/i }).nth(1).scrollIntoViewIfNeeded();
await page.getByRole("button", { name: /Pay \d+ XLM/i }).nth(1).click();

// balance hidden (73–79) — hold

// anti-replay (79–92)
await until(81);
await clickByName(/Replay a spent passport/i);

// under the hood (92–119): circuit, then the deployed contracts + reuse credits
await until(92);
await page.locator("#tech").scrollIntoViewIfNeeded();
await until(104);
await page.evaluate(() => document.querySelectorAll('a[href*="stellar.expert"]')[0]?.scrollIntoView({ block: "center", behavior: "smooth" }));

// outro (119–122.5): Remotion draws the end card over this
await until(119);
await page.evaluate(() => window.scrollTo({ top: 0, behavior: "smooth" }));
await until(122.6);

await context.close();
const vpath = await page.video().path();
await browser.close();
fs.copyFileSync(vpath, "../docs/screencast-clean.webm");
console.log("saved ../docs/screencast-clean.webm");
console.log("page errors:", errs.length ? errs.join("\n") : "none");
