# `cat/fhir-harness/ig-docs` — a route-keyed store

**Not a working branch. Do not merge it, and do not open a pull request from it.**
It is an orphan branch (no parent) holding the published output of ONE generator,
folio-assistant's `fhir-harness/scripts/gen-ig-pages.ts`: this IG's reader-facing pages.
Bean `folio-assistant-lbz8` in litlfred/folio-assistant.

Owner, 2026-10-04: generated FHIR IG pages belong on `cat/fhir-harness/ig-docs`, not on
`main`. The same branch name and layout serve every IG fork and folio-assistant itself.

## What is here

| path | pages at seed |
|---|---|
| `smart-base/docs/` | 2160 |

Paths mirror the checkout: in this repository `main` git-ignores `smart-base/docs/`
(litlfred/smart-trust#5), and this branch is where those pages are committed.

## How they were made

Generated from this repository's own `smart-base/fhir-artifact-index/` by the
`folio-assistant` submodule. The exact command is the `gate` in `manifest.json`, without
`--check`. The generator needs litlfred/folio-assistant#2082 (chrome owner named by path)
until that merges. Before the push, `--check` reported all 2160 pages current.

## Not yet authoritative

`"status": "seed"`, `"authoritative": false`. Nothing reads this branch yet. A site build
or reader that adopts it should treat a branch it cannot fetch as **unknown**, never as an
empty set of pages.
