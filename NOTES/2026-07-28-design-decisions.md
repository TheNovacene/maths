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
