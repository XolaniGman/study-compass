import fs from "node:fs";
import path from "node:path";

/**
 * Netlify Postbuild Resilience Script
 *
 * Ensures that whichever directory Netlify looks for (dist, dist/client, or .output/public),
 * the static build assets are present and ready for deployment.
 */
const rootDir = process.cwd();
const distDir = path.resolve(rootDir, "dist");
const clientDir = path.resolve(distDir, "client");
const outputPublicDir = path.resolve(rootDir, ".output", "public");

// 1. If Nitro generated `dist`, mirror into `dist/client`
if (fs.existsSync(distDir)) {
  if (!fs.existsSync(clientDir)) {
    fs.mkdirSync(clientDir, { recursive: true });
    for (const item of fs.readdirSync(distDir)) {
      if (item === "client") continue;
      const src = path.join(distDir, item);
      const dest = path.join(clientDir, item);
      fs.cpSync(src, dest, { recursive: true });
    }
    console.log("[postbuild] ✓ Mirrored 'dist' into 'dist/client' for Netlify compatibility.");
  }
}

// 2. If Nitro generated `.output/public` (e.g. cloudflare-module preset), mirror into `dist` and `dist/client`
if (fs.existsSync(outputPublicDir)) {
  if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
  }
  for (const item of fs.readdirSync(outputPublicDir)) {
    const src = path.join(outputPublicDir, item);
    const dest = path.join(distDir, item);
    if (!fs.existsSync(dest)) {
      fs.cpSync(src, dest, { recursive: true });
    }
  }

  if (!fs.existsSync(clientDir)) {
    fs.mkdirSync(clientDir, { recursive: true });
  }
  for (const item of fs.readdirSync(outputPublicDir)) {
    const src = path.join(outputPublicDir, item);
    const dest = path.join(clientDir, item);
    if (!fs.existsSync(dest)) {
      fs.cpSync(src, dest, { recursive: true });
    }
  }
  console.log("[postbuild] ✓ Ensured both 'dist' and 'dist/client' exist from '.output/public'.");
}
