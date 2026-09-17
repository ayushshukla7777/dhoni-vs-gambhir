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
g=tables('Gautam_Gambhir.html'); d=tables('MS_Dhoni.html')
print("##### GAMBHIR [1] career stats #####")
for r in g[1][2]: print(" | ".join(r))
print("\n##### GAMBHIR [2] honours #####")
for r in g[2][2]: print(" | ".join(r))
print("\n##### DHONI [2] honours #####")
for r in d[2][2]: print(" | ".join(r))
