# AGENTS.md

## Project

VSCode extension that copies the full Ruby member reference (module/class/method/constant path) under the cursor to the clipboard. Uses regex-based parsing with indentation tracking — no AST / parser gem.

## Stack

- **Language:** TypeScript, target ES2022, module Node16
- **Runtime:** VSCode ^1.95.0, Node
- **Bundler:** esbuild
- **Test:** mocha via @vscode/test-cli (run inside VSCode debug — not standalone)
- **Lint:** eslint with @typescript-eslint
- **Package:** vsce

## Scripts

- `yarn compile` — check types + lint + bundle
- `yarn test` — compile tests + build + lint + run in VSCode
- `yarn run check-types` — `tsc --noEmit`
- `yarn run lint` — `eslint src`

## Source layout

- `src/extension.ts` — activation entry point, registers command
- `src/copy-member-reference.ts` — command handler: reads editor, writes clipboard
- `src/get-member-reference.ts` — gets current line + text above, feeds `NamespaceBuilder`
- `src/namespace-builder.ts` — builds the member path string from parsed members
- `src/path-parser.ts` — regex-based parser with indentation-aware scoping; defines `Matcher` classes for each Ruby construct (module, class, instance/class method, constant, rake tasks)
- `src/test/suite/namespace-builder.test.ts` — unit tests for parser via `NamespaceBuilder`

## Architecture

1. `getMemberReference()` reads the current line and all lines above it up to the cursor.
2. `PathParser` scans those lines with combined regexes, tracking indent levels to build a stack of enclosing members.
3. `NamespaceBuilder` joins the member path with `::` / `.` / `#` separators.
4. The result is written to clipboard and shown in an info dialog.

## Key design decisions

- **No Ruby runtime dependency.** Parser is pure regex. Indentation-based scoping (no AST).
- **Single command** — `copy-ruby-member-reference.copyReference`. No keybinding by default.
- **Modal dialogs** — both success and failure use `{modal: true}` to guarantee user sees them.

## Indentation scoping

Parser assumes consistent indentation (no tab-mixing). Deeper indent = child scope, same indent = sibling (replaces previous at that level), shallower indent = dedent. Works correctly with `end` keywords implicitly (they dedent).

## Releasing

```
npm version [patch|minor|major]
# update CHANGELOG.md, commit, merge to main
npx vsce publish
```

## Dependency resolution note

`serialize-javascript` is pinned via yarn resolutions to ^7.0.5 for a security CVE in the mocha → serialize-javascript chain. Remove when mocha 12+ ships with serialize-javascript 7+. See `RESOLUTIONS.md`.
