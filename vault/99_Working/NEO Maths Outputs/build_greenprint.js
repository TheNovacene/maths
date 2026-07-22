const fs = require('fs');
const d = require('docx');
const {
  Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType,
  Table, TableRow, TableCell, WidthType, ShadingType, BorderStyle,
  PageBreak, TableOfContents, Header, Footer, PageNumber, LevelFormat,
  convertInchesToTwip
} = d;

const GREEN = '2E6B4F';
const DARK = '1F3B2C';
const GREY = '5A5A5A';

const children = [];

// ---------- helpers ----------
function H1(text) {
  children.push(new Paragraph({
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 400, after: 180 },
    children: [new TextRun({ text, bold: true, size: 30, color: GREEN, font: 'Calibri' })],
  }));
}
function H2(text) {
  children.push(new Paragraph({
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 300, after: 120 },
    children: [new TextRun({ text, bold: true, size: 25, color: DARK, font: 'Calibri' })],
  }));
}
function H3(text) {
  children.push(new Paragraph({
    heading: HeadingLevel.HEADING_3,
    spacing: { before: 220, after: 100 },
    children: [new TextRun({ text, bold: true, size: 22, color: DARK, font: 'Calibri' })],
  }));
}
function P(text, opts = {}) {
  children.push(new Paragraph({
    spacing: { after: opts.after === undefined ? 140 : opts.after },
    alignment: opts.align || AlignmentType.LEFT,
    indent: opts.indent,
    children: [new TextRun({
      text, size: opts.size || 21, font: 'Calibri',
      italics: !!opts.italics, bold: !!opts.bold, color: opts.color || '000000',
    })],
  }));
}
// paragraph with a bold lead-in
function PL(lead, rest, opts = {}) {
  children.push(new Paragraph({
    spacing: { after: 140 },
    children: [
      new TextRun({ text: lead, bold: true, size: 21, font: 'Calibri' }),
      new TextRun({ text: rest, size: 21, font: 'Calibri' }),
    ],
  }));
}
function LOCK(text) {
  children.push(new Paragraph({
    spacing: { before: 120, after: 160 },
    indent: { left: 220, right: 220 },
    border: {
      left: { style: BorderStyle.SINGLE, size: 18, color: GREEN, space: 10 },
    },
    shading: { type: ShadingType.CLEAR, fill: 'F1F6F2' },
    children: [
      new TextRun({ text: 'Locked rule. ', bold: true, size: 21, font: 'Calibri', color: GREEN }),
      new TextRun({ text, size: 21, font: 'Calibri' }),
    ],
  }));
}
function BULLETS(items, level = 0) {
  items.forEach(t => {
    const runs = Array.isArray(t)
      ? [new TextRun({ text: t[0], bold: true, size: 21, font: 'Calibri' }),
         new TextRun({ text: t[1], size: 21, font: 'Calibri' })]
      : [new TextRun({ text: t, size: 21, font: 'Calibri' })];
    children.push(new Paragraph({
      numbering: { reference: 'neo-bullets', level },
      spacing: { after: 70 },
      children: runs,
    }));
  });
}
function NUMS(items) {
  items.forEach(t => {
    children.push(new Paragraph({
      numbering: { reference: 'neo-numbers', level: 0 },
      spacing: { after: 70 },
      children: [new TextRun({ text: t, size: 21, font: 'Calibri' })],
    }));
  });
}
function TABLE(headers, rows, widths) {
  const total = widths.reduce((a, b) => a + b, 0);
  const mk = (text, bold, fill) => new TableCell({
    width: { size: 0, type: WidthType.DXA },
    shading: fill ? { type: ShadingType.CLEAR, fill } : undefined,
    margins: { top: 70, bottom: 70, left: 110, right: 110 },
    children: [new Paragraph({
      spacing: { after: 0 },
      children: [new TextRun({
        text, bold: !!bold, size: 19, font: 'Calibri',
        color: bold ? 'FFFFFF' : '000000',
      })],
    })],
  });
  const rowObjs = [
    new TableRow({
      tableHeader: true,
      children: headers.map((h, i) => {
        const c = mk(h, true, GREEN);
        c.options.width = { size: widths[i], type: WidthType.DXA };
        return new TableCell({
          width: { size: widths[i], type: WidthType.DXA },
          shading: { type: ShadingType.CLEAR, fill: GREEN },
          margins: { top: 70, bottom: 70, left: 110, right: 110 },
          children: [new Paragraph({ spacing: { after: 0 }, children: [new TextRun({ text: h, bold: true, size: 19, font: 'Calibri', color: 'FFFFFF' })] })],
        });
      }),
    }),
    ...rows.map((r, ri) => new TableRow({
      children: r.map((cell, i) => new TableCell({
        width: { size: widths[i], type: WidthType.DXA },
        shading: { type: ShadingType.CLEAR, fill: ri % 2 ? 'F5F8F5' : 'FFFFFF' },
        margins: { top: 70, bottom: 70, left: 110, right: 110 },
        children: [new Paragraph({ spacing: { after: 0 }, children: [new TextRun({ text: cell, size: 19, font: 'Calibri' })] })],
      })),
    })),
  ];
  children.push(new Table({
    columnWidths: widths,
    width: { size: total, type: WidthType.DXA },
    rows: rowObjs,
  }));
  children.push(new Paragraph({ spacing: { after: 160 }, children: [] }));
}
// mixed-run paragraph: array of [text] or [text, {sup:true, bold, italics}]
function MIX(parts, opts = {}) {
  children.push(new Paragraph({
    spacing: { before: opts.before || 0, after: opts.after === undefined ? 140 : opts.after },
    alignment: opts.align || AlignmentType.LEFT,
    children: parts.map(p => {
      const t = Array.isArray(p) ? p[0] : p;
      const o = (Array.isArray(p) && p[1]) || {};
      return new TextRun({
        text: t,
        size: opts.size || 21,
        font: 'Calibri',
        bold: !!o.bold,
        italics: !!o.italics,
        superScript: !!o.sup,
      });
    }),
  }));
}
function RULE() {
  children.push(new Paragraph({
    spacing: { before: 100, after: 200 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: 'C9D8CC', space: 6 } },
    children: [],
  }));
}
function BREAK() {
  children.push(new Paragraph({ children: [new PageBreak()] }));
}

// ===================== TITLE PAGE =====================
children.push(new Paragraph({ spacing: { before: 1200, after: 100 }, alignment: AlignmentType.CENTER,
  children: [new TextRun({ text: 'NEO MATHEMATICS CURRICULUM', bold: true, size: 26, color: GREY, font: 'Calibri', characterSpacing: 60 })] }));
children.push(new Paragraph({ spacing: { after: 60 }, alignment: AlignmentType.CENTER,
  children: [new TextRun({ text: 'GreenPrint', bold: true, size: 72, color: GREEN, font: 'Calibri' })] }));
children.push(new Paragraph({ spacing: { after: 320 }, alignment: AlignmentType.CENTER,
  children: [new TextRun({ text: 'Running Curriculum Design Record', size: 30, color: DARK, font: 'Calibri' })] }));
children.push(new Paragraph({ spacing: { after: 100 }, alignment: AlignmentType.CENTER,
  children: [new TextRun({ text: 'Version 1.6 — Consolidated Locked Record', bold: true, size: 26, font: 'Calibri' })] }));
children.push(new Paragraph({ spacing: { after: 420 }, alignment: AlignmentType.CENTER,
  children: [new TextRun({ text: 'Reasoning-First Interactive Design · Structural Explanation · Place-Value Language · Nutrition Presence', size: 21, italics: true, color: GREY, font: 'Calibri' })] }));
children.push(new Paragraph({ spacing: { after: 700 }, alignment: AlignmentType.CENTER,
  children: [new TextRun({ text: '“Connection before curriculum. Always.”', size: 24, italics: true, color: GREEN, font: 'Calibri' })] }));

TABLE(['Field', 'Entry'], [
  ['Status', 'Working GreenPrint — live design and production record. Consolidated locked version.'],
  ['Current version', 'v1.6 (consolidated 20 July 2026)'],
  ['Consolidates', 'v1.3 master record, the v1.4 and v1.5 milestone entries of 18 and 19 July 2026, and the v1.6 Nutrition presence decision of 20 July 2026'],
  ['Current focus', 'Reasoning-first interactive design; structural explanation over procedural instruction; faithful place-value language; universal Nutrition presence; age-neutral pathway architecture; one-lesson-at-a-time production'],
  ['Next intended version', 'v1.7 — completed Foundations unit sequence for Accuracy, Powers and Scale; pilot evidence; template refinements'],
  ['Owner', 'Curriculum lead (Gerrard Docherty) with the Director of Nudge Education Online (Kirstin Stevens)'],
], [1900, 7100]);

