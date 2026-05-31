/**
 * @roamzy/mcp-server — stdio entrypoint for the Roamzy global eSIM MCP server.
 *
 * Thin wrapper over the SHARED factory `buildRoamzyMcpServer` (Phase A1,
 * 2026-05-29). All tool definitions + dispatch live in
 * `product/shared/src/mcp-core.ts` — the SAME factory powers the remote
 * Streamable HTTP endpoint at https://roamzy.io/mcp. One source of truth for
 * the 12 tools; this file only wires the stdio transport + env config.
 *
 * INSTALL (Claude Desktop / Cursor / Continue / any MCP client):
 *
 *   {
 *     "mcpServers": {
 *       "roamzy": {
 *         "command": "npx",
 *         "args": ["-y", "https://roamzy.io/mcp/roamzy-mcp-latest.tgz"]
 *       }
 *     }
 *   }
 *
 * Anonymous mode by default — the first authed call mints a fresh anon
 * Roamzy account via POST /api/v1/anon-session and caches the token IN THIS
 * PROCESS only (per-instance closure state in the factory; no module
 * globals — safe for the shared HTTP transport too). To use a pre-existing
 * account, set ROAMZY_API_TOKEN (purchase tools also require
 * ROAMZY_ENABLE_PURCHASE=true in that mode).
 *
 * SECURITY: HTTP-only, no filesystem, no child processes, outbound only to
 * roamzy.io. Bundled self-contained via esbuild (the shared factory is
 * inlined at build time).
 */
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
// Vendored from product/shared/src/mcp-core.ts (single source of truth) by
// `npm run sync-core` / prebuild — so this repo builds standalone off GitHub.
import { buildRoamzyMcpServer } from './mcp-core';

const server = buildRoamzyMcpServer({
  apiBase: process.env.ROAMZY_API_BASE ?? 'https://roamzy.io/api/v1',
  initialApiToken: process.env.ROAMZY_API_TOKEN ?? '',
  allowPurchase: process.env.ROAMZY_ENABLE_PURCHASE === 'true',
});

const transport = new StdioServerTransport();
await server.connect(transport);

// Graceful shutdown — Claude Desktop sends SIGTERM on quit. Exit cleanly so
// the stdio transport doesn't leave a half-closed pipe.
process.on('SIGTERM', () => process.exit(0));
process.on('SIGINT', () => process.exit(0));
