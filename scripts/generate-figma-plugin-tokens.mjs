#!/usr/bin/env node
/**
 * generate-figma-plugin-tokens.mjs
 *
 * Reads tokens/tokens.json (the single source of truth) and regenerates the
 * TOKENS constant in figma-plugin/code.js. Never hand-edit that constant —
 * edit tokens.json and re-run this script instead.
 *
 * Usage:
 *   node scripts/generate-figma-plugin-tokens.mjs
 */

import { readFileSync, writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const tokensPath = resolve(__dirname, '../tokens/tokens.json');
const codePath = resolve(__dirname, '../figma-plugin/code.js');

const tokens = JSON.parse(readFileSync(tokensPath, 'utf8'));

/** Flatten a token tree into [{path, value, type}], skipping _meta. */
function flatten(obj, prefix, out) {
  for (const [key, val] of Object.entries(obj)) {
    if (key === '_meta') continue;
    const path = prefix ? `${prefix}.${key}` : key;
    if (val && typeof val === 'object' && 'value' in val && 'type' in val) {
      out.push({ path, value: val.value, type: val.type });
    } else if (val && typeof val === 'object') {
      flatten(val, path, out);
    }
  }
  return out;
}

const flat = flatten(tokens, '', []);
const byPath = new Map(flat.map((t) => [t.path, t]));

const isRef = (v) => typeof v === 'string' && v.startsWith('{') && v.endsWith('}');
const parseRef = (v) => v.slice(1, -1);

/** Resolve a token's value to its final literal, following {a.b.c} chains. */
function resolve_(token, seen = new Set()) {
  if (!isRef(token.value)) return token.value;
  const refPath = parseRef(token.value);
  if (seen.has(refPath)) throw new Error(`Circular reference: ${[...seen, refPath].join(' -> ')}`);
  const target = byPath.get(refPath);
  if (!target) throw new Error(`Unresolved reference "${refPath}" from "${token.path}"`);
  return resolve_(target, new Set([...seen, refPath]));
}

function figmaType(tokenType) {
  switch (tokenType) {
    case 'color':
      return 'COLOR';
    case 'spacing':
    case 'borderRadius':
    case 'fontSizes':
    case 'fontWeights':
    case 'sizing':
      return 'FLOAT';
    default:
      return 'STRING';
  }
}

/** Build the {core: {...}, semantic: {...}, component: {...}} shape code.js expects. */
const SETS = ['core', 'semantic', 'component'];
const out = {};

for (const set of SETS) {
  out[set] = {};
  for (const token of flat.filter((t) => t.path.startsWith(`${set}.`))) {
    // Figma variable name: everything after the set prefix, minus the leading
    // "color." segment (Figma doesn't need that grouping in the flat name).
    const rest = token.path.slice(set.length + 1).replace(/^color\./, '');
    const name = rest.replace(/\./g, '/');
    const fType = figmaType(token.type);
    const resolved = resolve_(token);
    const value = fType === 'FLOAT' ? Number(resolved) : resolved;
    out[set][name] = { type: fType, value };
  }
}

function serializeSet(obj) {
  const lines = Object.entries(obj).map(([name, { type, value }]) => {
    const v = typeof value === 'string' ? JSON.stringify(value) : value;
    return `    ${JSON.stringify(name)}: { type: ${JSON.stringify(type)}, value: ${v} },`;
  });
  return lines.join('\n');
}

const tokensBlock = `const TOKENS = {
  core: {
${serializeSet(out.core)}
  },
  semantic: {
${serializeSet(out.semantic)}
  },
  component: {
${serializeSet(out.component)}
  },
};`;

const current = readFileSync(codePath, 'utf8');
const blockRe = /const TOKENS = \{[\s\S]*?\n\};/;

if (!blockRe.test(current)) {
  console.error('❌  Could not find "const TOKENS = { ... };" block in figma-plugin/code.js — aborting.');
  process.exit(1);
}

const updated = current.replace(blockRe, tokensBlock);
const counts = SETS.map((s) => `${s}: ${Object.keys(out[s]).length}`).join(', ');

if (updated === current) {
  console.log(`✅  figma-plugin/code.js already up to date with tokens/tokens.json (${counts})`);
} else {
  writeFileSync(codePath, updated);
  console.log(`✅  figma-plugin/code.js regenerated from tokens/tokens.json (${counts})`);
}
