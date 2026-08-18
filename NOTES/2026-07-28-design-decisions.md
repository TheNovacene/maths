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

## Straight Lines L6 — Can I write the line? (SL-06) (2026-08-09)
- The synthesis lesson: combines c (intercept, L3) and m (gradient, L4/L5) into y = mx + c. Blueprint lead = Connection · Line Detective. DQ "How do the gradient and the intercept become an equation?"
- Cornerstones (Gerry took my recommendations for Movement + Creativity): Connection = Line Detective (ld — read c from the crossing and m from the 1-across step on a shown line, type both, Reveal checks and assembles the equation; cases cycle incl. negatives); Movement = Equation Builder (eb — c and m sliders draw the learner's line vs a faint dashed GHOST target; live equation via eqStr; guidance nudges "increase c / bigger m" until matched; New target cycles); Reflection = Right or slip? (rc — a shown line + someone's written equation; spot m/c swapped or a lost sign; 5 cards); Creativity = Write a real line (wl — gym/taxi/phone/savings contexts with a start + rate → type y = mx + c; parseLine parses the input; incl. negative-rate phone).
- Engine: no new drawGraph options needed — reused ghost (dashed target), stepTri, hideIntercept, xRange, fixedY from L3–L5. Added parseLine(str)→{m,c} tolerant equation parser (handles "y=3x+5","x-3","-2x+10","-x+5","4x"; rejects no-x). Abstract graphs (ld, eb, rc) on the square equal-scale window [-1,8]×[-1,8]; wl uses an adaptive real-units window. Tweaked stepTri "1 across" label to left-anchor (was centre) so it clears the y-axis when the intercept sits on the axis — L6 copy only.
- Practice (6): which letter is c; read c from (0,4); write y=3x+4 from c&m; write y=-2x+5 (falling); spot-the-slip (m/c swapped) → y=4x+1; real story plumber → y=30x+20. parseLine used in eq checks. Reconnection retuned: reading the y-intercept (mini line SVG), reading the gradient (1 across, up 3), which-number-is-which (m in y=4x+2). Nutrition reframed to fixed-fee-plus-rate deals (sets up SL-07/08).
- Wired SOURCES + curriculum.json (straight-lines-06). Build 29 live / 0 missing (PDF warnings expected pre-sign-off). jsdom QA 30/30 (parseLine, all four activities incl. sign-rejection, practice incl. equation-writing, reconnect). Visuals verified: detective (2x+1 step), builder (learner y=x vs ghost y=2x+3), reflection (falling -2x+4), real lines gym(3x+5) & phone(-2x+10). Guidance PDFs pending Gerry sign-off. NOT committed (Gerry pushes).

- Guidance PDFs generated (2026-08-09): gen_sl_l6_guides.py — Learner + Supporting Adult, lead on "two numbers, two places" + the m/c-swap and lost-sign slips. Build 29 live / 0 missing PDFs. Visually verified both. Not committed (Gerry pushes).

