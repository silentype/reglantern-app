#!/usr/bin/env node
/**
 * push-tokens-to-figma.mjs
 *
 * Reads tokens/tokens.json and creates native Figma Variables via the REST API.
 * Requires a Figma Personal Access Token with file_content:write + variables:write.
 *
 * Usage:
 *   FIGMA_TOKEN=figd_xxx node scripts/push-tokens-to-figma.mjs
 */

import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const FILE_KEY    = 'oGbyq96g9IQCvH6oTUgn7o';
const FIGMA_TOKEN = process.env.FIGMA_TOKEN;

if (!FIGMA_TOKEN) {
  console.error('❌  FIGMA_TOKEN env var is required.');
  console.error('    Usage: FIGMA_TOKEN=figd_xxx node scripts/push-tokens-to-figma.mjs');
  process.exit(1);
}

const tokens = JSON.parse(
  readFileSync(resolve(__dirname, '../tokens/tokens.json'), 'utf8')
);

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Flatten nested token object into [{path, value, type, description}] */
function flattenTokens(obj, prefix = '') {
  const out = [];
  for (const [key, val] of Object.entries(obj)) {
    const path = prefix ? `${prefix}.${key}` : key;
    if (val && typeof val === 'object' && 'value' in val && 'type' in val) {
      out.push({ path, value: val.value, type: val.type, description: val.description ?? '' });
    } else if (val && typeof val === 'object') {
      out.push(...flattenTokens(val, path));
    }
  }
  return out;
}

/** Expand shorthand hex (#fc6 → #ffcc66) and convert to Figma RGBA {r,g,b,a} */
function hexToRgba(hex) {
  if (!hex || typeof hex !== 'string') return null;
  if (hex === 'transparent') return { r: 0, g: 0, b: 0, a: 0 };
  let h = hex.replace('#', '');
  if (h.length === 3) h = h.split('').map(c => c + c).join('');
  if (h.length !== 6) return null;
  return {
    r: parseInt(h.slice(0, 2), 16) / 255,
    g: parseInt(h.slice(2, 4), 16) / 255,
    b: parseInt(h.slice(4, 6), 16) / 255,
    a: 1,
  };
}

const stripPx = v => parseFloat(String(v).replace('px', ''));

const isRef      = v => typeof v === 'string' && v.startsWith('{') && v.endsWith('}');
const parseRef   = v => v.slice(1, -1);
const pathToTemp = p => 'temp-' + p.replace(/\./g, '-');

function figmaType(tokenType) {
  switch (tokenType) {
    case 'color':                                return 'COLOR';
    case 'spacing':
    case 'borderRadius':
    case 'fontSizes':
    case 'fontWeights':
    case 'lineHeights':
    case 'sizing':                               return 'FLOAT';
    default:                                     return 'STRING';
  }
}

function figmaValue(token, fType) {
  const { value } = token;

  if (isRef(value)) {
    return { type: 'VARIABLE_ALIAS', id: pathToTemp(parseRef(value)) };
  }

  if (fType === 'COLOR') {
    // Skip oklch — Figma REST API only accepts RGBA
    if (typeof value === 'string' && value.startsWith('oklch')) return null;
    return hexToRgba(value);
  }

  if (fType === 'FLOAT') return stripPx(value);

  return String(value);
}

// ─── Build payload ─────────────────────────────────────────────────────────────

const flat = flattenTokens(tokens);

const SETS = {
  core:      '🎨 Core',
  semantic:  '🔤 Semantic',
  component: '🧩 Component',
};

const variableCollections = [];
const variableModes       = [];
const variables           = [];
const variableModeValues  = [];

let skipped = 0;

for (const [set, label] of Object.entries(SETS)) {
  const colId  = `temp-collection-${set}`;
  const modeId = `temp-mode-${set}`;

  variableCollections.push({ action: 'CREATE', id: colId, name: label, initialModeId: modeId });
  variableModes.push({ action: 'CREATE', id: modeId, name: 'Default', variableCollectionId: colId });

  for (const token of flat.filter(t => t.path.startsWith(`${set}.`))) {
    const fType = figmaType(token.type);
    const val   = figmaValue(token, fType);

    if (val === null) { skipped++; continue; }

    const tempId = pathToTemp(token.path);
    const name   = token.path.slice(set.length + 1).replace(/\./g, '/');

    variables.push({
      action: 'CREATE',
      id: tempId,
      name,
      variableCollectionId: colId,
      resolvedType: fType,
      description: token.description,
    });

    variableModeValues.push({ variableId: tempId, modeId, value: val });
  }
}

// ─── API call ──────────────────────────────────────────────────────────────────

console.log(`\n📦  Collections : ${variableCollections.length}`);
console.log(`🔵  Variables   : ${variables.length}  (${skipped} oklch skipped)`);
console.log(`🔗  Values      : ${variableModeValues.length}`);
console.log('\nPushing to Figma…\n');

const res = await fetch(`https://api.figma.com/v1/files/${FILE_KEY}/variables`, {
  method:  'POST',
  headers: { 'X-Figma-Token': FIGMA_TOKEN, 'Content-Type': 'application/json' },
  body:    JSON.stringify({ variableCollections, variableModes, variables, variableModeValues }),
});

const json = await res.json();

if (!res.ok) {
  console.error('❌  Figma API error:', JSON.stringify(json, null, 2));
  process.exit(1);
}

const created = json.meta?.variables ? Object.keys(json.meta.variables).length : '?';
console.log(`✅  Done! ${created} variables created in Figma.`);
console.log(`   Open your file: https://www.figma.com/design/${FILE_KEY}/`);
