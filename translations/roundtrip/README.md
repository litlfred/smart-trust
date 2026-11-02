# Round-trip verification of the UN-language translations

This folder records how the Arabic (ar), Chinese (zh), French (fr), Russian (ru) and Spanish (es) translations of this IG were produced and checked. English is the source. Issue: litlfred/smart-trust#133.

The translations themselves are gettext `.po` files that sit next to the `.pot` templates written by smart-base's `extract_translations.py`:

- `input/pagecontent/translations/<lang>.po`: narrative pages
- `input/images/translations/<lang>.po`: SVG diagram text
- `input/images-source/translations/<lang>.po`: PlantUML diagram text
- `translations/<lang>/glossary/smart-trust--gdhcn.po`: the GDHCN glossary

smart-base's `inject_translations.py` reads these files.

## Method

1. **Termbase.** A termbase was built for each language. It was seeded from the official WHO GDHCN documents that this repo holds in several UN languages: circular letter C.L.38.2023 and the Letters of Application.
2. **Translation.** All 2,864 strings were machine-translated for each language, in two halves.
3. **Blind back-translation.** An independent agent translated each language back into English. It saw only the target-language text, never the English source.
4. **Comparison.** Every string was judged as ok, minor or drift. Every drift and most minors were fixed.
5. **Harmonisation.** Terms were made consistent across the two halves (`<lang>/termbase.json`).
6. **Second round trip.** Every string changed in steps 4 and 5 was back-translated blind and compared again.
7. **Mechanical checks.**
   - URLs, link targets, inline code, `{…}` placeholders, HTML tags, heading prefixes and bold markers must survive.
   - The Arabic must contain no bidi control characters.

## Results (strings per language: 2,864)

| lang | ok | minor | drift (all fixed) | second round trip (changed strings) |
|---|---|---|---|---|
| ar | 2815 | 42 | 7 | 174 checked, 0 drift |
| zh | 2829 | 29 | 6 | 122 checked, 0 drift |
| fr | 2848 | 12 | 4 | 66 checked, 0 drift |
| ru | 2810 | 40 | 14 | 95 checked, 0 drift (1 minor fixed) |
| es | 2841 | 17 | 6 | 89 checked, 0 drift |

Each `review.json` file lists every string that was not judged ok, with a note.

## Conventions

- **Normative keywords** are mapped to fixed equivalents in each language (see each termbase), so SHALL, SHOULD and MAY stay distinguishable.
- **Acronyms.** Where the English uses an acronym (GDHCN, PKI, TNG, DID…), the Latin acronym is kept. Where the English spells a name out, the official translated name is used.
- **Source errors.**
  - Content errors in the English are translated faithfully, not silently corrected. Examples:
    - "DDCC Vaccination Status (DDCC:TR)"
    - "Transport Layer Security (TNPUP)"
    - "Data Access Kit (DAK)"
    - "Each Trust Network Certificate brings its own TNPUP"
    - "3-digit ISO code"
  - Each case is listed in `<lang>/source-errors.json`, so the English can be fixed upstream.
  - Plain spelling typos are translated by their intended meaning.

## Status

These are machine translations with round-trip verification. They have **not** yet been reviewed by native-speaker or WHO translation services and should not be released as official translations until that review is done.
