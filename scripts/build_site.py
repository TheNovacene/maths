#!/usr/bin/env python3
"""NEO Maths GreenPrint — site build script.

Copies the canonical interactive lessons from vault/ into docs/lessons/,
injects the progress-tracking snippet, and flips each lesson's status to
"live" in docs/data/curriculum.json.

Run from the repo root:  python3 scripts/build_site.py
Safe to re-run any time the vault changes.
"""
import json
import re
import shutil
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
VAULT = ROOT / "vault"
DOCS = ROOT / "docs"
CURRICULUM = DOCS / "data" / "curriculum.json"

# lesson id -> newest source file in the vault (update when versions move on)
SOURCES = {
    "aps-01-rounding-to-significant-figures":
        "02_Foundations/Accuracy, Powers and Scale/Lesson 01 - Rounding to Significant Figures/Lesson_01_Rounding_to_Significant_Figures_v0.3.html",
    "aps-02-estimation":
        "02_Foundations/Accuracy, Powers and Scale/Lesson 02 - Estimation/Lesson_02_Estimation_v0.1.html",
    "aps-03-using-index-laws":
        "02_Foundations/Accuracy, Powers and Scale/Lesson 03 - Using Index Laws/Lesson_03_Using_Index_Laws_v0.2.html",
    "aps-04-write-and-order-standard-form":
        "02_Foundations/Accuracy, Powers and Scale/Lesson 04 - Write and Order Standard Form/Lesson_04_Write_and_Order_Standard_Form_v0.3.html",
    "aps-05-calculating-with-standard-form":
        "02_Foundations/Accuracy, Powers and Scale/Lesson 05 - Calculating with Standard Form/Lesson_05_Calculating_with_Standard_Form_v0.4.html",
    "pyth-01-right-triangles-and-hidden-squares":
        "02_Foundations/01_Lessons/Pythagorean_Theorem/Lesson_01_Right_Triangles_and_Hidden_Squares/NEO_Maths_Y9_Pythagoras_Lesson_01_Hidden_Squares_v0.5.html",
    "pyth-02-finding-the-hypotenuse":
        "02_Foundations/01_Lessons/Pythagorean_Theorem/Lesson_02_Finding_the_Hypotenuse/NEO_Maths_Y9_Pythagoras_Lesson_02_Finding_the_Hypotenuse_v1.0.html",
    "pyth-03-finding-a-shorter-side":
        "02_Foundations/01_Lessons/Pythagorean_Theorem/Lesson_03_Finding_a_Shorter_Side/NEO_Maths_Y9_Pythagoras_Lesson_03_Finding_a_Shorter_Side_v0.3.html",
    "pyth-04-geometrical-problems":
        "02_Foundations/01_Lessons/Pythagorean_Theorem/Lesson_04_Geometrical_Problems/NEO_Maths_Y9_Pythagoras_Lesson_04_Geometrical_Problems_v0.5.html",
    "ks3-ratio-and-proportion":
        "KS3 (1)/ratio (1)/NEO_Maths_KS3_Ratio_Proportion_Interactive_v6.html",
    "ks3-place-value":
        "KS3 (1)/place-value-recycled/NEO_Maths_Y7_Place_Value_Interactive_v0.2.html",
    "ks4-straight-line-graphs":
        "KS4 (1)/straight-lines (1)/NEO_Maths_KS4_Straight_Line_Graphs_Interactive_v6.html",
    "ks4-equation-of-a-straight-line":
        "KS4 (1)/Example Lesson - Straight Lines (1)/equation-of-a-straight-line (1).html",
}

SNIPPET = (
    '\n<script src="{rel}assets/progress.js"></script>'
    '\n<script>NEOProgress.autoTrack({lesson_id!r});</script>\n'
)

