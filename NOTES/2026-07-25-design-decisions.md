# Design decisions and fixes — build session, 25 July 2026

Captured while continuing the NEO Maths repo work (curriculum partner + Claude). These
notes are append-only: refine by adding, not deleting. They record three fixes made this
session and the reasoning behind them, so the same ground is not lost again.

## 1. Worked-solution unlock gate (v1.0) — audit before retrofit

The 22 July handover listed five lessons as still needing the v1.0 unlock gate (prompt +
hint + two checked answers, per question, never inherited). An audit of the actual repo
found the list was stale: **four of the five already carried a correct gate.** pyth-01,
pyth-02 and pyth-03 each hold an `enforceWorkedSolutionRule` wrapper; place-value builds
the same rule directly into its practice module (the "item 75" comment). Only
`equation-of-a-straight-line` genuinely lacked it — and its old gate was the weak one
(unlocked after a single attempt; the worked solution revealed unconditionally).

**What changed:** the gate was added inside eqline's practice module, mirroring
place-value's approach — `promptUsed` / `hintUsed` arrays, `solutionUnlocked(i)`,
`solutionLockMessage(i)`, a guarded `showPracticeSolution` that refuses with a lock
message while locked, and an attempt only counted when the answer is non-empty.

**Principle to carry forward:** the repo is the source of truth. Before applying any
cross-lesson "design push", audit each target lesson for an existing implementation.
Assume the handover list may lag the code. Verify, then act.

**Verification:** each lesson's real HTML was loaded in a headless DOM with its scripts
executing, and driven through the full truth table — locked initially, after prompt-only,
hint-only, one attempt, and an empty check that must not count; unlocked only after prompt
+ hint + two non-empty checks; state not leaked to the next question and remembered on
return. All five pass 8/8.

## 2. Charset declaration — a build-time guarantee

eqline rendered as mojibake on localhost (`ðŸŒ¿` for 🌿, `â€"` for the em-dash) while every
other lesson was fine. Cause: eqline's source is a bare HTML *fragment* — it begins at
`<div id="lessonView">` with no `<head>` — so it was the only page with no
`<meta charset="utf-8">`. With no charset declared, `python -m http.server` serves it
without one and the browser falls back to Windows-1252, misreading the UTF-8 bytes. The
file itself was always valid UTF-8; only the declaration was missing.

**What changed:** `scripts/build_site.py` gained an `ensure_charset` step in the build
loop. It guarantees a `<meta charset="utf-8">` in the first bytes of every output page —
a no-op for the full-document lessons that already declare it, and future-proof for any
other fragment lesson. Charset is cross-cutting, so it belongs in the build alongside the
header/footer/comfort injections, not patched per lesson.

**Aside on "reverted" lessons:** the same session raised a fear that all recent changes
had reverted on localhost. They had not — git history and the on-disk `docs/` files still
carried every push (comfort, palette, accordion) and the new gate. The stale appearance
was browser cache. After a rebuild, a hard refresh (Cmd+Shift+R) or a private window
clears it. Worth remembering before assuming work is lost.

## 3. Visual containment for the Hidden Squares interactive (GreenPrint D7 / §17)

The Dynamic Squares interactive in pyth-01 was clipping again. This had been fixed once,
but only in the uncommitted Hidden Squares prototype — when that prototype's vault file
reverted to the original, the fix went with it. This records the approach so it survives
the next prototype cycle.

**Why it clips:** the construction is not the triangle. With the right angle at A, the
blue square extends left to `x = Ox − legC`, the red square down to `y = Oy + legB`, and
the green square on the hypotenuse reaches its far vertex at
`(Ox + legB + legC, Oy − legB − legC)`. The whole bounding box is roughly 900×900 at the
default legs and up to ~1320×1320 at the 430 leg-max — but the old `viewBox` was only
`980×720`, and mis-centred, so it cropped top and bottom even at rest.

**The fix (the general rule):** size the `viewBox` from the bounding box of the *whole*
construction across the full interaction range, plus a deliberate safety margin — never
from the central shape. Concretely: `viewBox` set to `1500×1500`, the default origin
recentred, and a `clampAreaOrigin()` (called at the top of every render) that keeps the
complete bounding box — squares, labels, right-angle marker and drag handles — inside the
frame at every leg size and while panning, so nothing can be dragged out of view. The
container keeps `overflow:hidden`, which is now safe because nothing spills.

**Verification:** 5,488 configurations were checked programmatically — every leg pair
from 160 to 430, plus pan-to-edge and off-screen pan attempts, with label and handle
extents included — for zero clipping and a minimum 48px margin to the frame edge. A
headless-DOM smoke test confirmed reset / randomise / centre / reveal all run without
error and the interactive still renders; the unlock gate on the same lesson still passes.

**Standing reminder:** whenever a diagram fix lives only in a prototype, it is not live.
Build-time injections (header, footer, comfort, palette, accordion, charset) reach every
lesson from one change; per-lesson interactive fixes must be committed into that lesson's
vault source or they are lost on the next reset. Check every diagram against its full
intended construction — attached squares, labels, markers, handles — not the central
object, at the default state and at every interaction extreme.
