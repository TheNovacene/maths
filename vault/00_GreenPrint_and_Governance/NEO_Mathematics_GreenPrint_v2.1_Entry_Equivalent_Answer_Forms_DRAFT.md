# NEO Mathematics GreenPrint — Running Design Record entry v2.1 (DRAFT)

**Proposed version:** 2.1 · **Date:** 2026-09-07 · **Controlling record:** builds on Active v1.6, extends entry v2.0
**Status:** Draft entry for filing · Curriculum by Gerry Docherty

*"Connection before curriculum. Always."*

## Decision — answer checking accepts every mathematically equivalent form, and this is enforced by QA, not left to prose

A learner who enters a **correct** answer in a different **written form** must be marked
correct. In particular, where the value is a fraction, the learner may type it as a
fraction `a/b` (e.g. `1/2`), as the unicode glyph (`½`, `¼`, `¾`), or as the decimal
(`0.5`) — all are accepted. The same holds for a leading `+` and for the unicode minus
`−` versus the keyboard hyphen `-`. Marking never depends on the surface form the learner
chose; it depends only on the mathematical value (with a sensible tolerance for
non-integers).

Entry v2.0 already stated that "accepted-answer tolerance stays generous", but it
illustrated only **word** synonyms ("bottom" as well as "denominator"). It did not name
**numeric** equivalent forms, gave no shared implementation, and added no QA check — so
the principle was true on paper but not enforced, and the same defect kept recurring.

## Why this entry exists (the recurring defect)

This is the third time a variant of the same bug has surfaced: a learner enters a correct
value in an unexpected form and the interactive marks it wrong.

- **Root cause.** The parser copied into each lesson (`num()`) did `Number(value)`.
  `Number("1/2")` is `NaN`, so a fraction was silently rejected even though it is exactly
  what a thoughtful learner would type for a coefficient like ½.
- **Why it recurred.** The "stay generous" rule lived only as prose. There was no shared
  fraction-aware parser and, crucially, **no QA gate that would fail when a valid fraction
  was rejected**. So each new lesson re-introduced the gap, and it was caught only by the
  curriculum lead spotting it by hand — exactly the manual re-checking this record exists
  to remove.
- **Triggering case.** QD-06 "Stretch and reflect": the table-compare panel for
  `y = ½x²` accepted `0.5` but rejected `1/2` and `½`.

## The standard (locked)

1. **One fraction-aware parser everywhere.** Every numeric input — in every interactive
   and every Practice Companion — parses through a single tolerant `num()` that
   understands fractions, the unicode fraction glyphs, decimals and the unicode minus:

   ```js
   function clean(v){return String(v).replace(/[,\s]/g,'').replace(/½/g,'0.5').replace(/¼/g,'0.25').replace(/¾/g,'0.75').replace(/−/g,'-').trim();}
   function num(v){var s=clean(v);var m=s.match(/^(-?\d+(?:\.\d+)?)\/(-?\d+(?:\.\d+)?)$/);if(m){var d=Number(m[2]);return d===0?NaN:Number(m[1])/d;}var n=Number(s);return Number.isFinite(n)?n:NaN;}
   ```

   `num("1/2")`, `num("½")` and `num("0.5")` all return `0.5`; `num("−4")` returns `-4`.
   Non-integer answers are compared with a tolerance, never with `===` on a string.
   Word answers keep the existing `normText()` synonym acceptance.

2. **QA gate 6a — equivalent-form acceptance (addition to the shipping gates).** A lesson
   does not ship until its jsdom QA harness proves equivalence acceptance. For **every**
   numeric answer field, the harness asserts that at least one equivalent form is
   accepted; and wherever any correct answer is **non-integer**, the harness MUST assert
   the **fraction form** (`a/b`) is accepted, not only the decimal. A rejected valid
   fraction is a ship-blocker, on the same footing as a broken worked-solution unlock.

3. **Display precision is unchanged.** This entry governs *marking* only. Precise display
   vocabulary and notation (entry v2.0) are untouched; a lesson may still *show* ½ as the
   preferred form while *accepting* 1/2 and 0.5.

## Implications and retrofit

- **Skill updated.** The `neo-mathematics` skill's SKILL.md now carries this parser
  verbatim as a "must use" standard and states QA gate 6a, so every future lesson bakes it
  in by default. (The reference-shell `num()` is superseded by the fraction-aware version;
  upgrade it whenever starting from the shell.)
- **Retrofit, low priority but tracked.** Earlier lessons whose numeric fields can take a
  non-integer answer should have `num()` upgraded and a fraction QA case added when next
  touched. Lessons with only integer answers are unaffected in practice but should still
  adopt the shared parser for consistency.

## Next step

Reword into the Running Design Record prose and consolidate with the pending
v1.7/v1.8/v1.9/v2.0 entries at the next milestone regeneration of the GreenPrint Active
document, folding QA gate 6a into references/qa-gates.md gate 6.
