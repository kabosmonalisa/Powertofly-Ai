#!/usr/bin/env python3
"""
PowerToFly AI — Storybook editing server.
Serves the whole project (so pages/iframes resolve) AND exposes a small write API
so the storybook's Remove / Replace buttons actually edit the files on disk.

  python3 ds/server.py [port]        # default 3456

Endpoints (POST JSON to /api/apply):
  {"type":"replace-hex","hex":"#4fe8a9","token":"--green-mid"}   # CSS contexts only, skips SVG attrs
  {"type":"replace-fontsize","old":"11.5px","new":"11px"}
  {"type":"replace-token","from":"--section-y-loose","to":"--section-y"}
  {"type":"replace-class","from":".btn-light","to":".btn"}
  {"type":"remove-token","token":"--r-sm"}                        # deletes its definition line in ptf.css
  {"type":"remove-css-rule","selector":".btn-light"}             # deletes an exact single-selector rule
/api/undo   -> restores the most recent backup
/api/ping   -> {"ok":true}    (storybook uses this to enable the buttons)
Every apply backs up touched files under ds/.sb-backups/<ts>/ first, then re-runs the scan.
"""
import http.server, socketserver, json, os, re, sys, time, shutil, subprocess, datetime

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DS   = os.path.join(ROOT, "ds")
CSS  = os.path.join(DS, "ptf.css")
BK   = os.path.join(DS, ".sb-backups")
SCAN = os.path.join(DS, "usage-scan.py")
DATA = os.path.join(DS, "usage-data.json")

PAGES_JSON = os.path.join(DS, "pages.json")

def _load_pages():  # single source of truth: ds/pages.json
    # Archived pages are never touched by an edit. Drafts ARE — if Accept skipped them
    # they would keep the old class and break the day you finish them.
    try:
        return [p["file"] for p in json.load(open(PAGES_JSON))["pages"]
                if p.get("status") != "archived"]
    except Exception:
        return ["employers/index.html","talents/index-v2.html","nav-options.html",
                "train/index.html","hire/index.html","about/index.html","event-common/index.html"]
PAGES = _load_pages()

def page_paths():        return [os.path.join(ROOT, p) for p in _load_pages() if os.path.exists(os.path.join(ROOT, p))]
def rel(p):              return os.path.relpath(p, ROOT)
def all_targets():       return page_paths() + [CSS]

CKPTS = os.path.join(DS, ".sb-checkpoints")  # dated restore points: "beginning" + one per day
APPR  = os.path.join(DS, "approvals.json")   # items Lizu marked "keep as it is"
BRIEFS = os.path.join(DS, "briefs.json")     # Create-wizard briefs, newest first, for Claude to plan against

def _snapshot(dirpath):
    os.makedirs(dirpath, exist_ok=True)
    for p in all_targets():
        dst = os.path.join(dirpath, rel(p)); os.makedirs(os.path.dirname(dst), exist_ok=True); shutil.copy2(p, dst)
    json.dump({"epoch": time.time()}, open(os.path.join(dirpath, "_meta.json"), "w"))

def _restore_dir(dirpath):
    if not os.path.isdir(dirpath): return 0
    backup(all_targets())                 # current state backed up first → any restore is undoable
    n = 0
    for p in all_targets():
        src = os.path.join(dirpath, rel(p))
        if os.path.exists(src): shutil.copy2(src, p); n += 1
    return n

def ensure_checkpoints():
    if not os.path.isdir(os.path.join(CKPTS, "beginning")): _snapshot(os.path.join(CKPTS, "beginning"))
    today = datetime.date.today().isoformat()
    if not os.path.isdir(os.path.join(CKPTS, today)): _snapshot(os.path.join(CKPTS, today))

def list_checkpoints():
    out = []
    if os.path.isdir(CKPTS):
        for name in os.listdir(CKPTS):
            d = os.path.join(CKPTS, name)
            if not os.path.isdir(d): continue
            try: ep = json.load(open(os.path.join(d, "_meta.json"))).get("epoch", 0)
            except Exception: ep = 0
            out.append({"id": name, "epoch": ep})
    out.sort(key=lambda x: (x["id"] == "beginning", -(x["epoch"] or 0)))  # newest date first, beginning last
    return out

