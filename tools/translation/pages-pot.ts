#!/usr/bin/env bun
/**
 * `.pot` templates for the IG's narrative pages, one per (locale, page).
 *
 * The harness's `translation:pot` serves `translation:drift`'s findings (pages
 * already published in a locale with no catalogue), so it names nothing here,
 * where no page has been translated yet. This is the same extraction over the
 * pages this IG publishes: `extractMarkdown` + `formatPot` +
 * `potWithoutTimestamp` from `cat-harness-tools/pipeline/pot-extract.ts`,
 * nothing added to them.
 *
 * Which pages: every `input/pagecontent/*.md`, the IG's hand-written narrative.
 * Template `translations/<locale>/pagecontent/<page>.pot`. A page from which
 * pot-extract takes no string (only Liquid includes, a table of contents) gets
 * no template: an empty template asks a translator for nothing.
 *
 * `docs/` is not extracted: its pages are generated at publish from the
 * artefact index and never committed. FHIR resources are not extracted: they
 * use FHIR's own designation / translation mechanism. The BPMN templates are
 * `bpmn-pot.ts`'s.
 *
 * Usage:
 *   bun tools/translation/pages-pot.ts           # write every template
 *   bun tools/translation/pages-pot.ts --check   # exit 1 if one is missing or stale
 */
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";

import { extractMarkdown, formatPot, potWithoutTimestamp } from "../../cat-harness-tools/pipeline/pot-extract.ts";

const ROOT = resolve(import.meta.dir, "..", "..");
/** Target locales: the six UN languages less the source, `en`. */
const LOCALES = ["ar", "es", "fr", "ru", "zh"];

/** [source path relative to ROOT, template path relative to translations/<locale>/]. */
export function pages(): [string, string][] {
  const pc = join(ROOT, "input", "pagecontent");
  return readdirSync(pc)
    .filter((n) => n.endsWith(".md"))
    .sort()
    .map((f) => [`input/pagecontent/${f}`, `pagecontent/${f.replace(/\.md$/, ".pot")}`]);
}

const check = process.argv.includes("--check");
let bad = 0;
let msgids = 0;
let templated = 0;
const list = pages();
const expected = new Set<string>();
for (const [src, tpl] of list) {
  const entries = extractMarkdown(readFileSync(join(ROOT, src), "utf8"), src);
  if (!entries.length) continue;
  templated++;
  msgids += entries.length;
  for (const locale of LOCALES) {
    const pot = formatPot(entries, { projectName: "smart-trust", locale });
    const path = join(ROOT, "translations", locale, tpl);
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
// The reverse question: a template whose page is gone (or now yields nothing).
for (const locale of LOCALES) {
  const dir = join(ROOT, "translations", locale, "pagecontent");
  if (!existsSync(dir)) continue;
  for (const n of readdirSync(dir).filter((n) => n.endsWith(".pot"))) {
    if (expected.has(join(dir, n))) continue;
    console.error(`  ✗ ${relative(ROOT, join(dir, n))} has no page`);
    bad++;
  }
}
if (bad) {
  console.error(`${bad} page template(s) missing, stale or orphaned: bun tools/translation/pages-pot.ts`);
  process.exit(1);
}
console.log(
  `✓ ${list.length} page(s), ${templated} with strings, ${msgids} extracted string(s), templates ${check ? "current" : "written"} for ${LOCALES.join(", ")}.`,
);
