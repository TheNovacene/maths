# Design decisions — 28 July 2026

Append-only.

## Self-contained 3D interactives adopted for the 2D and 3D Shapes unit

Confirmed by a working proof of concept: genuine draggable 3D solids built from pure inline
**CSS 3D transforms** — any prism base (triangle, square, pentagon, hexagon), no library,
**no external or third-party calls**. This clarifies that the long-standing constraint was
always "no external/CDN calls", never "no 3D". The reusable component is filed at
`vault/05_Lesson_Templates/NEO_3D_Solids_Component_CSS3D_v0.1.html`.

**Adopted for Lesson 5 (Nets)** — folding a flat net up into a solid — **and Lesson 7
(Cross-sections)** — slicing a solid to see the cross-section face-on — where rotation most
deepens understanding. Conditions: fully inline (no external calls), optional with a 2D
fallback, honour Reduce motion, keep visual containment, stay reasoning-first. Curved solids
(sphere/cylinder/cone) don't render well as flat CSS faces — use a small inline canvas
projector or keep 2D. Lesson 1 keeps its 2D Prism Family Explorer.

Recorded in GreenPrint entry v1.9
(`vault/00_GreenPrint_and_Governance/NEO_Mathematics_GreenPrint_v1.9_Entry_Self_Contained_3D_DRAFT.md`)
and the Unit Blueprint.

A geometry note for whoever reuses the component: end-faces (the clip-path polygons) must be
placed at the base polygon's **bounding-box centre**, not the scene origin — otherwise
odd-sided prisms (triangle, pentagon) misalign, because their bounding box is not centred on
the origin. Even-sided bases happen to be centred, which is why they looked right before the fix.

## Lesson 2 (Angles in Polygons) built

Built to the reference-shell contract with three interactives chosen by the curriculum lead:

- **Connection — Polygon Explorer** (table-driven). Adapted from Gerry's Canva "Polygon Explorer":
  a sides slider (3–8), vertex-label and circumcircle toggles, a "Draw triangulation lines"
  tool, a live Current-Polygon readout, and an **Investigation Table** the learner fills in
  (triangles + interior-angle sum per row). Cells settle **green** when correct and **soft amber**
  (never harsh red) when not yet; a "your sums so far" strip lets the pattern emerge before the
  learner writes the formula. The formula box accepts **any equivalent form** — it evaluates the
  expression on n = 3…9 and compares to (n − 2) × 180 (sanitised input, so 180(n−2), 180n − 360,
  (n − 2)180 all pass), honouring the answer-equivalence rule rather than one hard-coded string.
  Rendered in the NEO palette, not the Canva blue/purple (novelty from the maths, not the interface).
- **Movement — Exterior-Angle Walk**: step a marker round any polygon; each corner turns by the
  exterior angle; the running total reaches exactly 360° after one lap, for every polygon.
  Step-based (button clicks), so no animation to gate under Reduce motion.
- **Creativity — Corner-Fit**: place copies of a regular shape around a point; watch the angle
  total close the point exactly (triangle/square/hexagon), leave a gap, or overlap. Seeds the
  "why only five Platonic solids" idea for Lesson 6, and Nutrition (Mode A) uses it for the honeycomb.

Reflection is an "Angle Reasoner" true/false-and-why set (justification, not recall). Practice
Companion has six questions with the v1.0 unlock gate; Q6 (generalise) reuses the same formula
equivalence checker. Reconnection Routes: triangle angle sum, angles on a line, angles around a
point, naming polygons — wording easy to adjust.

Verified with a jsdom harness (44/44) covering all three interactives, the table's green/amber
marking, the formula equivalence (accept and reject cases, including junk-input rejection), the
walk's 360° invariant, Corner-Fit's fit/gap/overlap logic, the Reconnection Routes, and the
per-question unlock gate (locks, unlocks only after prompt + hint + two non-empty checks, never
inherited, empty check not counted). Built output confirmed: one standard Practice card at the
bottom, support-row trigger stripped, charset and shared chrome present.

Guidance PDFs (Learner + Supporting Adult) still to be generated after Gerry accepts the lesson.

