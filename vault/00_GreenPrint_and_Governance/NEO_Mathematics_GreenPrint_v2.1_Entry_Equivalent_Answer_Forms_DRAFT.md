# NEO Mathematics GreenPrint — Running Design Record entry v2.1 (DRAFT)

**Proposed version:** 2.1 · **Date:** 2026-09-07 · **Controlling record:** builds on Active v1.6, extends entry v2.0
**Status:** Draft entry for filing · Curriculum by Gerry Docherty

*"Connection before curriculum. Always."*

## Decision — answer checking accepts every mathematically equivalent form, and this is enforced by QA, not left to prose

A learner who enters a **correct** answer in a different **written form** must be marked
correct. In particular, where the value is a fraction, the learner may type it as a
fraction `a/b` (e.g. `1/2`), as the unicode glyph (`½`, `¼`, `¾`), or as the decimal
(`0.5`) — all are accepted. The same holds for a leading `+` and for the unicode minus
`−` versus the keyboard hyphen `-`. Marking never depends on the surface form the learner
chose; it depends only on the mathematical value (with a sensible tolerance for
non-integers).

Entry v2.0 already stated that "accepted-answer tolerance stays generous", but it
illustrated only **word** synonyms ("bottom" as well as "denominator"). It did not name
**numeric** equivalent forms, gave no shared implementation, and added no QA check — so
the principle was true on paper but not enforced, and the same defect kept recurring.

## Why this entry exists (the recurring defect)

This is the third time a variant of the same bug has surfaced: a learner enters a correct
value in an unexpected form and the interactive marks it wrong.

- **Root cause.** The parser copied into each lesson (`num()`) did `Number(value)`.
  `Number("1/2")` is `NaN`, so a fraction was silently rejected even though it is exactly
  what a thoughtful learner would type for a coefficient like ½.
- **Why it recurred.** The "stay generous" rule lived only as prose. There was no shared
  fraction-aware parser and, crucially, **no QA gate that would fail when a valid fraction
  was rejected**. So each new lesson re-introduced the gap, and it was caught only by the
  curriculum lead spotting it by hand — exactly the manual re-checking this record exists
  to remove.
- **Triggering case.** QD-06 "Stretch and reflect": the table-compare panel for
  `y = ½x²` accepted `0.5` but rejected `1/2` and `½`.

## The standard (locked)

