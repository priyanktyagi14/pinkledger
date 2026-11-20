// Script to generate PinkLedger PWA Icons (SVG & PNGs)
import fs from 'fs';
import path from 'path';
import zlib from 'zlib';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const iconsDir = path.join(rootDir, 'public', 'icons');

if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

// CRC32 implementation for PNG chunks
function crc32(buf) {
  let c;
  let table = [];
  for (let n = 0; n < 256; n++) {
    c = n;
    for (let k = 0; k < 8; k++) {
      c = ((c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1));
    }
    table[n] = c;
  }
  let crc = 0 ^ (-1);
  for (let i = 0; i < buf.length; i++) {
    crc = (crc >>> 8) ^ table[(crc ^ buf[i]) & 0xFF];
  }
  return (crc ^ (-1)) >>> 0;
}

function makeChunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const typeBuf = Buffer.from(type);
  const typeAndData = Buffer.concat([typeBuf, data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(typeAndData), 0);
  return Buffer.concat([len, typeAndData, crc]);
}

function createPng(width, height, rgbaBuffer) {
  const sig = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData[8] = 8; // 8-bit
  ihdrData[9] = 6; // RGBA
  ihdrData[10] = 0; // compression
  ihdrData[11] = 0; // filter
  ihdrData[12] = 0; // interlace
  const ihdr = makeChunk('IHDR', ihdrData);

  const scanlines = [];
  for (let y = 0; y < height; y++) {
    scanlines.push(Buffer.from([0])); // filter byte
    scanlines.push(rgbaBuffer.subarray(y * width * 4, (y + 1) * width * 4));
  }
  const idatData = zlib.deflateSync(Buffer.concat(scanlines));
  const idat = makeChunk('IDAT', idatData);
  const iend = makeChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([sig, ihdr, idat, iend]);
}

