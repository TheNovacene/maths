# NEO Mathematics GreenPrint — Running Design Record entry v1.9 (DRAFT)

**Proposed version:** 1.9 · **Date:** 2026-07-28 · **Controlling record:** builds on Active v1.6
**Status:** Draft entry for filing · Curriculum by Gerry Docherty

*"Connection before curriculum. Always."*

## Decision — self-contained 3D interactives are permitted (no third-party calls)

Lessons may include genuine, draggable **3D** interactives, built with the browser's own
**CSS 3D transforms** (or a small hand-rolled canvas projector), **entirely inline and with
no external or third-party calls at runtime.** This does not weaken the privacy rule — the
free layer still fetches nothing and leaks nothing. It clarifies that the constraint was
always "no external/CDN calls", never "no 3D".

Confirmed by a working proof of concept: a draggable solid whose base can be a triangle,
square, pentagon or hexagon, rendered from pure inline CSS transforms — no library, nothing
fetched. The reusable component is filed at
`vault/05_Lesson_Templates/NEO_3D_Solids_Component_CSS3D_v0.1.html`.

### Where it will be used

3D is adopted where rotation genuinely deepens understanding, not for novelty. In the
**2D and 3D Shapes** unit it is planned for:

- **Lesson 5 — Reasoning from nets** (folding a flat net up into a solid), and
- **Lesson 7 — Cross-sections** (slicing a solid and seeing the cross-section face-on).

Other lessons keep clean 2D where 3D would add little. **Curved solids** (sphere, cylinder,
cone) do not render well as flat CSS faces; for those, use a small inline canvas projector or
keep 2D.

### Conditions (all must hold)

1. **No external calls.** Fully inline; nothing fetched from a CDN or third party. Self-hosting
   a library in the repo and referencing it by a local path is the only acceptable "library"
   route, and is a separate, heavier decision not taken here.
2. **Optional, with a 2D fallback.** The mathematics must be reachable without the 3D view.
3. **Honour Reduce motion.** No auto-rotation when the learner's system or the Comfort control
   requests reduced motion; rotation is learner-driven by default.
4. **Visual containment still applies** (v0.8): the whole construction stays inside its frame
   across the full interaction range.
5. **Reasoning-first still applies** (v1.5): the 3D view supports reasoning the learner can
   reproduce; it is not a device that "produces" answers.

## Rationale

Nets and cross-sections are exactly where a flat page fails learners. Being able to fold, turn
and slice a solid — and to see the faces, edges and vertices hidden at the back — turns a told
fact ("a prism has a constant cross-section") into something observed. The technique is
lightweight, self-contained and privacy-preserving, so it carries no external-dependency cost.

## Implications and QA

- **QA:** for any 3D interactive, confirm no external requests, a working 2D fallback, correct
  behaviour under reduced motion, and containment at all rotations.
- **Reusable environment:** treat the filed CSS-3D component as the unit's shared 3D
  environment; adapt it per lesson (nets, cross-sections) rather than writing one-off engines.

## Next step

Reword into the Running Design Record prose and consolidate with the pending v1.7/v1.8 entries
at the next milestone regeneration of the GreenPrint Active document.
