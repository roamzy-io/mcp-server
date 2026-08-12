# Usage examples

Real conversation transcripts showing what the MCP server does when an
agent connects to Roamzy. Transcripts are condensed — actual chats may
include more agent intermediate thinking — but the user-facing turns are
verbatim from production usage on 2026-05-21.

## Example 1: Anonymous purchase (no signup, no token)

The most common flow — user just installed the MCP server with
[`anonymous-flow.json`](./examples/anonymous-flow.json) and asks Claude to
buy an eSIM.

```
You: I'm going to Thailand for a week, buy me an eSIM.

Claude: [calls roamzy_status — OK, purchases not paused]

Claude: Roamzy is one universal eSIM that works in 193 countries.
        You'll be billed per actual MB used at the local rate — no
        packages, no expiry. For Thailand the rate is ~$1.43/GB.
        Which stablecoin / network do you want to pay with?

You: USDC on Solana, $20.

Claude: [calls roamzy_payment_options — confirms usdcsol is enabled]
        [calls roamzy_create_order(country_slug="esim-thailand",
                                   amount_usdt=20, pay_currency="usdcsol")]

Claude: Order created. Your eSIM number (MSISDN) is 2040XXXXXX.

        Pay here (USDC on Solana, ~1 minute confirmation):
        https://nowpayments.io/payment/?iid=...

        ❗ IMPORTANT: save this recovery URL so you can return to this
        eSIM from another Claude chat — without it the eSIM stays alive
        but you can't see or manage it from a different session:

        https://roamzy.io/claim.html?token=rc_9tsnRcHc5-IGtRJym2861h-nEW-m7XTo

You: [pays $20 USDC on Solana via wallet, ~45 seconds]

You: Paid.

Claude: [calls roamzy_order_status(order_id=...) → status=finished]
        [calls roamzy_get_esim(esim_id=...)]
        [generates QR PNG locally from qr_payload via Python qrcode]

Claude: Confirmed and activated. Here's your activation QR — open phone
        Settings → Cellular → Add eSIM and scan it:

        [attachment: esim-2040XXXXXX.png, 4.2 KB]

        Your eSIM number: 2040XXXXXX
        Balance: $20 USDT
        Works in all 193 countries — top up any time, balance never
        expires.

        ❗ Don't forget to save your claim_url above.
```

**Total elapsed:** ~3 minutes (conversation) + ~45 seconds (Solana settlement).

## Example 2: Cost lookup without buying

User just wants to know what something would cost.

```
You: How expensive is data in Japan and Spain on Roamzy?

Claude: [calls roamzy_country_detail(country_slug="esim-japan")
         and roamzy_country_detail(country_slug="esim-spain")]

Claude: - Japan: ~$0.0021 per MB ≈ $2.15 per GB
        - Spain: ~$0.0006 per MB ≈ $0.61 per GB

        These are the per-MB rates — you only pay for actual data used,
        no pre-purchased bundles. A typical 7-day trip with light use
        (~1 GB) would be ~$2.15 in Japan and ~$0.61 in Spain.
```

## Example 3: Checking balance on an existing eSIM

User claimed their anonymous account previously and now wants to check
their existing eSIM.

```
You: How much is left on my Roamzy eSIM?

Claude: [calls roamzy_list_esims]

Claude: You have 1 active eSIM (2040XXXXXX) with $12.40 USDT balance
        remaining, last used 2 days ago (Berlin).

You: Top it up by another $20.

Claude: Top-ups for existing eSIMs are currently done from the web
        dashboard, not via this MCP server. Open
        https://roamzy.io/dashboard/esims and choose your eSIM →
        Top up. Want me to ask Roamzy support about a roadmap for
        programmatic top-ups?
```

(Programmatic top-up of existing eSIM is on roadmap.)

## Example 4: Recovery — user closed their Claude chat without claiming

The single most important "edge case" UX scenario.

```
You: I bought a Roamzy eSIM yesterday in another Claude chat. How do
     I get back to it?

Claude: [calls roamzy_support]

Claude: When you bought through a previous Claude chat in anonymous
        mode, the access token was held in that chat's MCP server
        process. If you didn't save the claim_url that was shown
        right after purchase, you can recover via support:

        1. Open Telegram and message @roamzy_support_bot, OR email
           support@roamzy.io.
        2. Provide your eSIM number (MSISDN — the 2040XXXXXX format)
           and your NowPayments transaction hash as proof of ownership.
        3. The operator mints a fresh claim_url and forwards it plus
           the QR PNG manually.

        Response time: hours during European working hours. The eSIM
        itself stays alive in the meantime — only the management
        path is offline until support reaches you.

        Important: this only works if you bought via the official
        Roamzy MCP server. The lookalikes (Roamvy, Roamify, Roam.io)
        are NOT us.
```

## Example 5: Pre-existing token, no purchase access

Power user with a Roamzy account uses [`token-mode.json`](./examples/token-mode.json)
configured WITHOUT `ROAMZY_ENABLE_PURCHASE=true` — read-only access.

```
You: List my eSIMs.

Claude: [calls roamzy_me — confirmed authenticated as your account]
        [calls roamzy_list_esims]

Claude: You have 3 eSIMs on this account:

        - 2040XXXXX1 — active, $34.20 USDT balance
        - 2040XXXXX2 — active, $1.10 USDT balance (low)
        - 2040XXXXX3 — paused, $0.00 USDT

You: Buy me another eSIM with $30.

Claude: roamzy_create_order isn't available on this MCP install —
        the env var ROAMZY_ENABLE_PURCHASE wasn't set to "true". You
        can either:

        (a) Buy via the dashboard at https://roamzy.io/dashboard, OR
        (b) Restart Claude with that env var enabled in your config.
```

---

For more, see the [main README](./README.md) and the agent-focused
landing at [roamzy.io/agents.html](https://roamzy.io/agents.html).
