#!/usr/bin/env bun
/**
 * The home page's traveller journey: one card per moment, generated from the
 * user scenarios so nothing is typed twice. As smart-ips-pilgrimage lays out
 * its "Eight moments that matter" (its input/scripts/journey-cards.ts), with
 * the owner's storyboard (2026-11-14) added under each picture: the moment's
 * ArchiMate strip.
 *
 * Each card has the moment's illustration (the scenario step's
 * `illustration.src`, input/images/journey-traveller/), its title, when and
 * where, its headline, the strip, and links to walk through it in the journeys
 * viewer and to its ArchiMate view (archimate/build.py gives each moment's view
 * the moment's id as its slug).
 *
 * The strip is the six system roles of scenarios/roles.json, the ArchiMate
 * ApplicationComponents archimate/build.py makes of them, in two rows: the
 * keys (Onesa's PKI, the GDHCN trust list, Taifafeki's PKI) over the document
 * (Onesa's issuer, the traveller's wallet, the clinic's verifier), Onesa on
 * the left and Taifafeki on the right. A box is lit when the moment names a
 * system that plays it (the scenario's `personas`) and greyed when not; each
 * box opens its ArchiMate element's page. Every word on it is page text, never
 * in the picture (owner, 2026-11-14: "only graphics").
 *
 * It also writes the hero, the story in one sentence: the parent scenario's
 * description, with buttons into the walkthrough and the journey's view.
 *
 * In each language: every string the cards and the hero show is in
 * `translations/<locale>/journey-cards.pot`, and a locale whose
 * `journey-cards.po` translates any of them gets its own
 * `journey-cards-<locale>.html` and `journey-hero-<locale>.html`, which the
 * home page's `{% lang-fragment %}` picks on that locale's page (fhir-harness
 * `resolveLangFragments`). A string with no translation stays English. Those
 * pages sit one level down (`<locale>/index.html`), so their links and images
 * point one level up.
 *
 * Usage:
 *   bun input/scripts/journey-cards.ts           # write the includes and the templates
 *   bun input/scripts/journey-cards.ts --check   # fail when a committed file is stale
 */
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { parsePo } from "../../cat-harness-tools/pipeline/po-inject.ts";
import { formatPot, potWithoutTimestamp, type PotEntry } from "../../cat-harness-tools/pipeline/pot-extract.ts";
import { readArchimate } from "../../cat-harness-tools/archimate/schemas/archimate.ts";
import { planSlugs } from "../../cat-harness-tools/archimate/schemas/slugs.ts";

const ROOT = resolve(import.meta.dir, "..", "..");
const VIEWER = "en/smart-trust/journeys/smart-trust";
const VERSION = /^version:\s*(\S+)/m.exec(readFileSync(join(ROOT, "sushi-config.yaml"), "utf8"))![1];
const MODEL = `en/smart-trust/archimate/${VERSION}`;
const LOCALES = ["ar", "es", "fr", "ru", "zh"];
const RTL = new Set(["ar"]);

/** The strip: two rows of system roles (scenarios/roles.json), Onesa left, Taifafeki right, with each box's colour. */
const STRIP: [string, string][][] = [
  [["signing-pki", "#E8833A"], ["trust-list", "#2F5597"], ["verifying-pki", "#1A9A8B"]],
  [["issuer", "#E8833A"], ["wallet", "#7A5BB5"], ["verifier", "#1A9A8B"]],
];

interface Lang { t: (s: string) => string; up: string; rtl?: boolean }
const ENGLISH: Lang = { t: (s) => s, up: "" };

/** The words the cards and the hero say themselves, not read from a scenario. */
const UI = {
  walkTitle: "Walk through this moment",
  walk: "Walk through it",
  archimate: "ArchiMate view",
  strip: "Active in this moment, in the ArchiMate model",
  kicker: "The story in one sentence",
  start: "Start the walkthrough",
  view: "The journey as ArchiMate",
  fictional: "Every person in this story is fictional, and so are both countries.",
} as const;

interface Step { headline?: string; narrative?: string; illustration?: { src: string; alt: string } }
interface Scenario { id: string; title: string; description: string; when?: string; where?: string; partOf?: string; personas: string[]; steps?: Step[] }
interface Role { id: string; title: string; description: string }

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const json = <T>(p: string): T => JSON.parse(readFileSync(join(ROOT, p), "utf8")) as T;

function scenarios(): Scenario[] {
  return readdirSync(join(ROOT, "user-scenarios")).filter((f) => f.endsWith(".json")).sort().map((f) => json<Scenario>(`user-scenarios/${f}`));
}
const moments = () => scenarios().filter((s) => s.partOf);
const parent = () => scenarios().find((s) => !s.partOf)!;
const roles = (): Map<string, Role> => new Map(json<{ roles: Role[] }>("scenarios/roles.json").roles.map((r) => [r.id, r]));

/** The roles a moment's people and systems play. */
function rolesOf(m: Scenario): Set<string> {
  const out = new Set<string>();
  for (const p of m.personas) for (const r of json<{ roles: string[] }>(`scenarios/actors/${p}.json`).roles) out.add(r);
  return out;
}

