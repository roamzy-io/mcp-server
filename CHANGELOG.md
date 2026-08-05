# Changelog

## [1.6.5] — 2026-08-05

### Added

- **Every tool now declares an `outputSchema`, and the server returns
  `structuredContent` to match it.** Callers had only prose to work with: an agent
  wanting the rate for one country had to re-parse a JSON string it was handed as
  text. The two halves ship together on purpose — MCP 2025-06-18 obliges a server
  that advertises a schema to send the structured payload, and a schema with
  nothing behind it is worse than none, because callers build on the promise. The
  text block is still sent alongside, so clients that never read the structured
  field are unaffected. Schemas are derived from live responses and stay
  permissive: `required` lists only fields present on every response, and nothing
  sets `additionalProperties: false`.
- **Tool annotations** (`title`, `readOnlyHint`, `destructiveHint`,
  `idempotentHint`, `openWorldHint`). Not decoration: without them a careful
  client must treat "what does data cost in Japan" as possibly destructive and
  stop to ask the user for permission. Eleven tools are read-only and idempotent.
  `roamzy_create_order` is neither, and says so — every call mints a new order and
  a new invoice, so a client that retried it on a timeout would charge the user
  twice.

### Fixed

- The outgoing `User-Agent` said `roamzy-mcp/1.5` — a version typed by hand and
  last correct months ago. It is now derived from `ROAMZY_MCP_VERSION`, closing
  the last of the hardcoded copies 1.6.4 started removing.

No tool was renamed and no input schema changed: still 12 tools, 193 countries,
anonymous by default.

## [1.6.4] — 2026-08-05

### Fixed

- **The server now introduces itself with its real version.** Published 1.6.3
  contained code that answered `initialize` with `serverInfo.version: "1.6.0"`.
  The constant was corrected in the monorepo on 2026-07-22, a month after the
  artifact was published, and the package was never rebuilt — so every client
  that connected over stdio was told 1.6.0. Found by running a clean
  `npx -y @roamzy/mcp-server` before submitting to a marketplace, which is
  exactly what that pre-flight check is for.

### Changed

- The version is read from one place instead of six. `ROAMZY_MCP_VERSION` in
  `shared/src/mcp-core.ts` is now re-exported and consumed by the MCP server
  card, the `/api/v1` manifest and their tests, all of which previously carried
  a hardcoded string. A release can no longer be half-applied.

No tool, schema or behaviour changes: still 12 tools, 193 countries, anonymous
by default.

All notable changes to `@roamzy/mcp-server` are recorded here.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.6.3] — 2026-06-21

> Earn-distribution: surface the agent-to-agent referral flywheel.

### Changed

- **`roamzy_referral` description** now makes the agent-to-agent referral loop
  explicit: share your link with ANYONE you recommend Roamzy to — a human user
  OR another AI agent — and the referred agent (anonymous-first) starts earning
  too, so the chain compounds across agents.
- **README** now leads with the earn angle ("agents don't just buy — they earn")
  and the 193-country figure (was 192 in 3 spots).
- **`GET /api/v1/referral`** response adds a ready-to-relay `share_text` blurb an
  agent can pass to another agent, and a sharper agent-to-agent `hint`.
- GitHub repo description updated to lead with agent-native + earn + 193.
  Descriptions/docs only — no tool/schema/behaviour change; tool count stays 12.

## [1.6.2] — 2026-06-21

> Factual correction. Country count updated to 193.

### Changed

- **Tool descriptions: country count 192 → 193** in `roamzy_list_countries`,
  `roamzy_country_detail`, and `roamzy_create_order` (including the pitch
  opener the agent speaks to the user). Roamzy now covers 193 countries
  (Australia was added). No tool / schema / behaviour change — descriptions
  only. Tool count stays 12.

## [1.6.1] — 2026-06-04

> Localization cleanup. Tool descriptions are now fully English.

### Changed

- **Tool descriptions: removed hardcoded Russian phrases** from
  `roamzy_payment_options`, `roamzy_get_esim`, and `roamzy_create_order`.
  The agent-facing prompts (pitch opener, top-up question, payment-method
  question, QR caption, claim-link recovery framing) were forcing Russian
  user-facing text regardless of the user's language. They are now English
  and language-neutral, so the agent naturally mirrors the user's language.
  No tool/schema/behaviour change — descriptions only. Tool count stays 12.

