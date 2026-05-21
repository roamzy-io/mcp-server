# @roamzy/mcp-server

MCP server for [Roamzy](https://roamzy.io) — buy and manage a global eSIM
through Claude Desktop, Cursor, Continue, Cline, Windsurf, Zed, or any other
[Model Context Protocol](https://modelcontextprotocol.io) client. Anonymous
flow by default: no account required to use it.

> One eSIM for 192 countries. Pay per actual MB used. USDT or USDC on your
> preferred network. No packages. No expiry. No subscription.

[![MCP](https://img.shields.io/badge/MCP-compatible-blue)](https://modelcontextprotocol.io)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)
[![Node](https://img.shields.io/badge/node-%3E%3D20-brightgreen)](https://nodejs.org)

---

## What it does

This MCP server lets an agent (running in any MCP-compatible client) call the
Roamzy HTTP API on the user's behalf. Sample conversation in Claude Desktop:

> **User:** I'm going to Thailand for a week, buy me an eSIM.
>
> **Claude:** Roamzy — one universal eSIM, works in 192 countries. Billed per
> MB at the local rate, no packages, no expiry. For Thailand the rate is
> ~$2.15/GB. Which stablecoin / network do you want to pay with?
> (USDT on TRON, BSC, Polygon, Optimism, Arbitrum, TON — or USDC on Solana,
> BSC, Polygon, Optimism, Arbitrum.) Minimum top-up is $20 USDT.
>
> **User:** USDC on Solana, $20.
>
> **Claude:** Order created. eSIM number 2040XXXXXX. Pay here: [pay-link].
> After ~1 minute on Solana, I'll fetch your QR.
> ❗ Save this recovery URL so you can return to this eSIM from another
> Claude chat: [claim-link].
>
> *User pays $20 USDC.*
>
> **Claude:** Paid. Here's your activation QR — open Settings → Cellular →
> Add eSIM and scan it with your phone camera. [QR PNG attached]

The server doesn't run a backend itself — it's a thin client to
`https://roamzy.io/api/v1/*`, mapped 1:1 to MCP tools.

---

## Install

Add this to your MCP client's configuration (e.g. `~/Library/Application
Support/Claude/claude_desktop_config.json` for Claude Desktop on macOS):

```json
{
  "mcpServers": {
    "roamzy": {
      "command": "npx",
      "args": ["-y", "https://roamzy.io/mcp/roamzy-mcp-latest.tgz"]
    }
  }
}
```

Restart your MCP client. The first authed tool call will mint an anonymous
Roamzy account automatically — no signup required.

### Optional environment variables

| Variable                  | Default                            | Purpose                                                                                                |
|---------------------------|------------------------------------|--------------------------------------------------------------------------------------------------------|
| `ROAMZY_API_TOKEN`        | _(unset → anonymous mode)_         | Use a pre-existing API token from `/dashboard/settings` instead of an anonymous account.               |
| `ROAMZY_ENABLE_PURCHASE`  | `false` _(but `true` in anon mode)_| When using a non-anonymous token, opt-in flag required to expose purchase tools.                       |
| `ROAMZY_API_BASE`         | `https://roamzy.io/api/v1`         | Override for staging / self-hosted backends.                                                           |

---

## Tools

### Public (no auth required)

| Tool                       | Purpose                                                                                  |
|----------------------------|------------------------------------------------------------------------------------------|
| `roamzy_status`            | Service status + agent-pause flags. Call before any purchase attempt.                    |
| `roamzy_list_countries`    | Reference list of all 192 supported countries with per-MB rates.                         |
| `roamzy_country_detail`    | Per-MB rate for one country.                                                             |
| `roamzy_estimate`          | Reference calc: «how many USDT would N MB cost in country X».                            |
| `roamzy_support`           | Official support channels + recovery procedure. Call instead of web-searching.           |
| `roamzy_payment_options`   | Currently-enabled stablecoins + networks (live from NowPayments). Call before order.     |

### Account-scoped (anonymous or token)

| Tool                       | Purpose                                                                                  |
|----------------------------|------------------------------------------------------------------------------------------|
| `roamzy_me`                | Current Roamzy account info (auto-mints anonymous account on first call).                |
| `roamzy_list_esims`        | The account's eSIMs with MSISDN, status, balance.                                        |
| `roamzy_get_esim`          | One eSIM's activation details (QR payload, LPA URI). Generate the QR PNG locally.        |
| `roamzy_order_status`      | Poll a pending order: `waiting → confirming → finished`.                                 |

### Purchase (anonymous or token + `ROAMZY_ENABLE_PURCHASE=true`)

| Tool                       | Purpose                                                                                  |
|----------------------------|------------------------------------------------------------------------------------------|
| `roamzy_create_order`      | Mint a new eSIM and fund it. Min top-up $20 USDT. Requires `pay_currency` from options.  |

Each tool returns structured JSON. Tool descriptions (visible via
`tools/list`) encode the agent contract — when to call each tool, what to
surface to the user, what to keep internal.

---

## Anonymous flow

When the MCP server starts without `ROAMZY_API_TOKEN`, the first authed call
sends `POST /api/v1/anon-session` (no auth) to mint a fresh anonymous Roamzy
account. The server caches the returned token in-process (never written to
disk) and uses it for subsequent calls.

The response also includes a `claim_url` — a magic-link that lets the user
later attach this anonymous account to a permanent Google or Telegram
identity. Once attached, the eSIM, balance, and history become visible from
`/dashboard/esims` on the web.

**Important:** the anonymous token lives only in this MCP server process. If
the user closes their MCP client (e.g. quits Claude Desktop) without saving
`claim_url`, the access path is lost — the eSIM itself keeps working, but
the user can't see or manage it from a new session. The recovery procedure
(operator-mediated via support) is described in the `roamzy_support` tool
response.

Anonymous accounts have conservative daily / monthly spending caps and a
cool-off period that gates large transactions; exact thresholds are shown to
the user in the dashboard once they claim.

---

## Security model

- **No filesystem access.** The server only makes HTTP calls.
- **No child processes.**
- **No environment scan** beyond explicit `ROAMZY_*` variables.
- **Outbound traffic only to `https://roamzy.io`** (override via
  `ROAMZY_API_BASE` if you self-host).
- **Purchase tools** are registered only in anonymous mode or with
  `ROAMZY_ENABLE_PURCHASE=true`.
- **Per-token spending caps** with cool-off period + big-transaction
  threshold; configurable per token in `/dashboard/settings`.
- **Service status honoured.** When `roamzy_status` reports
  `purchases_paused=true`, the agent must back off.
- **No telemetry.** The server doesn't phone home except to call the
  configured API base.

See [`SECURITY.md`](./SECURITY.md) for the disclosure policy.

---

## Build from source

```bash
git clone https://github.com/roamzy-io/mcp-server.git
cd mcp-server
pnpm install
pnpm build
```

Output: a single-file ESM bundle at `dist/index.js` (~520 KB,
self-contained, executable via Node 20+).

To produce a tarball for distribution:

```bash
pnpm build:tgz
# → dist/roamzy-mcp-server-<version>.tgz
```

---

## Links

- Website: [https://roamzy.io](https://roamzy.io)
- API docs: [https://roamzy.io/api/v1/docs](https://roamzy.io/api/v1/docs)
- For agents: [https://roamzy.io/agents.html](https://roamzy.io/agents.html)
- Long-form for AI engines: [https://roamzy.io/llms-full.txt](https://roamzy.io/llms-full.txt)
- Support: [@roamzy_support_bot](https://t.me/roamzy_support_bot) or `support@roamzy.io`
- Security: `roamzy.agent@gmail.com` ([SECURITY.md](./SECURITY.md))

---

## License

[MIT](./LICENSE) — © 2026 Artur. The Roamzy name and brand are trademarks of
the Roamzy service operator and are not licensed under MIT.