1. **One canonical parser everywhere.** Every numeric input — in every interactive
   and every Practice Companion — parses through a single tolerant `num()` that
   understands fractions, the unicode fraction glyphs, decimals, the unicode minus, units,
   a fraction bar written as `÷`, **and spelled-out number words** (including word
   fractions and decimals-in-words). It is paired with a `NEO_wordNum()` helper:

   ```js
   function NEO_wordNum(str){
     var s=String(str).toLowerCase().replace(/[-–—]/g,' ').replace(/\band\b/g,' ').replace(/\s+/g,' ').trim();
     if(!s) return NaN;
     s=s.replace(/\bone half\b|\ba half\b/g,'half').replace(/\bthree quarters?\b/g,'threeq')
        .replace(/\bone quarter\b|\ba quarter\b/g,'quarter').replace(/\btwo thirds?\b/g,'twothird')
        .replace(/\bone third\b|\ba third\b/g,'third');
     var frac={half:0.5,quarter:0.25,threeq:0.75,third:1/3,twothird:2/3};
     if(frac[s]!=null) return frac[s];
     var ones={zero:0,nought:0,nil:0,one:1,two:2,three:3,four:4,five:5,six:6,seven:7,eight:8,nine:9,ten:10,eleven:11,twelve:12,thirteen:13,fourteen:14,fifteen:15,sixteen:16,seventeen:17,eighteen:18,nineteen:19};
     var tens={twenty:20,thirty:30,forty:40,fifty:50,sixty:60,seventy:70,eighty:80,ninety:90};
     var parts=s.split(' '),total=0,cur=0,used=false,fracAdd=0,i,w;
     for(i=0;i<parts.length;i++){ w=parts[i];
       if(w==='a'||w==='') continue;
       if(ones[w]!=null){cur+=ones[w];used=true;}
       else if(tens[w]!=null){cur+=tens[w];used=true;}
       else if(w==='hundred'){cur=(cur||1)*100;used=true;}
       else if(w==='thousand'){total+=(cur||1)*1000;cur=0;used=true;}
       else if(frac[w]!=null){fracAdd+=frac[w];used=true;}
       else if(w==='point'){ total+=cur;cur=0;var dec='0.',j,any=false;
         for(j=i+1;j<parts.length;j++){if(ones[parts[j]]!=null&&ones[parts[j]]<10){dec+=ones[parts[j]];any=true;}else return NaN;}
         if(!any) return NaN; return used?total+parseFloat(dec):NaN; }
       else return NaN;
     }
     return used?total+cur+fracAdd:NaN;
   }
   function num(v){
     var s=String(v).toLowerCase().trim(); if(!s) return NaN;
     var wn=NEO_wordNum(s); if(!isNaN(wn)) return wn;
     s=s.replace(/÷/g,'/').replace(/(tan|sin|cos)\s*θ?/g,'').replace(/=/g,'');
     s=s.replace(/½/g,'0.5').replace(/¼/g,'0.25').replace(/¾/g,'0.75').replace(/−/g,'-');
     s=s.replace(/(\d)\s*(cm|mm|km|m)\b/g,'$1').replace(/[, ]+/g,'');
     var fm=s.match(/(-?\d+(?:\.\d+)?)\/(-?\d+(?:\.\d+)?)/);
     if(fm){var d=parseFloat(fm[2]);return d===0?NaN:parseFloat(fm[1])/d;}
     var m=s.match(/-?\d+(\.\d+)?/); return m?parseFloat(m[0]):NaN;
   }
   ```

   `num("1/2")`, `num("½")`, `num("0.5")` and `num("one half")` all return `0.5`;
   `num("two")` is `2`, `num("forty")` is `40`, `num("twenty two")` is `22`,
   `num("twenty two point five")` is `22.5`; `num("−4")` returns `-4`. A non-number
   word such as `"rhombus"` or `"two arms"` returns `NaN`, so text answers are unaffected.
   Non-integer answers are compared with a tolerance, never with `===` on a string.
   Word **synonym** answers still route through `normText()`; `num()` handles only values.

2. **QA gate 6a — equivalent-form acceptance (addition to the shipping gates).** A lesson
   does not ship until its jsdom QA harness proves equivalence acceptance. For **every**
   numeric answer field, the harness asserts that at least one equivalent form is
   accepted; wherever any correct answer is **non-integer**, the harness MUST assert
   the **fraction form** (`a/b`) is accepted, not only the decimal; and wherever a small
   whole number is a correct answer, the harness MUST assert its **spelled-out word form**
   (`"two"` as well as `2`) is accepted. A rejected valid fraction — or a rejected number
   word — is a ship-blocker, on the same footing as a broken worked-solution unlock.

3. **Display precision is unchanged.** This entry governs *marking* only. Precise display
   vocabulary and notation (entry v2.0) are untouched; a lesson may still *show* ½ as the
   preferred form while *accepting* 1/2 and 0.5.

## Implications and retrofit

- **Skill updated.** The `neo-mathematics` skill's SKILL.md now carries this parser
  verbatim as a "must use" standard and states QA gate 6a, so every future lesson bakes it
  in by default. (Any older reference-shell `num()` is superseded by the canonical version
  above; use it whenever starting from the shell.)
- **Retrofit complete (2026-09-18).** The recurring defect surfaced a **fourth** time —
  GC-04 "The angle bisector", Practice Q1: a learner typing the word `"two"` for the
  answer `2` was marked wrong while `2` was accepted. Rather than patch one lesson, the
  canonical `num()` + `NEO_wordNum()` above was deployed to **all 46 lessons** (three
  earlier parser generations collapsed into one identical body), verified by a 34-case
  parser test plus an end-to-end Practice-Companion check (`"two"`, `"forty"`,
  `"twenty two point five"` all accepted; wrong words still rejected). All numeric fields
  across the curriculum now share one parser, so this class of bug cannot re-diverge
  lesson-by-lesson.

## Next step

Reword into the Running Design Record prose and consolidate with the pending
v1.7/v1.8/v1.9/v2.0 entries at the next milestone regeneration of the GreenPrint Active
document, folding QA gate 6a into references/qa-gates.md gate 6.