// Helper drawing canvas
class PixelCanvas {
  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.buffer = Buffer.alloc(width * height * 4, 0);
  }

  setPixel(x, y, r, g, b, a = 255) {
    if (x < 0 || x >= this.width || y < 0 || y >= this.height) return;
    const idx = (Math.floor(y) * this.width + Math.floor(x)) * 4;
    if (a >= 255) {
      this.buffer[idx] = r;
      this.buffer[idx + 1] = g;
      this.buffer[idx + 2] = b;
      this.buffer[idx + 3] = 255;
    } else if (a > 0) {
      const srcA = a / 255;
      const dstA = this.buffer[idx + 3] / 255;
      const outA = srcA + dstA * (1 - srcA);
      if (outA > 0) {
        this.buffer[idx] = Math.round((r * srcA + this.buffer[idx] * dstA * (1 - srcA)) / outA);
        this.buffer[idx + 1] = Math.round((g * srcA + this.buffer[idx + 1] * dstA * (1 - srcA)) / outA);
        this.buffer[idx + 2] = Math.round((b * srcA + this.buffer[idx + 2] * dstA * (1 - srcA)) / outA);
        this.buffer[idx + 3] = Math.round(outA * 255);
      }
    }
  }

  fillGradient(colorStops) {
    for (let y = 0; y < this.height; y++) {
      const t = y / this.height;
      // Interpolate color
      let c1 = colorStops[0];
      let c2 = colorStops[colorStops.length - 1];
      for (let i = 0; i < colorStops.length - 1; i++) {
        if (t >= colorStops[i].pos && t <= colorStops[i + 1].pos) {
          c1 = colorStops[i];
          c2 = colorStops[i + 1];
          break;
        }
      }
      const localT = (t - c1.pos) / (c2.pos - c1.pos || 1);
      const r = Math.round(c1.r + (c2.r - c1.r) * localT);
      const g = Math.round(c1.g + (c2.g - c1.g) * localT);
      const b = Math.round(c1.b + (c2.b - c1.b) * localT);
      for (let x = 0; x < this.width; x++) {
        this.setPixel(x, y, r, g, b, 255);
      }
    }
  }

  fillRadialGlow(cx, cy, radius, r, g, b, maxAlpha = 180) {
    for (let y = Math.max(0, cy - radius); y <= Math.min(this.height - 1, cy + radius); y++) {
      for (let x = Math.max(0, cx - radius); x <= Math.min(this.width - 1, cx + radius); x++) {
        const dist = Math.hypot(x - cx, y - cy);
        if (dist <= radius) {
          const factor = Math.cos((dist / radius) * (Math.PI / 2));
          this.setPixel(x, y, r, g, b, Math.round(maxAlpha * factor));
        }
      }
    }
  }

  fillRoundedRect(rx, ry, rw, rh, radius, r, g, b, a = 255) {
    for (let y = Math.floor(ry); y <= Math.ceil(ry + rh); y++) {
      for (let x = Math.floor(rx); x <= Math.ceil(rx + rw); x++) {
        // Test corner radiuses
        let inside = true;
        let dist = 0;
        if (x < rx + radius && y < ry + radius) {
          dist = Math.hypot(x - (rx + radius), y - (ry + radius));
          if (dist > radius) inside = false;
        } else if (x > rx + rw - radius && y < ry + radius) {
          dist = Math.hypot(x - (rx + rw - radius), y - (ry + radius));
          if (dist > radius) inside = false;
        } else if (x < rx + radius && y > ry + rh - radius) {
          dist = Math.hypot(x - (rx + radius), y - (ry + rh - radius));
          if (dist > radius) inside = false;
        } else if (x > rx + rw - radius && y > ry + rh - radius) {
          dist = Math.hypot(x - (rx + rw - radius), y - (ry + rh - radius));
          if (dist > radius) inside = false;
        }
        if (inside && x >= rx && x <= rx + rw && y >= ry && y <= ry + rh) {
          this.setPixel(x, y, r, g, b, a);
        }
      }
    }
  }

  fillGradientRoundedRect(rx, ry, rw, rh, radius, c1, c2) {
    for (let y = Math.floor(ry); y <= Math.ceil(ry + rh); y++) {
      const t = (y - ry) / rh;
      const r = Math.round(c1.r + (c2.r - c1.r) * t);
      const g = Math.round(c1.g + (c2.g - c1.g) * t);
      const b = Math.round(c1.b + (c2.b - c1.b) * t);

      for (let x = Math.floor(rx); x <= Math.ceil(rx + rw); x++) {
        let inside = true;
        if (x < rx + radius && y < ry + radius) {
          if (Math.hypot(x - (rx + radius), y - (ry + radius)) > radius) inside = false;
        } else if (x > rx + rw - radius && y < ry + radius) {
          if (Math.hypot(x - (rx + rw - radius), y - (ry + radius)) > radius) inside = false;
        } else if (x < rx + radius && y > ry + rh - radius) {
          if (Math.hypot(x - (rx + radius), y - (ry + rh - radius)) > radius) inside = false;
        } else if (x > rx + rw - radius && y > ry + rh - radius) {
          if (Math.hypot(x - (rx + rw - radius), y - (ry + rh - radius)) > radius) inside = false;
        }
        if (inside && x >= rx && x <= rx + rw && y >= ry && y <= ry + rh) {
          this.setPixel(x, y, r, g, b, 255);
        }
      }
    }
  }

  drawSparkle(cx, cy, size, r, g, b, a = 255) {
    for (let y = Math.floor(cy - size); y <= Math.ceil(cy + size); y++) {
      for (let x = Math.floor(cx - size); x <= Math.ceil(cx + size); x++) {
        const dx = Math.abs(x - cx);
        const dy = Math.abs(y - cy);
        if ((dx === 0 && dy <= size) || (dy === 0 && dx <= size) || (dx + dy <= size * 0.75)) {
          const falloff = 1 - (dx + dy) / (size * 1.5);
          if (falloff > 0) {
            this.setPixel(x, y, r, g, b, Math.round(a * falloff));
          }
        }
      }
    }
  }
}

