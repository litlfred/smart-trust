#!/usr/bin/env bun
/**
 * Writes the reference lists in `input/pagecontent/*.md` from the
 * bibliography entries in `references/` (one `folio-reference/v1` CSL-JSON
 * file per work, `<key>.json`).
 *
 * A page marks where a list goes:
 *
 *   <!-- references:begin style=bracket keys=key-a,key-b -->
 *   …written here, never by hand…
 *   <!-- references:end -->
 *
 * `style` is `bracket` (`[1] …` paragraphs, numbered in key order), `ol` or
 * `ul`. Each entry gets the anchor `ref-<key>`, so an in-text citation links
 * to it as `[[1]](#ref-<key>)`.
 *
 *   bun input/scripts/references.ts           rewrite the lists
 *   bun input/scripts/references.ts --check   fail if a list is stale, a key
 *                                             has no entry, or a `#ref-` link
 *                                             points at no entry on its page
 */
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = join(import.meta.dir, "..", "..");
const REF_DIR = join(ROOT, "references");
const PAGE_DIR = join(ROOT, "input", "pagecontent");
const CHECK = process.argv.includes("--check");

type Name = { family?: string; given?: string; literal?: string };
type CslDate = { "date-parts"?: (number | string)[][] };
type Entry = {
  id: string;
  type: string;
  title?: string;
  author?: Name[];
  version?: string;
  "container-title"?: string;
  publisher?: string;
  "publisher-place"?: string;
  issued?: CslDate;
  accessed?: CslDate;
  volume?: string;
  issue?: string;
  page?: string;
  DOI?: string;
  URL?: string;
  status?: string;
  note?: string;
};

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

function date(d?: CslDate): string | undefined {
  const p = d?.["date-parts"]?.[0];
  if (!p?.length) return undefined;
  const [y, m, day] = p.map(Number);
  if (m && day) return `${day} ${MONTHS[m - 1]} ${y}`;
  if (m) return `${MONTHS[m - 1]} ${y}`;
  return String(y);
}

function name(n: Name): string {
  return n.literal ?? [n.family, n.given].filter(Boolean).join(" ");
}

const stripDot = (s: string) => s.replace(/[.\s]+$/, "");

/** One entry as HTML, Vancouver-like, every field from the CSL item. */
export function render(e: Entry): string {
  const parts: string[] = [];
  if (e.author?.length) parts.push(esc(e.author.map(name).join(", ")));
  const title = esc(stripDot(e.title ?? e.id));
  parts.push(e.URL ? `<a href="${esc(e.URL)}">${title}</a>` : title);
  if (e.version) parts.push(`Version ${esc(e.version)}`);
  if (e["container-title"] && e.type !== "article-journal") parts.push(`In: ${esc(e["container-title"])}`);
  const pub = [e["publisher-place"], e.publisher].filter(Boolean).map((s) => esc(s!)).join(": ");
  const issued = date(e.issued);
  if (e.type === "article-journal") {
    const vol = e.volume ? `${e.volume}${e.issue ? `(${e.issue})` : ""}${e.page ? `:${e.page}` : ""}` : "";
    parts.push(esc([e["container-title"], [issued, vol].filter(Boolean).join(";")].filter(Boolean).join(". ")));
  } else if (pub || issued) {
    parts.push([pub, issued].filter(Boolean).join("; "));
  }
  if (e.status) parts.push(esc(e.status));
  if (e.DOI) parts.push(`doi:<a href="https://doi.org/${esc(e.DOI)}">${esc(e.DOI)}</a>`);
  if (e.note) parts.push(esc(stripDot(e.note)));
  const accessed = date(e.accessed);
  if (accessed) parts.push(`Last accessed ${accessed}`);
  // A part ending in ? or ! keeps its own mark; every other part ends in a full stop.
  return parts.map((p) => (/[?!]$/.test(p) ? p : `${stripDot(p)}.`)).join(" ");
}

function loadEntries(): Map<string, Entry> {
  const m = new Map<string, Entry>();
  for (const f of readdirSync(REF_DIR).filter((f) => f.endsWith(".json")).sort()) {
    const e = JSON.parse(readFileSync(join(REF_DIR, f), "utf-8")) as Entry;
    if (`${e.id}.json` !== f) throw new Error(`references/${f}: id "${e.id}" does not match the file name`);
    m.set(e.id, e);
  }
  return m;
}

const BLOCK = /<!-- references:begin ([^>]*?)-->\n[\s\S]*?<!-- references:end -->/g;

function block(attrs: string, entries: Map<string, Entry>, problems: string[], page: string): { html: string; keys: string[] } {
  const a = Object.fromEntries(attrs.trim().split(/\s+/).map((kv) => kv.split("=") as [string, string]));
  const style = a.style ?? "ol";
  const keys = (a.keys ?? "").split(",").filter(Boolean);
  const items: string[] = [];
  keys.forEach((k, i) => {
    const e = entries.get(k);
    if (!e) {
      problems.push(`${page}: no entry references/${k}.json`);
      return;
    }
    const body = render(e);
    items.push(style === "bracket" ? `<p id="ref-${k}" data-ref="${k}">[${i + 1}] ${body}</p>` : `  <li id="ref-${k}" data-ref="${k}">${body}</li>`);
  });
  const html = style === "bracket" ? items.join("\n") : `<${style}>\n${items.join("\n")}\n</${style}>`;
  return { html: `<!-- references:begin ${attrs.trim()} -->\n${html}\n<!-- references:end -->`, keys };
}

function main(): void {
  const entries = loadEntries();
  const problems: string[] = [];
  const used = new Set<string>();
  for (const f of readdirSync(PAGE_DIR).filter((f) => f.endsWith(".md")).sort()) {
    const path = join(PAGE_DIR, f);
    const raw = readFileSync(path, "utf-8");
    const crlf = raw.includes("\r\n");
    const src = crlf ? raw.replace(/\r\n/g, "\n") : raw;
    if (!src.includes("references:begin") && !src.includes("#ref-")) continue;
    const onPage = new Set<string>();
    const out = src.replace(BLOCK, (_m, attrs: string) => {
      const b = block(attrs, entries, problems, f);
      b.keys.forEach((k) => (onPage.add(k), used.add(k)));
      return b.html;
    });
    for (const m of out.matchAll(/\(#ref-([A-Za-z0-9._:+-]+)\)|href="#ref-([A-Za-z0-9._:+-]+)"/g)) {
      const k = m[1] ?? m[2]!;
      if (!onPage.has(k)) problems.push(`${f}: citation #ref-${k} has no entry in this page's reference list`);
    }
    if (out !== src) {
      if (CHECK) problems.push(`${f}: reference list is stale; run bun input/scripts/references.ts`);
      else writeFileSync(path, crlf ? out.replace(/\n/g, "\r\n") : out);
    }
  }
  for (const k of entries.keys()) if (!used.has(k)) problems.push(`references/${k}.json is listed on no page`);
  if (problems.length) {
    console.error(problems.join("\n"));
    process.exit(1);
  }
  console.log(`references: ${entries.size} entries, all lists ${CHECK ? "current" : "written"}`);
}

if (import.meta.main) main();