/** Each system role's ArchiMate element page, by the slug the archimate-pages visualiser gives it. */
function elementPages(): Map<string, string> {
  const model = readArchimate(readFileSync(join(ROOT, "archimate", VERSION, "smart-trust.archimate")));
  const slugOf = planSlugs(model);
  const out = new Map<string, string>();
  for (const [id, r] of roles()) {
    const el = model.elements.find((e) => e.type === "ApplicationComponent" && e.name === r.title);
    if (el) out.set(id, `${MODEL}/element/${slugOf.get(el.id) ?? el.id}/`);
  }
  return out;
}

function strip(m: Scenario, lang: Lang, pages: Map<string, string>): string {
  const { t, up } = lang;
  const on = rolesOf(m);
  const all = roles();
  const box = ([id, colour]: [string, string]) => {
    const r = all.get(id)!;
    const lit = on.has(id);
    const style = lit
      ? `background:${colour};color:#fff;border:2px solid ${colour};font-weight:600`
      : "background:#f1f5f9;color:#94a3b8;border:1px dashed #cbd5e1";
    return `<a href="${up}${pages.get(id) ?? ""}" title="${esc(t(r.description))}" style="display:flex;align-items:center;justify-content:center;text-align:center;min-height:2.6em;padding:3px 4px;border-radius:6px;font-size:.72em;line-height:1.15;text-decoration:none;${style}">${esc(t(r.title))}</a>`;
  };
  return [
    `<div style="margin:8px 0 6px;padding:6px;border-radius:8px;background:#fff;border:1px solid #e2e8f0" aria-label="${esc(t(UI.strip))}">`,
    `<div style="font-size:.7em;color:#64748b;margin:0 0 4px">${esc(t(UI.strip))}</div>`,
    ...STRIP.map((row) => `<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:4px;margin-bottom:4px">${row.map(box).join("")}</div>`),
    "</div>",
  ].join("\n");
}