P('Primary sources: NEO Cornerstones in Mathematics; the NEO curriculum intent and implementation document; qualification specifications; learner-access principles; prototype and production lessons; Director feedback; and GreenPrint versions v0.1–v1.5.', { size: 19, color: GREY });

BREAK();

// ===================== HOW TO USE =====================
H1('How to Use This Running Design Record');

P('This document is the living record for the NEO KS3–KS4 Mathematics curriculum build. Every significant curriculum decision is added to it with a version number and a rationale. The record grows in milestone versions and is never silently overwritten: v0.1, v0.2, v0.3 and so on. It is deliberately a working document — a place to test language, capture unresolved questions and preserve decisions.');

H2('What this consolidation does');

P('Between 16 and 19 July 2026 the governing rules became distributed across three separate documents: the v1.3 master record, a standalone v1.4 entry on place-value language, and a standalone v1.5 entry on reasoning-first interactive design. Anyone building a lesson had to hold all three at once, and the QA gates introduced by v1.4 and v1.5 existed nowhere alongside the gates they extend.');

P('This version consolidates all locked decisions from v0.1 to v1.6 into one governing statement of the rules as they now stand, and gathers every shipping gate into a single Part Six. It is a restatement of current rules, not a replacement of the historical record.');

BULLETS([
  ['Nothing is removed. ', 'Every locked decision from v0.1 to v1.3 is carried forward here. Where a later version revised an earlier one, the revision is stated explicitly and the earlier position noted.'],
  ['Earlier versions remain recoverable. ', 'The v1.3 record, and the standalone v1.4 and v1.5 entries, remain in Drive at 00_GreenPrint_and_Governance. Consult them for the full deliberative narrative, superseded wording and the reasoning as it was recorded at the time.'],
  ['This record governs. ', 'Where this consolidation and an earlier document differ in wording, this record governs for all new production. Where it is silent on something an earlier version covered in detail, the earlier version still applies.'],
  ['Numbered items run continuously. ', 'Numbered items are numbered continuously across the whole record rather than restarting in each section, so that any single item can be cited unambiguously — for example “item 77”. Section headings give the governing version; item numbers give the reference.'],
]);

H2('Approval status');

P('The v1.4, v1.5 and v1.6 entries record mathematical and pedagogical corrections raised by the curriculum lead during the Lesson 04 and Lesson 05 builds and the subsequent review. They do not require separate Director approval and are recorded here as locked. The Director remains the approving authority for decisions affecting institutional policy, pathway architecture or qualification strategy.');

RULE();

H2('Version History');

TABLE(['Version', 'Date', 'Focus', 'Status'], [
  ['0.1', '1 July 2026', 'Mathematical interpretation of the six NEO Cornerstones; initial curriculum architecture', 'Locked and carried forward'],
  ['0.2', 'July 2026', 'Stepping Stones terminology; locked interactive HTML lesson style', 'Locked; panel order later revised by v1.2'],
  ['0.3', 'July 2026', 'Learner Guide, Supporting Adult Guidance and embedded Scratchpad architecture', 'Locked; refined by v0.4 and v1.1'],
  ['0.4', '4 July 2026', 'Locked guidance architecture; NEO Maths Scratchpad interaction standard', 'Locked; extended by v0.9'],
  ['0.5', 'July 2026', 'Detailed unit blueprints; session-level architecture; Reconnection Routes', 'Locked and carried forward'],
  ['0.6', 'July 2026', 'Learner-flow and interactive-entry design rule', 'Locked and carried forward'],
  ['0.7', 'July 2026', 'Nutrition as explicit mathematical nourishment; two locked modes', 'Locked and carried forward'],
  ['0.8', 'July 2026', 'Visual geometry containment and rendering QA', 'Locked and carried forward'],
  ['0.9', '9 July 2026', 'Layered Scratchpad design and QA rules', 'Locked and carried forward'],
  ['1.0', '15 July 2026', 'Practice Companion worked-solution unlock rule', 'Locked and carried forward'],
  ['1.1', '15 July 2026', 'Age-neutral pathways, planning envelope and lesson ecosystem production standard', 'Locked and carried forward'],
  ['1.2', '16 July 2026', 'One-lesson-at-a-time workflow; reference-shell consistency; review gate', 'Locked and carried forward'],
  ['1.3', '16 July 2026', 'Reconnection Routes access and return standard', 'Locked and carried forward'],
  ['1.4', '18 July 2026', 'Place-value language standard: the decimal point is fixed; the digits move', 'Locked — consolidated here'],
  ['1.5', '19 July 2026', 'Reasoning-first interactive design; structural explanation over procedural instruction', 'Locked — consolidated here'],
  ['1.6', '20 July 2026', 'Nutrition presence standard: contextual where the mathematics is genuinely nutritional, intellectual otherwise, present always. Consolidation of v0.1–v1.6 into a single governing record with unified QA gates.', 'This document'],
], [900, 1200, 4400, 2500]);

P('Note on version numbering: the v1.3 record anticipated that v1.4 would carry the completed Foundations unit sequence and pilot evidence. Production instead surfaced language and design corrections that needed locking first, and those became v1.4, v1.5 and v1.6. The anticipated content is carried forward as the next intended version — see Part Seven.', { size: 19, color: GREY });

BREAK();

// ===================== PART ONE =====================
H1('Part One — Direction and Frame');

H2('1. Core direction and vision (v0.1)');

P('NEO Mathematics is an interactive, inquiry-led KS3 and KS4 curriculum. It keeps the strengths of the Verse-al Maths curriculum but re-bases the pedagogical structure around the six NEO Cornerstones rather than the five Verse-al Ways of Knowing.');

P('The key shift is a change of question. Verse-al Maths asked: what are the different ways a learner can know mathematics? NEO Maths asks: how can mathematics help a learner reconnect with learning, self, body, others and the world?');

P('The curriculum remains grounded in the National Curriculum and qualification pathways but is not reduced to exam specifications. The curriculum spine defines what mathematical learning is; GCSE, iGCSE, Functional Skills and ASDAN requirements sit as overlays. A specification describes assessment, not the whole curriculum.');

H3('Curriculum vision statement');

children.push(new Paragraph({
  spacing: { before: 100, after: 200 },
  indent: { left: 300, right: 300 },
  shading: { type: ShadingType.CLEAR, fill: 'F1F6F2' },
  children: [new TextRun({
    text: 'NEO Mathematics is an interactive, inquiry-led curriculum that helps learners reconnect with mathematics as a language of relationships, change, pattern, fairness, design and decision-making. It is grounded in the National Curriculum and qualification pathways, but not reduced to them. Through the six NEO Cornerstones — Connection, Movement, Creativity, Reflection, Rest and Nutrition — learners explore mathematics as something they can see, move, make, question, pause with and use to sustain real life.',
    size: 21, italics: true, font: 'Calibri',
  })],
}));

H3('Canonical NEO Maths spine');

P('Number sense · structure and generalisation · proportional reasoning · spatial reasoning · change and functions · data and uncertainty · mathematical modelling · financial and applied reasoning · proof, explanation and communication · self-regulated mathematical learning.');

H2('2. The six Cornerstones interpreted mathematically (v0.1)');

P('Every NEO Mathematics lesson must reference all six Cornerstones honestly. They need not receive equal weight, and a forced or decorative reference is worse than a modest honest one.');

H3('Connection — mathematics as relationships');
P('Design question: what is connected to what, and how do we know? Equivalence, ratio and proportion, functions, graphs, sequences, similarity, correlation, networks, mathematical communication, collaborative reasoning and the human story of mathematics.');

H3('Movement — mathematics as change, transformation and embodied sense-making');
P('Design question: what is changing, moving or transforming? Number lines, transformations, coordinates, vectors, gradients, rates of change, sequences, graph behaviour, kinematics, trigonometry and dynamic geometry.');

H3('Creativity — mathematics as making, modelling and invention');
P('Design question: what can you make with this idea? Multiple solution methods, pattern creation, mathematical art, modelling, design challenges, coding, data stories and problem posing. Mathematics is not only about finding answers; it is about creating representations, models, conjectures, strategies, proofs and designs.');

