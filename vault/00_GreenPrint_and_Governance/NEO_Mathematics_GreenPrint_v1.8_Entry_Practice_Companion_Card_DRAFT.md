# NEO Mathematics GreenPrint — Running Design Record entry v1.8 (DRAFT)

**Proposed version:** 1.8 · **Date:** 2026-07-27 · **Controlling record:** builds on Active v1.6
**Status:** Draft entry for filing · Curriculum by Gerry Docherty

*"Connection before curriculum. Always."*

## Decision — the Practice Companion card is a standard, build-guaranteed control

Every lesson opens its Practice Companion from **one standard card at the bottom of the
lesson view**: a cream card with a left green border, centred, headed
**"✏️ Ready to strengthen your understanding?"**, containing a single centred
**"Open Practice Companion"** button — no arrow, and no instructions paragraph.

Wording is locked:
- **"understanding"**, not "skills" — a lesson is not always about developing a skill.
- **"Practice Companion"**, not "Practice Activity".
- **No arrow** on the button.

### How it is guaranteed

The card is a **build-time injection**, exactly like the shared header, footer and Comfort
control. `inject_practice_card` in `scripts/build_site.py`:

1. detects each lesson's practice open-function (`openPractice()` or `openPracticeSession()`);
2. removes the existing trigger — whether a plain button (anywhere in the lesson) or an older
   "Ready to strengthen your skills?" card;
3. tidies any empty support box the removed button leaves behind;
4. places the single standard card at the **bottom of the lesson view**, before the practice
   panel, so it hides correctly when practice opens.

The step is idempotent and a no-op if the anchor or trigger cannot be found, so a lesson is
never left in a broken state.

### Authoring rule (for every new lesson)

When authoring a lesson, expose **a single** `openPractice()` / `openPracticeSession()`
trigger and nothing more. **Do not hand-build a bespoke practice button or a card** — the
build standardises it. This delivers the previously separate "button at the bottom, centred"
requirement automatically, and keeps every lesson identical from one change.

## Rationale

Before this rule, the practice trigger varied across lessons (a plain button near the top in
most; an older bottom card headed "Ready to strengthen your skills?" with "Open Practice
Activity →" and an instructions paragraph in a few). Standardising it as a build-time card
removes that drift with a single mechanism, matches how the other cross-cutting controls are
injected, and fixes wording and position in one place.

## Implications and QA

- **QA (production gate):** confirm each built lesson carries exactly one `neo-practice-cta`
  card, at the bottom of the lesson view, with the fixed heading and button label, and no
  leftover legacy trigger or empty box. This is checkable programmatically.
- **Coverage map:** no per-lesson field change; the card is guaranteed at build.
- **Related standards captured the same week (for the next consolidation):** Reconnection
  Routes present in every lesson; the v1.0 worked-solution unlock counts only non-empty
  checked answers (empty "Check" clicks must not count); `ensure_charset` guarantees a UTF-8
  declaration on every built page; the build copies each lesson's guidance PDFs into `docs/`.

## Next step

Reword into the Running Design Record prose and consolidate with the pending v1.7 entry at the
next milestone regeneration of the GreenPrint Active document.
