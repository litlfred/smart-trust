#!/usr/bin/env bun
/**
 * `.pot` templates for the IG's BPMN diagrams, one per (locale, diagram).
 *
 * The harness's `translate-bpmn` extracts the diagrams of a declared
 * knowledge-graph directory, and this instance declares none for them: they
 * are IG source (`input/business-processes/`), which an index does not mount
 * (AGENTS.md). This is the same extraction over those files, with nothing
 * added: `extractBpmn` from `cat-harness-tools/pipeline/bpmn-translate.ts`,
 * `formatPot` + `potWithoutTimestamp` from `pipeline/pot-extract.ts`, the
 * template at `translations/<locale>/processes/<diagram>.pot` and the project
 * named after the diagram, as `translate-bpmn` writes them, so its `--inject`
 * reads them unchanged if the directory is ever declared.
 *
 * Usage:
 *   bun tools/translation/bpmn-pot.ts           # write every template
 *   bun tools/translation/bpmn-pot.ts --check   # exit 1 if one is missing, stale or orphaned
 */
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { basename, dirname, join, relative, resolve } from "node:path";

import { extractBpmn } from "../../cat-harness-tools/pipeline/bpmn-translate.ts";
import { formatPot, potWithoutTimestamp } from "../../cat-harness-tools/pipeline/pot-extract.ts";

const ROOT = resolve(import.meta.dir, "..", "..");
/** Target locales: the six UN languages less the source, `en`. */
const LOCALES = ["ar", "es", "fr", "ru", "zh"];
const SOURCE = join(ROOT, "input", "business-processes");

const check = process.argv.includes("--check");
let bad = 0;
let msgids = 0;
const diagrams = readdirSync(SOURCE).filter((n) => n.endsWith(".bpmn")).sort();
const expected = new Set<string>();
for (const name of diagrams) {
  const src = join(SOURCE, name);
  const entries = extractBpmn(readFileSync(src, "utf8"), relative(ROOT, src));
  msgids += entries.length;
  const stem = basename(name, ".bpmn");
  for (const locale of LOCALES) {
    const pot = formatPot(entries, { projectName: stem, locale });
    const path = join(ROOT, "translations", locale, "processes", `${stem}.pot`);
    expected.add(path);
    const current = existsSync(path) && potWithoutTimestamp(readFileSync(path, "utf8")) === potWithoutTimestamp(pot);
    if (current) continue;
    if (check) {
      console.error(`  ✗ ${relative(ROOT, path)} ${existsSync(path) ? "stale" : "missing"}`);
      bad++;
    } else {
      mkdirSync(dirname(path), { recursive: true });
      writeFileSync(path, pot);
    }
  }
}
for (const locale of LOCALES) {
  const dir = join(ROOT, "translations", locale, "processes");
  if (!existsSync(dir)) continue;
  for (const n of readdirSync(dir).filter((n) => n.endsWith(".pot"))) {
    if (expected.has(join(dir, n))) continue;
    console.error(`  ✗ ${relative(ROOT, join(dir, n))} has no diagram`);
    bad++;
  }
}
if (bad) {
  console.error(`${bad} diagram template(s) missing, stale or orphaned: bun tools/translation/bpmn-pot.ts`);
  process.exit(1);
}
console.log(`✓ ${diagrams.length} diagram(s), ${msgids} extracted string(s), templates ${check ? "current" : "written"} for ${LOCALES.join(", ")}.`);
