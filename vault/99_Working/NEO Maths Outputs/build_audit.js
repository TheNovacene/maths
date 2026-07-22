const fs = require('fs');
const d = require('docx');
const { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType,
  Table, TableRow, TableCell, WidthType, ShadingType, BorderStyle,
  PageBreak, Footer, PageNumber, LevelFormat } = d;

const GREEN = '2E6B4F', DARK = '1F3B2C', GREY = '5A5A5A', RED = 'A33B3B', AMBER = '8A6A1F';
const children = [];

function H1(t){children.push(new Paragraph({heading:HeadingLevel.HEADING_1,spacing:{before:400,after:180},children:[new TextRun({text:t,bold:true,size:30,color:GREEN,font:'Calibri'})]}));}
function H2(t){children.push(new Paragraph({heading:HeadingLevel.HEADING_2,spacing:{before:300,after:120},children:[new TextRun({text:t,bold:true,size:25,color:DARK,font:'Calibri'})]}));}
function H3(t){children.push(new Paragraph({heading:HeadingLevel.HEADING_3,spacing:{before:220,after:100},children:[new TextRun({text:t,bold:true,size:22,color:DARK,font:'Calibri'})]}));}
function P(t,o={}){children.push(new Paragraph({spacing:{after:o.after===undefined?140:o.after},alignment:o.align||AlignmentType.LEFT,children:[new TextRun({text:t,size:o.size||21,font:'Calibri',italics:!!o.italics,bold:!!o.bold,color:o.color||'000000'})]}));}
function FINDING(ref, severity, title, colour){
  children.push(new Paragraph({
    spacing:{before:220,after:80},
    shading:{type:ShadingType.CLEAR,fill:'F4F4F1'},
    border:{left:{style:BorderStyle.SINGLE,size:18,color:colour,space:10}},
    indent:{left:200,right:200},
    children:[
      new TextRun({text:ref+'  ',bold:true,size:21,font:'Calibri',color:colour}),
      new TextRun({text:severity.toUpperCase()+'  ',bold:true,size:17,font:'Calibri',color:colour}),
      new TextRun({text:title,bold:true,size:21,font:'Calibri'}),
    ],
  }));
}
function FIELD(label, text){
  children.push(new Paragraph({spacing:{after:70},indent:{left:200},children:[
    new TextRun({text:label+': ',bold:true,size:20,font:'Calibri'}),
    new TextRun({text:text,size:20,font:'Calibri'}),
  ]}));
}
function BULLETS(items){items.forEach(t=>{children.push(new Paragraph({numbering:{reference:'b',level:0},spacing:{after:70},children:[new TextRun({text:t,size:21,font:'Calibri'})]}));});}
function TABLE(headers,rows,widths){
  const total=widths.reduce((a,b)=>a+b,0);
  children.push(new Table({columnWidths:widths,width:{size:total,type:WidthType.DXA},rows:[
    new TableRow({tableHeader:true,children:headers.map((h,i)=>new TableCell({width:{size:widths[i],type:WidthType.DXA},shading:{type:ShadingType.CLEAR,fill:GREEN},margins:{top:70,bottom:70,left:110,right:110},children:[new Paragraph({spacing:{after:0},children:[new TextRun({text:h,bold:true,size:19,font:'Calibri',color:'FFFFFF'})]})]}))}),
    ...rows.map((r,ri)=>new TableRow({children:r.map((c,i)=>new TableCell({width:{size:widths[i],type:WidthType.DXA},shading:{type:ShadingType.CLEAR,fill:ri%2?'F5F8F5':'FFFFFF'},margins:{top:70,bottom:70,left:110,right:110},children:[new Paragraph({spacing:{after:0},children:[new TextRun({text:c,size:19,font:'Calibri'})]})]}))})),
  ]}));
  children.push(new Paragraph({spacing:{after:160},children:[]}));
}
function BREAK(){children.push(new Paragraph({children:[new PageBreak()]}));}

