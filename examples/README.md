# Examples

Drop-in configuration snippets for the major MCP clients. Pick the file
that matches your client, copy its contents into your client's MCP config,
restart, and you're done.

| Client | File | Notes |
|---|---|---|
| Claude Desktop | [`claude-desktop.json`](./claude-desktop.json) | macOS / Windows / Linux |
| Cursor | [`cursor.json`](./cursor.json) | IDE — global or per-workspace |
| Continue | [`continue.json`](./continue.json) | IDE extension |
| Cline | [`cline.json`](./cline.json) | VS Code extension |
| Windsurf | [`windsurf.json`](./windsurf.json) | Codeium's IDE fork |
| Zed | [`zed.json`](./zed.json) | Zed editor |
| Anonymous-flow | [`anonymous-flow.json`](./anonymous-flow.json) | No token — Roamzy account auto-created on first use |
| Token-mode | [`token-mode.json`](./token-mode.json) | Pre-existing Roamzy API token, purchase opt-in |
| Behind a firewall | [`offline-tarball.json`](./offline-tarball.json) | Self-hosted CDN tarball instead of npm |

## Where each client reads its config

| Client | Config file path |
|---|---|
| Claude Desktop (macOS) | `~/Library/Application Support/Claude/claude_desktop_config.json` |
| Claude Desktop (Windows) | `%APPDATA%\Claude\claude_desktop_config.json` |
| Claude Desktop (Linux) | `~/.config/Claude/claude_desktop_config.json` |
| Cursor (global) | Settings → Features → Model Context Protocol → edit `mcp.json` |
| Continue | `~/.continue/config.json` (in `mcpServers` block) |
| Cline (VS Code) | VS Code Settings → Cline → MCP Servers (JSON view) |
| Windsurf | Settings → Cascade → MCP Servers |
| Zed | `~/.config/zed/settings.json` (`context_servers` block) |

If the file already has other servers configured, merge the `roamzy` entry
into the existing `mcpServers` (or equivalent) object rather than replacing
the whole file.

## Pick a flow

- **First time, never used Roamzy before** → [`anonymous-flow.json`](./anonymous-flow.json). The server creates an anonymous Roamzy account on the first authed tool call. No signup, no token.
- **Already have a Roamzy account, want to bind agent activity to it** → [`token-mode.json`](./token-mode.json). Generate a token at [`/dashboard/settings`](https://roamzy.io/dashboard/settings) → Agent integration / API tokens.
- **Corporate network blocks npm** → [`offline-tarball.json`](./offline-tarball.json). Same code, different install path.

After config update, restart the MCP client so it spawns the server fresh.

## Verify

In Claude Desktop (or any client with an MCP-tools menu): the connected
servers list should show `roamzy: running`. Try a question:

> Buy me an eSIM for Japan with $20 USDT through Roamzy.

The agent calls `roamzy_payment_options`, asks you which stablecoin/network
you want, then `roamzy_create_order` returns the MSISDN + pay URL + a
claim URL (save the claim URL — without it you can't recover the eSIM
from another chat).