H3('Reflection — mathematics as noticing, reasoning and metacognition');
P('Design question: how do I know, and how did my thinking change? Proof, reasoning, error analysis, misconception work, self-explanation, comparing strategies and confidence ratings. Reviewing another learner’s written working to find the line that does not follow is a standard Reflection activity (see v1.5, Part Two §9).');

H3('Rest — mathematics as consolidation, zero, space and sustainable learning');
P('Design question: where is the pause, the space, the balance, or the nothing? Rest has two roles. As a pedagogical design principle it governs pacing, regulation, chunking, retrieval, low-stakes practice and sensory-load awareness. As a mathematical concept lens it covers zero, empty sets, gaps, pauses, balance, limits, intervals and negative space.');

H3('Nutrition — mathematics as fuelling life, body, health and sustainable choices');
P('Design question: how does this mathematics help us make choices that sustain life? Strongest in applied, contextual, statistical, financial and health-related mathematics. Two legitimate modes are locked at Part Four §16.');

H3('Default lesson rhythm');
P('A design support, not a compulsory sequence: Connect (~15 min) · Move (~15 min) · Reflect and Create (~7 min) · Rest and Nourish (~3 min) · Evidence (~5 min). Timings are invitations, not deadlines.');

H2('3. Cornerstone–strand mapping (v0.1)');

TABLE(['Strand', 'Strong Cornerstones', 'Inquiry focus'], [
  ['Number', 'Rest, Connection, Reflection', 'What is the structure of number? What does zero do?'],
  ['Algebra', 'Connection, Creativity, Reflection', 'How can symbols describe relationships and hidden rules?'],
  ['Ratio and Proportion', 'Connection, Nutrition, Creativity', 'How do quantities scale in recipes, maps, budgets and design?'],
  ['Geometry and Measures', 'Movement, Creativity, Rest', 'How do shapes move, fit, balance and occupy space?'],
  ['Graphs and Functions', 'Movement, Connection, Reflection', 'How can we see change and relationships?'],
  ['Statistics', 'Connection, Reflection, Nutrition', 'What stories does data tell, and what stories can it hide?'],
  ['Probability', 'Creativity, Reflection, Connection', 'What does fairness look like mathematically?'],
  ['Financial Maths', 'Nutrition, Reflection, Connection', 'How can maths support sustainable choices?'],
  ['Problem Solving', 'Reflection, Creativity, Rest', 'How do I choose a strategy and stay regulated when stuck?'],
], [2100, 2600, 4300]);

P('Each unit additionally records a Cornerstone design layer: primary, secondary and optional contextual Cornerstone; fit rating (strong, partial or light); sensory load; mode (live, asynchronous or independent); interactive tool type; evidence type; and mastery descriptors.');

H2('4. Qualification overlays (v0.1)');

P('National Curriculum KS3 · Pearson Edexcel International GCSE Mathematics A (Foundation and Higher tier) · Functional Skills Mathematics · ASDAN or portfolio evidence where appropriate. Overlays map to the same deeper curriculum outcomes; they do not define them.');

BREAK();

// ===================== PART TWO =====================
H1('Part Two — Language and Lesson Style');

H2('5. Locked terminology (v0.2, extended by v1.1 and v1.5)');

TABLE(['Avoid', 'Use instead', 'Rationale'], [
  ['Seeds of Change', 'Stepping Stones', 'More NEO-aligned; suggests gradual, safe progress and learner re-entry.'],
  ['Ways of Knowing', 'NEO Cornerstones', 'NEO Maths is re-based around the six school-wide Cornerstones.'],
  ['Learning objectives (learner-facing)', 'Stepping Stones', 'Acceptable in technical curriculum mapping only; learner-facing lessons use Stepping Stones.'],
  ['Student', 'Learner', 'Consistent NEO institutional language.'],
  ['Year 7 … Year 13, KS3, KS4 (learner-facing)', 'Foundations / Intermediate / Advanced', 'Age-neutral pathways (v1.1). Stage codes may remain in internal filenames and metadata.'],
  ['Foundation Level', 'Foundations', 'Avoids collision with the Pearson Foundation Tier; the NEO pathway is not an examination tier.'],
  ['Move the decimal point; the decimal point shifts', 'The digits slide across the place-value columns', 'Place-value language standard (v1.4). See §7.'],
  ['Machine, engine, calculator (as a framing for an interactive)', 'Working, chain, line, reason', 'Reasoning-first interactive design (v1.5). See §8.'],
], [2600, 2400, 4000]);

P('British English throughout. Timings are invitations, not deadlines.');

H2('6. Locked lesson style and interactive pattern (v0.2)');

P('NEO Mathematics lessons use a simple, LMS-friendly HTML structure: self-contained, with inline styles and plain JavaScript, and no external URLs unless supplied by NEO or the curriculum author.');

BULLETS([
  'Begin with a short, inquiry-led Driving Question.',
  'Follow with a warm, calm introduction block containing the lesson focus, the Stepping Stones and the Cornerstones.',
  'Use collapsible panels for the six Cornerstones in the locked order (see Part Five §21).',
  'End with a collapsible Final Task panel producing portfolio evidence.',
  'Use a gentle organic colour palette with a consistent page background and subtly differentiated panel colours.',
  'Write interactive activities directly into the page: learner inputs, selects, buttons, feedback boxes, hints, Socratic prompts and worked solutions.',
  'Include a separate in-page Practice Companion view, opened from the lesson and returned to by a second control.',
  'Design trauma-informed throughout: calm pacing, low-stakes checking, optional support, clear steps, no unnecessary visual clutter.',
]);

H3('Required interactive pattern');

P('Where an activity is described as interactive it must do more than display a table or reveal an answer. It must respond to learner input.');

NUMS([
  'The learner chooses or enters values.',
  'The page updates calculated outputs or generated content.',
  'The learner can request a Socratic prompt.',
  'The learner can request a hint.',
  'The learner can check an answer or explanation.',
  'Feedback is displayed in a calm, supportive tone, determined dynamically from what the learner actually entered.',
  'A worked solution becomes available under the conditions in Part Three §13.',
  'Progress is preserved within the current page session where feasible.',
]);

P('Feedback must accept mathematically equivalent answers, sensible tolerances and alternative valid representations. A single hard-coded answer string is not acceptable. Incorrect-answer feedback identifies a useful next action without revealing the method.');

H3('Mastery rubric');
P('Emerging → Developing → Secure → Mastering, across Understanding, Application, Communication and Reflection.');

RULE();

H2('7. Place-value language standard (v1.4)');

P('Prompted by a Director correction during the Lesson 04 build (Write and Order Standard Form), where lesson language described the decimal point as moving during multiplication and division by powers of ten.');

LOCK('In all NEO Mathematics learner-facing and adult-facing materials, the decimal point is described as a fixed separator between the whole-number and fractional place-value columns. It does not move. When a number is multiplied or divided by a power of ten, it is the digits that move across the place-value columns.');

H3('Standard phrasing');
BULLETS([
  'Multiplying by 10 slides every digit one place to the left.',
  'Dividing by 10 slides every digit one place to the right.',
  'The exponent records how many places the digits slide.',
]);

H3('Prohibited phrasing');
P('In any new material: “move the decimal point”, “the decimal point shifts”, “decimal-shift”, or any wording implying the separator travels while the digits stay still.');

H3('Rationale');
P('The digits-move model is the mathematically faithful description of place value: each digit’s value changes by a factor of ten because the digit occupies a new column, while the separator between ones and tenths is a fixed feature of the notation. The point-moves shortcut is a common source of later misconception, particularly around ordering decimals and negative exponents, and it undermines the very place-value understanding the Foundations pathway exists to secure.');

H3('Implications');
BULLETS([
  'Lesson interactives, feedback strings, hints, worked solutions, Practice Companions, Learner Guidance and Supporting Adult Guidance must all use the digits-move language.',
  '“Believing the decimal point moves” is treated as a named misconception with a supportive repair prompt in relevant Supporting Adult Guidance.',
  'Reconnection Routes touching place value, powers of ten, or multiplying and dividing by ten must model the correct language.',
  'Existing packages (Accuracy, Powers and Scale Lessons 01–03, the Pythagoras sequence and migrated repository lessons) are audited for the prohibited phrasing and corrected at their next version increment. The audit of Lessons 01–03 was completed on 18 July 2026 and recorded with those packages.',
]);

P('Validation example: Lesson 04 — Write and Order Standard Form v0.2/v0.3. The Scale Explorer reveal, the practice hints and both guidance documents use the locked language, and the Supporting Adult Guidance teaches the rule explicitly in its plain-language mathematics section.');