def restore_checkpoint(cid): return _restore_dir(os.path.join(CKPTS, cid))
def reset_to_baseline():      return restore_checkpoint("beginning")   # /api/reset alias
def checkpoint_now():         _snapshot(os.path.join(CKPTS, datetime.date.today().isoformat()))

def load_appr():
    try: return json.load(open(APPR))
    except Exception: return {"approved": []}
def save_appr(d): json.dump(d, open(APPR, "w"), indent=1)

def backup(paths):
    ts = str(int(time.time() * 1000))
    d = os.path.join(BK, ts); os.makedirs(d, exist_ok=True)
    manifest = []
    for p in paths:
        dst = os.path.join(d, rel(p)); os.makedirs(os.path.dirname(dst), exist_ok=True)
        shutil.copy2(p, dst); manifest.append(rel(p))
    json.dump(manifest, open(os.path.join(d, "manifest.json"), "w"))
    return ts

def run_edit(paths, fn):
    """fn(text) -> (new_text, count). Backs up, writes changed files, returns summary."""
    paths = [p for p in paths if os.path.exists(p)]
    bkid = backup(paths)
    total = 0; changed = []
    for p in paths:
        t = open(p, encoding="utf-8", errors="ignore").read()
        nt, c = fn(t)
        if c and nt != t:
            open(p, "w", encoding="utf-8").write(nt); total += c; changed.append([rel(p), c])
    return {"backup": bkid, "total": total, "changed": changed}

def apply(a):
    typ = a.get("type")
    if typ == "replace-hex":
        hx = a["hex"].lstrip("#"); tok = a["token"]
        rx = re.compile(r'#' + re.escape(hx), re.I)
        def fn(t):
            cnt = [0]
            def repl(m):
                s = m.start(); pre = t[max(0, s-2):s]
                if pre.endswith('="') or pre.endswith("='"):  # SVG/HTML attribute value → leave it
                    return m.group(0)
                cnt[0] += 1; return "var(" + tok + ")"
            return rx.sub(repl, t), cnt[0]
        return run_edit(page_paths(), fn)
    if typ == "replace-fontsize":
        rx = re.compile(r'(font-size\s*:\s*)' + re.escape(a["old"]), re.I)
        return run_edit(page_paths(), lambda t: rx.subn(r'\g<1>' + a["new"], t))
    if typ == "replace-token":
        rx = re.compile(r'var\(\s*' + re.escape(a["from"]) + r'\s*\)')
        return run_edit(page_paths() + [CSS], lambda t: rx.subn("var(" + a["to"] + ")", t))
    if typ == "replace-class":
        af = a["from"].lstrip("."); bt = a["to"].lstrip(".")
        def fn(t):
            cnt = [0]
            def repl(m):
                parts = m.group(2).split()
                nn = [bt if p == af else p for p in parts]
                if nn != parts: cnt[0] += 1
                return m.group(1) + " ".join(nn) + m.group(3)
            return re.sub(r'(class\s*=\s*")([^"]*)(")', repl, t), cnt[0]
        return run_edit(page_paths(), fn)
    if typ == "remove-token":
        rx = re.compile(r'^[ \t]*' + re.escape(a["token"]) + r'\s*:[^;\n]*;[^\n]*\n', re.M)
        return run_edit([CSS], lambda t: rx.subn("", t))
    if typ == "remove-css-rule":
        cls = a["selector"]                                  # e.g. ".btn-light"
        tok = re.compile(re.escape(cls) + r'(?![\w-])')      # word-bounded class token
        rule = re.compile(r'([^{}]+)\{([^{}]*)\}')           # innermost rule: selectors { decls }
        def fn(t):
            cnt = [0]
            def repl(m):
                sels = [s.strip() for s in m.group(1).split(",") if s.strip()]
                keep = [s for s in sels if not tok.search(s)]  # drop any selector referencing the class
                if len(keep) == len(sels):
                    return m.group(0)                          # rule untouched
                cnt[0] += 1
                if not keep:
                    return ""                                  # whole rule removed
                lead = re.match(r'\s*', m.group(1)).group(0)   # preserve indentation
                return lead + ", ".join(keep) + " {" + m.group(2) + "}"
            nt = rule.sub(repl, t)
            nt = re.sub(r'\n[ \t]*\n[ \t]*\n+', '\n\n', nt)    # tidy blank lines
            return nt, cnt[0]
        return run_edit([CSS], fn)
    if typ == "css-set":
        # Set a declaration on the rule whose selector list contains `selector` exactly.
        # Replaces the property if present, otherwise appends it. ptf.css only.
        sel, prop, val = a["selector"], a["prop"], a["value"]
        proprx = re.compile(r'(^|;|\{)(\s*)' + re.escape(prop) + r'\s*:[^;}]*(;?)', re.I)
        rule = re.compile(r'([^{}]+)\{([^{}]*)\}')
        def has_sel(prelude):
            # The captured "selector" text runs from the previous } and can include
            # comments and blank lines — strip those before comparing, or a rule
            # preceded by /* a comment */ silently never matches.
            s = re.sub(r'/\*.*?\*/', '', prelude, flags=re.S)
            return any(part.strip() == sel for part in s.split(","))
        def fn(t):
            cnt = [0]
            def repl(m):
                if not has_sel(m.group(1)):
                    return m.group(0)
                decls = m.group(2)
                if proprx.search(decls):
                    nd = proprx.sub(lambda d: d.group(1) + d.group(2) + prop + ": " + val + (d.group(3) or ";"), decls, count=1)
                else:
                    body = decls.rstrip()
                    sep = "" if (not body or body.endswith(";")) else ";"
                    nd = body + sep + " " + prop + ": " + val + ";" + ("\n" if "\n" in decls else " ")
                if nd == decls:
                    return m.group(0)
                cnt[0] += 1
                return m.group(1) + "{" + nd + "}"
            return rule.sub(repl, t), cnt[0]
        return run_edit([CSS], fn)
    if typ == "css-append":
        # Append a raw rule to the end of ptf.css (used to fix things that have no rule yet).
        block, marker = a["css"], a.get("marker", "")
        def fn(t):
            if marker and marker in t:
                return t, 0                      # already applied — never duplicate
            return t.rstrip() + "\n\n" + block.strip() + "\n", 1
        return run_edit([CSS], fn)
    raise ValueError("unknown action: " + str(typ))