// ---------------- title ----------------
children.push(new Paragraph({spacing:{before:900,after:80},alignment:AlignmentType.CENTER,children:[new TextRun({text:'NEO MATHEMATICS',bold:true,size:24,color:GREY,font:'Calibri',characterSpacing:60})]}));
children.push(new Paragraph({spacing:{after:80},alignment:AlignmentType.CENTER,children:[new TextRun({text:'Lesson Audit Report',bold:true,size:52,color:GREEN,font:'Calibri'})]}));
children.push(new Paragraph({spacing:{after:300},alignment:AlignmentType.CENTER,children:[new TextRun({text:'Accuracy, Powers and Scale — Lessons 01, 02 and 03',size:26,color:DARK,font:'Calibri'})]}));
children.push(new Paragraph({spacing:{after:500},alignment:AlignmentType.CENTER,children:[new TextRun({text:'Audited against GreenPrint v1.5 (reasoning-first design and structural explanation),\nwith v1.3 and v1.4 checks applied',size:20,italics:true,color:GREY,font:'Calibri'})]}));

TABLE(['Field','Entry'],[
  ['Report version','v1.0 — 20 July 2026'],
  ['Scope','Accuracy, Powers and Scale Lessons 01–03. Primary standard: GreenPrint v1.5. Secondary checks: v1.3 Reconnection Routes access, v1.4 place-value language, v1.1 feedback standard.'],
  ['Not in scope','The Pythagoras sequence (Lessons 01–04) remains unaudited against v1.5. Lessons 04 and 05 were built under v1.4/v1.5 and are treated as compliant by construction.'],
  ['Outcome','1 lesson clean · 1 lesson requiring minor repair · 1 lesson requiring rebuild of its central interactive'],
  ['Governing record','NEO Mathematics Curriculum GreenPrint Running Design Record v1.6'],
],[1700,7300]);

BREAK();

// ---------------- summary ----------------
H1('1. Summary');

P('Three lessons were read in full and checked against the v1.5 locked rules — no machine metaphors, mathematical writing as the learner’s product, choices as genuine mathematical decisions, free entry only after understanding, and structural explanation in place of procedural labels. Two further checks were applied while the source was open: the v1.3 Reconnection Routes access standard and the v1.4 place-value language standard.');

TABLE(['Lesson','v1.5 outcome','Other findings','Action'],[
  ['01 — Rounding to Significant Figures','Pass, with one procedural label','Missing Reconnection Routes control (v1.3 breach)','Repair at v0.3'],
  ['02 — Estimation','Pass','None','None — retain as reference shell'],
  ['03 — Using Index Laws','Fail — machine framing','Generic wrong-answer feedback; misplaced reconnection text','Rebuild central interactive at v0.2'],
],[2400,2000,2600,2000]);

P('The most consequential finding is not a v1.5 issue. Lesson 01 has no Reconnection Routes control at all, which breaches the v1.3 access standard, and the Foundations Coverage Map nevertheless records it as “Preview-ready” with route REC-NUM-01 attached. The map is asserting a compliance the lesson does not have. That matters more than a metaphor, because the coverage map is what the curriculum relies on to know what is safe to put in front of a learner.', { bold: true });

P('The v1.4 place-value audit of these lessons, completed on 18 July 2026, is confirmed as still holding. No prohibited decimal-point phrasing was found in any of the three.');

BREAK();

// ---------------- Lesson 01 ----------------
H1('2. Lesson 01 — Rounding to Significant Figures (v0.2)');

P('Interactives: Precision Lens (Movement), Boundary Explorer (Reflection). Nutrition: Mode B, intellectual nourishment. Six Cornerstone panels present in the locked order. No learner-visible year or key-stage labels.');

H2('2.1 Findings');