RULE();

H2('8. Reasoning-first interactive design (v1.5)');

P('Established through the Lesson 05 build (Calculating with Standard Form), which passed through four versions as the principle was clarified by Director review.');

LOCK('An interactive must develop reasoning the learner can reproduce on paper. It must never be a device the learner operates.');

H3('8.1 No machine metaphors');
P('Interactives must not be framed as machines, engines, calculators or other devices that “produce” answers. A machine framing quietly teaches that the procedure lives in the device rather than in the learner; when the learner later meets a non-routine problem, there is no machine. What must transfer is the learner’s own capacity to rewrite expressions equivalently and justify each step.');

H3('8.2 The learner’s product is mathematical writing');
P('Where an interactive walks through a calculation, its visible output should be working the learner could have written by hand — for NEO Mathematics, a chain of equalities in which every line is equal to the line above it and every line carries its reason in the margin. For example: “multiplication can be regrouped in any order”; “index law: add the exponents”; “15 = 1.5 × 10 — the same number, factorised”; “the definition: 1 ≤ a < 10”.');

H3('8.3 Choices are mathematical decisions');
P('Tap-first accessibility remains the standard — one action per moment, low reading and motor load, wrong taps cost nothing. But every choice offered must be a genuine mathematical decision. Distractors must embody real misconceptions, and their feedback must point back at the mathematics (“does the index law add or multiply the exponents?”), never merely at the interface.');

H3('8.4 Free entry comes after understanding');
P('Open input — typing one’s own numbers, posing one’s own problems — belongs after the idea is secure, consistent with the experience-before-create ordering locked at v0.6. When it arrives, the learner should write the working themselves, on the Scratchpad or on paper, before any model solution is revealed for comparison.');

RULE();

H2('9. Structural explanation over procedural instruction (v1.5)');

LOCK('Every transformation shown to a learner must be justified by a named mathematical fact, not by a procedural label.');

H3('9.1 Procedural labels are insufficient');
P('An instruction such as “slide the digits” — or “move the decimal”, “add a zero”, “swap it over” — names an effect without its cause. It tells the learner neither why the move is valid, nor how far, nor in which direction. Such labels may appear only as the interpretation of a justified step, never as the step itself.');

H3('9.2 The canonical example');
P('When a coefficient breaks the definition of standard form, the correction is written as algebra:');
MIX([
  ['15 × 10', { bold: true }], ['10', { bold: true, sup: true }],
  ['  =  1.5 × 10 × 10', { bold: true }], ['10', { bold: true, sup: true }],
  ['  =  1.5 × 10', { bold: true }], ['11', { bold: true, sup: true }],
], { align: AlignmentType.CENTER, size: 24, before: 60, after: 160 });

MIX([
  'The factorisation (15 = 1.5 × 10) supplies the reason; the index law fixes the direction and the amount; the digit slide is then observed as the place-value consequence. The same structure applies in reverse for coefficients below 1 (0.5 = 5 × 10',
  ['−1', { sup: true }], ').',
]);

H3('9.3 Definitions are stated precisely');
MIX([
  'Learner-facing lessons state definitions exactly where the mathematics depends on them, in learner-friendly form. For standard form: a × 10',
  ['n', { sup: true }],
  ', where 1 ≤ a < 10 and n is an integer, noting that a may equal 1. A rewrite prompted by a definition is presented as finishing the working, not as correcting an error: every line of a chain is the same number.',
]);

H3('9.4 Learner-facing implications');
BULLETS([
  'Lessons speak of “working”, “chains”, “lines” and “reasons” — never of machines or devices.',
  'The recurring self-question NEO Mathematics teaches is: “What is the next true line, and what is my reason?”',
  'Checking one’s final line against the relevant definition is part of every calculation’s route.',
  'Reviewing another learner’s written working, to find the line that does not follow, is a standard Reflection activity.',
]);

H3('9.5 Relationship to the place-value standard');
P('Where the v1.4 digit-shift language is used, it now appears as the interpretation of a justified factorisation, per §9.2 — not as the instruction itself. The two rules operate together: v1.4 governs how the movement is described, v1.5 governs whether it may be offered as a reason at all.');

P('Validation example: Lesson 05 — Calculating with Standard Form. Versions v0.1–v0.3 used a “Split–Work–Rejoin Machine”; Director review identified both the machine framing and the procedural “slide the digits” repair as contrary to NEO’s aim of transferable understanding. Version v0.4 rebuilt the lesson as “Growing the working” (a chain-of-equalities builder with a reason for every line), “Check this working” (judging handed-in chains) and “Pose your own, then write the chain” (tiles to pose, handwritten chain, model comparison). v0.4 is the reference implementation of both principles and was accepted on 20 July 2026.', { italics: true });

BREAK();

// ===================== PART THREE =====================
H1('Part Three — The Lesson Ecosystem');

H2('10. The five resources (v0.3, v0.4, refined v1.1)');

P('Every full NEO Mathematics lesson package is designed as a connected set of five resources. The learner must be able to navigate the core lesson independently, while optional support remains immediately available.');

TABLE(['Resource', 'Primary user', 'Locked purpose'], [
  ['Interactive Lesson', 'Learner', 'The hub. Inquiry-led HTML lesson using collapsible Cornerstone panels and genuine in-page interactives. Driving Question first; Stepping Stones in the orientation block; Reconnection Routes control; Final Task producing portfolio evidence against the mastery rubric.'],
  ['Practice Companion', 'Learner', 'In-page progressive supported practice: Socratic prompt → Hint → Check → Worked solution, per question, with progress dots and a Return to lesson control.'],
  ['NEO Maths Scratchpad', 'Learner', 'Optional, lesson-local layered canvas for sketching, annotating and recording working. Never a compliance or evidence requirement.'],
  ['Learner Guidance', 'Learner', 'Approximately 2–4 pages. Calm, invitational, age-neutral orientation; Stepping Stones; a possible route through; what to try when stuck; resources; progress signs; brief reflection.'],
  ['Supporting Adult Guidance', 'Teacher, practitioner, parent, carer or other supporting adult', 'Approximately 5–8 pages. Mathematical explanation in plain language; suggested pacing; prompts; misconceptions; Cornerstone interpretation; access, regulation and evidence guidance.'],
], [1900, 1700, 5400]);

P('Neither guidance document may assume the reader is a mathematics specialist.');

H3('Guidance access inside the lesson');
P('Near the top of each HTML lesson, immediately after the lesson information block, provide a compact support area containing: Learner Guidance · Supporting Adult Guidance · Reconnection Routes · Maths Scratchpad · Practice Companion. Guidance documents open separately so the learner retains their place in the lesson. Final file paths are supplied by the NEO platform or content repository and must not be invented during lesson authoring.');

H2('11. Learner Guidance (v0.3, refined v1.1)');

P('Written directly to the learner, calm and age-neutral. Standard structure:');

BULLETS([
  'Welcome, and what we are exploring — the Driving Question and a short orientation.',
  'Your Stepping Stones — learner-facing progression statements.',
  'Before you begin — resources and regulation choices.',
  'A possible way through — an invitational route following the Cornerstone rhythm, not a rigid sequence.',
  'Lesson-specific diagram or interaction guidance.',
  'The Practice Companion pathway, stating the exact worked-solution release conditions.',
  'When you feel stuck — one small action at a time, plus the lesson support hierarchy.',
  'How you might show understanding, and a short self-review with accessible “I can…” indicators, without reproducing the full formal rubric.',
]);

P('The Learner Guidance never reproduces worked answers.');

H3('Locked learner-facing principles');
LOCK('“You can pause. You can return. You do not need to complete everything in one sitting.”');
LOCK('“Using support is part of learning. It is not cheating.”');

H2('12. Supporting Adult Guidance (v0.3, refined v1.1)');

BULLETS([
  'Lesson purpose at a glance, and what the learner is developing.',
  'The adult’s role: protect learner thinking, agency and regulation — do not take over.',
  'Preparation: essential, helpful and optional resources.',
  'Support through the Cornerstone phases, with invitational timings.',
  'Short questions that preserve learner thinking.',
  'Plain-language mathematical explanation, usable by a non-specialist.',
  'Lesson-specific misconceptions and supportive responses.',
  'The Practice Companion pathway, and the prohibition on giving the worked solution verbally while it is locked.',
  'Regulation, access, re-engagement and the signs of overload.',
  'Evidence, self-review and what counts as a valid finishing point.',
  'Optional observation and reconnection notes.',
]);