// Generate the high-definition SVG icon
const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="100%" height="100%">
  <defs>
    <!-- Background Gradient -->
    <radialGradient id="bgGlow" cx="50%" cy="40%" r="65%">
      <stop offset="0%" stop-color="#2d124d" />
      <stop offset="60%" stop-color="#140726" />
      <stop offset="100%" stop-color="#07020d" />
    </radialGradient>

    <!-- Wallet Body Gradient (Luxury Hot Pink to Vivid Purple) -->
    <linearGradient id="walletBodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ff4b82" />
      <stop offset="45%" stop-color="#f43f5e" />
      <stop offset="85%" stop-color="#ec4899" />
      <stop offset="100%" stop-color="#a855f7" />
    </linearGradient>

    <!-- Flap Gradient -->
    <linearGradient id="flapGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#ff7597" />
      <stop offset="70%" stop-color="#e11d48" />
      <stop offset="100%" stop-color="#9333ea" />
    </linearGradient>

    <!-- Gold Metallic Clasp -->
    <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fef08a" />
      <stop offset="35%" stop-color="#facc15" />
      <stop offset="75%" stop-color="#eab308" />
      <stop offset="100%" stop-color="#ca8a04" />
    </linearGradient>

    <!-- Currency Note Gradient -->
    <linearGradient id="cashGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#34d399" />
      <stop offset="100%" stop-color="#059669" />
    </linearGradient>

    <!-- VIP Card Gradient -->
    <linearGradient id="cardGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#38bdf8" />
      <stop offset="50%" stop-color="#818cf8" />
      <stop offset="100%" stop-color="#c084fc" />
    </linearGradient>

    <!-- Glow Filter -->
    <filter id="neonGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="16" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>

    <filter id="dropShadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="18" stdDeviation="24" flood-color="#ec4899" flood-opacity="0.35" />
    </filter>
  </defs>

  <!-- Base App Background (Squircle) -->
  <rect width="512" height="512" rx="112" fill="url(#bgGlow)" />
  <rect width="510" height="510" x="1" y="1" rx="111" fill="none" stroke="#f472b6" stroke-width="2" stroke-opacity="0.2" />

  <!-- Ambient Neon Aura -->
  <circle cx="256" cy="280" r="160" fill="#ec4899" opacity="0.22" filter="url(#neonGlow)" />
  <circle cx="340" cy="200" r="100" fill="#a855f7" opacity="0.18" filter="url(#neonGlow)" />

  <!-- Peeking Currency Note -->
  <g transform="translate(140, 105) rotate(-10)">
    <rect width="180" height="110" rx="14" fill="url(#cashGrad)" stroke="#10b981" stroke-width="3" opacity="0.95" />
    <!-- Bill watermark pattern -->
    <circle cx="90" cy="55" r="26" fill="none" stroke="#a7f3d0" stroke-width="2" stroke-dasharray="4,4" />
    <text x="90" y="65" font-family="Arial, sans-serif" font-weight="900" font-size="28" fill="#ecfdf5" text-anchor="middle">₹</text>
    <circle cx="25" cy="55" r="7" fill="#6ee7b7" opacity="0.7" />
    <circle cx="155" cy="55" r="7" fill="#6ee7b7" opacity="0.7" />
  </g>

  <!-- Peeking VIP Holographic Card -->
  <g transform="translate(195, 125) rotate(14)">
    <rect width="175" height="110" rx="14" fill="url(#cardGrad)" stroke="#e0e7ff" stroke-width="2.5" opacity="0.98" />
    <!-- Chip -->
    <rect x="22" y="32" width="30" height="24" rx="4" fill="#fbbf24" stroke="#d97706" stroke-width="1.5" />
    <path d="M 22 44 L 52 44 M 37 32 L 37 56" stroke="#92400e" stroke-width="1" />
    <circle cx="140" cy="40" r="12" fill="#ffffff" opacity="0.3" />
    <circle cx="150" cy="40" r="12" fill="#ffffff" opacity="0.3" />
  </g>

  <!-- Main Wallet Body -->
  <g filter="url(#dropShadow)">
    <rect x="76" y="195" width="360" height="225" rx="36" fill="url(#walletBodyGrad)" stroke="#fda4af" stroke-width="2" stroke-opacity="0.4" />
    
    <!-- Inner Stitching Effect -->
    <rect x="88" y="207" width="336" height="201" rx="26" fill="none" stroke="#fbcfe8" stroke-width="2" stroke-dasharray="8,6" stroke-opacity="0.5" />

    <!-- Wallet Curved Front Pocket / Fold -->
    <path d="M 76 270 Q 256 310 436 270 L 436 384 Q 436 420 400 420 L 112 420 Q 76 420 76 384 Z" fill="#9d174d" opacity="0.45" />

    <!-- Wallet Flap -->
    <path d="M 76 195 L 436 195 L 436 245 C 436 275, 380 320, 256 320 C 132 320, 76 275, 76 245 Z" fill="url(#flapGrad)" stroke="#f472b6" stroke-width="3" stroke-opacity="0.6" />
    
    <!-- Flap Stitching -->
    <path d="M 88 205 L 424 205 L 424 240 C 424 265, 370 306, 256 306 C 142 306, 88 265, 88 240 Z" fill="none" stroke="#fde047" stroke-width="1.8" stroke-dasharray="6,5" stroke-opacity="0.55" />

    <!-- Gold Metallic Clasp / Heart Lock -->
    <g transform="translate(256, 310)">
      <!-- Outer Glow -->
      <circle cx="0" cy="0" r="32" fill="#fde047" opacity="0.3" filter="url(#neonGlow)" />
      <!-- Gold Disc -->
      <circle cx="0" cy="0" r="26" fill="url(#goldGrad)" stroke="#fef08a" stroke-width="2.5" />
      <circle cx="0" cy="0" r="21" fill="#ca8a04" opacity="0.3" />
      <!-- Heart Emblem on Clasp -->
      <path d="M 0 8 C -8 0, -12 -6, -12 -11 C -12 -16, -7 -19, -2 -19 C 1 -19, 0 -17, 0 -17 C 0 -17, -1 -19, 2 -19 C 7 -19, 12 -16, 12 -11 C 12 -6, 8 0, 0 8 Z" fill="#e11d48" stroke="#fda4af" stroke-width="1" />
    </g>
  </g>

  <!-- Sparkles ✨ around Wallet -->
  <!-- Top Left Sparkle -->
  <g transform="translate(90, 110)">
    <path d="M 0 -22 Q 0 0, -22 0 Q 0 0, 0 22 Q 0 0, 22 0 Q 0 0, 0 -22 Z" fill="#fde047" />
    <circle cx="0" cy="0" r="4" fill="#ffffff" />
  </g>

  <!-- Top Right Sparkle -->
  <g transform="translate(425, 115)">
    <path d="M 0 -26 Q 0 0, -26 0 Q 0 0, 0 26 Q 0 0, 26 0 Q 0 0, 0 -26 Z" fill="#f472b6" />
    <circle cx="0" cy="0" r="5" fill="#ffffff" />
  </g>

  <!-- Bottom Left Small Sparkle -->
  <g transform="translate(68, 380)">
    <path d="M 0 -14 Q 0 0, -14 0 Q 0 0, 0 14 Q 0 0, 14 0 Q 0 0, 0 -14 Z" fill="#fbcfe8" />
  </g>

  <!-- Bottom Right Gold Sparkle -->
  <g transform="translate(435, 360)">
    <path d="M 0 -16 Q 0 0, -16 0 Q 0 0, 0 16 Q 0 0, 16 0 Q 0 0, 0 -16 Z" fill="#fde047" />
  </g>

  <!-- Subtitle Tagline Pill -->
  <g transform="translate(256, 464)">
    <rect x="-80" y="-14" width="160" height="28" rx="14" fill="#1e1035" stroke="#f472b6" stroke-width="1.5" stroke-opacity="0.4" />
    <text x="0" y="5" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-weight="800" font-size="12" fill="#f9a8d4" text-anchor="middle" letter-spacing="1.5">PINKLEDGER</text>
  </g>
