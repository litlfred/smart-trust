# French round-trip evidence (not for merge)

Untainted round trip of a sample of the French catalogues in `translations/fr/`:
every 4th string of the page and BPMN catalogues plus the whole GDHCN glossary,
703 strings (key `<pot>#<n>`). Back-translators saw only the French (one Read,
one Write; TOOLS_USED recorded); the adjudicator saw only the English source and
the back-translation.

Result: 671 pass, 21 warn, 11 fail. All 11 fails were one class, SHOULD
rendered as MUST (doit/doivent), mostly in ethical_principles; fixed across
every catalogue (not just the sample) in 3500607. Warns: "Trusted Service"
read back as "Trust Service" (French "service de confiance" covers both), a
few agency-name and "release"/"deprecated" renderings, and one source typo
("with changing" for "without changing") carried through faithfully.

Verdicts are agent rulings; no human has adjudicated.