P('Age-neutral language throughout, with no deficit framing. Incomplete work is information, not failure. Timings are invitations, not deadlines: adults follow learner regulation, engagement and mathematical readiness.');

H2('13. Practice Companion and the worked-solution unlock rule (v1.0, v1.1)');

H3('Question architecture');

BULLETS([
  'Four to ten questions, chosen by cognitive weight rather than quota: 4–5 where questions are multi-step, diagram-rich or explanation-heavy; 6–7 for a normal balance; 8–10 for fluency and retrieval. Larger sets may be labelled Core Practice and Explore Further.',
  'Clearly separated information, diagram and response areas; measurements placed away from lines and edges; no give-away information.',
  'At least one opportunity for transfer, explanation, construction or interpretation.',
  'Socratic prompt, Hint, Check, Worked solution and Scratchpad available on every question.',
  'Previous and Next controls with visible progress, and a Return to lesson control.',
  'Feedback accepts mathematically equivalent answers and sensible tolerances.',
]);

H3('The worked-solution unlock rule');

LOCK('In every Practice Companion question, independently: the Worked solution button begins visible but greyed out and disabled. It unlocks only when all three conditions are true — the Socratic prompt has been used, the Hint has been used, and two or more non-empty answers have been entered and checked. State is per question and is never inherited.');

BULLETS([
  'A click on a locked button states exactly what remains: “Worked solution unlocks after you use the Socratic prompt, use the hint, and have two tries.”',
  'The rule is implemented gently. The support path should be visible and predictable, so that it reduces anxiety rather than creating it.',
  'A supporting adult must not give the complete worked solution verbally while it is locked.',
  'Recommended pathway: think and sketch → Socratic prompt → first try → Hint → second try → Worked solution.',
]);

P('Where a lesson produces worked steps, those steps must be reproducible by the learner on paper without the interactive present (v1.5 §8.2). Worked solutions in the Practice Companion should therefore be presented as chains of equalities with a reason for each line, wherever the mathematics permits.');

H2('14. The NEO Maths Scratchpad (v0.4, extended v0.9)');

P('A native HTML, CSS and JavaScript canvas inside the lesson package. It must not require an external whiteboard URL or remove the learner from the lesson environment. It opens and closes without losing the lesson position.');

P('Pedagogical purpose: to support a recurring inquiry cycle of Predict → Sketch → Test → Notice → Revise. The Scratchpad is optional and must never become a compliance or evidence requirement. Learners may use paper, a physical whiteboard or a notes app instead. Under v1.5 §8.4 it is also the natural place for a learner to write their own chain of working before a model is revealed.');

H3('Layered architecture (v0.9)');
BULLETS([
  'A persistent mathematical background layer.',
  'A learner-ink layer for pen, line and eraser actions.',
  'An annotation layer for sticky notes and movable thinking objects.',
]);
P('The eraser and Clear Board affect learner marks only; the background persists. Changing the background keeps existing learner marks unless the learner explicitly clears them.');

H3('Locked toolbar order');
P('Pen → Line → Colour → Width → Eraser → Undo → Redo → Sticky Note → Background. The Background label and its dropdown are grouped as one non-breaking inline control so they move together when the toolbar wraps.');

H3('Tool specification');
TABLE(['Tool', 'Locked behaviour'], [
  ['Pen', 'Freehand drawing and handwriting with mouse, touch or stylus where supported.'],
  ['Line', 'Dedicated straight-line tool: press to set the start point, drag to preview, release to place. Respects the selected colour and width.'],
  ['Colour', 'Charcoal, Ocean blue, Moss green, Plum, Earth brown, Berry red. Each stroke retains its selected colour.'],
  ['Width', 'Thin, Medium, Thick.'],
  ['Eraser', 'Removes learner marks only.'],
  ['Undo / Redo', 'Covers all object types, including straight lines and sticky notes, so revising thinking feels normal.'],
  ['Sticky Note', 'Multiple editable notes, draggable by the top bar and individually deletable; gentle pale palette. Metacognitive, not decorative.'],
  ['Background', 'Blank, square grid, coordinate grid, ratio table, double number line, and lesson-specific surfaces (for example a lines-of-working surface, or a place-value surface for rounding).'],
  ['New Page / Clear Board', 'Behind a protective confirmation where existing work may be lost. Clear Board removes ink, lines and notes but preserves the background.'],
  ['Save Working Page', 'Browser storage where the hosting environment permits. A local convenience only — not guaranteed Curriculum Vault storage.'],
  ['Save as Image', 'Exports background, learner marks and notes together as a PNG, so the mathematical context is preserved.'],
  ['Close', 'Returns the learner to exactly the same lesson position, without external navigation.'],
], [1700, 7300]);

P('Accessible labels, large tap targets and keyboard-reachable controls throughout. Where a tool is less obvious, a brief status message explains what the learner is expected to do.');

P('Sticky notes provide a low-pressure way to externalise provisional thinking without requiring a polished answer: “My prediction is…”, “I think c means…”, “Check this multiplier.”, “This model stops working when…”, “Question for my Practitioner…”. They align especially with Reflection, Connection and Rest.');

P('Production note: before the Scratchpad is treated as a production evidence system its behaviour must be tested inside NEO’s final hosting or LMS environment. Permanent evidence architecture is designed separately. The Scratchpad remains first and foremost a learner thinking space.', { size: 19, color: GREY });

BREAK();

// ===================== PART FOUR =====================
H1('Part Four — Design Rules for Interactives');

H2('15. Learner-flow and interactive entry rule (v0.6)');

P('The Straight-Line Graphs migration pilot established that a mathematically strong interactive is not sufficient on its own. A learner may still be left in the fog if the lesson does not make clear why the activity appears at that point, what action is expected, what should be noticed, and how the resulting idea connects to the next stage.');

LOCK('Every interactive must have a clear entry instruction, a stated mathematical noticing goal, and an explicit conceptual bridge to the next stage of the lesson.');

BULLETS([
  ['Entry instruction. ', 'Tell the learner concretely what to change, choose, drag, enter, compare or build. Activity titles must not be expected to carry the instructions.'],
  ['Mathematical noticing goal. ', 'State what relationship, invariant, change, structure or evidence the learner is trying to notice. This must be visible before or during the investigation, not only in feedback afterwards.'],
  ['Conceptual bridge. ', 'Close each substantial investigation by naming or eliciting the idea the learner should carry into the next activity. The next panel must visibly build from that idea.'],
]);

LOCK('Learners must encounter and experience an idea before they are asked to recognise, apply, compare, justify or create with it. Activities are ordered by conceptual dependency, not by Cornerstone category or by the order in which they were built.');

P('Cornerstone clustering remains the default layout rule where repeated Cornerstones occur, but conceptual dependency takes precedence. Panels may be interleaved only when returning to a Cornerstone is mathematically necessary.');

P('Reference example: the Plotting Straight Line Graphs migration pilot. The stronger sequence became — experience one relationship through the equation–table–graph connection → recognise the same relationship when representations are separated → deliberately change m or c and compare before and after → reconstruct a line from evidence → create a meaningful model.');

H3('The four learner-flow QA questions');
NUMS([
  'Why is the learner doing this now?',
  'What exactly are they expected to do?',
  'What mathematics are they trying to notice?',
  'What idea should they carry forward next?',
]);

H2('16. Nutrition modes and presence (v0.7, resolved v1.6)');

H3('16.1 The presence standard (v1.6)');

P('The v0.1 record left open whether Nutrition should be a universal design lens for every unit or mainly an applied and contextual lens. That question is now resolved.');

LOCK('The Nutrition Cornerstone is present in every NEO Mathematics lesson without exception. Where the mathematical context genuinely relates to nutrition, the Nutrition panel focuses on that context. Otherwise, all mathematics is to be understood as a form of intellectual nutrition, and the panel names what the learning is nourishing in the learner’s mathematical thinking.');

P('The consequence is that Nutrition is never absent, never optional and never a judgement about whether a topic “has” a nutrition angle. The only decision a lesson designer makes is which mode is honest for the mathematics in front of them. A lesson that reaches for a contrived food context has made the wrong decision, not a permitted one — Mode B was always available and is the ordinary case.');

P('This reframes Mode B. It is not a fallback for lessons that fail to find a real-world context; it is the standing position of the curriculum. Mathematics nourishes thinking. Naming what a particular lesson feeds — clarity, structure, precision, patience, the capacity to justify a line of working — is a substantive act, not a consolation.');

