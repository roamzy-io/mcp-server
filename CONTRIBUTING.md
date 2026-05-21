# Contributing

Thanks for your interest in `@roamzy/mcp-server`.

## Scope

This repository holds the **MCP-protocol wrapper** for the Roamzy eSIM
service — a thin client that maps MCP tool calls to public HTTP API calls
at `https://roamzy.io/api/v1/*`. It is intentionally small (~600 LOC,
self-contained ESM bundle).

The Roamzy backend, frontend, and eSIM-provisioning infrastructure live in
a separate (private) repository and are not part of this project.

## What we welcome

- 🐛 **Bug reports** — open an issue with a reproducer (preferably the
  exact tool call args + the response you saw vs. what you expected).
- 🔒 **Security findings** — please report privately via
  `roamzy.agent@gmail.com` instead of a public issue. See
  [`SECURITY.md`](./SECURITY.md).
- 📝 **Documentation improvements** — README clarifications, typo fixes,
  install-snippet polish for clients we haven't tested with.
- 🛠️ **Tool-description tightening** — if you spot a description that
  causes a popular agent to misbehave, an issue with a transcript is
  ideal. We iterate on tool descriptions based on observed agent behaviour.

## What's out of scope here

- **Feature requests on the underlying Roamzy service** (new countries,
  pricing changes, payment methods, etc.) — open a ticket via
  `@roamzy_support_bot` on Telegram or email `support@roamzy.io`.
- **Adding tools that don't map 1:1 to a public Roamzy API endpoint** —
  this server stays a thin wrapper. New tools require a corresponding API
  endpoint first.

## Building

```bash
git clone https://github.com/roamzy-io/mcp-server.git
cd mcp-server
npm install
npm run build       # bundles src/index.ts → dist/index.js via esbuild
```

Smoke-test the bundle:

```bash
printf '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2024-11-05","capabilities":{},"clientInfo":{"name":"local","version":"1"}}}\n' \
  | node dist/index.js
```

Should respond with `serverInfo: { name: "roamzy", version: "..." }`.

## Pull requests

1. Fork → branch → commit → push → PR against `main`.
2. Keep PRs small and focused. One concern per PR.
3. We don't enforce a specific commit-message style yet, but
   [Conventional Commits](https://www.conventionalcommits.org/) is
   appreciated.
4. CI must pass (the release workflow runs a build + smoke-test on every
   tag push; we may add a per-PR check later).

We may close PRs that contribute purely to inflate stats (drive-by typo
fixes that don't measurably help, etc.) — sorry, this is awesome-list-PR
spam mitigation.

## Releases

Releases are tag-driven and automated:

```bash
# Bump version in package.json, update CHANGELOG.md, commit, then:
git tag v<new-version>
git push --tags
```

The release workflow then publishes to npm with `--provenance` and creates
a draft GitHub release for the maintainer to publish manually.

## License

By contributing, you agree your contributions are licensed under the MIT
License (see [`LICENSE`](./LICENSE)).
