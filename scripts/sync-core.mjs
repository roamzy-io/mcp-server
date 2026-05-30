// scripts/sync-core.mjs — vendor the canonical MCP tool-factory into this
// standalone repo so it builds WITHOUT the monorepo (../../shared).
//
// Single source of truth = product/shared/src/mcp-core.ts (the SAME factory
// powers the remote Streamable HTTP endpoint). This script copies it to
// src/mcp-core.ts (committed) so `esbuild` can bundle it from a fresh GitHub
// clone where ../../shared does not exist.
//
// Runs as `prebuild` in the monorepo (re-vendors on every build → no drift).
// In a standalone clone the source is absent → no-op, and the committed
// vendored copy is used. Idempotent.
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const SRC = resolve(here, '../../shared/src/mcp-core.ts'); // monorepo canonical
const DST = resolve(here, '../src/mcp-core.ts');           // vendored (committed)

if (!existsSync(SRC)) {
  console.log('[sync-core] monorepo source not found (standalone build) — using committed vendored src/mcp-core.ts');
  process.exit(0);
}

const banner =
  '// AUTO-VENDORED from product/shared/src/mcp-core.ts — DO NOT EDIT HERE.\n' +
  '// Edit the canonical source in the monorepo and run `npm run sync-core`.\n' +
  '// esbuild bundles this into dist/index.js for the standalone npm package.\n\n';

const body = readFileSync(SRC, 'utf8');
writeFileSync(DST, banner + body);
console.log(`[sync-core] vendored mcp-core.ts (${body.length} bytes) from monorepo source.`);