H3('16.2 Mode A — authentic contextual nourishment');
P('Used where the mathematics genuinely lives in food, hydration, the body, health, physical self-care, sustainable resources, food security or another form of practical nourishment. Examples: recipe ratio, health statistics, food budgeting, resource allocation, sustainability. Where the context is genuinely nutritional, the panel focuses on that context rather than retreating to a generic statement about thinking.');

H3('16.3 Mode B — intellectual nourishment');
P('Used wherever the mathematical content does not itself concern nutrition. The learner is invited to notice what the learning is feeding or strengthening in their mathematical thinking: clarity, pattern awareness, precision, curiosity, prediction, evidence checking, confidence, agency, tolerance of uncertainty or appreciation of structure.');

H3('16.4 The non-contrivance rule');
LOCK('A food, body, health or sustainability context must not be manufactured merely to populate a Nutrition panel. Where the mathematics is not nutritional, Mode B is the correct and expected choice.');

H3('Required function of a Nutrition panel');
BULLETS([
  'Name honestly which mode is being used.',
  'Identify the mathematical habit, capacity or practical form of nourishment being strengthened.',
  'Give the learner a low-pressure way to notice what feels stronger or clearer.',
  'Ask the learner to identify one idea, habit or connection worth carrying forward.',
  'Avoid becoming a generic wellbeing reflection or a disguised assessment score.',
]);

P('Nourishment is also a whole-curriculum quality condition. The GreenPrint QA question is: how is this lesson nourishing the learner mathematically? If a lesson is active but does not reduce fog, reveal structure, create meaningful agency or strengthen a worthwhile mathematical habit, the pedagogy requires review.');

H2('17. Visual geometry containment and rendering QA (v0.8)');

P('Mathematical correctness is not sufficient when part of the intended construction is clipped, hidden or visually cut off.');

LOCK('Every diagram, graph, coordinate environment or dynamic geometry application must be checked against the full intended construction, not only the central mathematical object.');

BULLETS([
  ['Full construction. ', 'The visual bounds must include attached shapes, constructed squares, labels, right-angle markers, annotations, draggable handles, arrows and any other element forming part of the learner’s evidence.'],
  ['Safety margin. ', 'Bounds must include deliberate breathing room on every side. A construction should not merely fit mathematically; it should remain comfortably readable.'],
  ['Default state. ', 'The complete construction must be visible when the learner first opens the activity or panel.'],
  ['Interaction extremes. ', 'Where the learner can drag, resize, rotate, scale or randomise, the intended interaction range must be tested for clipping and for loss of labels or controls.'],
  ['Container and viewBox. ', 'For SVG and canvas geometry, the container and drawing coordinate system must be dimensioned from the bounding box of the whole intended construction. Cropping to the central shape alone is not acceptable where attached geometry extends beyond it.'],
]);

P('Reference example: in the Pythagoras migration pilot, the Reflection section was improved by adding a labelled right-angled triangle and the three squares as an explicit evidence source. The first render clipped the upper part of the square on the hypotenuse because the SVG viewBox had been sized around the central triangle rather than the complete construction. The lesson learned is locked: when geometry is constructed on a mathematical object, the QA bounding box belongs to the construction as a whole.');

P('Visual containment is part of learner flow. An instruction such as “use the diagram below as your evidence” fails pedagogically if the evidence is partly cropped.');

BREAK();

// ===================== PART FIVE =====================
H1('Part Five — Architecture and Production');

H2('18. Unit and session architecture (v0.5)');

LOCK('Required hierarchy: Mathematical Strand → Unit → Unit Driving Question → 45-minute lesson sessions → Stepping Stones. One row in the Lesson Architecture Map represents one planned 45-minute learning opportunity.');

BULLETS([
  'A substantial interactive learning environment may support several lesson sessions through different presets, prompts and routes. Session volume and HTML-resource volume are not the same production measure.',
  'Unit sequences follow the mathematics, not a fixed lesson template. Identify the unit’s mathematical story before generating session titles.',
  'The mapped units must never be auto-expanded using a single repeated 10- or 15-lesson template.',
  'Production planning must audit reusable interactive tool families — for example the Pythagoras Explorer or the Dynamic Graph Lab — before commissioning isolated one-off applications.',
]);

H3('Reference unit arcs');
P('Foundations Pythagoras (15 sessions): right triangle → areas of squares → relationship → symbolic equation → hidden lengths → theorem selection → embedded triangles → indirect measurement.');
P('Intermediate Straight Lines: relationship → coordinates → start → change → gradient from points → equation → parallelism → intersection → conversion → model limitation → qualification translation → synthesis → model creation. Locked design correction: set notation and Venn diagrams must not be forced into the Straight Lines arc; they belong in a Data and Uncertainty / Probability representation unit.');

H3('Mastery checkpoints');
P('Not automatically timed end-of-unit tests. Reference shape: Arrive 5 / Choose 5 / Evidence 20 / Review 10 / Next Step 5. Learners select evidence from interactive work, Scratchpad images, annotated solutions, verbal or audio teach-back, corrected misconceptions or portfolio work. Mastery is judged against the relevant Stepping Stone demonstration, and the session identifies the next route, including a possible targeted Reconnection Route. Qualification assessment remains available where appropriate but is not the sole definition of mathematical learning.');

H2('19. Reconnection Routes (v0.5, access standard v1.3)');

H3('19.1 Attachment to the moment of need (v0.5)');
BULLETS([
  'Reconnection is not a separate catch-up block and is not automatically completed by every learner.',
  'A route is triggered by a prerequisite signal that is materially blocking current learning.',
  'Each route records a return point and the minimum return evidence.',
  'The learner repairs enough of the prerequisite connection to resume meaningful progress; they are not required to complete an unrelated intervention programme first.',
]);

H3('19.2 Access and return (v1.3)');

LOCK('The Reconnection Routes control is recurring page furniture in every lesson, in the compact support area near the top, beside Learner Guidance, Supporting Adult Guidance, Scratchpad and Practice Companion.');

BULLETS([
  'It opens a small in-page choice of only the prerequisites relevant to this lesson. It is never a generic catch-up menu.',
  'Each route names one short mathematical connection, offers a calm prompt and an optional hint, and asks only for minimum return evidence.',
  'Each route includes an explicit “Return to [current lesson]” control that preserves the learner’s place.',
  'Learners may choose a route independently; an adult may invite one without requiring it.',
  'Language is age-neutral, non-deficit and invitational. Using a route is part of learning, not evidence of failure.',
  'Reconnection activity must not replace the lesson’s main evidence or become an extra completion burden.',
]);

H2('20. Age-neutral pathways and planning envelope (v1.1)');

TABLE(['Learner-facing pathway', 'Internal mapping', 'Purpose'], [
  ['Foundations', 'Broadly Years 7–9, plus bridges and reconnections', 'Secure conceptual structures before qualification study.'],
  ['Intermediate', 'Broadly Years 10–11', 'iGCSE preparation and qualification.'],
  ['Advanced', 'Broadly Years 12–13', 'AS/A-Level. Hours planned separately.'],
], [2400, 3100, 3500]);

LOCK('Chronological year labels (Year 7 to Year 13) and key-stage labels must never appear in learner-facing titles, headers, page furniture or guidance. Internal filenames and metadata may keep stage codes such as Y9.');

P('Use “Foundations” in the plural — never “Foundation Level”, which collides with the Pearson Foundation Tier. The NEO pathway is not an examination tier and is tracked separately.');

H3('Planning envelope');
BULLETS([
  'Foundations and Intermediate each run 3 × 45 minutes × 38 weeks = 114 lessons per year, or 85.5 guided hours.',
  'The Intermediate two-year total is 228 lessons / 171 hours — a deliberate buffer over Pearson’s 120 guided learning hours.',
  'Advanced must be planned separately against the chosen qualification (approximately 180 GLH for AS, 360 for the full A-Level).',
  'Topic allocation is responsive and decided live from evidence, never distributed in advance: build a short cluster, review the evidence, then extend or conclude by conceptual security.',
  'A live coverage map is maintained so that responsive pacing never creates specification gaps.',
  'A topic is complete when its essential Stepping Stones have been encountered, practised, connected and evidenced.',
]);

H2('21. One lesson at a time, and the reference shell (v1.2)');

LOCK('Work one lesson at a time. Never pre-build the rest of a topic before the current lesson has passed review.');

H3('The six-stage production workflow');

