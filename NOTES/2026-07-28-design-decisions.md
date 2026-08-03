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

## Lesson 4 (Area of a Circle) built — 31 July

Framed one at a time; interactives from Gerry's two Novacene sketches, with a Cornerstone swap he
requested (derive first, then explore the linear relationship):

- **Connection — Circle to Parallelogram** (his activity 2). A slider raises the number of sectors;
  the circle's slices rearrange into an (approximate) parallelogram of base ≈ π r and height ≈ r.
  Two dropdown steps let the learner *derive* the formula: complete the statement
  (parallelogram / height r / half the circumference), then Area ≈ base × height = π r × r = π r².
  The carry-forward is gated until the derivation is correct. Justified as Connection: the deep link
  between the circle's area and the parallelogram's area.
- **Movement — the (r², A) Plotter** (his activity 1). Change the radius; point G = (r², A) plots and
  a table builds. Putting **r²** on the x-axis makes it linear, so the points fall on A = π r² through
  the origin. Discovery inputs for gradient (π) and equation (`areaEquiv` — accepts πr², pi*r^2,
  3.14r², π×r², A=πr², 3.142*r*r; rejects πr, 2πr², πd); carry-forward gated. Justified as Movement:
  the variable point tracing the line as the circle changes.
- **Reflection — Circle-Area Reasoner** (true/false + why), centred on "doubling the radius quadruples
  the area" (area ∝ r²).
- **Creativity — Estimate then check** (coin → pizza → pond); investigate the pizza/plate doubling.
- **Nutrition Mode A:** pizza — a 12-inch has four times the area of a 6-inch, because area ∝ r².

Practice Companion: six questions with the v1.0 gate; numeric tolerances via `eq`, Q1 reuses
`areaEquiv`, Q6 is the doubling-quadruples reasoning. Reconnection Routes: squaring, area of a
parallelogram, parts of a circle. Vocab card (area, radius, r², sector) opens Connection. Focused
palette π, r, ², ×, =, ≈ on the discovery + practice fields. Verified with a jsdom harness (41/41),
plus a built-page check (card at bottom, palette with π and ² attached to the discovery fields).

Guidance PDFs to follow after sign-off (remember: spell "pi" as a word — the PDF font lacks the
Greek glyph; use r*r or "r squared" rather than r² for the same reason). Next: Lesson 5 — Reasoning
from nets (first CSS-3D lesson).

## Guidance PDFs now render real π and superscript ² (supersedes earlier "spell pi" note)

The PDF generator (`_guides_template.py`) now registers **DejaVuSans** and routes all text through a
`fix()` helper: it wraps the maths glyphs Helvetica lacks (π, ≈, ≤, ≥, √, ≠, ±, ∞) in DejaVuSans so
they render as real symbols, and converts ² / ³ into true `<super>2</super>` / `<super>3</super>`
superscripts. Body text stays Helvetica, matching the earlier guides. Generators now write real π and
r² in their content (L3 gen: dropped the pi→word substitution; L4 gen: content rewritten with π and ²,
"pizza" left intact). L3 and L4 guides regenerated and verified (π renders in DejaVuSans, superscript-2
present, no broken "»", no "pi"/"r squared" words). Future lessons should just use real π/² in guide
content — the template handles rendering. (Earlier note to spell "pi" as a word no longer applies.)

## Lesson 5 (Reasoning from Nets) built — first CSS-3D lesson (Sat)

Cornerstones as Gerry chose: Movement = Net Folder (CSS-3D), Connection = Predict & Fold,
Reflection = "Will it close?" Net Investigator, Creativity = Design-a-Net.

- **Shared engine `foldSim(cells)`** — rolls a virtual cube along a polyomino to test whether six
  edge-joined squares fold into a cube (each cell → the cube face that rolls to the bottom; valid iff
  all six faces distinct and connected). Brute-force verified in the harness: exactly **35 free
  hexominoes, 11 fold into a cube** — the known theorem. This one function powers Reflection and
  Creativity (and the opposite-face logic in Connection), so all the net reasoning is provably correct.
- **Connection — Predict & Fold:** a numbered cube net with one face shaded; learner predicts the solid
  and which face lands *opposite* the shaded one (opposite = OPP of its rolled face). Carry-forward gated.
- **Movement — Net Folder (CSS-3D):** nested hinged `<div>` faces; a fold slider rotates each face about
  its hinge (data-axis/data-angle × fraction); drag to rotate the scene. Four solids: cube, cuboid,
  triangular prism (side flaps 120°, triangle caps), square pyramid (flaps ~122° = 180−acos((S/2)/m)).
  Reduce-motion friendly (slider-driven; flat 0% and solid 100% are static). 2D fallback = the flat net itself.
