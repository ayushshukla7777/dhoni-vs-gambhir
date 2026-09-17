import lxml.html
def tables(path):
    doc=lxml.html.parse(path).getroot(); out=[]
    for t in doc.xpath('//table'):
        cap=t.xpath('preceding::*[self::h2 or self::h3 or self::h4][1]')
        title=cap[0].text_content().strip() if cap else "?"
        rows=[]
        for tr in t.xpath('.//tr'):
            c=[x.text_content().strip().replace('\xa0',' ') for x in tr.xpath('./th|./td')]
            if c: rows.append(c)
        out.append((t.get('class',''),title,rows))
    return out
print("="*30,"DHONI","="*30)
for i in [1,3,5,6]:
    cls,title,rows=tables('MS_Dhoni.html')[i]
    print(f"\n##### [{i}] {title} #####")
    for r in rows: print(" | ".join(r))
print("\n"+"="*30,"GAMBHIR","="*30)
gs=tables('Gautam_Gambhir.html')
for i,(cls,title,rows) in enumerate(gs):
    prev=" | ".join(" ".join(r) for r in rows)[:120]
    print(f"[{i}] {title!r} rows={len(rows)} :: {prev}")