TABLE(['Stage', 'Requirement'], [
  ['1 — Frame one lesson', 'Confirm pathway, unit, lesson number, Stepping Stones, prerequisites and likely Reconnection Routes. State the mathematical noticing goal: the relationship, structure, change or decision the learner should become able to perceive.'],
  ['2 — Present an option bank', 'Offer three to five original or meaningfully adapted interactive options before building. For each: the learner action and mathematical response; the strongest Cornerstone and how the other five connect; sensory and cognitive load; the best Scratchpad background; likely Practice Companion focus and evidence; and a clear recommendation with mathematical and accessibility rationale. Do not build until the curriculum lead chooses or authorises the recommendation.'],
  ['3 — Apply the reference shell', 'Use the accepted reference lesson as the design contract. Keep the age-neutral title area, Driving Question, warm information block and compact support area. Keep the six collapsible Cornerstone panels in the locked order. Keep Final Task, Practice Companion and Scratchpad in their established positions.'],
  ['4 — Build the ecosystem', 'Produce all five resources as a connected package (Part Three §10).'],
  ['5 — Apply the safeguards', 'Worked-solution unlock rule per question (§13); reasoning-first and structural-explanation checks (§8, §9); place-value language check (§7).'],
  ['6 — QA, then review', 'Work through Part Six in full, then present the lesson to the curriculum lead for review. Accepted lessons become the evidence base for the next option bank.'],
], [2000, 7000]);

H3('Locked Cornerstone panel order');

LOCK('Connection → Movement → Reflection → Creativity → Rest → Nutrition.');

P('Note: this order differs from the listing order used in the v0.1 and v0.2 narrative sections. The v1.2 order governs for all lesson builds.', { size: 19, color: GREY });

H3('Shell consistency');
P('The reference shell is the recurring learner-facing design contract. Sudden changes in layout, navigation, colour, control position or support sequence create unnecessary demand for neurodivergent learners. Novelty comes from the mathematics and the interactive, never from the interface.');

LOCK('Any proposed shell change is a system-level design decision: review it, version it in the GreenPrint, then apply it consistently. A single lesson must never introduce a new shell unannounced.');

H2('22. File naming, packaging and versioning');

BULLETS([
  'Lesson: NEO_Maths_[InternalStage]_[Unit]_[Lesson]_vX.Y.html',
  'Learner guide: NEO_Maths_[InternalStage]_[Unit]_[Lesson]_Learner_Guide_vX.Y.pdf',
  'Adult guide: NEO_Maths_[InternalStage]_[Unit]_[Lesson]_Supporting_Adult_Guidance_vX.Y.pdf',
  'Package: NEO_Maths_[InternalStage]_[Unit]_[Lesson]_vX.Y_Package.zip, containing an index of every artefact.',
]);

P('Every change receives a version increment and a concise reason; previous versions remain recoverable. Where a design decision made during a session changes or extends the locked rules, a new GreenPrint version entry is drafted recording the decision, its rationale and its implications. The GreenPrint grows by milestone versions, never by silent overwrite.');

BREAK();

// ===================== PART SIX =====================
H1('Part Six — Consolidated QA Shipping Gates');

P('Run these checks before presenting any lesson for review. A lesson ecosystem is ready only when every answer is yes. Where a check can be done programmatically — searching the HTML for year labels or prohibited phrasings, counting Cornerstone panels, exercising the unlock logic — do it programmatically rather than by eye.');

H2('23. Production gate (v1.1, v1.2)');

NUMS([
  'Are learner-facing titles, headers, guidance and page furniture free of chronological year labels and key-stage labels?',
  'Are the Driving Question, the Stepping Stones and the mathematical noticing goal clear?',
  'Do the visual shell and the recurring control positions match the reference lesson?',
  'Are all six Cornerstones visible, mathematically honest, and in the locked order Connection → Movement → Reflection → Creativity → Rest → Nutrition?',
  'Is a Nutrition panel present, and does it name its mode — contextual or intellectual — honestly, with no contrived context? Where the mathematics is genuinely nutritional, does the panel focus on that context?',
  'Does every interactive respond meaningfully to input, with mathematically valid dynamic feedback that accepts equivalent answers and sensible tolerances?',
  'Does every interactive have an entry instruction, a noticing goal and a conceptual bridge, with activities ordered by conceptual dependency?',
  'Are complete diagrams visible, readable and contained at the default state and at interaction extremes?',
  'Does the Practice Companion have an appropriate four to ten questions, chosen by cognitive weight rather than quota?',
  'Does the worked-solution rule pass independently for every question?',
  'Does the Scratchpad preserve backgrounds, support the locked toolbar and tools, and remain optional?',
  'Is the Reconnection Routes control present, keyboard-reachable and consistently placed, with every route genuinely prerequisite, every prompt, hint, check and Return control working, and lesson state preserved?',
  'Do both guidance documents match the lesson, use age-neutral language and preserve the support pathway?',
  'Can the learner pause, return, and use an alternative way of recording their thinking?',
  'Have the HTML, JavaScript, responsive layout, PDF links and package navigation been tested after the most recent change?',
  'Do the source package, live preview, coverage map and evidence register all carry the same version and status?',
]);

H2('24. Reasoning-first and structural-explanation gate (v1.5)');

NUMS([
  'Does any interactive frame the mathematics as a machine, engine or device? This must be no.',
  'Can every transformation the interactive shows be justified aloud by a named fact — regrouping, an index law, a definition, a factorisation?',
  'Do wrong-choice feedbacks reference the mathematics rather than the interface?',
  'Where the lesson produces worked steps, could the learner reproduce them on paper without the interactive present?',
  'Does free entry appear only after the guided experience, and is the learner asked to write their own working before a model is revealed?',
  'Are definitions stated precisely at the point where the mathematics depends on them?',
  'Is a rewrite prompted by a definition presented as finishing the working rather than as correcting an error?',
]);

H2('25. Place-value language gate (v1.4)');

NUMS([
  'Has the full lesson text — including interactives, feedback strings, hints, worked solutions, the Practice Companion and both guidance documents — been searched for “move the decimal point”, “the decimal point shifts” and “decimal-shift”?',
  'Does every description of multiplying or dividing by a power of ten say that the digits slide and the decimal point stays fixed?',
  'Where digit movement is described, does it appear as the interpretation of a justified factorisation rather than as the instruction itself?',
  'Does the Supporting Adult Guidance name “believing the decimal point moves” as a misconception, with a supportive repair prompt, where relevant?',
]);

H2('26. Visual geometry containment gate (v0.8)');

NUMS([
  'Is the whole mathematical construction visible without scrolling inside the drawing area?',
  'Are all attached shapes and constructed objects fully visible — squares on sides, labels, right-angle markers, handles, arrows?',
  'Are labels, markers and handles comfortably inside the visual bounds, with a safety margin?',
  'Does the construction remain contained at the intended interaction extremes, including drag, resize, rotate, randomise and larger generated objects?',
  'Is the diagram or graph the instructions cite as evidence visible alongside those instructions?',
  'Have the visuals been rechecked after the most recent geometry or layout change?',
  'Are the SVG or canvas container and viewBox sized from the bounding box of the whole intended construction rather than the central object?',
]);

H2('27. Worked-solution unlock gate (v1.0)');

P('Test at least one question fully, and the lock state of all.');

NUMS([
  'Is the worked solution initially disabled?',
  'Is it still disabled after the Socratic prompt only?',
  'Is it still disabled after the hint only?',
  'Is it still disabled after one checked attempt?',
  'Does it unlock after prompt, hint and two non-empty checked attempts?',
  'Does a locked click state exactly which conditions remain?',
  'Does each question retain its own lock state during Previous and Next navigation?',
]);

H2('28. Scratchpad gate (v0.9)');

NUMS([
  'Does the background persist after erasing learner marks?',
  'Does the Line tool draw truly straight lines in the selected colour and width?',
  'Do undo and redo work for all tool types — pen, line and sticky notes?',
  'Does Clear Board remove ink, lines and notes but preserve the background?',
  'Does the exported image combine the background, the marks and the notes?',
  'Is the toolbar order Pen → Line → Colour → Width → Eraser → Undo → Redo → Sticky Note → Background, with the Background label and dropdown grouped?',
  'Is behaviour consistent across the lesson?',
]);

H2('29. Guidance documents gate (v0.3, v1.1)');

