# Changelog

All notable changes to `@roamzy/mcp-server` are recorded here.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.5.2] — 2026-05-21

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
