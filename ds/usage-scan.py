#!/usr/bin/env python3
"""
PowerToFly AI — design-system usage scanner.
Indexes how often every CSS class, token (--var), raw hex color, and font family
is actually used across the real site pages, with a per-file breakdown.
Writes ds/usage-data.json, which the storybook loads to show its "Usage" audit.

Re-run any time after editing pages:   python3 ds/usage-scan.py
"""
import os, re, json, collections

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))  # project root
CSS  = os.path.join(ROOT, "ds", "ptf.css")

# ── The storybook's universe comes from ds/pages.json (single source of truth). ──
# Add a page there and it is audited automatically. Fallback list if the file is missing.
def _load_pages():
    # archived pages are excluded entirely — not scanned, not counted, not audited
    try:
        return [p["file"] for p in json.load(open(os.path.join(os.path.dirname(os.path.abspath(__file__)), "pages.json")))["pages"]
                if p.get("status") != "archived"]
    except Exception:
        return ["employers/index.html","talents/index-v2.html","nav-options.html",
                "train/index.html","hire/index.html","about/index.html","event-common/index.html"]
PAGES = _load_pages()

def rel(p): return os.path.relpath(p, ROOT)

def html_files():
    files = [os.path.join(ROOT, p) for p in PAGES if os.path.exists(os.path.join(ROOT, p))]
    js = os.path.join(ROOT, "ds", "ptf.js")     # renders the nav / footer / drawer markup
    if os.path.exists(js):
        files.append(js)
    return files

CLASS_ATTR = re.compile(r'class\s*=\s*"([^"]*)"|class\s*=\s*\'([^\']*)\'')
# Classes applied by script: classList.add/toggle/remove('x'), el.className = 'x y'.
# ptf.js RENDERS the nav + footer, so its class names never appear in any page's HTML —
# without this they scan as "unused" and the audit would tell you to delete them.
JS_CLASS = re.compile(r"""classList\.(?:add|toggle|remove)\s*\(\s*['"]([^'"]+)['"]|className\s*=\s*['"]([^'"]+)['"]""")
TOKEN_RE   = re.compile(r'--[A-Za-z][\w-]*')
HEX_RE     = re.compile(r'#[0-9A-Fa-f]{3,8}\b')
VAR_RE     = re.compile(r'var\(\s*(--[A-Za-z][\w-]*)')

classes = collections.defaultdict(lambda: collections.defaultdict(int))
tokens  = collections.defaultdict(lambda: collections.defaultdict(int))
hexes   = collections.defaultdict(lambda: collections.defaultdict(int))
fonts   = collections.defaultdict(lambda: collections.defaultdict(int))
fontsz  = collections.defaultdict(lambda: collections.defaultdict(int))
FS_RE   = re.compile(r'font-size\s*:\s*([0-9.]+px)', re.I)
STYLE_RE = re.compile(r'<style[^>]*>(.*?)</style>', re.S | re.I)
pagecss = {}   # how many lines of CSS a page writes for itself — the clearest drift signal
               # we have: the pages with none (Resources, Become a sponsor) have no
               # opportunities against them; Employers writes 939 lines and has nine.

files = html_files()
for path in files:
    r = rel(path)
    try:
        txt = open(path, encoding="utf-8", errors="ignore").read()
    except Exception:
        continue
    # classes — only real class="" attribute tokens (no prose / JS false positives)
    for m in CLASS_ATTR.finditer(txt):
        val = m.group(1) or m.group(2) or ""
        for cls in val.split():
            if cls:
                classes["." + cls][r] += 1
    # …plus classes applied by scripts (classList.add/toggle/remove, className=).
    # Without this, anything the JS renders or toggles looks "unused" and the audit
    # would tell you to delete it — e.g. the footer's social row, which ptf.js builds.
    for m in JS_CLASS.finditer(txt):
        for cls in (m.group(1) or m.group(2) or "").split():
            if cls:
                classes["." + cls][r] += 1
    # tokens (--var), anywhere (inline style / <style> blocks)
    for t in TOKEN_RE.findall(txt):
        tokens[t][r] += 1
    # raw hex colors — flags color used WITHOUT going through a token
    for h in HEX_RE.findall(txt):
        hexes[h.lower()][r] += 1
    # font sizes (typography unification: near-duplicate sizes)
    for fs in FS_RE.findall(txt):
        fontsz[fs.lower()][r] += 1
    # a page's own CSS — everything inside its <style> blocks, comments and blanks aside
    if r.endswith(".html"):
        n = 0
        for block in STYLE_RE.findall(txt):
            body = re.sub(r'/\*.*?\*/', '', block, flags=re.S)
            n += len([l for l in body.split("\n") if l.strip()])
        pagecss[r] = n
    # font families
    for fam in ("Inter Tight", "JetBrains Mono"):
        n = txt.count("'" + fam + "'") + txt.count('"' + fam + '"')
        if n: fonts[fam][r] += n
    # plain Inter (not Inter Tight) — count 'Inter' occurrences that aren't 'Inter Tight'
    n_inter = len(re.findall(r"['\"]Inter['\",]", txt))
    if n_inter: fonts["Inter"][r] += n_inter

# var() reference counts inside ptf.css (how many rules consume each token)
css_refs = collections.Counter()
css_defs = set()
try:
    css_txt = open(CSS, encoding="utf-8", errors="ignore").read()
    for v in VAR_RE.findall(css_txt):
        css_refs[v] += 1
    for m in re.finditer(r'(--[A-Za-z][\w-]*)\s*:', css_txt):
        css_defs.add(m.group(1))
    css_class_defs = sorted(set(re.findall(r'\.[a-zA-Z][\w-]*', css_txt)))
except Exception:
    css_txt = ""; css_class_defs = []

def pack(store):
    out = {}
    for key, filemap in store.items():
        total = sum(filemap.values())
        out[key] = {
            "total": total,
            "files": dict(sorted(filemap.items(), key=lambda kv: -kv[1])),
        }
    return out

data = {
    "meta": {
        "generated": "run `python3 ds/usage-scan.py` to refresh",
        # ptf.js is scanned (it renders the nav/footer markup) but it is NOT a page —
        # counting it would inflate every "used on N pages" number by one.
        "pageCount": len([p for p in files if p.endswith(".html")]),
        "pages": [rel(p) for p in files if p.endswith(".html")],
        "pageCss": pagecss,
    },
    "classes": pack(classes),
    "tokens":  pack(tokens),
    "hex":     pack(hexes),
    "fonts":   pack(fonts),
    "fontsize": pack(fontsz),
    "cssClasses": css_class_defs,
}
# fold css info into tokens
for tk, meta in data["tokens"].items():
    meta["cssRefs"] = css_refs.get(tk, 0)
    meta["defined"] = tk in css_defs
# ensure every defined token appears even if unused in pages
for tk in css_defs:
    if tk not in data["tokens"]:
        data["tokens"][tk] = {"total": 0, "files": {}, "cssRefs": css_refs.get(tk, 0), "defined": True}

out_path = os.path.join(ROOT, "ds", "usage-data.json")
json.dump(data, open(out_path, "w"), indent=1)
print("Scanned %d pages -> %s" % (len(files), rel(out_path)))
print("  classes: %d  tokens: %d  hex: %d" % (len(data["classes"]), len(data["tokens"]), len(data["hex"])))
