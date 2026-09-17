import lxml.html, sys, re, json

def tables(path):
    doc = lxml.html.parse(path).getroot()
    out = []
    for t in doc.xpath('//table[contains(@class,"wikitable")]'):
        cap = t.xpath('preceding::*[self::h2 or self::h3 or self::h4][1]')
        title = cap[0].text_content().strip() if cap else "?"
        rows = []
        for tr in t.xpath('.//tr'):
            cells = [c.text_content().strip().replace('\xa0',' ') for c in tr.xpath('./th|./td')]
            if cells: rows.append(cells)
        out.append((title, rows))
    return out

for f in ['MS_Dhoni.html','Gautam_Gambhir.html']:
    print("#"*100)
    print("FILE:", f)
    for i,(title,rows) in enumerate(tables(f)):
        joined = " ".join(" ".join(r) for r in rows).lower()
        if any(k in joined for k in ['matches','innings','average','centur']):
            print(f"\n----- [{i}] {title!r}  rows={len(rows)} -----")
            for r in rows[:26]:
                print(" | ".join(r)[:190])