## Straight Lines L7 — Parallel stories of change (SL-07) (2026-08-10)
- "Lines together" begins. Parallel = same gradient m, different intercept c. Blueprint lead = Connection · Parallel Line Challenge. DQ "Can two lines change alike but begin differently?"
- Cornerstones (Gerry took my recommendations for Movement + Creativity): Connection = Parallel Line Challenge (pl — a blue reference line + 3 equation options; pick the parallel one; a same-intercept-different-gradient distractor targets the classic misconception; chosen line drawn green/red on pick via family); Movement = Make it parallel (mp — reference line + learner's m & c sliders; green only when m matches AND c differs; special "that's the same line" warning when both match); Reflection = Parallel or not? (rc — two equations + both lines drawn; decide parallel; cards include same-intercept-diff-gradient traps); Creativity = Two plans side by side (tp — two real plans sharing a rate, different fees; write both equations → parallel; then "which is always cheaper?" → lower fee, because parallel lines never cross; previews SL-08).
- Engine: no new options — reused family (multi-line + intercept dots) for pl/mp/rc/tp, parseLine for tp. Made ystep adaptive for large real-value windows (>40→10, >20→5, >12→2, else 1) so the two-plans graph (to ~£50) isn't cluttered — L7 copy only. Abstract graphs on square [-1,8]²; tp uses adaptive real window.
- Practice (6): what parallel lines share (gradient); gradient of a parallel line; write a parallel line y=2x+6; parallel yes (same m); NOT parallel (same intercept, diff m — the trap); real two-gyms parallel yes. Reconnection retuned: reading gradient from eqn, reading intercept from eqn, "parallel = same gradient" fill-in. Nutrition reframed to parallel deals (same rate → never break even), threading to SL-08.
- Wired SOURCES + curriculum.json (straight-lines-07). Build 30 live / 0 missing. jsdom QA 26/26 (all four activities incl. same-line & wrong-rate rejections, the which-is-cheaper logic, practice incl. the misconception item, reconnect). Visuals verified: challenge (2 parallel), make-parallel (matched pair), reflection (non-parallel crossing at shared intercept), two-gyms (parallel, clean axis). Guidance PDFs pending Gerry sign-off. NOT committed (Gerry pushes).

## Scratchpad fix — coordinate-grid axes off the gridlines (2026-08-10)
- Gerry spotted that the Scratchpad's Coordinate Grid background drew the axes mid-square. Cause: gridlines were drawn from x=0/y=0 in 28px steps, but the axes are drawn at the canvas centre (460, 280); 460 is not a multiple of 28, so the vertical axis fell between gridlines (the horizontal at 280 = 10×28 happened to align).
- Fix: draw the grid OUTWARD FROM THE CENTRE (const _cx=width/2,_cy=height/2; lines at _cx±28k, _cy±28k) so a gridline always passes exactly through the origin. Verified numerically: axis x=460 now on a gridline (was not); axis y=280 still on one. Applies to both square-grid and coordinate-grid templates.
- Scope: the Scratchpad is copied into each lesson (not injected by build). Patched all 23 vault lessons that carry it — all Straight Lines L1–L7, live Foundations (2D&3D Shapes L1–L4, Pythagoras L2–L3), the KS4 straight-line interactive, and recycled KS3/KS4 package copies. Two whitespace formats (minified single-line in newer lessons; pretty-printed multi-line in Foundations) both handled. Build 30 live / 0 missing. NOT committed (Gerry pushes).

- Guidance PDFs generated (2026-08-10): gen_sl_l7_guides.py — Learner + Supporting Adult, lead on "it is all in the gradient" + the shared-intercept trap; threads to SL-08 (where different gradients cross). Build 30 live / 0 missing PDFs. Visually verified both. Not committed (Gerry pushes).

## Straight Lines L8 — When two lines meet (SL-08) (2026-08-10)
- Intersections / break-even. Different gradients cross exactly once; in context that crossing is where two costs are equal. Blueprint lead = Connection · Cost Comparison. DQ "What does the point where two lines cross tell us?"
- Cornerstones (Gerry took my recommendations for Movement + Creativity): Connection = Cost Comparison (cc — two cost lines + break-even ring; read the crossing's x and y; print/pool/streaming cases); Movement = Slide to the crossing (sc — DRAGGABLE vertical marker across two cost lines; readout shows both values + the gap, locks green with a ring when the gap hits zero at the crossing; taxis/prints/membership); Reflection = What does the crossing mean? (rc — which option is cheaper on each side; below the break-even the low-start deal wins, above it the low-rate deal; 5 cards); Creativity = Which deal wins? (wd — buy-vs-subscribe / membership / season pairs; find break-even x, then which wins for light vs heavy use).
- Engine: extended the family branch with opts.vmark (draggable vertical marker + dots on each line), opts.markPoint ({x,y,label} ring for the intersection), and opts.hideFamilyDots (suppress (0,c) dots on cost graphs). Added intersect(A,B) helper. sc uses a FIXED xRange [-1,11] so the pointer→x mapping is stable while y stays adaptive; scInit wires pointer drag (down/move/up) once. cc/rc/wd use adaptive real-cost windows; ystep already adaptive (from L7) keeps big-£ axes clean.
- Practice (6): what's equal at a crossing (=equal); solve 2x+6=4x for break-even x (=3); cost there (=12); does the cheaper deal swap past the crossing (=different); membership 40=5x (=8); advise at 4 visits (=pay-per-visit). Reconnection: working out a cost (substitute), reading coordinates, "at the crossing the y-values are equal". Nutrition reframed to break-even decisions (buy vs subscribe); closes the parallel/intersection pair.
- Wired SOURCES + curriculum.json (straight-lines-08). Build 31 live / 0 missing. jsdom QA 29/29 (intersect, all four activities incl. slide found/gap states + wrong-answer rejections, the which-side reasoning, practice, reconnect). Visuals verified: cost-compare ring, slide at x=3 (gap) and x=6 (found), reflection membership crossing, which-deal printer (10,£40). Guidance PDFs pending Gerry sign-off. NOT committed (Gerry pushes).

- SL-08 fixes (Gerry, 2026-08-10): (1) Which Deal Wins? button labels were back-to-front — Deal A is high-upfront/low-rate, Deal B is £0-upfront/high-rate, so relabelled "Deal A (low rate)" / "Deal B (low start)" (the few-units logic was already correct, only labels were wrong). (2) Practice Q4 reworded with named deals P and Q: "...for a few units Deal P is cheaper. Past the crossing, at x=8, is Deal P still the cheaper one? (yes/no)" answer no. Rebuilt 31 live; QA 29/29 + extra checks (Q4=no, labels, few=B) pass.

- Guidance PDFs generated (2026-08-10): gen_sl_l8_guides.py — Learner + Supporting Adult, lead on "the crossing is a decision" + the two-coordinate reminder (x = how many, y = the cost) and the cheaper-option-swaps reasoning. Build 31 live / 0 missing PDFs. Visually verified both. Not committed (Gerry pushes).

## Straight Lines L9 — Conversion graphs as models (SL-09) (2026-08-11)
- The line as a converter, read both ways. Blueprint lead = Connection · Conversion Graph Translator. DQ "How can a line translate one quantity into another?"
- Cornerstones (Gerry took my recommendations for Movement + Creativity): Connection = Conversion Graph Translator (ct — a conversion line; convert a value, reveal shows the up-and-across dashed guide; miles/km, £/€, and the non-proportional °C/°F both directions); Movement = Two-way reader (tr — DRAGGABLE point along the line with guides dropping to BOTH axes; selector switches miles/km, £/€, °C/°F); Reflection = Read it right? (ri — spot the slips: wrong axis, or "just multiply" which fails for °C/°F because 0°C=32°F not 0; 5 cards); Creativity = Holiday money (hm — £/€ both ways: "£40 → €?" and "€30 → £?").
- Engine: added opts.axisLabels {x,y} (override the x/y letters with quantity names) and made gridlines + tick labels ADAPTIVE (gsx/gsy) so wide windows (°C/°F to 110, £/€ to 60) stay clean; rounded the highlightX read-off label to 1 dp. Reused highlightX (dashed vertical to x-axis + horizontal to y-axis + point) as the two-way read-off — works for a single line with any intercept, so it shows the °C/°F offset correctly. Conversions defined once in CONV {m,c,xlab,ylab,xR,yhi,units}. Two-way reader maps pointer→x per the active conversion's xRange.
- Conversions & rates: miles↔km ×1.6 (0..10 / 0..16); £↔€ ×1.20 (0..20 / 0..24; holiday money uses 0..50 / 0..60); °C↔°F F=1.8C+32 (0..40 / 0..110). Practice (6): works-both-ways (yes); 5 miles→8 km; 16 km→10 miles; rate from (10,12)=1.2; °C not-just-multiply (no, need +32); €30→£25. Reconnection: reading coordinates, reading up to a line (y=2x at x=4→8), the conversion rate (=1.6). Nutrition reframed to conversion look-ups (money/recipes/travel; why some lines don't start at zero).
- Wired SOURCES + curriculum.json (straight-lines-09). Build 32 live / 0 missing. jsdom QA 24/24 (all four activities incl. both-direction conversions, the °C/°F offset traps, wrong-direction rejections, practice, reconnect). Visuals verified: labelled axes, adaptive grids, two-way guides; °C/°F line crossing (0,32). Guidance PDFs pending Gerry sign-off. NOT committed (Gerry pushes).

- Guidance PDFs generated (2026-08-11): gen_sl_l9_guides.py — Learner + Supporting Adult, lead on "read to the line, both ways" + the °C/°F not-through-origin case (10°C = 50°F not 18°F). Build 32 live / 0 missing PDFs. Visually verified both. Not committed (Gerry pushes).

## Straight Lines L10 — What can I now explain about a line? (SL-10, consolidation) (2026-08-11)
- The closing consolidation lesson. Synthesis + the "limits of a linear model" theme Gerry wanted. DQ "What do I understand about a straight line — and where does a line stop being a good model?"
- Cornerstones (Gerry approved my recommendations for Movement + Creativity; I set Connection + Reflection): Connection = The whole story of a line (ws — one line shown four ways at once: equation eqStr, graph, table tableHTML, story storyStr; "Another line" cycles); Movement = Mastery Challenge (mc — a mixed run of ALL unit skills: read-m, read-c, write-eqn, spot-parallel, find-break-even, convert; progress dots + running score); Reflection = Where does the model break? (rc — real linear models with limits: battery hits 0%, plant can't grow forever, candle burns out, savings assume no spending, and a twist card where a conversion is EXACT with no breaking point; "limit" ring at the break); Creativity = A line that tells a human story (hs — write the equation for battery/candle/tank, then name the x where the model runs out; scratchpad to model your own life).
- Engine: added opts.markPoint to the SINGLE-LINE path too (it was family-only from L8) so the "limit" ring shows on the model graphs. No other engine change — reused showPoints/hideIntercept/family/axisLabels/adaptive grid/intersect/parseLine/eqStr/storyStr/tableHTML.
- Practice (6, mixed): which letter is m; parallel gradient=3; write y=2x−1; break-even x+8=3x → 4; convert 5 miles=8 km; where the battery model breaks (y=100−10x → x=10). Reconnection: read gradient / read intercept / parallel rule. Nutrition + Final Task reframed as a portfolio close (tell the whole story of a line AND state its limits). Rest = reflective look back over the whole unit.
- Wired SOURCES + curriculum.json (straight-lines-10). Build 33 live / 0 missing. jsdom QA 31/31 (all four activities incl. every mastery-challenge type, the model-break cards incl. the exact-conversion twist, human-story eqn+limit, practice, reconnect). Visuals verified: whole-story line, mc break-even ring, mc convert labels, battery & candle "limit" rings with the line continuing below zero. Guidance PDFs pending Gerry sign-off. UNIT COMPLETE pending sign-off (10/10 lessons). NOT committed (Gerry pushes).

- SL-10 fix (Gerry, 2026-08-11): Mastery Challenge gradient graphs had gridlines only every 5 (adaptive gsy too coarse for ~16-unit windows), so odd-height points fell between lines and the gradient was hard to read. Refined gsy thresholds so small/medium windows (yr<=18) get gridlines+labels every 1 — points now land on gridlines; large windows (battery 0-110, savings 0-50) stay coarse and clean. L10 copy only. Rebuilt 33 live; QA 31/31.

- Guidance PDFs generated (2026-08-11): gen_sl_l10_guides.py — Learner + Supporting Adult, consolidation framing, "it all comes back to m and c — and its limits", the model-breaks (battery/candle) and the exact-conversion twist, and reassurance that revisiting earlier lessons is good practice. Build 33 live / 0 missing PDFs. Visually verified both. UNIT COMPLETE (10/10 lessons, each with lesson + Practice Companion + Scratchpad + 2 guidance PDFs). Not committed (Gerry pushes).

## New Year 10 unit — Introduction to Trigonometry (HT1 second unit) (2026-08-11)
- Gerry chose an Introduction to Trigonometry unit to fill the second quarter of Year 10 HT1 (Y10 needs 18 lessons/HT1 at 3/week; Straight Lines gave 10, so ~8 more). A change of strand (Geometry) and a genuinely new topic to end the half-term on discovery; builds on Pythagoras.
- Scope (Gerry): introduce sine/cosine/tangent, find a side given one side + one angle, use inverse ratios to find an angle from two sides. Non-right triangles / Sine & Cosine Rules explicitly OUT of scope.
- Drafted unit blueprint: vault/01_Curriculum_Maps/NEO_Mathematics_Unit_Blueprint_Introduction_to_Trigonometry_HT1_v0.1.md — 8 lessons TR-01..TR-08 (constant ratio → naming sides → tangent → sin & cos/SOHCAHTOA → find a side ×2 → find an angle → apply), mid-unit checkpoint after L4, Geometry strand, iGCSE 4MA1 overlay. Design lean: build from the "constant ratio in similar right triangles" discovery, give side-naming its own lesson, introduce degrees-mode calculator deliberately.
- Resource note: NEW interactive spine required (draggable right triangle with opp/adj/hyp labels relative to the marked angle + ratio readouts); the Straight Lines graph engine doesn't serve. Audit the Pythagoras right-triangle interactives for a reusable triangle component before building. Blueprint pending Gerry review, then build lesson-by-lesson with Stage-2 option banks.

- Trig blueprint — Nutrition fix (Gerry, 2026-08-17): my v0.1 Nutrition emphasis force-fit real-world context (ramps/ladders) as the cornerstone — exactly what GreenPrint D6 forbids. Repositioned to Mode B (intellectual) throughout: trig does not live in food/body/budgeting, so name what the LEARNING feeds (the discovery of an invariant ratio; the agency of reaching what cannot be measured; precision/tool-choice). Real contexts kept only as honest problem settings (esp. L8), never as the Nutrition cornerstone. Blueprint updated.

## Trigonometry L1 — The constant ratio (TR-01) (2026-08-17)
- First lesson of the new Trigonometry unit. Connection lead = Ratio Locks (Gerry chose Option A). DQ "Why does the ratio of two sides stay the same when only the size changes?"
- Cornerstones: Connection = Ratio Locks (scale a 3-4-5 with a size slider; sides change 3k/4k/5k but up÷along locks at 0.75); Movement = Stack the similar triangles (add nested similar triangles ×1..×4, table shows every ratio = 0.75); Reflection = Same shape? (two triangles per card; same iff up÷along matches; includes near-miss distractors); Creativity = Find the hidden length (given a shape's ratio + one side, find the other — a taste of "reach what you can't measure"); Nutrition = MODE B intellectual (what the learning feeds: the habit of looking for the invariant amid change) — honestly named per the D6 fix.
- NEW interactive spine built: drawTri(svgId, along, up, opts) — scalable right triangle, sandy fill + slate stroke (echoes the Pythagoras palette for Geometry-strand coherence), θ angle arc, right-angle marker, up/along/hyp labels, and ghost nested triangles (dashed verticals + apex dots). Fixed ppu (17) for the scaling demos so scale is visible and comparable; auto-fit with a 48px right reserve for the compare minis so the up-label never clips. The Pythagoras drawTriangle was audited but is DOM/example-driven, not suited to a scalable ratio tool, so a purpose-built engine was warranted.
- Uses neutral "up"/"along" side names for now (opposite/adjacent named in L2). Practice (6): up÷along=0.75; still 0.75 when scaled; ratio depends on the ANGLE not size; equal ratio → same shape (yes); find up (0.75×12=9); find along (6÷0.75=8). Reconnection: 3-4-5 hypotenuse (Pythagoras), a ratio as a division (6÷4=1.5), same-shape angles (similarity). Scratchpad = square grid. Palette = ÷ × = . θ.
- New unit wired: curriculum.json unit "introduction-to-trigonometry" (Intermediate · Geometry) + build_site.py SOURCES. Build 34 live / 0 missing. jsdom QA 25/25. Visuals verified (scaling, nested stack, compare minis, hidden-length, angle arc + right-angle marker + labels all correct; label-clip and hidden-ghost bugs fixed). Guidance PDFs pending Gerry sign-off. NOT committed (Gerry pushes).

- TR-01 vocabulary precision (Gerry, 2026-08-17): iGCSE learners must use accurate mathematical language from the outset. (1) "Size" slider -> "Scale factor" ("multiply every side length by ×N") — makes clear it is side LENGTHS scaled, not area. (2) "Similar" defined properly: corresponding angles equal AND corresponding sides in the same ratio (an exact scale-factor enlargement) — updated in New Words, Reflection ("Similar or not?", options Similar/Not similar), reconnect, practice. (3) "up/along" -> "vertical/horizontal" throughout (labels, readouts, ratio, practice, engine defaults). Build 34 live; QA 25/25; verified labels/readout/slider/definition render correctly. Not committed.

- TR-01 follow-up fixes (Gerry, 2026-08-17): (1) vertical-side label clipping — the "vertical = N" label ran off the SVG right edge on the fixed-scale triangles (no reserve) and the auto-fit minis (48px reserve too small). Fix: right reserve 48->82px in auto-fit AND reduced fixed ppu 17->15 for Ratio Locks/Stack so the label always fits; also fixed Stack triangle still labelling "up/along" -> "horizontal/vertical". (2) Practice Q3 ambiguous "SIZE of the triangle" -> "the SCALE FACTOR the triangle is drawn at, or its ANGLE θ" (prompt/hint/sol reworded to scale-factor language). Build 34 live; QA 25/25; all vertical labels verified un-clipped.

- Guidance PDFs generated (2026-08-17): gen_tr_l1_guides.py — Learner + Supporting Adult for TR-01, written with the precise vocabulary (scale factor, similar = equal corresponding angles + sides in same ratio, vertical/horizontal), lead on "the ratio belongs to the angle" with the 3-4-5 example and a note that opposite/adjacent naming comes in L2. Build 34 live / 0 missing PDFs. Visually verified both. First Trigonometry lesson COMPLETE end to end. Not committed (Gerry pushes).

## TR-02 — Naming the sides (built 2026-08-16)
- New engine `drawLabelTri(svgId, opts)`: renders a right triangle from logical legs `a` (vertical) / `b` (horizontal) with the right angle at R; applies `orient` (×90°) + optional `flip`, then auto-fits to the viewBox. Right-angle marker at R, θ arc at the marked acute vertex (`mark:"P"|"Q"`). Sides keyed to θ: hyp (opposite the right angle, brown #8a5a2b), opp (across from θ, red #b24c4c), adj (next to θ, blue #2b6cb0). `show:"all"` labels all three with names; `highlight:key` thickens one side. Opposite/adjacent swap when `mark` switches; hypotenuse fixed.
- Cornerstones: Connection = Side Labeller (switch angle + reorient); Movement = Label it yourself (name the highlighted side, 6 rotated rounds, running score); Reflection = Which side is it? (judge a claim right/slip, targets adjacent↔hypotenuse slip); Creativity = Same triangle, two viewpoints (name from A then B, table shows opp/adj swap, ties to L1 vertical/horizontal). Rest + Nutrition Mode B (precision of language, naming by role not position).
- Reconnect routes retargeted: hypotenuse, right angle (90°), the constant ratio (L1 link). Practice = 6 naming questions. Palette unchanged.
- QA: 29/29 pass (qa_tr02.js). Visual QA confirmed correct naming + swap across all 4 orientations both marks, and highlight per side. Guidance PDFs (Learner + Supporting Adult) generated. curriculum.json + build_site.py updated; site builds 35 live / 0 missing.

## TR-03 — The tangent ratio (built 2026-08-16)
- Creativity cornerstone: Gerry chose Option B ("Rank by steepness") over Option A ("Reach the unmeasurable / find a side") to keep side-finding fully within TR-05/06 and keep the tangent-as-angle-fingerprint idea tight.
- Engine reuse: drawLabelTri gains two options — `labels:{hyp|opp|adj: text}` (colour-coded value labels per side, e.g. "opposite = 6") and `ppu` (fixed pixels-per-unit, bottom-left anchored, overriding auto-fit). The fixed-scale mode is what lets the Tangent Explorer hold the adjacent side at a constant screen length while the opposite grows.
- Cornerstones: Connection = The ratio with a name (opp÷adj constant across 3 sizes → named tan θ = 0.75); Movement (dominant) = Tangent Explorer (angle slider 10–68°, flip:true so opposite sits on the right, adjacent fixed at 4, live tan θ = opp÷adj climbing from ~0.18 to ~2.48); Reflection = Is this tan θ? (judge claims, targets hypotenuse-slip and inverted-ratio slip); Creativity = Rank by steepness (three ramps as rise/run, order by tan). Rest + Nutrition Mode B (one number standing for something larger; ties tangent↔gradient).
- Slider capped at 68° so opposite (≤ ~9.9 units at ppu 20) fits the 300px viewBox; cn/tq triangles bumped to pad 66 to stop the left-side opposite label clipping.
- Reconnect routes: opposite/adjacent (L2), a ratio as a division, the constant ratio (L1). Practice = 6 tangent questions (define, compute, invariance, compare steepness, spot the inverted slip, tan45=1).
- QA: 26/26 pass (qa_tr03.js). Visual QA confirmed adjacent-fixed/opposite-grows across 15–68° and clean labels on Connection/Reflection. Guidance PDFs (Learner + Supporting Adult) generated. curriculum.json + build_site.py updated; site builds 36 live / 0 missing.

## TR-03 refinements — units + stacked fractions (2026-08-16, Gerry-requested)
- Units of measurement: every side length now carries a unit ("practise what we preach"). Triangle sides in cm (Connection, Tangent Explorer, Reflection); ramps in m (Rank by steepness). Teaching point surfaced: cm ÷ cm cancels, so the tangent is unitless — stated in the Connection reveal and Practice Q2 solution.
- Ratios shown as stacked fractions (numerator over denominator) instead of inline "a ÷ b": new .frac CSS (inline-flex column, border-top denominator, currentColor so it inherits text colour) + JS frac(n,d) helper. Applied in New words, Connection reveal, Tangent Explorer readout, Reflection claims, Rank-by-steepness cards/feedback, and the tan definition.
- Symbols palette (SITE-WIDE, in build_site.py CHROME_STYLE + PALETTE_SCRIPT so all 36 lessons benefit): added a fraction key (renders an a/b button; inserts "/" at the cursor) and a live "Reads as:" preview under any answer field that renders typed a/b as a stacked fraction. A plain <input> can't itself stack, so the preview gives the visual; the checker was made fraction-aware.
- num() in TR-03 now evaluates a simple "a/b" as a decimal and strips a trailing unit (cm/mm/m/km), so a learner may answer with a fraction ("3/4") or with units. Practice Q2 accepts a fraction or decimal.
- Gotcha fixed: JS regex backslashes (\s, \/) inside PALETTE_SCRIPT broke build_site because the script is inserted via re.sub (backslashes interpreted in the replacement). Rewrote renderFractions with a backslash-free RegExp constructor (" */ *" and literal ²³).
- QA: qa_tr03.js now 30/30 (adds fraction-render + num("3/4")=0.75 + num("6 cm")=6 checks). Site builds 36 live / 0 missing. NOTE: fraction rendering is CSS flexbox — verify visually in-browser; num()/frac() are per-lesson so propagate to TR-01/02 and earlier units when convenient (palette feature is already global).

## TR-03 Practice — tolerant answer parser (2026-08-16, Gerry-requested)
- Learners writing a correct answer as "tan θ = 3/4" were marked wrong (old num() read the leading "3"). Rewrote num() to: lowercase; treat ÷ as a fraction bar; strip a leading "tan θ" and any "="; strip a unit written after a number; then evaluate a fraction found anywhere (a/b), else the first number. Now accepts "tan θ = 3/4", "3/4", "3 ÷ 4", "6/8", "0.75", "4 cm" etc. QA extended to 37/37. To propagate to other lessons' Practice Companions when convenient.

## Tolerant answer parser — propagated across the curriculum (2026-08-19)
- Rolled the TR-03 tolerant parser (fraction eval, ÷→/, strip leading trig label tan/sin/cos + "=", strip a unit written after a number) to every NEO pathway lesson via exact-string migrations:
  - Standard num() one-liner → tolerant: 22 files (Straight Lines ×10, 2D/3D Shapes ×10, Trig L1–L2).
  - clean()-based num() (Foundations Accuracy L2–L5) → tolerant: 6 files.
  - Pythagoras practiceNumber() ×4 and parseNum() → tolerant; Pyth L4 numFrom(String) → tolerant.
  - TR-03 aligned to the canonical (tan|sin|cos) prefix.
- Already-tolerant / intentionally skipped: Pyth L1 numberFrom() already splits on "/" and strips letters (fraction+unit aware); Rounding-to-Sig-Figs L1 left as-is (answers are plain rounded numbers — fractions never apply — and its cleanNumber() is reused in display code, so not worth the risk).
- Deferred (flagged to Gerry): the 4 KS3/KS4 "Interactive Library" legacy items (ratio-and-proportion, place-value, straight-line-graphs, equation-of-a-straight-line) use bespoke parsers and predate the current NEO template; to be standardised when they're reworked, not hot-patched now.
- Verification: TR-01/02/03 QA harnesses still 25/29/37 (no regression); a jsdom tolerance smoke over 12 pathway lessons = 36/36 (each reachable parser accepts "3/4", "13 cm", plain integers). Site builds 36 live / 0 missing.

## TR-04 — Sine and cosine (SOH · CAH · TOA) (built 2026-08-19)
- Dominant cornerstone = Connection (Ratio Trio), per blueprint. Creativity fork: chose "The other angle's cosine" (complementary sin θ = cos(90−θ) via the two-viewpoints idea) over a card-sort, to keep side-finding in TR-05/06 and tie the unit together.
- Engine: drawLabelTri.highlight now accepts an ARRAY of side keys (or a string) so the Ratio Trio / Which-ratio can light up the TWO sides a ratio uses.
- Cornerstones: Connection = Ratio Trio (3-4-5, buttons sin/cos/tan highlight the two sides + show the fraction & value, grouped SOH/CAH/TOA — hypotenuse enters here); Movement = Ratio Explorer (angle slider, hypotenuse fixed at 5 via ppu, sin rises 0→1 as cos falls 1→0); Reflection = Which ratio is it? (two sides highlighted → name sin/cos/tan, targets sine/cosine mix-up); Creativity = The other angle's cosine (sin A = cos B = 0.6 on a 3-4-5, then sin θ = cos(90−θ)). Rest + Nutrition Mode B (structure over rote; hidden symmetry).
- Reconnect: hypotenuse (L2), tangent (L3, tan=opp÷adj), a ratio as a division (3÷5). Practice = 6 (SOH, CAH, work out sin, work out cos, choose the ratio, complementary cos60=sin30).
- Visual fix: Ratio Explorer value-labels collided on tall/narrow triangles at steep angles; switched the moving triangle to short name-only labels (opp/adj/hyp) and kept the measured values with cm in the readout below.
- QA: qa_tr04.js 27/27 (incl. array-highlight = exactly two thick sides, sin/cos crossover at 30/60, complementary identity, tolerant "sin θ = 3/5"). Guidance PDFs generated. curriculum.json + build_site.py updated; site builds 37 live / 0 missing.

## drawLabelTri — prominence + label clearance (2026-08-19, Gerry-requested)
- Highlighting made obvious: highlighted sides now draw a soft colour halo (width 11, opacity 0.28) behind a bold colour line (width 6); non-highlighted sides in a highlight view drop their colour (show only the slate polygon edge) and their label is muted grey. Clear "these two light up" effect for the Ratio Trio / Which-ratio.
- Side labels no longer sit on the edges: each label is offset PERPENDICULAR to its edge (outward from the centroid), with edge-aware text-anchor (start/end for vertical-ish sides, middle for horizontal) and a canvas clamp so it can never run off an edge. Fixed the left-vertical "opp = 3 cm" clipping via the clamp + bumping the fixed label-heavy triangles to pad 78.
- Ratio Explorer keeps short name-only labels (values in the readout) — unchanged.
- Propagated the canonical drawLabelTri from TR-04 into TR-02 and TR-03 (superset engine: show/labels/array-highlight/ppu/vertexLabels), so all naming/tangent/sine-cosine triangles share the same prominent highlight + clear labels.
- QA after propagation: TR-02 29/29, TR-03 37/37, TR-04 28/28 (adds halo + two-bold-sides checks). Site builds 37 live / 0 missing.
