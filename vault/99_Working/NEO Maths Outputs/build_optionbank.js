const fs=require('fs');
const d=require('docx');
const {Document,Packer,Paragraph,TextRun,HeadingLevel,AlignmentType,Table,TableRow,TableCell,
 WidthType,ShadingType,BorderStyle,PageBreak,Footer,PageNumber,LevelFormat}=d;

const GREEN='2E6B4F',DARK='1F3B2C',GREY='5A5A5A';
const children=[];

function H1(t){children.push(new Paragraph({heading:HeadingLevel.HEADING_1,spacing:{before:380,after:170},children:[new TextRun({text:t,bold:true,size:30,color:GREEN,font:'Calibri'})]}));}
function H2(t){children.push(new Paragraph({heading:HeadingLevel.HEADING_2,spacing:{before:290,after:120},children:[new TextRun({text:t,bold:true,size:25,color:DARK,font:'Calibri'})]}));}
function H3(t){children.push(new Paragraph({heading:HeadingLevel.HEADING_3,spacing:{before:200,after:90},children:[new TextRun({text:t,bold:true,size:21,color:DARK,font:'Calibri'})]}));}
function P(t,o={}){children.push(new Paragraph({spacing:{after:o.after===undefined?130:o.after},alignment:o.align||AlignmentType.LEFT,children:[new TextRun({text:t,size:o.size||21,font:'Calibri',italics:!!o.italics,bold:!!o.bold,color:o.color||'000000'})]}));}
function FIELD(l,t){children.push(new Paragraph({spacing:{after:70},indent:{left:180},children:[
 new TextRun({text:l+': ',bold:true,size:20,font:'Calibri'}),new TextRun({text:t,size:20,font:'Calibri'})]}));}
function BULLETS(items){items.forEach(t=>children.push(new Paragraph({numbering:{reference:'b',level:0},spacing:{after:65},children:[new TextRun({text:t,size:21,font:'Calibri'})]})));}
function MONO(t){
 const lines=t.split('\n');
 lines.forEach((ln,i)=>children.push(new Paragraph({
  spacing:{before:i===0?60:0,after:i===lines.length-1?120:0},
  indent:{left:280},
  shading:{type:ShadingType.CLEAR,fill:'F4F6F3'},
  children:[new TextRun({text:ln||' ',size:20,font:'Consolas'})],
 })));
}
function OPT(tag,title,fill){children.push(new Paragraph({spacing:{before:300,after:120},shading:{type:ShadingType.CLEAR,fill:fill||'EAF1EA'},border:{left:{style:BorderStyle.SINGLE,size:20,color:GREEN,space:10}},indent:{left:180,right:180},children:[
 new TextRun({text:tag+'  ',bold:true,size:24,font:'Calibri',color:GREEN}),
 new TextRun({text:title,bold:true,size:24,font:'Calibri'})]}));}
function TABLE(h,rows,w){const total=w.reduce((a,b)=>a+b,0);
 children.push(new Table({columnWidths:w,width:{size:total,type:WidthType.DXA},rows:[
  new TableRow({tableHeader:true,children:h.map((x,i)=>new TableCell({width:{size:w[i],type:WidthType.DXA},shading:{type:ShadingType.CLEAR,fill:GREEN},margins:{top:70,bottom:70,left:110,right:110},children:[new Paragraph({spacing:{after:0},children:[new TextRun({text:x,bold:true,size:19,font:'Calibri',color:'FFFFFF'})]})]}))}),
  ...rows.map((r,ri)=>new TableRow({children:r.map((c,i)=>new TableCell({width:{size:w[i],type:WidthType.DXA},shading:{type:ShadingType.CLEAR,fill:ri%2?'F5F8F5':'FFFFFF'},margins:{top:70,bottom:70,left:110,right:110},children:[new Paragraph({spacing:{after:0},children:[new TextRun({text:c,size:19,font:'Calibri'})]})]}))}))]}));
 children.push(new Paragraph({spacing:{after:150},children:[]}));}
function BREAK(){children.push(new Paragraph({children:[new PageBreak()]}));}