CHROME_STYLE = """
<style>
  .neo-chrome, .neo-chrome * { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Inter', -apple-system, 'Segoe UI', sans-serif; }
  .neo-chrome-header { background: #1A2E3B; color: #F7F7F5; padding: 0.6rem 1.2rem; display: flex; align-items: center; justify-content: space-between; gap: 1rem; flex-wrap: wrap; }
  .neo-chrome-header a.neo-home { color: #2AB3A0; text-decoration: none; font-size: 0.72rem; font-weight: 600; letter-spacing: 0.18em; text-transform: uppercase; white-space: nowrap; }
  .neo-chrome-header a.neo-home:hover { text-decoration: underline; }
  .neo-chrome-header .neo-crumb { font-size: 0.8rem; color: rgba(247,247,245,0.85); text-align: right; }
  .neo-chrome-header .neo-crumb strong { color: #FFFFFF; font-weight: 600; }
  .neo-chrome-footer { background: #1A2E3B; color: rgba(247,247,245,0.85); padding: 1.1rem 1.2rem; text-align: center; font-size: 0.8rem; margin-top: 2rem; }
  .neo-chrome-footer a { color: #2AB3A0; text-decoration: none; margin: 0 0.6rem; }
  .neo-chrome-footer a:hover { text-decoration: underline; }
  .neo-chrome-footer .neo-mark { font-size: 0.95rem; color: #FFFFFF; letter-spacing: 0.06em; margin-bottom: 0.3rem; }
  .neo-chrome-footer .neo-mark span { color: #2AB3A0; }
  /* --- Comfort & Access --- */
  .neo-comfort-btn{background:#2AB3A0;color:#08312b;border:none;border-radius:8px;padding:0.35rem 0.7rem;font-weight:700;font-size:0.72rem;letter-spacing:0.06em;cursor:pointer;white-space:nowrap}
  .neo-comfort-btn:hover{filter:brightness(1.06)}
  .neo-comfort-panel{background:#12242e;color:#F7F7F5;padding:0.85rem 1.2rem;display:flex;flex-wrap:wrap;gap:1.4rem;align-items:flex-end;border-top:1px solid rgba(255,255,255,0.12);font-family:'Inter',-apple-system,'Segoe UI',sans-serif}
  .neo-comfort-panel[hidden]{display:none}
  .neo-comfort-group{display:flex;flex-direction:column;gap:0.35rem}
  .neo-comfort-group>span{font-size:0.62rem;text-transform:uppercase;letter-spacing:0.14em;color:rgba(247,247,245,0.65)}
  .neo-comfort-row{display:flex;gap:0.4rem}
  .neo-comfort-panel button.opt{background:rgba(255,255,255,0.10);color:#F7F7F5;border:1px solid rgba(255,255,255,0.25);border-radius:7px;padding:0.35rem 0.7rem;cursor:pointer;font-size:0.8rem}
  .neo-comfort-panel button.opt[aria-pressed="true"]{background:#2AB3A0;color:#08312b;border-color:#2AB3A0;font-weight:700}
  .neo-comfort-reset{margin-left:auto;align-self:center;background:none;border:1px solid rgba(255,255,255,0.3);color:rgba(247,247,245,0.85);border-radius:7px;padding:0.35rem 0.7rem;cursor:pointer;font-size:0.75rem}
  html[data-neo-text="large"]{font-size:112.5%}
  html[data-neo-text="larger"]{font-size:125%}
  html[data-neo-spacing="on"] .neo-lesson-root{letter-spacing:0.012em}
  html[data-neo-spacing="on"] .neo-lesson-root p,html[data-neo-spacing="on"] .neo-lesson-root li,html[data-neo-spacing="on"] .neo-lesson-root summary,html[data-neo-spacing="on"] .neo-lesson-root h2,html[data-neo-spacing="on"] .neo-lesson-root h3,html[data-neo-spacing="on"] .neo-lesson-root label{line-height:1.9!important;margin-bottom:0.7em!important}
  html[data-neo-calm="on"]{filter:saturate(0.82) brightness(1.02)}
  html[data-neo-motion="reduced"] *,html[data-neo-motion="reduced"] *::before,html[data-neo-motion="reduced"] *::after{animation-duration:0.001ms!important;animation-iteration-count:1!important;transition-duration:0.001ms!important;scroll-behavior:auto!important}
  @media (prefers-reduced-motion: reduce){*,*::before,*::after{animation-duration:0.001ms!important;transition-duration:0.001ms!important;scroll-behavior:auto!important}}
</style>
"""

CHROME_HEADER = (
    '<div class="neo-chrome neo-chrome-header">'
    '<a class="neo-home" href="{rel}index.html">&larr; NEO Maths home</a>'
    '<div class="neo-crumb">{unit} &middot; <strong>{num} &mdash; {title}</strong></div>'
    '<button class="neo-comfort-btn" type="button" onclick="neoComfortToggle()" aria-expanded="false" aria-controls="neoComfortPanel" title="Comfort and access settings">Aa&nbsp;Comfort</button>'
    '</div>'
)

CHROME_FOOTER = (
    '<div class="neo-chrome neo-chrome-footer">'
    '<div class="neo-mark">NE<span>O</span> by Nudge Education</div>'
    '<div>'
    '<a href="{rel}index.html">All lessons</a>'
    '<a href="{rel}cornerstones.html">The Six Cornerstones</a>'
    '<a href="{rel}curriculum.html">Our curriculum</a>'
    '</div>'
    '</div>'
)

COMFORT_PANEL = (
    '<div id="neoComfortPanel" class="neo-comfort neo-comfort-panel" hidden aria-label="Comfort and access settings">'
    '<div class="neo-comfort-group"><span>Text size</span><div class="neo-comfort-row">'
    '<button class="opt" data-k="text" data-v="normal" onclick="neoComfortSet(&#39;text&#39;,&#39;normal&#39;)">A</button>'
    '<button class="opt" data-k="text" data-v="large" onclick="neoComfortSet(&#39;text&#39;,&#39;large&#39;)">A+</button>'
    '<button class="opt" data-k="text" data-v="larger" onclick="neoComfortSet(&#39;text&#39;,&#39;larger&#39;)">A++</button>'
    '</div></div>'
    '<div class="neo-comfort-group"><span>Comfort</span><div class="neo-comfort-row">'
    '<button class="opt" data-k="spacing" onclick="neoComfortToggleOpt(&#39;spacing&#39;)">More spacing</button>'
    '<button class="opt" data-k="calm" onclick="neoComfortToggleOpt(&#39;calm&#39;)">Calmer colours</button>'
    '<button class="opt" data-k="motion" onclick="neoComfortToggleOpt(&#39;motion&#39;)">Reduce motion</button>'
    '</div></div>'
    '<button class="neo-comfort-reset" type="button" onclick="neoComfortReset()">Reset</button>'
    '</div>'
)