NUMS([
  'Is the Learner Guidance approximately 2–4 pages, invitational and age-neutral; does it include the two locked principles; does it state the exact worked-solution release conditions; and does it avoid reproducing worked answers?',
  'Is the Supporting Adult Guidance approximately 5–8 pages and usable by a non-specialist; does it include misconceptions, Cornerstone phase support with invitational timings, and regulation guidance; and does it state the prohibition on giving worked solutions verbally while locked?',
  'Does the naming follow the locked pattern?',
]);

H2('30. Blueprint and curriculum-map gate');

NUMS([
  'Is the hierarchy respected: Strand → Unit → Unit Driving Question → 45-minute sessions → Stepping Stones?',
  'Is the unit organised around its own mathematical story rather than a copied template?',
  'Are Reconnection Routes attached to moments of need, with return points and minimum return evidence?',
  'Have reusable interactive environments been audited before any new one-off application is proposed?',
  'Are pathway fields present, with year codes internal only?',
  'Has the coverage map been updated with Stepping Stones, routes, status, evidence and header compliance after acceptance?',
]);

BREAK();

// ===================== PART SEVEN =====================
H1('Part Seven — Record Keeping');

H2('31. Validation examples');

TABLE(['Version', 'Validation example'], [
  ['v0.6', 'Plotting Straight Line Graphs migration pilot — learner flow and interactive entry.'],
  ['v0.7', 'Place Value migration and Plotting Straight Line Graphs — intellectual nourishment.'],
  ['v0.8', 'Pythagoras Reflection diagram — visual containment of the three constructed squares.'],
  ['v1.2', 'Accuracy, Powers and Scale Lesson 01 (Rounding to Significant Figures v0.2) — workflow validation; Lesson 02 (Estimation) — Reconnection Routes restoration.'],
  ['v1.4', 'Accuracy, Powers and Scale Lesson 04 (Write and Order Standard Form v0.2/v0.3) — place-value language.'],
  ['v1.5', 'Accuracy, Powers and Scale Lesson 05 (Calculating with Standard Form v0.4) — reference implementation of reasoning-first design and structural explanation. Accepted 20 July 2026.'],
  ['v1.6', 'Accuracy, Powers and Scale Lessons 01 and 03 — both use Mode B intellectual nourishment honestly and are compliant reference examples of the presence standard.'],
], [1300, 7700]);

H2('32. Reference artefacts');

TABLE(['Artefact', 'Current reference'], [
  ['Reference lesson shell', 'Accuracy, Powers and Scale — Lesson 02: Estimation (the accepted design contract)'],
  ['Detailed unit blueprints', 'NEO Mathematics Pathway Unit Blueprints GreenPrint v0.2'],
  ['Lesson architecture map', 'NEO_Mathematics_Pathway_Lesson_Architecture_Map_GreenPrint_v0_3'],
  ['Curriculum Vault map', 'NEO Mathematics Curriculum Vault Map Pathways GreenPrint v0.2'],
  ['Live coverage map', 'NEO Mathematics Foundations Coverage Map (01_Curriculum_Maps)'],
  ['Reference prototype lessons', 'Ratio and Proportion Interactive v5; Straight-Line Graphs Interactive v5'],
], [2300, 6700]);

H2('33. Open questions and outstanding items');

P('Items resolved on 20 July 2026 are retained here, struck through in status rather than deleted, so the working record stays traceable.', { size: 19, color: GREY });

NUMS([
  'RESOLVED (20 July 2026). Approval of the v1.4, v1.5 and v1.6 entries. These record mathematical and pedagogical corrections raised by the curriculum lead and do not require separate Director approval.',
  'OPEN. The Foundations Coverage Map is behind production: Accuracy, Powers and Scale Lessons 04 and 05 are not yet registered, and the v1.4, v1.5 and v1.6 QA gates are not yet reflected in its controlled lists.',
  'PART COMPLETE (20 July 2026). The v1.5 audit of Accuracy, Powers and Scale Lessons 01–03 is complete and its findings are recorded in the Lesson Audit Report v1.0. The Pythagoras sequence has not yet been audited against v1.5. The v1.4 place-value audit of Lessons 01–03 was completed on 18 July 2026.',
  'OPEN. Header remediation: Place Value (learner-visible year labels), Ratio and Proportion and Straight-Line Graphs (learner-visible key-stage labels).',
  'OPEN. Pythagoras Lesson 1 has no Learner or Supporting Adult Guidance — a gap, not a failed header.',
  'OPEN. Worked-solution release rule not yet aligned in the Place Value, Ratio and Proportion and Straight-Line Graphs reference environments.',
  'OPEN. Reconnection Routes REC-NUM-03, REC-NUM-04 and REC-GEO-01 are mapped but not yet built. Under the v1.2 workflow these require a Stage 2 option bank before building.',
  'RESOLVED (20 July 2026). Whether Nutrition is a universal lens or an applied lens. It is universal in presence and contextual in mode — see §16.1.',
  'OPEN. How should the NEO mastery scale be phrased specifically for mathematics? (Curriculum lead to advise.)',
  'OPEN. How will portfolio evidence map to qualification overlays and commissioner-facing progress reports? (Curriculum lead to advise.)',
  'NEW, OPEN (20 July 2026). Accuracy, Powers and Scale Lesson 01 has no Reconnection Routes control, contrary to v1.3. Its coverage-map status of “Preview-ready” with route REC-NUM-01 overstates its compliance. See the Lesson Audit Report.',
  'NEW, OPEN (20 July 2026). Accuracy, Powers and Scale Lesson 03 frames its central interactive as an “Exponent Pattern Machine”, contrary to v1.5 §8.1. This requires a rebuild, not a rename.',
]);

H2('34. Next intended version');

P('v1.7 should carry the completed Foundations unit sequence for Accuracy, Powers and Scale, together with pilot evidence and any template refinements the pilot surfaces. This was the content anticipated for v1.4 by the v1.3 record, deferred while the language and design corrections at v1.4, v1.5 and v1.6 were locked.');

RULE();

H2('Document control');

P('This consolidation was prepared by Claude, acting as the NEO Mathematics course assistant, on 20 July 2026. It restates the locked decisions recorded in the GreenPrint Running Design Record v1.3 (16 July 2026) together with the v1.4 entry of 18 July 2026 and the v1.5 entry of 19 July 2026, both arising from curriculum-lead corrections during the Lesson 04 and Lesson 05 builds, and the v1.6 Nutrition presence decision taken on 20 July 2026.');

P('No locked decision has been removed. Earlier versions remain in Drive at 00_GreenPrint_and_Governance and should be consulted for the full deliberative narrative. Later decisions should be added through a new milestone version rather than by silently replacing this record.');

children.push(new Paragraph({
  spacing: { before: 400 }, alignment: AlignmentType.CENTER,
  children: [new TextRun({ text: '“Connection before curriculum. Always.”', size: 24, italics: true, color: GREEN, font: 'Calibri' })],
}));

// ===================== DOC =====================
const doc = new Document({
  creator: 'NEO Mathematics — Novacene',
  title: 'NEO Mathematics Curriculum GreenPrint — Running Design Record v1.5',
  description: 'Consolidated locked record, v0.1–v1.5',
  numbering: {
    config: [
      {
        reference: 'neo-bullets',
        levels: [
          { level: 0, format: LevelFormat.BULLET, text: '•', alignment: AlignmentType.LEFT,
            style: { paragraph: { indent: { left: 460, hanging: 260 } } } },
          { level: 1, format: LevelFormat.BULLET, text: '◦', alignment: AlignmentType.LEFT,
            style: { paragraph: { indent: { left: 900, hanging: 260 } } } },
        ],
      },
      {
        reference: 'neo-numbers',
        levels: [
          { level: 0, format: LevelFormat.DECIMAL, text: '%1.', alignment: AlignmentType.LEFT,
            style: { paragraph: { indent: { left: 460, hanging: 260 } } } },
        ],
      },
    ],
  },
  sections: [{
    properties: {
      page: {
        margin: { top: 1100, bottom: 1100, left: 1200, right: 1200 },
      },
    },
    footers: {
      default: new Footer({
        children: [new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [
            new TextRun({ text: 'NEO Mathematics GreenPrint · Running Design Record v1.5 · 20 July 2026 · page ', size: 16, color: GREY, font: 'Calibri' }),
            new TextRun({ children: [PageNumber.CURRENT], size: 16, color: GREY, font: 'Calibri' }),
          ],
        })],
      }),
    },
    children,
  }],
});

Packer.toBuffer(doc).then(buf => {
  fs.writeFileSync(process.argv[2], buf);
  console.log('written', process.argv[2], buf.length, 'bytes');
});