### Lesson 2 review round 1 — four refinements (Gerry)

- **Formula checker widened.** The interior-angle-sum formula box was rejecting answers that used the
  letter **"x"** for multiply (e.g. `180x(n-2)`), which read as "only 180(n-2) is accepted". Now
  normalises x / X / · / ∙ / × to `*` and the unicode minus variants to `-` before evaluating, so
  (n−2)×180, 180×(n−2), 180x(n-2), 180n−360 and spaced variants all pass. Also cleared the deg/degrees
  replace-order bug. Added `oninput` clearing of the formula feedback so stale "Not yet" never lingers
  once the learner edits — a re-check always reflects the current answer.
- **Exterior-Angle Walk now shows the turning.** Each step draws the walked edge **and** a little orange
  exterior-angle wedge at the corner (with a dashed "straight-on" reference line), plus a **turn dial**
  in the readout that fills as the total turn grows and closes into a full circle at 360°. Makes "one
  full turn round any polygon" visible rather than just a number.
- **Creativity redesigned as the Tessellation Investigator** (was Corner-Fit). Now investigative:
  learners **drag** a shape tile onto the centre point (or tap it — pointer-events with a click/tap
  fallback, so no fine-motor requirement), test each shape, and an **investigation record** table
  auto-fills (shape · interior angle · copies that fit · fills 360? ✓/✗). A "what do the tessellating
  shapes share?" reveal draws out the rule: the interior angle must divide evenly into 360°. Still
  bridges to the Platonic solids.
- **Practice Companion card position** — confirmed a non-issue: the raw source keeps a support-row
  trigger by design; the build relocates it to the single standard card at the bottom. The built/
  deployed page is correct (verified). Preview the built page, not the source.

Re-verified with the jsdom harness (48/48), including the widened formula checker (accept + reject +
junk-rejection), the walk's per-corner wedges / dashed lines / dial states, and the investigator's
drag/tap logic, capping, record table and reveal.

## Lesson 3 (Circumference of a Circle) built — 29 July

Framed and built one at a time. Interactives chosen by the curriculum lead (Gerry), inspired by
his Geometer's Sketchpad (d, C) sketch:

- **Connection — the (d, C) Plotter.** Learner changes the diameter; a live point G = (d, C) rides
  along the (hidden) line while a table of points builds. "Draw the line" reveals C = π d through the
  origin. Two discovery inputs let the learner find it themselves: the **gradient** (accepts a number
  near π, or "pi"/"π") and the **equation** (a `circEquiv` checker that evaluates the expression on
  d = 1…10 vs π d, so πd, pi*d, 3.14d, 3.142·d, d×π, C=πd all pass; 3d, 2πd and anything in r are
  rejected). Self-contained SVG — no GeoGebra/Sketchpad dependency; stays 2D (curved shape).
- **Movement — Rolling Wheel.** A slider rolls the wheel one full turn along a track marked in
  diameters (0, 1d, 2d, 3d, πd); the rolled distance lands just past the 3d mark — π diameters.
  Slider-driven, so nothing to gate under Reduce motion.
- **Reflection — Circle Reasoner** (true/false + why), incl. the "exactly 3× the diameter" trap.
- **Creativity — Estimate then check:** predict the circumference of real objects (coin → Moon),
  check within tolerance, reveal C = π d; plus a "π tape" Scratchpad nudge (the string-wrap idea).
- **Nutrition Mode A:** the tin label — a label must be as long as the tin's circumference (packaging).

Practice Companion: six questions with the v1.0 unlock gate; numeric questions use tolerance `eq`
functions, and Q2/Q6 reuse `circEquiv` / π-acceptance. Reconnection Routes: multiplying by a decimal,
"times bigger" ratio, naming parts of a circle. Verified with a jsdom harness (43/43), including the
plotter/table/graph, the gradient and equation checkers (accept + reject + junk), the wheel's π-diameter
readout, reflection, the estimator tolerances, routes, and the per-question gate. Built page clean:
one Practice card at the bottom, support-row trigger stripped, charset + chrome present.

Guidance PDFs to follow after Gerry signs off. Next: Lesson 4 — Area of a circle.