def undo():
    if not os.path.isdir(BK): return None
    ids = sorted(os.listdir(BK))
    if not ids: return None
    last = ids[-1]; d = os.path.join(BK, last)
    for r in json.load(open(os.path.join(d, "manifest.json"))):
        shutil.copy2(os.path.join(d, r), os.path.join(ROOT, r))
    shutil.rmtree(d)
    return last

def rescan():
    try: subprocess.run([sys.executable, SCAN], cwd=ROOT, capture_output=True, timeout=30)
    except Exception as e: print("scan failed:", e)
    try: return json.load(open(DATA))
    except Exception: return None

class H(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *a, **k): super().__init__(*a, directory=ROOT, **k)
    def _json(self, obj, code=200):
        b = json.dumps(obj).encode()
        self.send_response(code); self.send_header("Content-Type", "application/json")
        self.send_header("Access-Control-Allow-Origin", "*"); self.send_header("Content-Length", str(len(b)))
        self.end_headers(); self.wfile.write(b)
    def do_OPTIONS(self):
        self.send_response(204); self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "POST, GET, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type"); self.end_headers()
    def do_POST(self):
        if self.path.rstrip("/") == "/api/apply":
            n = int(self.headers.get("Content-Length", 0)); body = json.loads(self.rfile.read(n) or "{}")
            try:
                res = apply(body); res["data"] = rescan(); res["ok"] = True; self._json(res)
            except Exception as e:
                self._json({"ok": False, "error": str(e)}, 400)
            return
        if self.path.rstrip("/") == "/api/undo":
            last = undo(); self._json({"ok": bool(last), "restored": last, "data": rescan()})
            return
        if self.path.rstrip("/") == "/api/reset":
            n = reset_to_baseline(); self._json({"ok": True, "restored": n, "data": rescan()})
            return
        if self.path.rstrip("/") == "/api/restore":
            n = int(self.headers.get("Content-Length", 0)); body = json.loads(self.rfile.read(n) or "{}")
            r = restore_checkpoint(body.get("id", "beginning")); self._json({"ok": True, "restored": r, "data": rescan()})
            return
        if self.path.rstrip("/") == "/api/checkpoint":
            checkpoint_now(); self._json({"ok": True})
            return
        if self.path.rstrip("/") == "/api/pages":
            # Every page + when it was last worked on. Includes archived (they still have
            # tiles, just collapsed), which the scan deliberately never sees.
            d = json.load(open(PAGES_JSON))
            out = []
            for pg in d["pages"]:
                fp = os.path.join(ROOT, pg["file"])
                item = dict(pg)
                item["mtime"] = os.path.getmtime(fp) if os.path.exists(fp) else 0
                item["missing"] = not os.path.exists(fp)
                out.append(item)
            self._json({"ok": True, "pages": out})
            return
        if self.path.rstrip("/") == "/api/page-status":
            # Set a page's lifecycle: live | draft | archived
            n = int(self.headers.get("Content-Length", 0)); body = json.loads(self.rfile.read(n) or "{}")
            pid, status = body.get("id"), body.get("status")
            if status not in ("live", "draft", "archived"):
                self._json({"ok": False, "error": "unknown status: %s" % status}); return
            d = json.load(open(PAGES_JSON))
            hit = next((p for p in d["pages"] if p.get("id") == pid), None)
            if not hit:
                self._json({"ok": False, "error": "no such page: %s" % pid}); return
            hit["status"] = status
            json.dump(d, open(PAGES_JSON, "w"), indent=1, ensure_ascii=False)
            self._json({"ok": True, "id": pid, "status": status, "data": rescan()})
            return
        if self.path.rstrip("/") == "/api/rescan":
            # Re-measure the pages. This is the mechanical half of an audit — counting,
            # not judging. It never writes a finding; it only refreshes the data.
            self._json({"ok": True, "data": rescan()})
            return
        if self.path.rstrip("/") == "/api/brief":
            # The Create wizard hands its brief off here so Claude can read it from disk
            # and write a plan into ds/plans.json. Newest brief wins; history is kept.
            n = int(self.headers.get("Content-Length", 0)); body = json.loads(self.rfile.read(n) or "{}")
            briefs = []
            if os.path.exists(BRIEFS):
                try: briefs = json.load(open(BRIEFS)).get("briefs", [])
                except Exception: briefs = []
            briefs.insert(0, {"at": datetime.datetime.now().isoformat(timespec="seconds"),
                              "brief": body.get("brief", ""), "wiz": body.get("wiz", {})})
            json.dump({"briefs": briefs[:20]}, open(BRIEFS, "w"), indent=1)
            self._json({"ok": True, "saved": rel(BRIEFS)})
            return
        if self.path.rstrip("/") == "/api/approve":
            n = int(self.headers.get("Content-Length", 0)); body = json.loads(self.rfile.read(n) or "{}")
            d = load_appr(); s = set(d.get("approved", [])); key = body.get("key")
            if body.get("on"): s.add(key)
            else: s.discard(key)
            d["approved"] = sorted(s); save_appr(d); self._json({"ok": True, "approved": d["approved"]})
            return
        self._json({"ok": False, "error": "not found"}, 404)
    def do_GET(self):
        if self.path.rstrip("/") == "/api/ping": return self._json({"ok": True})
        if self.path.rstrip("/") == "/api/approvals": return self._json(load_appr())
        if self.path.rstrip("/") == "/api/checkpoints": return self._json({"checkpoints": list_checkpoints()})
        return super().do_GET()
    def end_headers(self):
        self.send_header("Cache-Control", "no-store")
        super().end_headers()
    def log_message(self, *a): pass

if __name__ == "__main__":
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 3456
    ensure_checkpoints()   # "beginning" (first run) + today's snapshot; more accrue per day
    socketserver.ThreadingTCPServer.allow_reuse_address = True
    with socketserver.ThreadingTCPServer(("127.0.0.1", port), H) as httpd:
        print("Storybook editing server on http://localhost:%d  (project root: %s)" % (port, ROOT))
        httpd.serve_forever()
