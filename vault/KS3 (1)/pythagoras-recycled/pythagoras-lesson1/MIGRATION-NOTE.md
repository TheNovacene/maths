# NEO Repo Migration Pilot — Pythagoras' Theorem v0.4

## Public repo source
- `lessons/2-pythagoras-trig/pythagoras-theorem-v2.html`
- `metadata/2-pythagoras-trig/pythagoras-theorem-v2.json`

## Matrix decision
**REBUILD AND NARROW THE CONCEPTUAL SPINE**

The source lesson contains valuable material, but it asks one nominal 45-minute lesson to carry theorem discovery, notation, side identification, missing-length calculations, applications, Pythagorean triples, proof history, Perigal, Hippasus/√2, accessibility design and a tilted-square proof task.

The migrated lesson keeps one conceptual journey:

**right triangle → dynamic square-area relationship → statement in words → opposite-side labelling convention → symbolic formula → justification of the condition on c**

## Learner-flow design
Every substantial investigation includes:
1. a clear entry instruction;
2. a mathematical noticing goal;
3. a conceptual bridge to the next stage.

## Cornerstone translation
- **Connection:** manipulate a right triangle and notice the square-area relationship that survives.
- **Movement:** move from geometry through notation to the formula in staged representations.
- **Reflection:** justify why the right angle determines the hypotenuse and therefore the role of c.
- **Creativity:** teach the theorem beginning with geometry rather than a memorised formula.
- **Rest:** reduce notation load to one connection at a time.
- **Nutrition:** intellectual nourishment — pattern awareness, meaning before memory, precision and mathematical courage.

## Content moved to later lessons
Missing-length calculations, Pythagorean triples, practical design applications, proof-history extensions, irrationality, Perigal and 3D Pythagoras remain valuable unit assets but are not forced into this theorem-discovery lesson.

## Repo status
Local migration pilot only. The public GitHub repository has not been modified.


## v0.2 learner-flow refinement
The Reflection panel now uses a labelled right-triangle-and-squares diagram as the evidence source. The learner is explicitly directed to:
1. locate the right angle;
2. trace to the opposite side;
3. identify the hypotenuse;
4. connect the opposite-side lower-case label;
5. move from side length to square area;
6. combine the three square areas.

A sentence frame then helps the learner turn the six observations into one connected explanation.


## v0.3 visual geometry containment refinement
The Reflection diagram viewBox was expanded from the triangle-centred bounds to the bounds of the complete construction, including all three attached squares and a deliberate safety margin.

New QA principle applied:
- determine the bounding box of the full intended construction;
- include labels, markers and attached shapes;
- add visual safety margin;
- check the default state and interaction extremes for clipping before delivery.


## v0.4 Scratchpad architecture upgrade
The NEO Maths Scratchpad now uses separate background and learner-ink canvas layers. Erasing uses `destination-out` on the ink layer only, so square grids, coordinate grids, ratio tables and number lines persist.

A dedicated Line tool has also been added:
- press/touch to choose the start point;
- drag for a live straight-line preview;
- release to place the line;
- current colour and width are respected;
- line objects participate in Undo, Redo, local working-page storage and image export.

Toolbar order: Pen → Line → Colour → Width → Eraser → Undo → Redo → Sticky Note → Background.