// ---- title ----
children.push(new Paragraph({spacing:{before:800,after:70},alignment:AlignmentType.CENTER,children:[new TextRun({text:'NEO MATHEMATICS · STAGE 2',bold:true,size:22,color:GREY,font:'Calibri',characterSpacing:60})]}));
children.push(new Paragraph({spacing:{after:70},alignment:AlignmentType.CENTER,children:[new TextRun({text:'Interactive Option Bank',bold:true,size:50,color:GREEN,font:'Calibri'})]}));
children.push(new Paragraph({spacing:{after:280},alignment:AlignmentType.CENTER,children:[new TextRun({text:'Accuracy, Powers and Scale — Lesson 03: Using Index Laws',size:26,color:DARK,font:'Calibri'})]}));
children.push(new Paragraph({spacing:{after:450},alignment:AlignmentType.CENTER,children:[new TextRun({text:'Rebuilding the Movement interactive under GreenPrint v1.5',size:20,italics:true,color:GREY,font:'Calibri'})]}));

TABLE(['Field','Entry'],[
 ['Purpose','Replace the “Exponent Pattern Machine” (audit finding L03-A) with a reasoning-first interactive, and correct the sequencing fault at L03-B.'],
 ['Pathway / unit','Foundations · Accuracy, Powers and Scale · session 3 (internal tag Y9, NEO-MATH-Y9-003A)'],
 ['Stepping Stone','Use the multiplication, division and power-of-a-power index laws and explain why they work; explain the zero-index pattern.'],
 ['Governing rules','GreenPrint v1.6 §8 (reasoning-first), §9 (structural explanation), §15 (learner flow), §21 (reference shell)'],
 ['Status','Awaiting authorisation. Nothing will be built until an option is chosen.'],
],[1700,7300]);

BREAK();

// ---- framing ----
H1('1. What the rebuild has to achieve');

H2('The mathematical noticing goal');

P('An index law is a compact description of what happens to repeated factors. The learner should become able to perceive that each law’s direction and amount is determined by the structure of the expression — not by a rule held in memory, and not by a device.');

P('Stated as the question the learner should be able to ask themselves: how many factors of this base am I actually left with, and why?');

H2('What the current panel does wrong');

P('The Exponent Pattern Machine invites the learner to “predict the resulting exponent before asking the machine to reveal the pattern”. The pattern is therefore something the machine holds and discloses. When the learner later meets an unfamiliar expression there is no machine, and nothing has transferred except a memory of three rules — which is precisely what the reveal text supplies on a wrong answer: “multiply powers → add exponents; divide powers → subtract; power of a power → multiply.”');

P('Index laws are the clearest case in this unit where the reason is fully reconstructible from first principles. 2³ × 2⁴ is seven factors of 2 because three factors join four. A learner who has seen that once does not need the rule; a learner who has only the rule cannot rebuild it.');

H2('Three faults to fix together');

TABLE(['Ref','Fault','What the rebuild must do'],[
 ['L03-A','Machine framing (v1.5 §8.1)','Remove the device. The learner’s product must be working they could have written by hand.'],
 ['L03-B','Free entry precedes experience (v1.5 §8.4)','Division and power-of-a-power are typeable before either has been met. Sequence so each law is experienced before it is entered.'],
 ['L03-C','Feedback recites the rules (v1.5 §9.1)','Point at the repeated factors instead of listing all three procedures.'],
],[800,2900,5300]);

P('A fourth item, L03-D, is a one-line correction to reconnection feedback that mentions place value in a lesson about index laws. It is unaffected by the choice below.', { size: 20, color: GREY });

H2('Reusable environments audited first');

P('Per v1.2, existing environments were checked before proposing anything new. The unit already contains the Precision Lens (Lesson 01), the Estimation Laboratory (Lesson 02), the Index Law Detective (Lesson 03, Connection — compliant and retained) and the chain-of-equalities builder accepted in Lesson 05.');

P('The Lesson 05 chain builder is the reusable environment relevant here. Options A and B both extend it rather than introducing a parallel writing surface, so the unit converges on one way of showing working. Only Option B adds a new manipulable, and it feeds the same chain.');

BREAK();

// ---- options ----
H1('2. The options');

// A
OPT('Option A','Growing the working — chain of equalities');

