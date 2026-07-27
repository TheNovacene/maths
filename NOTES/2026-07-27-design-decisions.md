# Design decisions — build session, 27 July 2026

Continuation of the NEO Maths repo work (curriculum partner + Claude). Append-only.

## 1. New unit started: 2D and 3D Shapes (Foundations, Y9)

Blueprint agreed and filed at `vault/01_Curriculum_Maps/NEO_Mathematics_Unit_Blueprint_2D_and_3D_Shapes_v0.1.md`.
Unit Driving Question: *How can we describe and measure the space that shapes occupy — in two
dimensions and three?* Mathematical story: **describe → measure 2D → build 3D → measure 3D →
scale the units.** Nine 45-minute lessons: properties · polygon angles · circumference · area
of a circle · nets · surface area · cross-sections · volume · converting spatial units.

**Lesson 1 — Analysing 2D and 3D Properties** built and accepted into preview (v0.1). Chosen
interactives: Option A (Prism Family Pattern Explorer) in the Connection Cornerstone and
Option D (Shape Detective) in Reflection. Verified 22/22 functional + all QA gates + 5/5 on
the fully-built output. Wired into `curriculum.json` and `build_site.py` SOURCES as a new
"2D and 3D Shapes" unit. Two review tweaks applied: a "New words: faces, edges and vertices"
card with a labelled cube added to the top of Connection (learners meet the vocabulary before
using it), and the base buttons renamed from "3-gon base" to "Triangular base" etc. Guidance
PDFs to follow after acceptance, in the exemplar format.

## 2. Practice Companion card — now a standing design rule (baked in)

Confirmed as a locked rule, not just a one-off standardisation. **Every lesson opens its
Practice Companion from one standard card at the bottom of the lesson view:** a cream card,
left green border, centred, headed "✏️ Ready to strengthen your understanding?", with a single
centred "Open Practice Companion" button — no arrow, no instructions paragraph. Wording is
fixed: "understanding" not "skills"; "Practice Companion" not "Practice Activity"; no arrow.

It is **guaranteed by the build**: `inject_practice_card` in `scripts/build_site.py` detects
each lesson's open-function, removes any legacy trigger (top button or old card), tidies any
empty box, and places the standard card at the bottom. **Authoring rule:** a new lesson
exposes a single `openPractice()`/`openPracticeSession()` trigger and never hand-builds a
bespoke practice button or card — the build standardises it.

Baked into three places today so it is not lost: this NOTES entry; a GreenPrint entry
(`vault/00_GreenPrint_and_Governance/NEO_Mathematics_GreenPrint_v1.8_Entry_Practice_Companion_Card_DRAFT.md`);
and the `neo-mathematics` skill's lesson-ecosystem rules.
