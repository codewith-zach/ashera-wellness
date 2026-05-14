/**
 * Generates minimal valid PWA PNG icons using raw PNG byte generation.
 * No external dependencies — only Node.js built-ins.
 */
import { createWriteStream } from 'fs';
import { createDeflate } from 'zlib';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function crc32(buf) {
  const table = new Uint32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let j = 0; j < 8; j++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    table[i] = c;
  }
  let crc = 0xffffffff;
  for (const b of buf) crc = table[(crc ^ b) & 0xff] ^ (crc >>> 8);
  return (crc ^ 0xffffffff) >>> 0;
}

function uint32be(n) {
  const b = Buffer.alloc(4);
  b.writeUInt32BE(n);
  return b;
}

function pngChunk(type, data) {
  const typeBytes = Buffer.from(type);
  const len = uint32be(data.length);
  const crc = uint32be(crc32(Buffer.concat([typeBytes, data])));
  return Buffer.concat([len, typeBytes, data, crc]);
}

async function deflateSync(data) {
  return new Promise((resolve, reject) => {
    const deflate = createDeflate({ level: 6 });
    const chunks = [];
    deflate.on('data', (c) => chunks.push(c));
    deflate.on('end', () => resolve(Buffer.concat(chunks)));
    deflate.on('error', reject);
    deflate.end(data);
  });
}

async function generateIcon(size, outPath) {
  // Sage green (#7A9E7E) background with a white ✿ (rendered as coloured circle)
  const bg = { r: 0x7a, g: 0x9e, b: 0x7e };
  const cream = { r: 0xf5, g: 0xf0, b: 0xea };

  const pixels = [];
  const r2 = (size / 2) * (size / 2);
  const border = size * 0.06;
  const innerR = ((size / 2) - border) * ((size / 2) - border);

  for (let y = 0; y < size; y++) {
    pixels.push(0); // filter byte
    for (let x = 0; x < size; x++) {
      const dx = x - size / 2;
      const dy = y - size / 2;
      const dist = dx * dx + dy * dy;
      let col;
      if (dist > r2) {
        // Outside circle — transparent background
        col = cream;
      } else if (dist > innerR) {
        col = { r: 0x4a, g: 0x70, b: 0x50 }; // sage dark ring
      } else {
        col = bg;
        // Draw a simple cross/flower shape in cream
        const cx = Math.abs(dx) / (size / 2);
        const cy = Math.abs(dy) / (size / 2);
        const inPetal =
          (cx < 0.12 && cy < 0.45) ||
          (cy < 0.12 && cx < 0.45) ||
          (Math.abs(cx - cy) < 0.09 && cx < 0.38);
        if (inPetal) col = cream;
      }
      pixels.push(col.r, col.g, col.b);
    }
  }

  const rawData = Buffer.from(pixels);
  const compressed = await deflateSync(rawData);

  const IHDR = Buffer.alloc(13);
  IHDR.writeUInt32BE(size, 0);
  IHDR.writeUInt32BE(size, 4);
  IHDR[8] = 8; // bit depth
  IHDR[9] = 2; // RGB
  IHDR[10] = 0; IHDR[11] = 0; IHDR[12] = 0;

  const png = Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]), // PNG sig
    pngChunk('IHDR', IHDR),
    pngChunk('IDAT', compressed),
    pngChunk('IEND', Buffer.alloc(0)),
  ]);

  await new Promise((resolve, reject) => {
    const ws = createWriteStream(outPath);
    ws.on('finish', resolve);
    ws.on('error', reject);
    ws.end(png);
  });
  console.log(`Generated ${outPath} (${size}x${size})`);
}

const base = path.join(__dirname, '..', 'public', 'icons');
await generateIcon(192, path.join(base, 'icon-192.png'));
await generateIcon(512, path.join(base, 'icon-512.png'));
console.log('Icons generated.');