- **Reflection — Will it close?** six preset arrangements classified live by foldSim; learner guesses, score shown.
- **Creativity — Design-a-Net:** 5×5 grid, place six squares, fold-test via foldSim; tracks distinct nets found (of 11).

Practice (6, unlock gate) incl. opposite-faces-of-a-dice and net-area = surface-area (Q6 bridges to L6).
Reconnection Routes: faces of a solid, naming 2D shapes, area of a rectangle. Vocab card (net, face, edge,
opposite faces). jsdom harness 33/33.

**Not yet visually verified:** the CSS-3D fold direction/signs cannot be seen in the jsdom sandbox, and
Claude-in-Chrome was not connected this session. The transforms were reasoned carefully but the fold may
need a sign/angle tweak once viewed. FLAGGED FOR GERRY to preview on localhost; iterate if any face folds
the wrong way. Everything non-3D is proven. Guidance PDFs after sign-off.

### Lesson 5 review rounds (Gerry) + guidance

- **Net Folder fixes:** faces used a 2px *border* which shifted every nested face (accumulating gaps/
  overlaps) — switched to `box-shadow: inset` (no layout offset) so faces meet exactly. Flat net now
  sits face-on: the 3D tilt ramps with the fold fraction (0% = face-on, 100% = tilted), drag adds on top.
  Triangular-prism cap clips were flipped (apex at hinge) — corrected so the triangle's base sits on the
  hinge and the apex points outward, folding up to cap the prism.
- **Invalid Predict&Fold net (Gerry spotted):** one hand-picked net covered only 5 cube faces. Replaced
  with a verified "T" net AND the PF list now `.filter`s through `foldSim` so only genuine cube nets can
  ever appear. Harness asserts all PF nets valid.
- **Isometric grid** added to the Scratchpad background options (vertical + ±30° lines) — for 3D sketching.
  Currently in L5 only; offer to add to the shared Scratchpad and retrofit L1–L4.
- **Design-a-Net now folds up:** on a valid net, a mini 3D viewer builds the learner's OWN net as a hinge
  spanning-tree (each shared edge a 90° fold) and animates it closed (drag to rotate; snaps closed under
  Reduce motion; degrades to instant if requestAnimationFrame is unavailable).

jsdom harness 38/38 (incl. the 35-hexomino / 11-cube-net theorem, PF-nets-all-valid guard, and the dynamic
folder). Guidance PDFs built with the DejaVuSans π/superscript template. Next: Lesson 6 — Surface Area.

## Lesson 6 (Platonic Solids) built — the flagship 3D lesson (Sun)

Numbering corrected: Platonic Solids is **L6** (Gerry flagged my earlier "L6 = Surface Area" slip);
blueprint renumbered (Surface area→L7, Cross-sections→L8, Volume→L9, Converting units→L10).

Cornerstones as chosen: Connection = Euler film + F+V−E=2 table; Movement = **Fold & Rotate**;
Reflection = "why exactly five?" Corner Investigator; Creativity = Solid Detective + Duals;
Nutrition Mode A = dice (d4/d6/d8/d12/d20 are the five Platonic solids).

**Geometry engine (prototyped + verified before embedding):** tetra/cube/octa hardcoded; icosahedron
faces computed as 3-cliques of the min-distance graph; **dodecahedron built as the dual of the
icosahedron** (face-centroids → 20 vertices; 12 pentagons ordered around each icosa vertex). Verified
numerically: all five give Euler = 2, equal edge lengths, planar + regular faces. The **generic
hinge-tree fold** (BFS spanning tree; each hinge folds by the signed angle that makes the child
coplanar with its parent) reproduces each solid exactly at t=1 and lays a perfectly flat net at t=0 —
proven for all five (matchErr 0, net-planarErr ~1e-15). So the whole Movement engine is
mathematically guaranteed even though I can't see the render.

Movement renders via an SVG orthographic projector (fold t + drag view, painter's depth sort,
auto-fit). Euler video embedded with `<video controls preload=metadata poster>` + caption `<track default>`
from `docs/assets/media/` (paths `../../assets/media/…` resolve in the built page), no autoplay.
Practice (6, gate) incl. Euler-formula rearrange and the "3 hexagons = 360° so no solid" reasoning.
jsdom harness 43/43 (geometry + fold both re-verified against the in-page code, plus every panel).

