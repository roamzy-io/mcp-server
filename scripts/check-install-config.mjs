#!/usr/bin/env node
// Guards against the install snippet drifting between the two places that carry it.
//
// `.mcp.json` exists so scanners that follow the Open Plugins standard (Cursor
// Directory among them) can auto-detect this server instead of us hand-typing
// metadata into a web form. README.md carries the same object because that is
// what a human copies into their client config.
//
// Two copies of the same fact is exactly the shape that rots quietly: change the
// package name or the npx flags in one, and the other keeps telling people the
// old thing until someone files a bug. So: assert that some ```json block in the
// README parses to precisely the contents of `.mcp.json`.
//
// Deliberately not a generator — the README block sits inside prose that explains
// it, and generating into that context costs more than it saves. A check is
// enough, because the failure mode we care about is silence, not effort.

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

const declared = JSON.parse(readFileSync(join(root, '.mcp.json'), 'utf8'));
const readme = readFileSync(join(root, 'README.md'), 'utf8');

// Every fenced ```json block in the README, parsed leniently — a block that isn't
// valid JSON is simply not a candidate, not an error.
const blocks = [...readme.matchAll(/```json\s*\n([\s\S]*?)```/g)]
  .map((m) => {
    try {
      return JSON.parse(m[1]);
    } catch {
      return null;
    }
  })
  .filter(Boolean);

const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);

if (!blocks.some((b) => same(b, declared))) {
  console.error(
    'check-install-config: no ```json block in README.md matches .mcp.json.\n' +
      '\n.mcp.json declares:\n' +
      JSON.stringify(declared, null, 2) +
      '\n\nIf you changed one on purpose, change the other in the same commit.\n' +
      `Candidate JSON blocks found in README: ${blocks.length}`,
  );
  process.exit(1);
}

console.log('check-install-config: README install snippet matches .mcp.json ✓');