P('A direct adaptation of the accepted Lesson 05 interactive.');
FIELD('Learner action','Builds the working one line at a time. At each step the learner taps the next true line from three alternatives, then names the reason for it from a short list. Wrong taps cost nothing and the chain simply does not advance.');
FIELD('Mathematical response','Each proposed line is tested for equality with the line above. A selected line is written into the chain with its reason in the margin, so the visible output is working the learner could have produced on paper.');
MONO('2³ × 2⁴\n= (2×2×2) × (2×2×2×2)      expanding each power\n= 2⁷                        seven factors of 2');
FIELD('Strongest Cornerstone','Movement — the expression moves through equivalent forms while its value stays fixed. Connection: every line equals the line above. Reflection: each line must be justified. Creativity: the learner later builds their own chain. Rest: the chain is a calm, one-decision-at-a-time surface. Nutrition (Mode B): nourishes the habit of asking what the next true line is.');
FIELD('Load','Low. One tap per moment, short reading, no drag. Chains stay under five lines.');
FIELD('Scratchpad','Lines-of-working background, as Lesson 05. This would replace the current index-organiser preset, whose column headings (“Exponent rule”) are themselves procedural.');
FIELD('Practice Companion','Worked solutions become chains with a named reason per line — a small extension of what is already there, since they are written as 5³ × 5⁴ = 5^(3+4) = 5⁷ today.');
FIELD('Strength','Proven, already accepted, and consistent across the unit. Lowest build risk.');
FIELD('Weakness','A chain shows that the exponents add; it is weaker at showing why. The expansion line carries the whole explanatory burden in a single step, and for larger exponents that line becomes long and hard to read.');

// B
OPT('Option B','Factor strips feeding a chain — recommended');

P('A manipulable that makes the reason visible, with every action writing a line into the Option A chain.');
FIELD('Learner action','Taps to expand each power into a strip of repeated factors, then acts on the strips according to the operation — joining them, cancelling matched pairs, or repeating a group — and finally compresses the result back into a single power. Every action writes its line and its reason into the chain beside the strips.');
FIELD('Mathematical response','The tile count is the exponent. The operation determines what happens to the tiles, and the learner reads the resulting exponent off the strip rather than being told it.');
MONO('multiplication   2³ × 2⁴   [2][2][2] + [2][2][2][2]  → 7 tiles → 2⁷\ndivision         5⁸ ÷ 5³   3 pairs cancel, 5 remain    → 5⁵\npower of a power (3²)⁴    4 groups of 2 tiles          → 3⁸\nzero index       9⁶ ÷ 9⁶   every tile cancels           → 9⁰ = 1');
FIELD('Why the last line matters','The zero index is in the Stepping Stone but currently appears only as practice question 6, where it is asserted. On strips it is visible: cancelling every factor leaves an empty product, and an empty product is 1, not 0. This is the single most common misconception in the topic and no other option addresses it.');
FIELD('Strongest Cornerstone','Movement — factors are physically joined, cancelled and regrouped. Connection: the strip and the power are two views of the same quantity. Reflection: the learner explains why the count changed. Creativity: they construct strips for a target power. Rest: the zero-index case is a genuine pause where nothing remains. Nutrition (Mode B): nourishes the instinct to ask what is actually there before reaching for a rule.');
FIELD('Load','Low to moderate. Tap-only, no dragging. Strips are capped at twelve tiles, which the existing input validation already enforces; beyond that the interactive offers the chain alone.');
FIELD('Scratchpad','Lines-of-working background with an optional factor band along the top, so a learner can sketch strips by hand before or instead of using the interactive.');
FIELD('Practice Companion','Focus on choosing and justifying the law, with one question requiring the zero-index explanation in words. Evidence: a written chain with a reason on every line.');
FIELD('Sequencing','Opens on multiplication only. Division unlocks once a multiplication chain is complete, and power-of-a-power after division — which fixes L03-B directly. The existing preset buttons already provide the scaffold; they need ordering, not rebuilding.');
FIELD('Strength','The only option that shows the reason rather than asserting it, and the only one that earns the zero index.');
FIELD('Weakness','The largest build of the four, and it introduces a new visual element to the unit — though contained within the existing panel and shell.');

// C
OPT('Option C','Check this working — judging handed-in chains','F2F0EA');

P('Adapted from the Lesson 05 Reflection activity.');
FIELD('Learner action','Reads three chains handed in by other learners and finds the line that does not follow, then says why.');
MONO('2³ × 2⁴ = 2⁷        ✓\n3² × 3⁴ = 9⁶        ✗  the bases were multiplied\n(x³)⁵  = x⁸        ✗  the exponents were added, not multiplied');
FIELD('Strongest Cornerstone','Reflection — v1.5 §9.4 names this as a standard Reflection activity.');
FIELD('Load','Very low. Reading and one decision per chain.');
FIELD('Assessment','Cheap to build and genuinely valuable, but it judges working rather than generating it. It cannot carry the Movement panel on its own, and Lesson 03 already has a Reflection panel doing adjacent work. Better as a later addition than as the rebuild.');

// D
OPT('Option D','One target, many routes','F2F0EA');

