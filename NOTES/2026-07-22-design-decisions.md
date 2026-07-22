# Design decisions and insights — NLN call, 22 July 2026

Captured from a Novacene Learning Network conversation between the Director, the maths
curriculum partner, and an online-AP maths and science teacher in the network. Written
with roles rather than names by design. These notes are append-only: refine by adding,
not deleting.

## 1. Answer-checking credibility (highest priority)

Hard-coded answer matching that rejects mathematically correct variants (e.g. entering
`x = 3, y = 4` in a different form to the expected string) is a critical failure, not a
cosmetic one. For learners with rejection sensitivity, a correct answer marked wrong is
actively harmful — and for teachers, "the whole thing collapses like a pack of cards"
the moment it happens.

**Design principle:** every practice companion must recognise all mathematically
equivalent correct solutions, and feedback must be compassionate — lead with how much
is *right*, never "you haven't quite".

**Supporting fix:** learners should never have to guess how to *type* mathematics.
Each lesson should offer a topic-adaptive symbol palette (superscripts, fraction bars,
dy/dx where relevant) and a scientific calculator sidebar.

## 2. The two-tier consent architecture

Settled on this call:

- **Free layer** — open to anyone, captures nothing. "Free to walk down the street and
  look at the clouds." The privacy policy can honestly say: nothing is recorded.
- **Enrolled layer** — learners on the school roll sign in (Google), which brings the
  API, adaptive serving, and the consent framework (parental consent, commissioner
  agreements, data-protection mapping) with it.

Between the two sits learner-controlled saving, borrowed from the learner-studio
pattern in the wider portal work: explicit buttons for *keep it private*, *park it and
come back*, *save to my own Drive*, and *share with my teacher*. Saving work for
yourself without surrendering it is the consent gradient made tangible. Front-line
observation confirming the need: learners work willingly but freeze when asked to
*show* their work — sharing must remain their choice.

## 3. Patterns to standardise across all lessons ("design pushes")

Now the repo is the source of truth, cross-cutting features roll out as one change
across all lessons (as the header/footer did). Agreed candidates:

1. **Reconnection routes** at the start of every lesson — one button, one gentle
   mini-recap, framed "only if it helps you re-enter". Present in newer lessons;
   audit older ones.
2. **Accordion behaviour** — opening one collapsible panel closes the others.
   Currently inconsistent across lessons.
3. **Accessibility control** — a site-wide option for calmer colours, larger text and
   more spacing. May deliver the "white space" need without removing features.
4. **Engagement section** — optional "fun fact / maths in the news" panel. Must be
   self-hosted content only, never an external link (same reasoning as self-hosting
   fonts: no third-party calls, nothing leaks).

Once the lesson format stabilises, distil it into a **skill** so future lessons — and
future subjects (science, English) — inherit the format and philosophy automatically.

## 4. Diagnostics without tests

A learner's first interaction must never be an assessment — "it's a test even if they
say it's not a test". Understanding is gathered gently, over time, inside lessons
(small embedded choices, reflection responses), not through an upfront diagnostic.
Worth holding firm on this before September planning makes a baseline test feel
convenient.

## 5. Workflow agreements

- This repository is the **source of truth**. The shared Drive folder is retired for
  authoring ("messy house" vs "clean house").
- The curriculum partner clones the repo, builds locally, and pushes lesson by lesson.
- Cross-lesson changes are batched as design pushes rather than fixed lesson-by-lesson.
- QA tip that worked: record a spoken talk-through while reviewing, then have the AI
  turn the transcript into a prioritised change list.

## 6. Strategic context

- Met with Oak National Academy this week: their curriculum is now an open-source,
  agent-readable GitHub repository with early interdisciplinary mapping. Opportunity:
  use Oak's open content as the depersonalised base layer, with the Cornerstones lens
  and the consent architecture layered on top for enrolled learners.
- Lessons structured as a searchable schema open the path to serving lessons
  adaptively as interest or aptitude develops — the enrolled layer's long game.
- Initial audience for the site is **educators** (a consistency scaffold across
  everyone delivering maths); learners follow.
- Child-safe whiteboard tooling remains an unsolved gap in the sector (major tools
  exclude under-16s on data-protection grounds); worth tracking but not building yet.
