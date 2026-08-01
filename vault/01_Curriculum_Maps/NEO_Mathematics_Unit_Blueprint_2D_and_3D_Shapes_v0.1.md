# NEO Mathematics — Unit Blueprint: 2D and 3D Shapes

**Pathway:** Foundations · **Internal stage:** Y9 · **Strand:** Spatial reasoning and measurement
**Status:** Blueprint v0.1 (draft for build) · **Controlling GreenPrint:** Active v1.6
**Created:** 2026-07-27 · Curriculum by Gerry Docherty

> *Blueprints identify the unit's mathematical story first, then the session titles.
> Build one lesson at a time; never pre-build the rest of the unit.*

## Unit Driving Question

*How can we describe and measure the space that shapes occupy — in two dimensions and three?*

## The unit's mathematical story

Shapes occupy space, and we can describe and measure that space precisely. The unit moves
from **describing** shapes (their properties and angles), to **measuring flat space** —
including the circle, where a single constant, π, unlocks both the distance around and the
area within — to **building** solid space (nets and cross-sections reveal how 3D shapes are
made), to **measuring** solid space (surface area and volume), and finally to how the
**units of space themselves scale** (why area scales by 100 and volume by 1000). The arc is:
**describe → measure 2D → build 3D → measure 3D → scale the units.**

## Stepping Stones (seven strands)

Analyse 2D/3D properties · use polygon angles · work with circles (circumference and area) ·
reason from nets · calculate surface area and volume · use cross-sections · convert spatial
units.

## Session sequence (ten 45-minute lessons)

Ordered by conceptual dependency, so each lesson feeds the next. "Skin then structure":
nets → surface area, then cross-sections → volume. A **Platonic Solids** enrichment lesson (L6)
follows nets, pulling together angles (L2), Euler's F + V − E = 2 (L1) and nets (L5).

| # | Lesson | Stepping Stone | Mathematical noticing goal | Likely Reconnection Routes |
|---|--------|----------------|----------------------------|----------------------------|
| 1 | Analysing 2D and 3D properties | 2D/3D properties | A 3D solid is *built* from 2D faces meeting at edges and vertices; families of solids (prisms, pyramids) have a structure determined by their base polygon | shape vocabulary; right angles (REC-GEO-01) |
| 2 | Angles in polygons | polygon angles | The interior angles of a polygon are fixed by its number of sides; interior and exterior angles are connected | angle facts (line/point/triangle sum) |
| 3 | Circumference of a circle | circles | The distance around every circle is the same multiple (π) of its diameter | multiplication; measuring; ratio |
| 4 | Area of a circle | circles | The area within a circle is π × r²; the same π governs both distance around and area within | square numbers (REC-NUM-04); area concept |
| 5 | Reasoning from nets | nets | A flat net folds into a solid; each 2D face maps to a face of the 3D shape (the 2D→3D bridge) | 2D shape properties (L1); area of rectangles/triangles |
| 6 | Platonic solids (enrichment) | regular polyhedra | There are exactly five regular solids, because the angles at a corner must total less than 360° to fold into 3D; every convex polyhedron obeys Euler's F + V − E = 2 | F/V/E of a solid (L1); interior angle of a regular polygon (L2); angles around a point |
| 7 | Surface area | surface area/volume | A solid's surface area is the total area of its net — the sum of its 2D faces (including circles for cylinders) | area of rectangles/triangles; circle area (L4); nets (L5) |
| 8 | Cross-sections | cross-sections | A prism is a constant cross-section carried along its length; slicing a solid reveals a 2D shape | 2D shape properties (L1); area |
| 9 | Volume | surface area/volume | Volume is cross-sectional area × length; the same idea covers cuboids, prisms and cylinders | area (L4/L7); cross-sections (L8); multiplication |
| 10 | Converting spatial units | convert spatial units | Length units scale by 10, but *area* units scale by 100 and *volume* units by 1000 — a consequence of powers of ten | place value / powers of ten (REC-NUM-01/02) |

## Cornerstone emphasis across the unit

Strong Cornerstones for spatial reasoning are **Movement** (transforming, folding, slicing),
**Creativity** (building and modelling solids) and **Connection** (2D ↔ 3D relationships).
**Reflection** carries the reasoning ("how do I know this property holds?"); **Rest** provides
the pause to predict before measuring; **Nutrition** is Mode B (intellectual) for most lessons,
with genuine Mode A openings where measurement meets real contexts (packaging, capacity,
sustainable use of material).

## Prerequisite and reconnection notes

The unit builds on prior arithmetic (multiplication, powers of ten) and earlier geometry
(right angles, area of squares/rectangles/triangles). It cross-links strongly with **Place
Value** (units and powers of ten drive the L9 unit conversions) and **Pythagoras** (square
areas and decomposition). Any new standalone Reconnection-Route environments this unit needs
(e.g. angle facts, area of basic shapes) are commissioned via the Stage 2 option-bank process,
not pre-built here.

## Interactive environments

A reusable, self-contained **CSS-3D solids component** (draggable prisms, any base polygon; no
external calls) is filed at `vault/05_Lesson_Templates/NEO_3D_Solids_Component_CSS3D_v0.1.html`
and endorsed by GreenPrint entry v1.9. It is adopted for the two lessons where rotation most
deepens understanding:

- **Lesson 5 — Reasoning from nets:** fold a flat net up into the solid in 3D.
- **Lesson 6 — Platonic solids:** fold each regular solid from its net and rotate it (SVG projector driven by verified 3D coordinates).
- **Lesson 8 — Cross-sections:** slice a solid and view the cross-section face-on.

Each use must stay optional with a 2D fallback, honour Reduce motion, and keep the construction
contained. Curved-solid lessons (circles, and any cylinder work) stay 2D or use a small inline
canvas projector. Lesson 1 keeps its clean 2D Prism Family Explorer.

## Build note

This blueprint fixes the *story and sequence*, not the interactives. Each lesson is framed and
built one at a time: Stage 1 (frame) → Stage 2 (interactive option bank, chosen by the
curriculum lead) → Stage 4 (build the full ecosystem) → Stage 6 (QA, then review). Lessons 1–6
are built (through Platonic Solids); Lesson 7 (Surface area) is next.
