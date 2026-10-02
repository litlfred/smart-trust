# Separation rehearsal: smart-trust's instance in its own repository

**Rehearsal branch. Do not merge.** This branch tests stage E of the
smart-* separation plan
([`smart-separation-2026-10-01.md`](https://github.com/litlfred/folio-assistant/blob/main/cat-harness/docs/proposals/smart-separation-2026-10-01.md),
bean `n3ni`, issue litlfred/folio-assistant#1767) before anything is done in
the WHO repositories.

Owner, 2026-10-02: *"use forks litlfred/smart-* as staging before we do it on
WHO reps"*. The plan names one risk as the thing that would change it: *"If a
fork cannot run `gen-ig-pages` without cloning folio-assistant, E needs a
tools package first."* This rehearsal measures that risk.

## What is on this branch

- `smart-trust/`: the instance directory from folio-assistant at `52a35ddf`
  (PR litlfred/folio-assistant#1766), copied unchanged. It holds the artefact
  index, the menu, 2,158 generated pages, the QA results and the themes.
- `smart-trust/PLATFORM-FILES.txt`: the folio-assistant files the gates
  needed (see below).

No folio-assistant code is copied onto this branch. The platform files were
placed only in a scratch copy, to measure what the gates need.

## Results (2026-10-02)

| check | in this repository, with only the listed platform files | result |
|---|---|---|
| `gen-ig-pages --instance smart-trust --check` | 23 code and data files from folio-assistant, the page templates, plus smart-base's `smart-base.json` and `chrome.json` | **pass**: 2,158 pages byte-identical |
| `ingest-ig-menu --source . --check` | 2 files | **pass**: 5 groups, 29 items. The IG source *is* this repository, so the check runs here. folio-assistant's CI cannot run it, because it cannot reach the source (bean `0818`). |
| the same page check with the directory renamed `smart-base/`, as the plan's layout has it | same | **fail**: all 2,153 artefact pages change |

## Findings

1. **A fork cannot run the gates by itself, but it needs very little.**
   - Page generation pulls in 23 files from four places: 11 in
     `cat-harness/schemas`, 5 in `fhir-harness`, 2 in
     `folio-assistant-core`, and 2 in `bootstrap-tools`. That last one is
     its own repository, a submodule of folio-assistant.
   - It also needs 2 data files and the templates.
   - So "a tools package first" is a small package, not a large one.
   - A static import scan found 20 of the 23. Run-time loading supplied the
     other 3, including a JSON code list read by URL. So the package's file
     list must be built by running the gates, not by reading imports.
2. **The instance's identity is its directory name.**
   - Page URLs are built from it: `/smart-trust/assets/...` becomes
     `/smart-base/...`.
   - The chrome is found through the directory too. It is
     `--chrome-owner smart-base`, read from smart-base's declaration.
   - The plan has every IG repository keep its data under `smart-base/`.
     Under that layout, every IG would publish under `/smart-base/` and
     collide once folio-assistant subscribes to several forks.
   - Before the rename, the generators need an instance id separate from
     the directory. The declaration's `name` is the obvious candidate.
3. **The chrome belongs to the harness, not to one instance.**
   smart-trust's pages read `smart-base/fhir-artifact-index/chrome.json`.
   This is plan question Q4: re-key it to the template and ship it with the
   harness. It must be settled before this repository can build its own
   pages in the target layout.
4. **The menu gate gets better in the fork.** It needs the IG's
   `sushi-config.yaml` at a commit, and here that is the working tree. A gate
   that folio-assistant cannot run becomes an ordinary one.

## Not done here

- No GitHub Actions workflow is added; CI minutes appear exhausted, and the
  rehearsal's question is answered locally.
- No change to `main`. The `smart-base/` layout is not adopted, per finding 2.
- No WHO repository is touched.