COMFORT_SCRIPT = """
<script>
(function(){
 var KEY="neoComfort",d=document.documentElement,st={text:"normal",spacing:false,calm:false,motion:false};
 try{var sv=JSON.parse(localStorage.getItem(KEY)||"null");if(sv)st=Object.assign(st,sv);}catch(e){}
 function apply(){d.setAttribute("data-neo-text",st.text);st.spacing?d.setAttribute("data-neo-spacing","on"):d.removeAttribute("data-neo-spacing");st.calm?d.setAttribute("data-neo-calm","on"):d.removeAttribute("data-neo-calm");st.motion?d.setAttribute("data-neo-motion","reduced"):d.removeAttribute("data-neo-motion");}
 function save(){try{localStorage.setItem(KEY,JSON.stringify(st));}catch(e){}}
 function sync(){var ps=document.querySelectorAll("#neoComfortPanel .opt");for(var i=0;i<ps.length;i++){var b=ps[i],k=b.getAttribute("data-k");if(k==="text"){b.setAttribute("aria-pressed",st.text===b.getAttribute("data-v")?"true":"false");}else{b.setAttribute("aria-pressed",st[k]?"true":"false");}}}
 window.neoComfortToggle=function(){var p=document.getElementById("neoComfortPanel"),btn=document.querySelector(".neo-comfort-btn"),willOpen=p.hasAttribute("hidden");willOpen?p.removeAttribute("hidden"):p.setAttribute("hidden","");if(btn)btn.setAttribute("aria-expanded",willOpen?"true":"false");};
 window.neoComfortSet=function(k,v){st[k]=v;apply();save();sync();};
 window.neoComfortToggleOpt=function(k){st[k]=!st[k];apply();save();sync();};
 window.neoComfortReset=function(){st={text:"normal",spacing:false,calm:false,motion:false};apply();save();sync();};
 apply();
 if(document.readyState==="loading"){document.addEventListener("DOMContentLoaded",sync);}else{sync();}
})();
</script>
"""


def inject_chrome(html: str, unit: str, num: str, title: str, depth: int) -> str:
    if "neo-chrome" in html:
        return html
    rel = "../" * depth
    header = CHROME_STYLE + CHROME_HEADER.format(rel=rel, unit=unit, num=num, title=title) + COMFORT_PANEL + COMFORT_SCRIPT + '<div class="neo-lesson-root">'
    footer = "</div>" + CHROME_FOOTER.format(rel=rel)
    m = re.search(r"<body[^>]*>", html, re.IGNORECASE)
    if m:
        html = html[: m.end()] + "\n" + header + "\n" + html[m.end() :]
    else:
        html = header + "\n" + html
    if re.search(r"</body>", html, re.IGNORECASE):
        html = re.sub(r"</body>", footer + "\n</body>", html, count=1, flags=re.IGNORECASE)
    else:
        html = html + footer
    return html


def inject_progress(html: str, lesson_id: str, depth: int) -> str:
    rel = "../" * depth
    snippet = SNIPPET.format(rel=rel, lesson_id=lesson_id)
    if "NEOProgress.autoTrack" in html:
        return html  # already injected
    if re.search(r"</body>", html, re.IGNORECASE):
        return re.sub(r"</body>", snippet + "</body>", html, count=1, flags=re.IGNORECASE)
    return html + snippet


def main() -> None:
    data = json.loads(CURRICULUM.read_text(encoding="utf-8"))
    live, missing = [], []

    for unit in data["units"]:
        for lesson in unit["lessons"]:
            src_rel = SOURCES.get(lesson["id"])
            if not src_rel:
                continue
            src = VAULT / src_rel
            dest = DOCS / lesson["file"]
            if not src.exists():
                missing.append(lesson["id"])
                lesson["status"] = "pending"
                continue
            dest.parent.mkdir(parents=True, exist_ok=True)
            html = src.read_text(encoding="utf-8", errors="replace")
            depth = len(Path(lesson["file"]).parents) - 1
            html = inject_progress(html, lesson["id"], depth)
            html = inject_chrome(html, unit["title"], lesson["num"], lesson["title"], depth)
            dest.write_text(html, encoding="utf-8")
            lesson["status"] = "live"
            live.append(lesson["id"])

    CURRICULUM.write_text(json.dumps(data, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    print(f"live: {len(live)}  missing: {len(missing)}")
    for m in missing:
        print(f"  missing source: {m}")


if __name__ == "__main__":
    main()