**Needs Gerry's eye:** the 3D render itself (projection/occlusion look) can't be seen from the sandbox —
maths is guaranteed, visuals to confirm. Caption timings still approximate (flagged in the .vtt).
Guidance PDFs after sign-off.

### Lesson 6 review round 1 (Gerry) — captions + accessibility visuals

Driven by the NEO priority: these learners may be out of formal schooling and/or neurodivergent, so
abstract-number-only activities cause confusion and lose them. Fixes:

- **Captions rebuilt** from Gerry's updated micro-beat script (14 beats; 20 cues), replacing the older
  mismatched dialogue. Timings at ~10s beats, flagged approximate/nudgeable in the .vtt NOTE.
- **New Words card** opening Connection: five small solid icons (rendered by the verified projector at
  fold=1), each labelled with faces + Plato's element (fire/earth/air/water/cosmos), plus the origins
  note (Plato ~360 BC; Euler's F+V−E=2).
- **Reflection now has a picture:** the Corner Investigator draws the actual regular polygons meeting at
  one corner (2D fan, congruent polygons sharing the centre), shades the **gap** wedge when the angle
  sum < 360°, and shows a **mini 3D model of the solid it folds into** beside it. So "270° leaves a gap →
  the cube" is seen, not just stated. =360° shows no gap (tiling); >360° shows overlap.
- **Creativity Duals now has a picture:** a rotatable viewer draws the chosen solid faint, with **blue
  dots at every face-centre** joined by **red edges** to reveal the dual skeleton inside (cube→octahedron
  = 6 dots/12 edges; dodeca→icosa = 12 dots). Drag to rotate.

All new visuals reuse the numerically-verified geometry. jsdom harness 56/56 (adds icon/fan/mini-solid/
dual checks). Still needs Gerry's eye on the 3D render look. Guidance PDFs after sign-off.

### Lesson 6 — captions, article-tolerance, guidance

- **Captions (round 2):** the real cause was two uploaded scripts sharing a name — I'd read the *old*
  one. Rebuilt from the correct updated script (1a "Leonard Euler… Come with me to follow his thread",
  new 4a/5a, "taught"/"sine curve"/"Years of study dimmed his eyes…", Catherine "welcomed reason").
  Then Gerry reported the timings lagged; my sandbox couldn't reach a speech-to-text model (HuggingFace
  403 through the SOCKS proxy) and silence-detection failed under the music bed, so **Gerry supplied the
  18 line start-times**. Cue starts set to those; ends trimmed to each line's speech. Served as a fresh
  filename each revision (…_v2 → …_v3) to defeat the browser's very sticky WebVTT track cache. Confirmed
  the film has no burned-in dialogue captions (only an opening title), so the .vtt is the sole source.
- **Article-tolerance:** Practice answer-matching now strips a leading "a/an/the", so "A Cube" /
  "An octahedron" / "the octahedron" pass. Applied to ALL SIX 2D-and-3D-Shapes lessons (L1–L6). The
  older Pythagoras/ratio/place-value/straight-line lessons have only numeric or number-with-unit answers,
  so it doesn't apply there. Regression suites all green (L2 48, L3 45, L4 48, L5 38, L6 61).
- **Guidance PDFs** generated (DejaVu template; F + V − E = 2 renders cleanly). Lesson 6 complete.

## L7 Surface Area — Connection & Movement rework (2026-08-03)
- **Connection (Unfold & Total):** now shows the SOLID first, with an "📦 Unfold to net / 🧊 Fold back up" button that animates a true 3D hinge-fold down to the flat net (view tilt ramps with the fold; net ends face-on). Built on a generic hinge-fold engine (rotate each face's subtree about its current hinge). Fold data verified in Node: cuboid seam closes to 0.000, pyramid's 4 apexes meet at one point, prism seams coincide; every solid is flat at t=0. Each solid has its own viewing pose (prism uses a −90° pre-rotation so the 3-4-5 wedge stands up rather than looking flat). Cylinder unfolds via a strip-wrap: can → 2 circles + rectangle.
- **Movement (Unroll the cylinder):** replaced the detached "growing rectangle" with a genuine peel — the orange curved surface lifts off the can at the right seam and lays itself flat to the right (ridges migrate from round to flat, wrapped remainder shrinks, can ends empty), flat width grows to 2πr. Addresses Gerry's note that neurodivergent learners need to *see* the unrolling, not just a rectangle enlarging.
- Verified headlessly (jsdom 19/19) and by rasterising SVG frames.