P('Learner is given a target such as q¹² and builds expressions reaching it by multiplication, by division and by a power of a power, writing the chain for each.');
FIELD('Strongest Cornerstone','Creativity.');
FIELD('Assessment','This is close to what the existing Creativity panel (“Build an Index Puzzle”) already asks. Proposing it as the Movement rebuild would duplicate a panel rather than repair one. It is worth keeping as a refinement of the Creativity panel once the rebuild is settled — adding the requirement that each route is written as a chain would bring that panel into the v1.5 idiom at almost no cost.');

BREAK();

// ---- comparison ----
H1('3. Comparison');

TABLE(['','A · Chain','B · Strips + chain','C · Check working','D · One target'],[
 ['Removes the machine framing','Yes','Yes','Yes','Yes'],
 ['Shows why the law holds','Partly','Yes','Partly','No'],
 ['Earns the zero index','No','Yes','No','No'],
 ['Fixes the sequencing fault','Partly','Yes','n/a','No'],
 ['Learner product is written working','Yes','Yes','No','Yes'],
 ['Reuses an accepted environment','Yes','Yes','Yes','Partly'],
 ['Cognitive / sensory load','Low','Low–moderate','Very low','Moderate'],
 ['Build size','Small','Largest','Smallest','Small'],
 ['Duplicates an existing panel','No','No','Partly','Yes'],
],[2600,1600,1800,1500,1500]);

H1('4. Recommendation');

P('Option B — factor strips feeding a chain of equalities.', { bold: true });

H3('Mathematical rationale');

P('Option A would satisfy the letter of v1.5: the machine goes, and the learner’s product becomes written working. But it would leave the explanatory weight resting on a single expansion line, and it would leave the zero index exactly where the audit found it — asserted in a practice solution rather than understood. Strips carry the reason in the representation itself. A learner who has watched every factor cancel and seen that something rather than nothing remains has an answer to “why is 9⁰ not 0?” that no rule can give them.');

P('It also matches the structure v1.5 §9.2 locks for the canonical standard-form example. There, the factorisation supplies the reason and the index law fixes the direction and amount. Here, the strip supplies the reason and the count fixes the amount. The two lessons would teach the same habit of mind through different mathematics, which is what shell consistency is for.');

H3('Accessibility rationale');

P('Tap-only throughout, one action per moment, wrong taps costing nothing — the tap-first standard is preserved. Strips are capped at twelve tiles, which the lesson’s existing validation already enforces, so the visual never becomes a wall of symbols. For a learner who finds the strips busy, the chain alone remains a complete route through the panel: the strips are a way in, not a gate.');

P('The staged unlocking is an accessibility gain as well as a mathematical one. The current panel presents a learner with a dropdown containing two operations they have not met, which is a small but real source of the fog v0.6 exists to prevent.');

H3('Scope, if authorised');

BULLETS([
 'Rebuild the Movement panel as strips feeding a chain, staged multiplication → division → power of a power → zero index.',
 'Replace the Scratchpad preset with the lines-of-working background plus an optional factor band.',
 'Rewrite the wrong-answer feedback to point at the repeated factors rather than list the three rules (L03-C).',
 'Correct the misplaced place-value reference in the reconnection feedback (L03-D).',
 'Give the two Index Law Detective distractors distinct responses, since they carry different misconceptions.',
 'Extend the Practice Companion worked solutions to carry a named reason on each line.',
 'Version as v0.2 and run the full Part Six QA gate before review.',
]);

P('The Connection, Reflection, Creativity, Rest and Nutrition panels are unchanged by this recommendation, and the shell, palette and control positions are untouched. The novelty is in the mathematics, not the interface.');

const doc=new Document({
 creator:'NEO Mathematics — Novacene',
 title:'NEO Mathematics Stage 2 Option Bank — Lesson 03',
 numbering:{config:[{reference:'b',levels:[{level:0,format:LevelFormat.BULLET,text:'•',alignment:AlignmentType.LEFT,style:{paragraph:{indent:{left:460,hanging:260}}}}]}]},
 sections:[{properties:{page:{margin:{top:1100,bottom:1100,left:1200,right:1200}}},
  footers:{default:new Footer({children:[new Paragraph({alignment:AlignmentType.CENTER,children:[
   new TextRun({text:'Stage 2 Option Bank · Accuracy, Powers and Scale Lesson 03 · 20 July 2026 · page ',size:16,color:GREY,font:'Calibri'}),
   new TextRun({children:[PageNumber.CURRENT],size:16,color:GREY,font:'Calibri'})]})]})},
  children}],
});
Packer.toBuffer(doc).then(b=>{fs.writeFileSync(process.argv[2],b);console.log('written',b.length);});
