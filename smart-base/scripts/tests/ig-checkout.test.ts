/**
 * smart-trust's IG site, and the releases it and smart-base record, as the
 * fhir-harness pipeline reads them in a checkout that composes all three.
 *
 * MOVED HERE from `cat-harness-tools/test/coordinator/` (owner, 2026-10-09:
 * the coordinator tests "should not import fhir-harness" — cat-harness-tools
 * sits below fhir-harness, and `check:import-direction` refuses the edge).
 * Each assertion here is about REAL WHO data, so it belongs to an instance
 * that may name both WHO and the pipeline: smart-trust needs smart-base,
 * which needs fhir-harness. The BEHAVIOUR under test — `igSiteDocs` finds a
 * declared IG site and nothing else, `webpagePalette` inherits along
 * `needs`, `IgReleasesSchema` accepts what an ingest writes — is fhir-harness's
 * own, and stays tested there over synthetic instances, which is also where
 * "an instance with no IG has no IG docs" now lives (it used to be asserted
 * of who-iris here).
 *
 * | was | now |
 * |---|---|
 * | `build-ig-site-checkout.test.ts` › igSiteDocs over this repository | `igSiteDocs` below, smart-trust and smart-base; the non-IG case in fhir-harness `scripts/build-ig-site.test.ts` |
 * | `build-ig-site-checkout.test.ts` › webpagePalette over this repository | `webpagePalette` below |
 * | `ig-releases-checkout.test.ts` › the committed records validate | `releases.json` below |
 *
 * Every path is composed from this file's own directory, so it reads the same
 * files wherever the checkout puts the instance.
 *
 * @module smart-trust/scripts/tests/ig-checkout.test
 */
import { describe, expect, test } from "bun:test";
import { join, resolve } from "node:path";

import { IgReleasesSchema } from "../../../fhir-harness/schemas/ig-releases.ts";
import { igSiteDocs, webpagePalette } from "../../../fhir-harness/scripts/stage-ig-sites.ts";

/** This instance's root (`smart-trust/` in a composed checkout). */
const INSTANCE = resolve(import.meta.dir, "..", "..");
/** The checkout that composes it beside smart-base and fhir-harness. */
const CHECKOUT = resolve(INSTANCE, "..");
const SMART_BASE = join(CHECKOUT, "smart-base");

describe("igSiteDocs over the WHO IGs this checkout holds", () => {
  test("smart-trust DECLARES igSite, so its IG site builds at its own root", () => {
    expect(igSiteDocs(INSTANCE)).toBe(join(INSTANCE, "docs/"));
  });

  test("smart-base does too, the same way (owner: \"no drift issues\")", () => {
    expect(igSiteDocs(SMART_BASE)).toBe(join(SMART_BASE, "docs/"));
  });
});

describe("webpagePalette inherits along needs (bean `mftp`)", () => {
  test("smart-trust declares no theme and wears smart-base's, found through its needs", () => {
    const t = webpagePalette(CHECKOUT, "smart-trust");
    expect(t.palette).toBeDefined();
    expect(t.note).toContain("inherited from smart-base");
  });

  test("smart-base's theme is its own, not inherited", () => {
    expect(webpagePalette(CHECKOUT, "smart-base").note).not.toContain("inherited");
  });
});

describe("ig-releases/v1 over the committed WHO records", () => {
  for (const [name, root] of [
    ["smart-trust", INSTANCE],
    ["smart-base", SMART_BASE],
  ] as const) {
    test(`${name}'s releases.json validates`, async () => {
      const r = IgReleasesSchema.safeParse(await Bun.file(join(root, "fhir-artifact-index", "releases.json")).json());
      expect(r.success, r.success ? "" : JSON.stringify(r.error.issues.slice(0, 3))).toBe(true);
    });
  }
});