</svg>`;

// Save SVG icons
fs.writeFileSync(path.join(iconsDir, 'icon.svg'), svgContent, 'utf-8');
fs.writeFileSync(path.join(rootDir, 'public', 'favicon.svg'), svgContent, 'utf-8');
console.log('✅ Generated public/icons/icon.svg & public/favicon.svg');

// Render a raster PNG representation of the wallet icon
function renderWalletIcon(size, isMaskable = false) {
  const canvas = new PixelCanvas(size, size);
  const scale = size / 512;

  // Background
  if (isMaskable) {
    // Full bleed background for maskable icons
    canvas.fillGradient([
      { pos: 0.0, r: 45, g: 18, b: 77 },
      { pos: 0.5, r: 20, g: 7, b: 38 },
      { pos: 1.0, r: 7, g: 2, b: 13 }
    ]);
  } else {
    // Rounded squircle background for standard icons
    const cornerRadius = 112 * scale;
    canvas.fillRoundedRect(0, 0, size, size, cornerRadius, 10, 5, 18, 255);
    canvas.fillGradientRoundedRect(0, 0, size, size, cornerRadius,
      { r: 45, g: 18, b: 77 },
      { r: 10, g: 3, b: 20 }
    );
  }

  // Neon Radial glow center
  canvas.fillRadialGlow(
    Math.round(256 * scale),
    Math.round(270 * scale),
    Math.round(180 * scale),
    236, 72, 153,
    90
  );

  // Peeking Cash note (green)
  const cashW = Math.round(170 * scale);
  const cashH = Math.round(95 * scale);
  const cashX = Math.round(145 * scale);
  const cashY = Math.round(135 * scale);
  canvas.fillRoundedRect(cashX, cashY, cashW, cashH, 12 * scale, 16, 185, 129, 240);
  canvas.fillRoundedRect(cashX + 4, cashY + 4, cashW - 8, cashH - 8, 8 * scale, 52, 211, 153, 255);

  // Peeking VIP Card (purple/cyan)
  const cardW = Math.round(165 * scale);
  const cardH = Math.round(95 * scale);
  const cardX = Math.round(210 * scale);
  const cardY = Math.round(150 * scale);
  canvas.fillRoundedRect(cardX, cardY, cardW, cardH, 12 * scale, 56, 189, 248, 245);
  canvas.fillGradientRoundedRect(cardX + 3, cardY + 3, cardW - 6, cardH - 6, 8 * scale,
    { r: 56, g: 189, b: 248 },
    { r: 192, g: 132, b: 252 }
  );

  // Main Wallet Body (Hot Pink to Violet Gradient)
  const bodyX = Math.round(80 * scale);
  const bodyY = Math.round(205 * scale);
  const bodyW = Math.round(352 * scale);
  const bodyH = Math.round(205 * scale);
  const bodyR = Math.round(34 * scale);

  // Drop shadow
  canvas.fillRoundedRect(bodyX, bodyY + Math.round(8 * scale), bodyW, bodyH, bodyR, 150, 20, 80, 110);
  
  // Wallet base
  canvas.fillGradientRoundedRect(bodyX, bodyY, bodyW, bodyH, bodyR,
    { r: 255, g: 75, b: 130 },
    { r: 147, g: 51, b: 234 }
  );

  // Front pouch darker shade
  const pouchY = Math.round(270 * scale);
  const pouchH = Math.round(140 * scale);
  canvas.fillRoundedRect(bodyX, pouchY, bodyW, pouchH, bodyR, 157, 23, 77, 85);

  // Wallet Flap
  const flapX = bodyX;
  const flapY = bodyY;
  const flapW = bodyW;
  const flapH = Math.round(110 * scale);
  canvas.fillGradientRoundedRect(flapX, flapY, flapW, flapH, bodyR,
    { r: 255, g: 117, b: 151 },
    { r: 225, g: 29, b: 72 }
  );

  // Golden Metallic Clasp Disc
  const claspCx = Math.round(256 * scale);
  const claspCy = Math.round(315 * scale);
  const claspRadius = Math.round(25 * scale);

  // Glow
  canvas.fillRadialGlow(claspCx, claspCy, Math.round(36 * scale), 254, 240, 138, 140);

  // Gold circle
  for (let dy = -claspRadius; dy <= claspRadius; dy++) {
    for (let dx = -claspRadius; dx <= claspRadius; dx++) {
      const d = Math.hypot(dx, dy);
      if (d <= claspRadius) {
        const factor = (dy + claspRadius) / (claspRadius * 2);
        const r = Math.round(254 - 50 * factor);
        const g = Math.round(240 - 70 * factor);
        const b = Math.round(138 - 120 * factor);
        canvas.setPixel(claspCx + dx, claspCy + dy, r, g, b, 255);
      }
    }
  }

  // Heart center in clasp
  const heartR = Math.round(10 * scale);
  for (let dy = -heartR; dy <= heartR; dy++) {
    for (let dx = -heartR; dx <= heartR; dx++) {
      if (Math.hypot(dx, dy) <= heartR * 0.75) {
        canvas.setPixel(claspCx + dx, claspCy + dy, 225, 29, 72, 255);
      }
    }
  }

  // Sparkles
  canvas.drawSparkle(Math.round(95 * scale), Math.round(120 * scale), Math.round(20 * scale), 253, 224, 71, 255);
  canvas.drawSparkle(Math.round(420 * scale), Math.round(125 * scale), Math.round(24 * scale), 244, 114, 182, 255);
  canvas.drawSparkle(Math.round(430 * scale), Math.round(370 * scale), Math.round(16 * scale), 253, 224, 71, 240);
  canvas.drawSparkle(Math.round(80 * scale), Math.round(390 * scale), Math.round(14 * scale), 251, 207, 232, 220);

  return canvas.buffer;
}

// Generate all required PNG files
const sizesToGenerate = [
  { file: 'icon-192x192.png', size: 192, maskable: false },
  { file: 'icon-512x512.png', size: 512, maskable: false },
  { file: 'icon-maskable-192x192.png', size: 192, maskable: true },
  { file: 'icon-maskable-512x512.png', size: 512, maskable: true },
  { file: 'apple-touch-icon.png', size: 180, maskable: false },
];

for (const target of sizesToGenerate) {
  const rgba = renderWalletIcon(target.size, target.maskable);
  const png = createPng(target.size, target.size, rgba);
  const outPath = path.join(iconsDir, target.file);
  fs.writeFileSync(outPath, png);
  console.log(`✅ Generated ${target.file} (${target.size}x${target.size}, ${png.length} bytes)`);
}

// Also write favicon.png in public root
const favRgba = renderWalletIcon(64, false);
const favPng = createPng(64, 64, favRgba);
fs.writeFileSync(path.join(rootDir, 'public', 'favicon.png'), favPng);
console.log('✅ Generated public/favicon.png');