FINDING('L01-A','Critical','No Reconnection Routes control (GreenPrint v1.3)', RED);
FIELD('Standard','v1.3: the Reconnection Routes control is recurring page furniture in every lesson, in the compact support area near the top, beside Learner Guidance, Supporting Adult Guidance, Scratchpad and Practice Companion.');
FIELD('Observed','The support area of Lesson 01 contains four controls: Learner Guide, Supporting Adult Guidance, Maths Scratchpad and Practice Companion. There is no Reconnection Routes control, and the lesson contains no reconnection logic — no route definitions, no return control. Lesson 02 and Lesson 03 both have it.');
FIELD('Why it matters','This lesson is the entry point to the unit and rounding depends on place-value security. A learner whose place-value understanding is blocking them has no offered route and no way back. The coverage map records REC-NUM-01 as this lesson’s route, which is not true of the artefact.');
FIELD('Repair','Add the standard Reconnection Routes control and panel, with routes for place value, powers of ten and magnitude, each with a calm prompt, optional hint, minimum return evidence and an explicit “Return to Rounding to Significant Figures” control. Lesson 03 contains a working implementation to follow.');

FINDING('L01-B','Moderate','“Restore place value” is a procedural label (v1.5 §9.1)', AMBER);
FIELD('Standard','v1.5 §9.1: a procedural label names an effect without its cause. It may appear only as the interpretation of a justified step, never as the step itself.');
FIELD('Observed','The lesson’s four-step route is “find → keep → decide → restore place value”, repeated in the Movement conceptual bridge, the Rest panel and the Practice Companion diagram. Worked solutions use it directly: “Restore the remaining places with zeros: 49,000.”');
FIELD('Why it matters','“Restore place value” tells the learner to add zeros without saying why, how many, or what would go wrong otherwise. It is the same defect as “slide the digits”, which was corrected at v1.5 for exactly this reason. A learner who has only the label cannot reconstruct the step on an unfamiliar number.');
FIELD('Repair','Justify the step by the place value the kept digits occupy. For 48,763 to 2 significant figures: the 4 occupies the ten-thousands column and the 8 the thousands column, so the hundreds, tens and ones must be held by zeros for the number to keep its size — 49,000, not 49. The label may then be retained as the short name for a step the learner can already justify.');

FINDING('L01-C','Minor','Practice Companion wrong-answer feedback is generic (v1.5 §8.3)', AMBER);
FIELD('Standard','v1.5 §8.3: feedback on a wrong choice must point back at the mathematics, never merely at the interface. v1.1 requires feedback determined dynamically from learner input.');
FIELD('Observed','Every incorrect Practice Companion answer returns the same string: “Not quite yet. Use the prompt or hint, then try again.” This is interface instruction, not mathematics, and it is identical across all six questions.');
FIELD('Note','The lesson’s in-panel feedback is markedly better — checkLens returns “Find the first non-zero digit, count to the last digit you need, then look one place to the right.” The defect is confined to the Practice Companion, and the same string appears in Lesson 03.');
FIELD('Repair','Give each question a mathematically specific incorrect-response message. Where the learner’s entry can be diagnosed — for example returning 49 rather than 49,000, or counting leading zeros as significant — name the misconception without giving the method.');

H2('2.2 Assessed as compliant');
BULLETS([
  'No machine metaphor. The Precision Lens is an instrument for seeing structure, not a device that produces answers: it colours digits by role (keep, last, decide, drop) so the learner reads the reasoning rather than receiving a result.',
  'The Boundary Explorer gives genuine structural justification for the rounding decision — it shows the halfway boundaries and where the value sits between them, which is the reason 5 rounds up rather than a rule about it.',
  'Worked solutions carry reasons, not just steps, apart from the “restore” label at L01-B.',
  'Free entry in the Precision Lens arrives after the Connection panel has established where significant figures begin, satisfying v1.5 §8.4.',
  'Nutrition panel present, Mode B named honestly, no contrived context — compliant with the v1.6 presence standard.',
  'Worked-solution unlock rule correctly implemented per question, with an accurate remaining-conditions message.',
]);

BREAK();