## [1.6.0] — 2026-05-31

> Agent-earn release. Agents can now earn referral commissions.

### Added

- **`roamzy_referral` tool** (read-only): returns your referral link + earnings.
  Roamzy pays 20% (default) of every cash payment made by accounts that join
  through your link — forever, paid in USDT. Works in anonymous mode too: an
  anonymous agent earns and can spend earnings on its own eSIM traffic; cashing
  out to a wallet requires linking a Google/Telegram identity. Tool count 11 → 12.

### Changed

- Backed by the new `GET /api/v1/referral` endpoint and a `ref` attribution
  parameter on `POST /api/v1/anon-session` (an agent can attribute a buyer it
  refers). Remote `https://roamzy.io/mcp` serves the new tool to every client.

## [1.5.4] — 2026-05-30

> Remote-discovery release. No change to stdio tool behaviour.

### Added

- **`remotes` entry in the Official MCP Registry manifest** (`server.json`):
  advertises the zero-install remote endpoint `https://roamzy.io/mcp`
  (Streamable HTTP, anonymous-first) alongside the npm/stdio package, so agents
  discovering Roamzy via the registry can connect with no install.

### Changed

- The stdio entrypoint now imports the shared `buildRoamzyMcpServer` factory
  (vendored into `src/mcp-core.ts` via `npm run sync-core`) — single source of
  truth shared with the remote endpoint; the repo builds standalone off GitHub.

## [1.5.3] — 2026-05-22

> Discoverability + polish release. No functional change to tool
> behaviour — adds the `mcpName` field for Official MCP Registry
> submission + rolls up all the post-1.5.2 infrastructure work.

### Added

