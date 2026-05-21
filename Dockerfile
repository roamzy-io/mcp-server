# Minimal container for the @roamzy/mcp-server.
#
# Used by Glama.ai (and any other MCP marketplace that runs servers in a
# sandbox) to validate that the server starts and responds to MCP
# introspection requests (`tools/list`, `initialize`).
#
# The bundle in `dist/index.js` is self-contained — esbuild has inlined
# every dependency, including the MCP SDK. So the container only needs
# Node 20+; no `npm install` step, no package.json copy.
#
# End users still install via `npx -y @roamzy/mcp-server` (npm registry)
# or the hosted tarball at https://roamzy.io/mcp/roamzy-mcp-latest.tgz.
# This Dockerfile is for marketplace validators, not for end-user install.

FROM node:20-bookworm-slim

WORKDIR /app

# The bundle is the ONLY file we need to run the server. It speaks stdio
# (the MCP standard transport for locally-hosted servers), so no ports,
# no environment scan beyond the documented ROAMZY_* vars.
COPY dist/index.js /app/index.js

RUN chmod +x /app/index.js

# Anonymous-flow is the default — no env vars required. Marketplaces can
# inject ROAMZY_API_TOKEN / ROAMZY_ENABLE_PURCHASE via env at runtime if
# the user has configured them (see smithery.yaml `configSchema`).

ENTRYPOINT ["node", "/app/index.js"]
