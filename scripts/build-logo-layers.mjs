import sharp from "sharp";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const src = join(root, "public/brand/golden-fresh-logo.png");
const outDir = join(root, "public/brand");

function isNearBlack(r, g, b, a) {
  return a < 16 || (r < 32 && g < 32 && b < 32);
}

function isBlueBackground(r, g, b, a) {
  if (isNearBlack(r, g, b, a)) return false;
  return b > 80 && b > r + 25 && b > g + 10;
}

function isWhiteStripe(r, g, b, a) {
  if (isNearBlack(r, g, b, a)) return false;
  return r > 205 && g > 205 && b > 205;
}

function isForeground(r, g, b, a) {
  if (isNearBlack(r, g, b, a)) return false;
  if (isBlueBackground(r, g, b, a) || isWhiteStripe(r, g, b, a)) return false;
  return true;
}

async function buildLayers() {
  const { data, info } = await sharp(src).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;

  const stripes = Buffer.alloc(data.length);
  const elements = Buffer.alloc(data.length);

  for (let i = 0; i < data.length; i += channels) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const a = data[i + 3];

    if (isBlueBackground(r, g, b, a) || isWhiteStripe(r, g, b, a)) {
      stripes[i] = r;
      stripes[i + 1] = g;
      stripes[i + 2] = b;
      stripes[i + 3] = a;
    }

    if (isForeground(r, g, b, a)) {
      elements[i] = r;
      elements[i + 1] = g;
      elements[i + 2] = b;
      elements[i + 3] = a;
    }
  }

  const encode = (buffer, name) =>
    sharp(buffer, { raw: { width, height, channels } })
      .png()
      .toFile(join(outDir, name));

  await Promise.all([
    encode(stripes, "logo-layer-stripes.png"),
    encode(elements, "logo-layer-text.png"),
  ]);

  console.log("Wrote logo-layer-stripes.png and logo-layer-text.png");
}

buildLayers().catch((err) => {
  console.error(err);
  process.exit(1);
});