// ---------------- Lesson 02 ----------------
H1('3. Lesson 02 — Estimation');

P('This lesson is the accepted reference shell and the design contract for the unit. It was checked against the same standards and no breaches were found.');

BULLETS([
  'No machine, engine or device framing of the mathematics. The single occurrence of “calculator” is a legitimate mathematical context — judging whether a displayed result is plausible — and not a framing of the learner’s method.',
  'No prohibited place-value phrasing.',
  'No learner-visible year or key-stage labels.',
  'Reconnection Routes control present, as recorded in the coverage map.',
]);

P('Retain unchanged. Its status as the reference shell is confirmed by this audit.');

// ---------------- Lesson 03 ----------------
H1('4. Lesson 03 — Using Index Laws (v0.1)');

P('Interactives: Index Law Detective (Connection), Exponent Pattern Machine (Movement). Nutrition: Mode B. Six Cornerstone panels present in the locked order. Reconnection Routes control present. No learner-visible year or key-stage labels.');

H2('4.1 Findings');

FINDING('L03-A','Critical','“Exponent Pattern Machine” is a machine framing (v1.5 §8.1)', RED);
FIELD('Standard','v1.5 §8.1: interactives must not be framed as machines, engines, calculators or other devices that produce answers. A machine framing quietly teaches that the procedure lives in the device rather than in the learner.');
FIELD('Observed','The Movement panel is titled “Exponent Pattern Machine”. The learner instruction reads “Predict the resulting exponent before asking the machine to reveal the pattern.” The implementation carries the metaphor throughout — resetMachine, checkMachine, revealMachine, machineData, machineNotation, validMachine.');
FIELD('Why it matters','This is the exact framing removed from Lesson 05, and for the same reason. The index laws are the clearest case in the unit where the reason is reconstructible from first principles: 2³ × 2⁴ is seven factors of 2 because three factors join four. A machine that reveals the pattern places that reasoning outside the learner at precisely the moment it should be internalised.');
FIELD('Repair','Rebuild as a chain-of-equalities builder in the Lesson 05 idiom. The learner selects each next line and its reason: 2³ × 2⁴ = (2 × 2 × 2) × (2 × 2 × 2 × 2) [expanding the powers] = 2⁷ [seven factors of 2]. This is a rebuild of the panel, not a rename — renaming the machine while keeping reveal-the-answer behaviour would not satisfy §8.1.');
FIELD('Note','The existing reveal output is closer to compliance than the framing suggests: it already gives the exponent calculation and a reason (“The two groups of repeated factors join”). That material can largely be reused as the content of the chain.');

FINDING('L03-B','Moderate','Free entry precedes the experience of two of the three laws (v1.5 §8.4)', AMBER);
FIELD('Standard','v1.5 §8.4: open input belongs after the idea is secure — the experience-before-create ordering locked at v0.6.');
FIELD('Observed','The Connection panel establishes the multiplication law only. The Movement panel then offers free entry across all three operations, including division and power-of-a-power, which the learner has not yet met. The Reflection panel introduces power-of-a-power afterwards.');
FIELD('Repair','Open the rebuilt Movement interactive on multiplication, and unlock division and power-of-a-power as each is experienced. The existing preset buttons already provide the right scaffold; they simply need sequencing.');

FINDING('L03-C','Minor','Wrong-answer feedback recites the rules (v1.5 §9.1)', AMBER);
FIELD('Observed','An incorrect prediction returns “Check the operation: multiply powers → add exponents; divide powers → subtract; power of a power → multiply.” This hands over all three procedures as a list rather than directing the learner to the structure.');
FIELD('Repair','Point at the repeated factors: “How many factors of the base are there altogether?” The Detective panel already models this well — its incorrect response is “Keep the base 2 and count how many factors of 2 appear altogether.”');

