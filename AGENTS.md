# AGENTS.md — smart-trust

This file is agent-generic: Claude Code, Gemini CLI, Cursor, Copilot and others
read it natively. What binds everywhere is the harness's
[`AGENTS.md`](https://github.com/litlfred/cat-harness/blob/HEAD/AGENTS.md); what
this repository *is* is [`README.md`](README.md).

## What this instance is

The WHO SMART Trust implementation guide: FHIR IG source under `input/`, built
by the IG Publisher. It takes the smart-hiv shape (owner, 2026-10-14). It has
no harness of its own: `index.config.json` mounts `smart-base` and the layers
below it, and `smart-trust.json` declares what an index may mount from here.

## The one rule

**The two mounted graphs are generated copies of upstream, never authored.**
`fhir-artifact-index/` is rewritten by `ingest-ig-artifacts.ts` from the IG's
published artefacts, and `openapi/` by `ingest-openapi.ts` and
`gen-openapi-pages.ts` from the sources `openapi/cat-openapi.config.json`
names. Both directories are declared `readOnly`. A hand edit silently changes
what this repository claims upstream published; `check:materialized-fixity`
and the writers' `--check` catch one. To change what is there, change the
upstream source or the writer, then re-run the writer.

## What an index mounts from here

folio-assistant mounts two directories, `fhir-artifact-index/` and `openapi/`,
plus this file and the README as declared assets. `document-kinds/` holds this
IG's DAK coverage report, generated from `fhir-artifact-index/` by the DAK
layer's `smart-base:document-kinds`; an index mounts it once its re-pin lists
`smart-trust-document-kinds`. The IG source (`input/`) is
not mounted. Neither is `docs/`, which is built at publish by
`smart-trust:pages` (fhir-harness's `gen-ig-pages.ts`) and never committed.
`fhir-ast/` is restored from its cache branch by `ig-cache.sh`.

## Before running SUSHI

Read fhir-harness's [`fhir-validation`](https://github.com/litlfred/fhir-harness/blob/main/skills/content/fhir-ig-authoring/fhir-validation.md#when-a-package-host-refuses-you)
§"When a package host refuses you" first. Where packages.fhir.org is refused,
`fhir-cache-seed-npm` fills the package cache from npm and
fhir-package-mirror at exact versions only. Never report "SUSHI cannot run
here" before running the seeder, and never stand in another version for a pin;
its `--missing-out` list is what the mirror still needs.
