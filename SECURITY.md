# Security policy

## Reporting a vulnerability

If you find a vulnerability in `@roamzy/mcp-server`, the public Roamzy API,
or any part of the Roamzy service, please report it privately.

**Preferred channel:** email `roamzy.agent@gmail.com`.

**Alternate channels:**
- Telegram: [@roamzy_support_bot](https://t.me/roamzy_support_bot)
- Roamzy's public policy: [https://roamzy.io/.well-known/security.txt](https://roamzy.io/.well-known/security.txt)

Please include:

1. A clear description of the issue and its impact.
2. Reproduction steps (URL, request, response, or transcript fragments —
   minimal redacted form is fine).
3. Your assessment of severity (informational / low / medium / high /
   critical).
4. Whether you intend to publish a write-up, and a reasonable disclosure
   timeline — we'll typically respond within 72 hours with an acknowledgement
   and a fix-or-mitigation ETA.

## What's in scope

- The MCP server source in this repository (`src/`, the bundled
  `dist/index.js`, and any published npm/tarball artefacts).
- The public Roamzy HTTP API at `https://roamzy.io/api/v1/*` insofar as it
  affects the MCP integration.
- Anonymous-session flow, claim-token flow, and per-token spending caps.

## What's out of scope

- Issues that require the user to have already leaked their own
  `ROAMZY_API_TOKEN` or `claim_url` to a third party.
- Pricing, refund-policy, or business-logic disagreements (use
  `support@roamzy.io` instead).
- Vulnerabilities in dependencies that have already been disclosed upstream
  and where we are within the standard 90-day patch window.

## Safe-harbour

We will not pursue legal action against researchers who:

- Report findings through one of the channels above before public
  disclosure.
- Limit testing to your own account (or an anonymous session you created).
- Do not access, modify, or exfiltrate other users' data, eSIM profiles,
  balances, or payments.
- Do not run automated traffic against production beyond what's needed to
  demonstrate the issue.

Good-faith research is welcome and appreciated. Thanks for keeping Roamzy
safe.