FINDING('L03-D','Minor','Reconnection feedback references the wrong topic', AMBER);
FIELD('Observed','An incorrect reconnection answer returns “Not yet. Use the hint or record the place value on the Scratchpad.” Place value is not the subject of any of this lesson’s four routes (multiplication, powers, base and exponent, operation symbols). This appears to be carried over from the Lesson 01 shell.');
FIELD('Repair','Replace with a route-appropriate instruction — for example recording the repeated multiplication on the Scratchpad.');

H2('4.2 Assessed as compliant');
BULLETS([
  'The Index Law Detective distractors embody real misconceptions — 4⁷ (multiplying the bases) and 2¹² (multiplying the exponents) — satisfying v1.5 §8.3 in construction.',
  'Practice Companion worked solutions are already written as chains of equalities: 5³ × 5⁴ = 5^(3+4) = 5⁷. Adding a named reason to each line would bring them fully into the v1.5 idiom.',
  'Nutrition panel present, Mode B named honestly.',
  'Worked-solution unlock rule correctly implemented per question.',
  'Reconnection Routes control present with a working return control.',
]);

P('One caveat on the distractor feedback: both wrong choices return the same message. Since the two distractors represent distinct misconceptions — confusing the base with the exponent, and confusing multiplication of powers with multiplication of exponents — each deserves its own response.', { size: 20, color: GREY });

BREAK();

// ---------------- actions ----------------
H1('5. Recommended actions');

TABLE(['Ref','Action','Version','Priority'],[
  ['L01-A','Add the Reconnection Routes control and panel to Lesson 01','v0.3','High — correct before any learner pilot'],
  ['L01-B','Replace “restore place value” with a place-value justification','v0.3','High — this is the v1.5 defect proper'],
  ['L01-C','Make Practice Companion wrong-answer feedback mathematically specific','v0.3','Medium'],
  ['L03-A','Rebuild the Exponent Pattern Machine as a chain-of-equalities builder','v0.2','High — requires a Stage 2 option bank'],
  ['L03-B','Sequence the rebuilt interactive so each law is experienced before it is entered','v0.2','High — same rebuild'],
  ['L03-C','Replace rule-recitation feedback with structural prompts','v0.2','Medium'],
  ['L03-D','Correct the misplaced place-value reference in reconnection feedback','v0.2','Low'],
  ['—','Correct the Lesson 01 row in the Foundations Coverage Map','Map v0.3','High — the map currently overstates compliance'],
  ['—','Audit the Pythagoras sequence against v1.5','—','Medium — not yet started'],
],[900,4200,1200,2700]);

H2('A note on sequencing');

P('L03-A is a rebuild of a lesson’s central interactive, which under the v1.2 workflow is a Stage 2 decision: an option bank of three to five approaches should be presented and authorised before building. It should not be treated as a patch. The Lesson 01 repairs (L01-A to L01-C) are genuine repairs and can proceed directly to a v0.3 increment.');

P('The coverage-map correction should not wait for either. A map that records a lesson as preview-ready when it lacks required page furniture is the kind of error that compounds quietly.');

// ---------------- doc ----------------
const doc = new Document({
  creator:'NEO Mathematics — Novacene',
  title:'NEO Mathematics Lesson Audit Report v1.0',
  numbering:{config:[{reference:'b',levels:[{level:0,format:LevelFormat.BULLET,text:'•',alignment:AlignmentType.LEFT,style:{paragraph:{indent:{left:460,hanging:260}}}}]}]},
  sections:[{
    properties:{page:{margin:{top:1100,bottom:1100,left:1200,right:1200}}},
    footers:{default:new Footer({children:[new Paragraph({alignment:AlignmentType.CENTER,children:[
      new TextRun({text:'NEO Mathematics Lesson Audit Report v1.0 · 20 July 2026 · page ',size:16,color:GREY,font:'Calibri'}),
      new TextRun({children:[PageNumber.CURRENT],size:16,color:GREY,font:'Calibri'}),
    ]})]})},
    children,
  }],
});

Packer.toBuffer(doc).then(b=>{fs.writeFileSync(process.argv[2],b);console.log('written',b.length);});