- **`mcpName` field** in `package.json` (`io.github.roamzy-io/mcp-server`)
  — required for verification in the [Official MCP Registry](https://registry.modelcontextprotocol.io)
  (mirrored downstream to PulseMCP and other catalogs).
- **`server.json`** manifest for Official MCP Registry submission.
- **`.github/workflows/codeql.yml`** — continuous SAST with the
  `security-extended` query set (push, PR, weekly).
- **`.github/workflows/token-rotation-reminder.yml`** — auto-creates
  an urgent rotation issue 7 days before `NPM_TOKEN` expires.
- **CI release workflow hardening:** `tsc --noEmit` typecheck before
  build, expanded smoke-test verifies `tools/list` returns ≥ 11 tools,
  and publish is gated on `npm audit --audit-level=high --omit=dev`
  (so releases with HIGH/CRITICAL runtime CVEs are blocked).
- **Branch protection on `main`:** requires CodeQL pass + linear
  history + blocks force-push and branch deletion (admin override
  available — solo-friendly).
- **`examples/` directory** with drop-in config snippets for 6 MCP
  clients (Claude Desktop, Cursor, Continue, Cline, Windsurf, Zed) plus
  three flow-mode files (anonymous, token-mode, offline-tarball).
- **`USAGE_EXAMPLES.md`** with 5 real production conversation
  transcripts: anonymous purchase, cost lookup, balance check, recovery
  from lost-chat, token-mode read-only.
- **`Dockerfile`** for marketplace validators (Glama, etc.) —
  self-contained `node:20` image, no install step.
- **`smithery.yaml`** manifest for Smithery.ai listing (stdio transport,
  optional config schema).
- **`CONTRIBUTING.md`**, **`CODE_OF_CONDUCT.md`** (Contributor Covenant
  2.1), `.github/ISSUE_TEMPLATE/{bug_report,feature_request}.md`,
  `.github/PULL_REQUEST_TEMPLATE.md`.
- **`.github/workflows/release.yml`** — auto-publish to npm with
  `--provenance` on `git push --tags v*`. Includes strict `npm ci`
  install, `tsc --noEmit` typecheck, MCP handshake + `tools/list` smoke
  test, and `npm audit --audit-level=high` block on critical
  vulnerabilities before publish.
- **`.github/workflows/codeql.yml`** — GitHub CodeQL static analysis on
  every push, PR, and weekly schedule. `security-extended` query set.
- **`.github/dependabot.yml`** — weekly npm + monthly GitHub Actions
  updates, with minor/patch grouped to reduce PR noise.
- **`@types/node@^22`** dev dependency + `"types": ["node"]` in
  `tsconfig.json` — fixes `tsc --noEmit` errors that TypeScript 6.0
  introduced by no longer auto-including `@types/*` packages.
- **`package-lock.json`** committed — guarantees reproducible builds
  across local, CI, Glama validator, etc.
- **README badges** for npm version, npm downloads, GitHub stars, MCP
  compatibility, MIT license, Node 20+, and the Glama score.

### Changed

- **CI workflow** install command switched from `npm install` to
  `npm ci` for strict, reproducible installs from the lockfile.
- **devDependencies bumped:**
  - `esbuild` 0.24.2 → 0.28.0
  - `typescript` 5.9.3 → 6.0.3
  - `actions/setup-node` 4 → 6 (Node 24 runtime, GitHub Actions)
  - `actions/checkout` 4 → 6
  - `softprops/action-gh-release` 2 → 3

### Security

- Static analysis (CodeQL) now runs continuously — results in the
  repo's Security tab.
- Vulnerability scanning gated at release time via `npm audit`.

## [1.5.2] — 2026-05-21

### Added

- **Now published on the npm registry as
  [`@roamzy/mcp-server`](https://www.npmjs.com/package/@roamzy/mcp-server).**
  Recommended install path is now `npx -y @roamzy/mcp-server`. The hosted
  tarball at `https://roamzy.io/mcp/roamzy-mcp-latest.tgz` remains available
  as an alternative.
- Source code published as the public GitHub repository
  [roamzy-io/mcp-server](https://github.com/roamzy-io/mcp-server) under
  the MIT License.

### Changed

- Publish-prep cleanup: tightened metadata (`license: MIT`, proper
  `repository` field, exact-pinned devDependencies, `engines.node >= 20`).
- Removed the long internal operator-coaching block from `src/index.ts` —
  the public tool descriptions remain the agent contract; internal
  product-strategy notes are kept private.
- Anonymised placeholder MSISDNs in tool descriptions and README examples
  (real test SIMs no longer referenced).
- New `LICENSE` (MIT), `.gitignore`, `SECURITY.md`, and this changelog.

### Security

- See [`SECURITY.md`](./SECURITY.md). Bundle audited — no secrets, no
  build-machine paths, no inlined sourcemaps in published artefacts.

## [1.5.1] — 2026-05-21

### Added

- New tool `roamzy_payment_options` returning the live list of stablecoins +
  networks currently enabled in the Roamzy NowPayments account.
- `pay_currency` is now a mandatory input to `roamzy_create_order`. The
  agent must call `roamzy_payment_options` first and ask the user which
  stablecoin + network they want.

### Changed

- `roamzy_create_order` description: removed the silent default to
  `usdttrc20`; the agent must surface options to the user.

## [1.5.0] — 2026-05-21

### Changed

- Strengthened claim-URL push: tool descriptions now require the agent to
  surface the anonymous `claim_url` prominently after every successful
  purchase, with an explicit «save this link RIGHT NOW» framing. Lost-chat
  recovery procedure documented in FAQ + support endpoint.

## [1.4.9] — 2026-05-21

### Changed

- QR rendering strategy locked: the MCP server no longer returns
  `qr_image_url`. The agent must generate the QR PNG locally from
  `qr_payload` (LPA URI) using its code-execution tools (Python `qrcode`,
  JS `qrcode` npm package). This avoids broken «Show Image» dialogs in
  Claude Desktop and gives users a real downloadable PNG.

## [1.4.0] — 2026-05-20

### Added

- New tool `roamzy_support` returning official support channels +
  recovery procedure. Prevents Claude from web-searching and falling into
  lookalike companies (Roamvy, Roamify, Roam.io).

## [1.2.0] — 2026-05-20

### Added

- Anonymous-flow auth. The MCP server now creates an anonymous Roamzy
  account on the first authed call when `ROAMZY_API_TOKEN` is not set. The
  response surfaces a `claim_url` so the user can later attach the eSIM
  to a permanent Google or Telegram identity.

## [1.0.0] — 2026-05-19

### Added

- Initial public MCP server with tools for: status, country catalog,
  country detail, cost estimate, account info, eSIM list, eSIM detail,
  order status, and order creation (USDT-only via NowPayments).