export function cards(lang: Lang = ENGLISH): string {
  const { t, up } = lang;
  const pages = elementPages();
  const out = [
    "<!-- Generated by input/scripts/journey-cards.ts from user-scenarios/ and scenarios/. Do not edit; edit the scenarios and rerun. -->",
    '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(max(220px,calc((100% - 56px) / 5)),1fr));gap:14px;margin:12px 0 24px">',
  ];
  for (const m of moments()) {
    const walk = `${up}${VIEWER}/${m.id}/`;
    const [label, ...rest] = m.title.split(" · ");
    const name = rest.join(" · ") || m.title;
    const step = m.steps?.[0];
    const img = step?.illustration?.src.replace(/^input\/images\//, "") ?? "";
    out.push(
      '<div style="border:1px solid #e2e8f0;border-radius:14px;padding:12px;background:#f8fafc;color:#1e293b">',
      `<div style="font-size:.75em;font-weight:700;color:#2F5597;text-transform:uppercase;letter-spacing:.06em">${esc(t(label))}</div>`,
      `<div style="font-weight:700;font-size:1.02em;margin:2px 0 6px;min-height:2.5em">${esc(t(name))}</div>`,
      `<a href="${walk}" title="${esc(t(UI.walkTitle))}"><img src="${up}${img}" alt="${esc(t(step?.illustration?.alt ?? name))}" style="width:100%;border-radius:10px"/></a>`,
      strip(m, lang, pages),
      `<div style="font-size:.78em;color:#64748b">${esc([m.when && t(m.when), m.where && t(m.where)].filter(Boolean).join(" · "))}</div>`,
      `<p style="font-size:.88em;margin:6px 0">${esc(t(step?.headline ?? m.description))}</p>`,
      `<div style="font-size:.85em"><a href="${walk}"><b>${esc(t(UI.walk))}</b></a> · <a href="${up}${MODEL}/view/${m.id}/">${esc(t(UI.archimate))}</a></div>`,
      "</div>",
    );
  }
  out.push("</div>", "");
  return out.join("\n");
}

export function hero(lang: Lang = ENGLISH): string {
  const { t, up, rtl } = lang;
  const p = parent();
  const first = moments()[0];
  const button = (href: string, text: string, primary: boolean) =>
    `<a href="${href}" style="display:inline-block;padding:9px 16px;border-radius:8px;font-weight:600;text-decoration:none;` +
    (primary ? "background:#0ea5e9;color:#fff" : "background:rgba(255,255,255,.1);color:#fff;border:1px solid rgba(255,255,255,.18)") + `">${text}</a>`;
  return [
    "<!-- Generated by input/scripts/journey-cards.ts from user-scenarios/. Do not edit; edit the scenarios and rerun. -->",
    '<div style="background:linear-gradient(135deg,#0f172a,#0c2a43);color:#fff;border-radius:16px;padding:28px 32px;margin:8px 0 20px">',
    rtl
      ? `<div style="font-size:.85em;color:#7dd3fc">${esc(t(UI.kicker))}</div>`
      : `<div style="font-family:monospace;font-size:.75em;letter-spacing:.12em;color:#7dd3fc;text-transform:uppercase">${esc(t(UI.kicker))}</div>`,
    `<div style="font-size:1.5em;font-weight:700;line-height:1.25;margin:10px 0 12px;max-width:44em">${esc(t(p.description))}</div>`,
    `<p style="color:#cbd5e1;margin:0 0 18px;max-width:52em">${esc(t(UI.fictional))}</p>`,
    `<div style="display:flex;gap:10px;flex-wrap:wrap">${button(`${up}${VIEWER}/${first.id}/`, `${rtl ? "&#9665;" : "&#9655;"} ${esc(t(UI.start))}`, true)}${button(`${up}${MODEL}/view/${p.id}/`, `${esc(t(UI.view))} ${rtl ? "&#8592;" : "&#8594;"}`, false)}</div>`,
    "</div>",
    "",
  ].join("\n");
}

/** Every string a card or the hero shows, as the template a translator works from. */
export function entries(): PotEntry[] {
  const out: PotEntry[] = [];
  const seen = new Set<string>();
  const add = (source: string, msgid: string | undefined, comment: string) => {
    if (!msgid || seen.has(msgid)) return;
    seen.add(msgid);
    out.push({ source, line: out.length + 1, msgid, kind: "ui-string", comment });
  };
  for (const m of moments()) {
    const src = `user-scenarios/${m.id}.json`;
    const [label, ...rest] = m.title.split(" · ");
    add(src, label, "A moment's label over its card: Prologue, or the step's number.");
    add(src, rest.join(" · ") || m.title, `Moment ${m.id}: its title on the home page's card.`);
    add(src, m.steps?.[0]?.illustration?.alt, `Moment ${m.id}: its picture's alternative text.`);
    add(src, m.when, "When the moment happens, on its card.");
    add(src, m.where, "Where the moment happens, on its card.");
    add(src, m.steps?.[0]?.headline ?? m.description, `Moment ${m.id}: its card's one-line summary.`);
  }
  for (const r of roles().values()) {
    if (!STRIP.flat().some(([id]) => id === r.id)) continue;
    add("scenarios/roles.json", r.title, "A box of the ArchiMate strip under each card: an ArchiMate element's name.");
    add("scenarios/roles.json", r.description, "The tooltip of that box.");
  }
  add(`user-scenarios/${parent().id}.json`, parent().description, "The home page's story in one sentence.");
  const ui: Record<keyof typeof UI, string> = {
    walkTitle: "Tooltip on a card's picture.",
    walk: "A card's link into the journeys viewer.",
    archimate: "A card's link to the moment's ArchiMate view.",
    strip: "Caption over the ArchiMate strip: lit boxes are active in the moment, grey ones are not.",
    kicker: "Small heading over the story in one sentence.",
    start: "The hero's first button.",
    view: "The hero's second button: the journey's ArchiMate view.",
    fictional: "The line under the story in one sentence.",
  };
  for (const k of Object.keys(UI) as (keyof typeof UI)[]) add("input/scripts/journey-cards.ts", UI[k], ui[k]);
  return out;
}

function langOf(locale: string): Lang | undefined {
  const path = join(ROOT, "translations", locale, "journey-cards.po");
  if (!existsSync(path)) return undefined;
  const po = parsePo(readFileSync(path, "utf8"));
  if (![...po.values()].some((v) => v.trim())) return undefined;
  return { t: (s) => po.get(s)?.trim() || s, up: "../", rtl: RTL.has(locale) };
}

const fragment = (base: string, locale?: string) => join(ROOT, "input/includes", `${base}${locale ? `-${locale}` : ""}.html`);

function emit(path: string, want: string, check: boolean, same: (a: string, b: string) => boolean = (a, b) => a === b): boolean {
  const rel = path.slice(ROOT.length + 1);
  if (check) {
    const have = existsSync(path) ? readFileSync(path, "utf8") : "";
    if (!same(have, want)) {
      console.error(`${rel}: stale; run bun input/scripts/journey-cards.ts`);
      return false;
    }
    console.log(`${rel}: current`);
    return true;
  }
  if (existsSync(path) && same(readFileSync(path, "utf8"), want)) return true;
  mkdirSync(join(path, ".."), { recursive: true });
  writeFileSync(path, want);
  console.log(`${rel}: written`);
  return true;
}

if (import.meta.main) {
  const check = process.argv.includes("--check");
  const results = [emit(fragment("journey-cards"), cards(), check), emit(fragment("journey-hero"), hero(), check)];
  for (const locale of LOCALES) {
    const pot = formatPot(entries(), { projectName: "smart-trust", locale });
    results.push(emit(join(ROOT, "translations", locale, "journey-cards.pot"), pot, check, (a, b) => potWithoutTimestamp(a) === potWithoutTimestamp(b)));
    const lang = langOf(locale);
    for (const [base, make] of [["journey-cards", cards], ["journey-hero", hero]] as const) {
      const path = fragment(base, locale);
      if (lang) results.push(emit(path, make(lang), check));
      else if (existsSync(path)) {
        console.error(`${path.slice(ROOT.length + 1)}: ${locale} translates none of the cards; delete it`);
        results.push(false);
      }
    }
  }
  if (!results.every(Boolean)) process.exit(1);
}
