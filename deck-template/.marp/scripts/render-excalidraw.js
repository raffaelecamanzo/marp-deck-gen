#!/usr/bin/env node
/**
 * Minimal Excalidraw → PNG renderer.
 * Uses @napi-rs/canvas (available as n8n transitive dep) for rendering.
 * Handles: rectangle, text, arrow elements.
 */
const { createCanvas, GlobalFonts } = require('@napi-rs/canvas');
const fs = require('fs');
const path = require('path');

// Register Excalidraw fonts so el.fontFamily values render correctly
const VIRGIL_PATH = path.join(__dirname, '..', 'assets', 'fonts', 'Virgil.woff2');
if (fs.existsSync(VIRGIL_PATH)) GlobalFonts.registerFromPath(VIRGIL_PATH, 'Virgil');

// Excalidraw fontFamily: 1=Virgil, 2=Cascadia (monospace), 3=Assistant (sans-serif)
const FONT_FAMILY_MAP = {
  1: '"Virgil", "Bradley Hand", cursive',
  2: '"Cascadia Code", "Courier New", monospace',
  3: 'Arial, sans-serif',
};

const [inputFile, outputFile] = process.argv.slice(2);
if (!inputFile || !outputFile) {
  console.error('Usage: node render-excalidraw.js <input.excalidraw> <output.png>');
  process.exit(1);
}

const data = JSON.parse(fs.readFileSync(inputFile, 'utf-8'));
const elements = data.elements.filter(el => !el.isDeleted);

// Calculate bounding box across all elements
let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
for (const el of elements) {
  if (el.type === 'text' || el.type === 'rectangle' || el.type === 'ellipse') {
    minX = Math.min(minX, el.x);
    minY = Math.min(minY, el.y);
    maxX = Math.max(maxX, el.x + el.width);
    maxY = Math.max(maxY, el.y + el.height);
  } else if (el.type === 'arrow' && el.points) {
    for (const [px, py] of el.points) {
      minX = Math.min(minX, el.x + px);
      minY = Math.min(minY, el.y + py);
      maxX = Math.max(maxX, el.x + px);
      maxY = Math.max(maxY, el.y + py);
    }
  }
}

const PADDING = 24;
const scale = 2; // 2× for retina-quality PNG
const canvasW = ((maxX - minX) + PADDING * 2) * scale;
const canvasH = ((maxY - minY) + PADDING * 2) * scale;
const ox = (-minX + PADDING) * scale;
const oy = (-minY + PADDING) * scale;

const canvas = createCanvas(Math.round(canvasW), Math.round(canvasH));
const ctx = canvas.getContext('2d');

// White background
ctx.fillStyle = data.appState?.viewBackgroundColor || '#ffffff';
ctx.fillRect(0, 0, canvasW, canvasH);

const tx = x => (x * scale) + ox;
const ty = y => (y * scale) + oy;
const ts = v => v * scale;

// --- Rectangles ---
const rects = elements.filter(el => el.type === 'rectangle');
for (const el of rects) {
  ctx.save();
  const x = tx(el.x), y = ty(el.y), w = ts(el.width), h = ts(el.height);
  if (el.fillStyle === 'solid' && el.backgroundColor && el.backgroundColor !== 'transparent') {
    ctx.fillStyle = el.backgroundColor;
    ctx.fillRect(x, y, w, h);
  }
  if (el.strokeColor && el.strokeColor !== 'transparent') {
    ctx.strokeStyle = el.strokeColor;
    ctx.lineWidth = ts(el.strokeWidth || 2);
    ctx.strokeRect(x, y, w, h);
  }
  ctx.restore();
}

// --- Ellipses ---
const ellipses = elements.filter(el => el.type === 'ellipse');
for (const el of ellipses) {
  ctx.save();
  const cx = tx(el.x + el.width / 2);
  const cy = ty(el.y + el.height / 2);
  const rx = ts(el.width / 2);
  const ry = ts(el.height / 2);
  ctx.beginPath();
  ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
  if (el.fillStyle === 'solid' && el.backgroundColor && el.backgroundColor !== 'transparent') {
    ctx.fillStyle = el.backgroundColor;
    ctx.fill();
  }
  if (el.strokeColor && el.strokeColor !== 'transparent') {
    ctx.strokeStyle = el.strokeColor;
    ctx.lineWidth = ts(el.strokeWidth || 2);
    ctx.stroke();
  }
  ctx.restore();
}

// --- Arrows ---
const arrows = elements.filter(el => el.type === 'arrow');
for (const el of arrows) {
  if (!el.points || el.points.length < 2) continue;
  ctx.save();
  ctx.strokeStyle = el.strokeColor || '#2d2d2d';
  ctx.fillStyle = el.strokeColor || '#2d2d2d';
  ctx.lineWidth = ts(el.strokeWidth || 2);

  const pts = el.points.map(([px, py]) => [tx(el.x + px), ty(el.y + py)]);
  ctx.beginPath();
  ctx.moveTo(pts[0][0], pts[0][1]);
  for (let i = 1; i < pts.length; i++) {
    ctx.lineTo(pts[i][0], pts[i][1]);
  }
  ctx.stroke();

  // Arrowhead (triangle)
  if (el.endArrowhead) {
    const last = pts[pts.length - 1];
    const prev = pts[pts.length - 2];
    const angle = Math.atan2(last[1] - prev[1], last[0] - prev[0]);
    const hl = ts(11);
    ctx.beginPath();
    ctx.moveTo(last[0], last[1]);
    ctx.lineTo(last[0] - hl * Math.cos(angle - Math.PI / 6), last[1] - hl * Math.sin(angle - Math.PI / 6));
    ctx.lineTo(last[0] - hl * Math.cos(angle + Math.PI / 6), last[1] - hl * Math.sin(angle + Math.PI / 6));
    ctx.closePath();
    ctx.fill();
  }
  ctx.restore();
}

// --- Text (skip text elements with transparent stroke = contained labels) ---
const texts = elements.filter(el => el.type === 'text');
for (const el of texts) {
  if (!el.text) continue;
  ctx.save();
  // Contained text: use dark color; standalone text: use strokeColor
  const color = (el.strokeColor && el.strokeColor !== 'transparent') ? el.strokeColor : '#2d2d2d';
  ctx.fillStyle = color;
  const fontSize = ts(el.fontSize || 16);
  const fontFamily = FONT_FAMILY_MAP[el.fontFamily] || 'Arial, sans-serif';
  ctx.font = `${fontSize}px ${fontFamily}`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  const cx = tx(el.x + el.width / 2);
  const cy = ty(el.y + el.height / 2);
  const lines = el.text.split('\n');
  const lineH = fontSize * 1.3;
  const totalH = lines.length * lineH;
  for (let i = 0; i < lines.length; i++) {
    const ly = cy - totalH / 2 + (i + 0.5) * lineH;
    ctx.fillText(lines[i], cx, ly);
  }
  ctx.restore();
}

const buffer = canvas.toBuffer('image/png');
fs.writeFileSync(outputFile, buffer);

const finalW = Math.round(canvasW);
const finalH = Math.round(canvasH);
console.log(`Written: ${outputFile} (${finalW}×${finalH}, ratio=${(finalW/finalH).toFixed(2)})`);
