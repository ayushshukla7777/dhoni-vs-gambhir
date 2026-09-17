import lxml.html

def tables(path):
    doc = lxml.html.parse(path).getroot()
    out=[]
    for t in doc.xpath('//table'):
        cls = t.get('class','')
        cap = t.xpath('preceding::*[self::h2 or self::h3 or self::h4][1]')
        title = cap[0].text_content().strip() if cap else "?"
        rows=[]
        for tr in t.xpath('.//tr'):
            cells=[c.text_content().strip().replace('\xa0',' ') for c in tr.xpath('./th|./td')]
            if cells: rows.append(cells)
        out.append((cls,title,rows))
    return out

for f in ['MS_Dhoni.html','Gautam_Gambhir.html']:
    print("#"*95); print("FILE:",f)
    for i,(cls,title,rows) in enumerate(tables(f)):
        preview=" | ".join(" ".join(r) for r in rows)[:150]
        print(f"[{i}] class={cls!r} sec={title!r} rows={len(rows)} :: {preview}")
