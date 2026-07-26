# Design decisions and work log — build session, 26 July 2026

Continuation of the NEO Maths repo work (curriculum partner + Claude). Append-only:
refine by adding, not deleting. This entry records the Reconnection Routes rollout, two
worked-solution gate fixes, the eqline consistency work, and the Practice Companion
standardisation.

## 1. Reconnection Routes — now complete across all lessons

The Reconnection Routes control (GreenPrint E2/§19) is now present in every lesson. Before
this session only the Accuracy reference lessons had it; it has now been added to all eight
that lacked it: Pythagoras 01–04, Ratio and Proportion, Place Value, Straight-Line Graphs,
and Equation of a Straight Line.

Each lesson was handled one at a time. For every lesson the prerequisites were framed
first, the recap questions and hints drafted for the curriculum lead's review, and only
then built — so each set of routes is genuinely specific to that lesson rather than a
generic catch-up menu. The routes chosen:

- **Pyth-01:** square numbers, square roots, right angles.
- **Pyth-02:** square numbers, square roots, the hypotenuse (is it longest or shorter?).
- **Pyth-03:** square numbers, square roots, the hypotenuse (is its square larger?).
- **Pyth-04:** choosing add-vs-subtract, square roots, the hidden right angle (perpendicular bisector).
- **Ratio:** scaling by a multiplier, equivalent fractions, sharing into parts.
- **Place Value:** value of a digit, bundling in tens, partitioning.
- **Straight-Line:** coordinates, substitution, finding a change.
- **Equation of a line:** negative numbers, the y-axis (x = 0), substitution.

Each control is recurring furniture in the support area, opens an in-page panel offering
only that lesson's prerequisites, and each route gives a checked answer, a hint, and a
"Return to the lesson" that preserves the learner's place. Answer-checking accepts numeric
tolerances and sensible typed variants (e.g. "larger"/"bigger", "-6"/"−6", "the longest
side"), honouring the highest-priority answer-equivalence rule. Every hint was tuned to
name the structure but stop short of stating the answer, keeping the reasoning with the
learner.

**Reference implementation:** the control is a small self-contained script per lesson, styled
to match each lesson's own shell (the Pythagoras lessons reuse the `guidebtn`/`card`
classes; ratio, straight-line and eqline are inline-styled; place value uses its `neo-`
classes). Each was verified in a headless DOM (9–15 checks per lesson) plus a check that the
existing unlock gate did not regress.

## 2. Two worked-solution gate fixes (empty-check counting)

While adding Reconnection Routes, the gate harness surfaced a pre-existing v1.0 compliance
gap in two lessons: **Ratio** and **Straight-Line Graphs** counted an *empty* "Check" click
as an attempt (`pAttempts[pIndex]++` ran unconditionally), so prompt + hint + one real try +
one blank Check unlocked the worked solution. The v1.0 rule (GreenPrint D8) requires two
*non-empty* checked answers.

Both were fixed with the same one-line change used earlier on the equation lesson — count
the attempt only when the answer is non-empty (`if (learner) pAttempts[pIndex]++;`). The
Pythagoras lessons and Place Value already guarded correctly. All now pass the full gate
truth table 8/8.

**Standing reminder:** when retrofitting any cross-lesson feature, run the gate truth table
on each lesson as you touch it — the same weakness can hide in lessons that "already have"
the gate.

## 3. Equation-of-a-Straight-Line brought into line with the others

The eqline lesson (the migration pilot) was a bare fragment with no support area. To make it
consistent it gained a proper "Lesson Guides and Scratchpad" support block — Learner Guide,
Supporting Adult Guidance, the full GreenPrint-standard Scratchpad (copied verbatim from
Pyth-02, opening on a coordinate-grid background), and the Reconnection Routes control.

**Open item:** eqline has no Learner or Supporting Adult Guidance PDFs yet. The two buttons
link to convention-named files (`NEO_Maths_Equation_of_a_Straight_Line_Learner_Guide.pdf`
and `..._Supporting_Adult_Guidance.pdf`), following the same pattern as Pyth-02/04 whose
folders also lack the PDFs. Those buttons will 404 until the PDFs are written and placed in
the lesson folder.

## 4. Practice Companion trigger — standardised site-wide (build-time)

The practice trigger was inconsistent: 12 lessons used a plain button near the top
("Open Practice Companion", calling `openPractice()` or `openPracticeSession()`), while
ratio, straight-line and eqline used a bottom card headed "Ready to strengthen your skills?"
with "Open Practice Activity →" and an instructions paragraph.

This was standardised as a **build-time injection** (`inject_practice_card` in
`scripts/build_site.py`), the same mechanism as the shared header/footer/comfort controls.
For each lesson the build detects the open-function, removes the existing trigger (plain
button or old card), tidies any empty box left behind, and drops one identical card at the
bottom of the lesson view:

> ✏️ Ready to strengthen your understanding? — with a single centred "Open Practice
> Companion" button (no arrow, no instructions paragraph).

Wording decisions (curriculum lead): "understanding" rather than "skills" (a lesson is not
always about a skill); "Practice Companion" rather than "Practice Activity"; no arrow on the
button. Placing the card at the bottom of the lesson view also delivered the previously
deferred "button at the bottom, centred" item.

The vault sources are unchanged — the card is injected at build time, so it reaches every
lesson from one change. Verified across all 13 lesson sources (exactly one standard card,
correct open-function, correct bottom placement, no leftover trigger or empty box,
idempotent) plus a functional headless-DOM check on four structural variants confirming the
card renders and its button opens the practice panel.

## 5. Smaller build fixes captured this session

- **`ensure_charset`** in `build_site.py`: guarantees `<meta charset="utf-8">` in the first
  bytes of every built page. Fixes mojibake on fragment lessons (eqline had no `<head>`);
  no-op where a charset is already declared.
- **Local preview** documented in the README: `python3 -m http.server 8000 --directory docs`
  run from the repo root, with the two-tab workflow (server in one tab, build in another,
  hard-refresh to see changes) — no need to `cd` between the repo root and `docs`.

## 6. State of the original design-push list

All items from the 25 July list are now complete: v1.0 worked-solution unlock gate (audited
— most lessons already had it; only the equation lesson needed it), Reconnection Routes
(all lessons), and the Practice Companion button position and naming (standardised
build-time card). Remaining follow-ups are content, not mechanism: the eqline guidance PDFs,
and any per-lesson guidance PDFs still pending across the unit.
