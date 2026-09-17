#!/usr/bin/env python3
"""
Extract the career-statistics, captaincy and honours tables used in data.js
from the Wikipedia HTML for each player.

Usage
-----
    python3 extract_stats.py                 # fetches the pages itself
    python3 extract_stats.py MS_Dhoni.html   # parse a file you already have

The raw HTML dumps are deliberately not committed (see research/.gitignore) —
run this script if you ever need to re-derive the numbers in ../data.js.

Requires: lxml  (pip install lxml)
"""

import sys
import urllib.request

try:
    import lxml.html
except ImportError:
    sys.exit("This script needs lxml:  pip install lxml")

PAGES = {
    "MS_Dhoni": "https://en.wikipedia.org/wiki/MS_Dhoni",
    "Gautam_Gambhir": "https://en.wikipedia.org/wiki/Gautam_Gambhir",
}

# Substrings that identify the tables we actually care about.
KEEP = {
    "MS_Dhoni": ["Competition", "Captaincy", "Franchise career", "Career statistics", "Awards and honours"],
    "Gautam_Gambhir": ["Competition", "Captaincy", "Awards and honours", "Representing"],
}


def fetch(url):
    req = urllib.request.Request(url, headers={"User-Agent": "stats-research/1.0"})
    return urllib.request.urlopen(req, timeout=60).read().decode("utf-8", "replace")


def tables(html_or_path):
    """Return [(section_heading, rows)] for every table on the page."""
    doc = (lxml.html.parse(html_or_path).getroot()
           if html_or_path.endswith(".html")
           else lxml.html.fromstring(html_or_path))

    out = []
    for t in doc.xpath("//table"):
        cap = t.xpath("preceding::*[self::h2 or self::h3 or self::h4][1]")
        heading = cap[0].text_content().strip() if cap else "?"
        rows = []
        for tr in t.xpath(".//tr"):
            cells = [c.text_content().strip().replace("\xa0", " ")
                     for c in tr.xpath("./th|./td")]
            if cells:
                rows.append(cells)
        out.append((heading, rows))
    return out


def main():
    targets = {}
    for name, url in PAGES.items():
        if len(sys.argv) > 1 and any(a.startswith(name) for a in sys.argv[1:]):
            path = next(a for a in sys.argv[1:] if a.startswith(name))
        else:
            print(f"# fetching {name} ...", file=sys.stderr)
            html = fetch(url)
            path = f"{name}.html"
            with open(path, "w") as fh:
                fh.write(html)
        targets[name] = path

    for name, path in targets.items():
        print("=" * 78)
        print(f"## {name}   (source: {path})")
        for heading, rows in tables(path):
            flat = " ".join(" ".join(r) for r in rows)
            haystack = (flat + " " + heading).lower()
            wanted = any(k.lower() in haystack for k in KEEP[name])
            if not wanted:
                continue
            preview = " | ".join(rows[0]) if rows else ""
            # Only the compact stats tables, not the giant navboxes.
            if len(rows) > 30 or not any(
                h in flat for h in ("Matches", "Won", "Winner", "Runs scored")
            ):
                continue
            print(f"\n--- table under section: {heading!r}  (rows={len(rows)}) ---")
            for r in rows:
                print(" | ".join(r))


if __name__ == "__main__":
    main()
