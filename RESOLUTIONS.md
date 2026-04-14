# Dependency Resolutions

## serialize-javascript@^7.0.5

**Reason:** Security vulnerability in serialize-javascript < 7.0.5 (CVE).

**Chain:** @vscode/test-cli → mocha@11.7.5 → serialize-javascript@^6.0.2

**Mocha's stance:** Does not release security updates for dev dependencies.

**Remove when:** mocha@12+ releases with serialize-javascript@7+ in its dependency tree. Check mocha's changelog periodically.

**Test removal:** `yarn remove resolutions && yarn install && yarn test`
