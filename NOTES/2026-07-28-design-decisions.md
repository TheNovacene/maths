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

## L8 Cross-sections — build (2026-08-04)
- Cornerstones chosen by Gerry: Connection = Carry-it-Along Extruder (B); Movement = Slicing Plane Studio (A) WITH a cone/conic-sections "wow"; Reflection = Name the Slice (C); Creativity = Design-a-Prism (E).
- **Connection (Extruder):** pick a 2D cross-section (rectangle, triangle, L-shape, pentagon, circle→cylinder), drag Length to carry it along into a prism; dashed "ghost slices" show constancy; shows cross-section area + names the solid. Seeds Volume (area × length).
- **Movement (Slicing Plane Studio):** every solid built as a mesh (cuboid, tri-prism, sq-pyramid, and cylinder/cone as 48-gon meshes); ONE generic plane-slicer computes the cross-section polygon for any height + tilt. 3D view (solid + translucent cutting plane + bold section) beside a face-on view. Verified in Node AND jsdom: cylinder flat→circle(d4), tilt30→ellipse(4×4.62), pyramid/cone shrink with height, prism constant, cone parallel-to-slant→parabola (open, touches base). Shape auto-named per solid+regime; cross-section area shown.
- **Reflection (Name the Slice):** 8 predict-the-shape scenarios with reasoning.
- **Creativity (Design-a-Prism):** choose cross-section + length, predict a halfway slice (answer: identical — that's what makes it a prism); isometric Scratchpad.
- Practice: 6 Qs (meaning, prism definition, cuboid/cylinder/tilted-cylinder slices, prism-or-not) with article/text tolerance. Reconnection Routes: naming 2D shapes, sides of a rectangle, parts of a circle. Scratchpad storageKey cross_sections_v01, isometric default.
- QA: jsdom 18/18; visuals verified by rasterising SVG frames (extruder + studio incl. parabola). Guidance PDFs pending Gerry's sign-off.

## L9 Volume — build (2026-08-04)
- Cornerstones chosen by Gerry: Connection = Prism Volume Machine (B); Movement = Layer-Stacker (A) WITH the Cavalieri skew "wow" (C folded in as a Lean slider); Reflection = Spot the Slip; Creativity = How Much Does It Hold (capacity + litres).
- **Connection (Prism Volume Machine):** reuses the L8 extruder (drawPrism, fixed-scale). Cross-section chips rectangle→cuboid / triangle→triangular prism / circle→cylinder; drag length; live readout "area × length = volume" in cm³.
- **Movement (Layer-Stacker):** self-authored isometric unit-cube renderer (military projection, painter order = (a+b) then k — verified no occlusion errors). Sliders width/depth/height/lean. Volume = layer (W×D) × layers (H); Lean shears the stack into an oblique prism with the SAME volume (Cavalieri). Prototyped + screenshot-tuned.
- **Reflection (Spot the Slip):** 6 volume calcs targeting cm²/cm³ units, diameter-for-radius, add-instead-of-multiply, face-area-for-volume.
- **Creativity (How Much Does It Hold):** fish tank / juice carton / soup tin / cube; volume + litres (1 L = 1000 cm³).
- Practice: fill-in-blank Q1 (× length), cuboid, cube, any-prism, cylinder (πr²h), units T/F. Reconnection: rectangle area, circle area, multiplying. Palette ["³","²","×","="]. Scratchpad key volume_v01.
- QA: jsdom (all real checks pass; one loose test-regex miscount corrected — stacker draws 108 polys for 36 cubes as expected). Visuals verified by rasterising frames (volume machine + stacker + lean). Guidance PDFs pending sign-off.

## L10 Converting spatial units — build (2026-08-04) — UNIT COMPLETE
- Cornerstones chosen by Gerry: Connection = Zoom & Reveal (A); Movement = Fill It Up (C); scope = mm, cm and m. Reflection = Spot the Slip (conversions); Creativity = Real Measures.
- **Connection (Zoom & Reveal):** tabs length/area/volume; press Zoom in to fill 1 cm / 1 cm² / 1 cm³ with mm units → 10 / 100 / 1000, tying the factor to powers of ten (10¹, 10², 10³). Volume uses a subdivided isometric cube (10×10 grid on 3 faces).
- **Movement (Fill It Up):** area mode packs a cm² cell-by-cell to 100; volume mode stacks layers to fill a cm³ (faint outline shows remaining space) to 1000. Reuses a shared isoBox helper.
- **Reflection (Spot the Slip):** 6 conversion right/slip cards (×10 for area error, volume ×1000, m²→cm² = ×10000, etc.).
- **Creativity (Real Measures):** room m²→cm², phone mm²→cm², tank cm³→litres, pond m³→litres.
- Practice: fill-blank (1 cm²=100 mm²), length/area/volume conversions, m²→cm², why-×100 T/F. Reconnection: ×10, ×100, powers of ten. Palette ["²","³","×","="].
- QA jsdom 20/20; visuals verified (zoom reveal + fill). Guidance PDFs pending sign-off.
- **Unit status: 2D and 3D Shapes L1–L10 all complete.**

## Year 10 unit started — Straight Lines and Connected Representations (2026-08-05)
- New Intermediate pathway unit (internal Y10). HT1 = 18 lessons (6 weeks × 3), from the 15-session blueprint + 3 additions (SL-R2 directed number, SL-C1 consolidation, SL-Q2 qualification). Mid-unit checkpoint after L9. Blueprint saved: vault/01_Curriculum_Maps/NEO_Mathematics_Unit_Blueprint_Straight_Lines_HT1_v0.1.md. Y9 HT1 covered by 2D&3D Shapes + Pythagoras (2/week).
- New curriculum unit "straight-lines" (stage Intermediate, strand Algebra) in curriculum.json; vault 03_Intermediate/01_Lessons/Straight_Lines/. build_site.py SOURCES entry added.
- **L1 "A line as a relationship" (SL-01):** Cornerstones — Connection = One Line, Five Costumes (m/c sliders drive story+table+coordinates+equation+graph together); Movement = Step the Story (dot steps along line, constant m); Reflection = Match the Representation (table/story → equation); Creativity = Model the Story (set m,c to fit a real scenario).
- **Reusable graph engine** built: drawGraph(svgId,m,c,opts) — adaptive y-range, labelled axes, intercept dot, plotted points, highlightX with dashed guides, optional ghost target line; eqStr()/storyStr()/tableHTML() formatters (handle m∈{0,±1}, negative c). This is the shared spine the rest of the unit reskins (Intercept Isolator, Gradient Isolator, Line Detective, etc.).
- QA jsdom 23/23; graph visuals verified (positive/negative/zero gradient + step). Practice: two-numbers, substitution×2, read-the-step, match, one-relationship T/F. Reconnection: coordinates, substitution, reading a table. Guidance PDFs pending sign-off.

## Straight Lines L2 — A table can predict a line (SL-02) (2026-08-05)
- Cornerstones (Gerry): Connection = Table-to-Line Predictor (fill table from a rule → highlight constant first difference → predict direction → REVEAL graph, hidden until predicted); Movement = Step-to-Build (press +m, table grows a row at a time, line builds via segTo); Reflection = First-Difference Detective (constant step or not — includes 2 non-linear: doubling, squares); Creativity = Predict a Mystery (2 rows shown → predict y at x=4 → reveal).
- Extended shared drawGraph: showPoints now accepts a number (0..n); added hideLine and segTo (draw green segment 0→segTo) for the build-up effect. Backward compatible with L1.
- Practice: generate y at x=0/4, first difference, continue the table, predict direction, is-it-a-line (non-linear no). Reconnection unchanged (coordinates/substitution/table). Wired: build_site.py + curriculum.json. 25 lessons live.
- QA jsdom 20/20; visuals verified (predictor reveal + step-build segments). Guidance PDFs pending sign-off.

## Straight Lines L3 — Where does the line start? (SL-03) (2026-08-06)
- Cornerstones (Gerry): Connection = Intercept Isolator (m locked via m=1/2/3 buttons, vary c; shows crossing (0,c)); Movement = Slide to a Target (red target ring on y-axis, drag c to hit it); Reflection = Find the Intercept from graph / equation / table (three forms); Creativity = Parallel Family (shared m, three c sliders → three parallel lines, colour-matched intercepts).
- Extended shared drawGraph again: opts.family (array of {m,c,col} → draws each line + its intercept, skips single-line drawing) and opts.targetY (hollow ring at (0,targetY)). Fit now spans all family lines + target. Backward compatible with L1/L2. This family capability is reused by SL-07 (parallel) and SL-08 (intersections).
- Practice: which letter is c, c from equation, c from graph coordinate, c from table, parallel yes/no, "same m diff c = parallel" fill-blank. Reconnection unchanged. 26 lessons live.
- QA jsdom 20/20; visuals verified (isolator + target + parallel family). Guidance PDFs pending sign-off.

## Correctness fix — "y-intercept" not "starting point of a line" (2026-08-06)
- Gerry (curriculum lead) flagged that framing c as "the starting value/point of a line" is mathematically misleading: a (non-vertical) line extends infinitely both ways and has no start; and "every straight line crosses the y-axis" is false (vertical lines x = k). Corrected across SL-01, SL-02, SL-03 lessons AND their guidance PDFs, plus the unit blueprint and curriculum.json title.
- Convention adopted: c = the y-intercept (the value of y when x = 0, the point (0, c) where the line crosses the y-axis). "Initial/fixed value" reserved for real-life CONTEXTS where x counts from 0 (tariffs, deposits). Added an explicit note in SL-03 (New Words + FAQ + adult guide): a line has no start; and a caveat that y = mx + c describes only non-vertical lines (x = k has no y-intercept).
- SL-03 renamed (learner-facing) "Where does the line start?" -> "Where does the line cross the y-axis?" (H2, page <title>, practice heading, curriculum title, blueprint). Internal filename/id/slug unchanged. Legitimate in-context uses (Model-the-Story, real fees) kept but tidied. Rebuilt: 26 live; jsdom SL-03 20/20.

## Descartes film added to SL-01 (2026-08-06)
- Gerry supplied "Lines of Thought — The Life of René Descartes" (1080p, 2:41, animated). Placed as a short OPENER before Connection in Straight Lines Lesson 1 (coordinates = the Cartesian plane's origin story). Matches the Euler-film pattern.
- Transcoded to 720p (CRF 23) → docs/assets/media/Descartes_Lines_of_Thought_720p.mp4 (~20 MB) + poster jpg (title card). Self-hosted, no CDN. Embedded with <video><source> + poster; relative path ../../assets/media/ (verified).
- Captions: deferred per Gerry (add later). WebVTT track to be added once narration script is available (as with Euler). Note added in the opener that captions are coming.

## Straight Lines L4 — How fast is the line changing? (SL-04) (2026-08-06)
- Mirror of L3 (Gradient Isolator). Cornerstones (Gerry chose B, C): Connection = Gradient = the rate (m slider → line + table + unit-step; ties m to the first difference/rate of change); Movement = Gradient Isolator (c LOCKED via c=0/4/-2 buttons, drag m, line pivots about the fixed intercept; rising/falling/flat + steeper/shallower readout); Reflection = Read & compare gradients (sign: rising/falling/flat from mini-graphs; steepness = size of m incl. negatives; same-m = equally steep); Creativity = Model a real rate (plant/coffee-card/tank/savings; negative rates = negative gradients).
- Engine: added opts.stepTri (unit rise/run marker "1 across / +m up" at the intercept; "flat: no change" for m=0). Reuses fixedY window [-6,14]. DQ reworded "intercept stays fixed" (post-correction).
- Practice: which letter is m, read gradient from equation, direction of negative gradient, gradient as rate, which is steeper, gradient of a flat line (=0). Reconnection: coordinates, directed numbers, substituting a negative (directed-number focus for negatives). 27 lessons live; jsdom 20/20; visuals verified (pos/neg/zero + step marker, label overlap fixed).

## Straight Lines L5 — Rise, run and two points (SL-05) (2026-08-07)
- Shifts from "read m off the equation" to "compute m from two points". Cornerstones (Gerry approved my recommendations): Connection = Same line, different triangle (one fixed line shows TWO rise/run triangles at once — small A→B and wider C→D — both giving the same rise÷run; "Another line" button cycles examples; gradient belongs to the line, not the chosen points); Movement = Gradient Triangle Builder (DRAGGABLE points A & B; live line-through-two-points + rise/run triangle + gradient = rise÷run readout, sign included); Reflection = "Right or slip?" (spot the two classic errors — run÷rise swapped, and sign lost on a falling line); Creativity = Rate from two readings (bath/battery/taxi/candle two-reading contexts → rate as rise÷run, including negatives).
- Engine: added three drawGraph opts — lineThrough:{A,B} (draws the extended line through two points, computing its own m,c), tris:[{A,B,col,aLabel,bLabel}] (rise/run right-triangle + labelled points; rise label flips to inside near right edge to avoid clipping), and hideIntercept (suppresses the (0,c) dot). Added gradStr(rise,run) + gcd helpers (fraction/decimal display). Backward compatible; lineThrough/tris reused by SL-08 (intersections).
- Draggable builder: pointer→graph mapping replicates the fixedY=[-6,14] window (pad 34, xmin −1, ux/uy from 360/(range)); snaps to integers, clamps x∈[0,5] y∈[-4,12], and GUARDS against B.x===A.x (zero run). Pointer capture; cursor grab/grabbing. gtInit wires listeners once (dataset.wired guard).
- Practice (reworked from L4): rise÷WHAT (=run), run from two points, gradient from two points, falling line keep-the-sign (=−2), same line any two points (=same), fractional gradient (2/4=0.5). Reconnection retuned: reading coordinates, finding a difference (1−7=−6), a fraction as a division (6÷3=2).
- Wired SOURCES + curriculum.json (straight-lines-05). Build 28 live / 0 missing. jsdom QA 27/27 (incl. drag helpers, gradient calcs, sign-rejection, practice, reconnect). Visuals verified: connection (2 triangles same m), builder rising & falling, reflection card, creativity candle (−2). Guidance PDFs pending Gerry sign-off. Not committed/pushed (Gerry pushes).
- Guidance PDFs generated (2026-08-07): gen_sl_l5_guides.py — Learner + Supporting Adult, lead on "rise over run, in that order" + the two classic slips (upside-down fraction, lost minus sign). Build 28 live / 0 missing PDFs. Visually verified both. Not committed (Gerry pushes).

## SL-05 follow-up — equal axis scales (2026-08-07)
- Gerry flagged that the graphs used unequal px/unit (x ~42 px/unit vs y ~15 px/unit under fixedY=[-6,14]), so a gradient of e.g. 1.5 looked shallower than 1 — visually contradicting the concept. Fix: give both axes equal pixels-per-unit, which is automatic when the x-span equals the y-span (plot area is square 292×292).
- Added opts.xRange=[xmin,xmax] to drawGraph (default [-1,6]). The three ABSTRACT-gradient activities now use a square window xRange=[-1,8] + fixedY=[-1,8] (span 9 both axes → equal scale): Connection (Same line, different triangle), Movement (Gradient Triangle Builder), Reflection (Right or slip?). Gradient now reads true: gradient 1 = 45°, 1.33 clearly >45°, −1 = true −45°.
- Creativity (Rate from two readings) deliberately KEEPS its own adaptive window — its axes are different quantities (minutes vs litres, hours vs %), so equal scale would be meaningless there.
- Builder constants moved to the square window (GT_XMIN=-1, GT_XMAX=8, GT_FY=[-1,8]); draggable points re-clamped to x∈[0,7], y∈[0,8]; pointer→coord mapping now equal-scale. slLines curated so both triangles' points fit [-1,8]; one Reflection card moved off the top edge. Rebuilt 28 live; jsdom 27/27; visuals re-verified (equal scale confirmed). NOT committed (Gerry pushes).
- Open option (not actioned): the same equal-scale treatment could be applied to SL-01–SL-04 graphs; left as-is for now since those lessons target intercept/equation-form (their tuned windows), not visual steepness. Offer to Gerry.
