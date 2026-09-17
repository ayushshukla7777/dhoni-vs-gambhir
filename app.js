/* ============================================================
   Dhoni vs Gambhir — page rendering
   Depends on data.js (PLAYERS, FORMATS, CAPTAINCY, TROPHIES,
   SCORECARD, MOMENTS, SOURCES, META).
   ============================================================ */

(function () {
  "use strict";

  /* ---------- helpers ---------- */
  const $ = (sel) => document.querySelector(sel);
  const el = (tag, cls, html) => {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (html !== undefined) n.innerHTML = html;
    return n;
  };
  const num = (v) => (v === null || v === undefined || v === "" ? null : Number(v));
  const fmtInt = (v) => (v === null ? "–" : Number(v).toLocaleString("en-US"));
  const fmt2 = (v) => (v === null ? "–" : Number(v).toFixed(2));
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const accentOf = (key) => PLAYERS[key].accent;

  /* Reveal-on-scroll for elements that opt in. */
  const revealTargets = [];
  function reveal(node) { node.classList.add("reveal"); revealTargets.push(node); return node; }

  /* ============================================================
     1. HERO META + PROFILES
     ============================================================ */
  $("#metaLine").textContent =
    "Data through " + META.dataThrough + ". " + META.builtNote;

  function renderProfiles() {
    const grid = $("#profileGrid");

    Object.values(PLAYERS).forEach((p) => {
      const card = el("article", "profile");
      card.style.setProperty("--accent", p.accent);

      card.appendChild(el("div", "profile__top", `
        <div class="profile__mono">${esc(p.initials)}</div>
        <div>
          <h3 class="profile__name" style="color:${p.accent}">${esc(p.name)}</h3>
          <p class="profile__role">${esc(p.role)}</p>
        </div>`));

      card.appendChild(el("p", "profile__tagline", esc(p.tagline)));

      const ul = el("ul", "profile__facts");
      const facts = [
        ["Full name", p.full],
        ["Born", p.born],
        ["Birthplace", p.birthplace],
        ["Jersey number", `<span class="profile__jersey">#${esc(p.jersey)}</span>`],
      ];
      facts.forEach(([k, v]) => {
        const li = el("li");
        li.appendChild(el("span", "k", esc(k)));
        li.appendChild(el("span", "v", v));
        ul.appendChild(li);
      });
      card.appendChild(ul);

      grid.appendChild(card);
    });
  }

  /* ============================================================
     2. COMPARE — format tabs + mirrored bars
     ============================================================ */
  const METRICS = [
    { key: "mat",       label: "Matches",         fmt: fmtInt, higherIsBetter: true },
    { key: "runs",      label: "Runs scored",     fmt: fmtInt, higherIsBetter: true },
    { key: "avg",       label: "Batting average", fmt: fmt2,   higherIsBetter: true },
    { key: "sr",        label: "Strike rate",     fmt: fmt2,   higherIsBetter: true },
    { key: "hundreds",  label: "Centuries",       fmt: fmtInt, higherIsBetter: true },
    { key: "fifties",   label: "Fifties",         fmt: fmtInt, higherIsBetter: true },
    { key: "hs",        label: "Highest score",   fmt: (v) => (v === null ? "–" : esc(v)), higherIsBetter: false },
    { key: "catches",   label: "Catches",         fmt: fmtInt, higherIsBetter: true },
    { key: "stumpings", label: "Stumpings",       fmt: fmtInt, higherIsBetter: true },
  ];

  let currentFormat = "odi";

  function renderTabs() {
    const tabs = $("#tabs");
    tabs.innerHTML = "";
    Object.entries(FORMATS).forEach(([key, f]) => {
      const b = el("button", "tab", esc(f.label));
      b.type = "button";
      b.setAttribute("role", "tab");
      b.setAttribute("aria-selected", key === currentFormat ? "true" : "false");
      b.dataset.format = key;
      b.addEventListener("click", () => {
        currentFormat = key;
        Array.from(tabs.children).forEach((c) =>
          c.setAttribute("aria-selected", c.dataset.format === key ? "true" : "false"));
        renderCompare();
      });
      tabs.appendChild(b);
    });
  }

  function numeric(v) {
    if (v === null || v === undefined) return null;
    const n = parseFloat(String(v).replace(/[^0-9.]/g, ""));
    return isNaN(n) ? null : n;
  }

  function renderCompare() {
    const f = FORMATS[currentFormat];
    $("#formatBlurb").textContent = f.blurb;

    const panel = $("#comparePanel");
    panel.innerHTML = "";

    /* header: who is left / right */
    const head = el("div", "cmp__head");
    head.appendChild(el("b", "l", `<span style="color:${accentOf("dhoni")}">MS Dhoni</span>`));
    head.appendChild(el("span", "cmp__vs", "vs"));
    head.appendChild(el("b", "r", `<span style="color:${accentOf("gambhir")}">Gautam Gambhir</span>`));
    panel.appendChild(head);

    METRICS.forEach((m) => {
      const dv = f.dhoni[m.key];
      const gv = f.gambhir[m.key];
      if (dv === null && gv === null) return;
      if (m.key === "sr" && (dv === null || gv === null)) return;
      if (m.key === "stumpings" && dv === 0 && gv === 0) return;

      const dn = numeric(dv), gn = numeric(gv);
      const max = Math.max(dn || 0, gn || 0);
      const dPct = max > 0 ? ((dn || 0) / max) * 100 : 0;
      const gPct = max > 0 ? ((gn || 0) / max) * 100 : 0;

      let dWin = false, gWin = false;
      if (m.higherIsBetter && dn !== null && gn !== null && dn !== gn) {
        if (dn > gn) dWin = true; else gWin = true;
      }

      const row = el("div", "row");
      row.appendChild(el("div", "row__label", esc(m.label)));

      const bars = el("div", "row__bars");

      const left = el("div", "side side--l");
      left.style.setProperty("--win", accentOf("dhoni"));
      const lv = el("div", "side__val " + (dWin ? "win" : gWin ? "lose" : ""));
      lv.innerHTML = m.fmt(dv) + (dWin ? '<span class="tick" title="Leads this metric">▲</span>' : "");
      const lt = el("div", "side__track");
      const lf = el("div", "side__fill");
      lf.dataset.pct = dPct;
      lt.appendChild(lf);
      left.appendChild(lv); left.appendChild(lt);

      const right = el("div", "side side--r");
      right.style.setProperty("--win", accentOf("gambhir"));
      const rv = el("div", "side__val " + (gWin ? "win" : dWin ? "lose" : ""));
      rv.innerHTML = m.fmt(gv) + (gWin ? '<span class="tick" title="Leads this metric">▲</span>' : "");
      const rt = el("div", "side__track");
      const rf = el("div", "side__fill");
      rf.dataset.pct = gPct;
      rt.appendChild(rf);
      right.appendChild(rv); right.appendChild(rt);

      bars.appendChild(left); bars.appendChild(right);
      row.appendChild(bars);
      panel.appendChild(row);
    });

    /* Footer line for the format */
    const foot = el("p", "section__lead section__lead--tight");
    foot.style.marginTop = "10px";
    foot.innerHTML = `<strong>${esc(f.label)}:</strong> ${esc(f.blurb)}`;
    panel.appendChild(foot);

    animateFills();
  }

  /* Animate every un-animated bar to its target width. */
  function animateFills() {
    requestAnimationFrame(() => {
      document.querySelectorAll(".side__fill[data-pct]").forEach((f) => {
        if (f.dataset.done === "1") return;
        f.style.width = f.dataset.pct + "%";
        f.dataset.done = "1";
      });
      document.querySelectorAll(".tally__seg[data-pct]").forEach((s) => {
        if (s.dataset.done === "1") return;
        s.style.width = s.dataset.pct + "%";
        s.dataset.done = "1";
      });
    });
  }

  /* ============================================================
     3. FULL CAREER TABLE
     ============================================================ */
  function renderCareerTable() {
    const t = $("#careerTable");
    t.innerHTML =
      `<caption>Full career table — Test, ODI and T20I, plus IPL. Dashes mean the figure is not recorded, or does not apply.</caption>
       <thead><tr><th scope="col">Metric</th>
         <th scope="col">MS Dhoni</th><th scope="col">Gautam Gambhir</th></tr></thead>`;

    const tbody = el("tbody");

    Object.entries(FORMATS).forEach(([key, f]) => {
      const grp = el("tr", "grp");
      const td = el("td", "", esc(f.label + (key === "ipl" ? " (franchise)" : " (international)")));
      td.colSpan = 3;
      grp.appendChild(td);
      tbody.appendChild(grp);

      METRICS.forEach((m) => {
        const dv = f.dhoni[m.key], gv = f.gambhir[m.key];
        if (dv === null && gv === null) return;
        if (m.key === "sr" && dv === null && gv === null) return;
        if (m.key === "stumpings" && !dv && !gv) return;
        const tr = el("tr");
        tr.appendChild(el("th", "", esc(m.label)));
        tr.firstChild.setAttribute("scope", "row");
        tr.firstChild.style.textAlign = "left";
        tr.firstChild.style.fontWeight = "500";
        tr.firstChild.style.color = "var(--muted)";
        tr.appendChild(el("td", "", m.fmt(dv)));
        tr.appendChild(el("td", "", m.fmt(gv)));
        tbody.appendChild(tr);
      });
    });

    t.appendChild(tbody);
  }

  /* ============================================================
     4. SCORECARD + TALLY
     ============================================================ */
  function renderScorecard() {
    const dWins = SCORECARD.filter((s) => s.winner === "dhoni").length;
    const gWins = SCORECARD.filter((s) => s.winner === "gambhir").length;
    const total = SCORECARD.length;

    const tally = $("#tally");
    tally.innerHTML = `
      <div>
        <div class="tally__num tally__num--d">${dWins}<span style="font-size:1rem;color:var(--muted)"> / ${total}</span></div>
        <div class="tally__label">MS Dhoni · ${dWins === 1 ? "category" : "categories"}</div>
      </div>
      <div class="tally__bar">
        <div class="tally__track">
          <div class="tally__seg tally__seg--d" data-pct="${(dWins / total) * 100}"></div>
          <div class="tally__seg tally__seg--g" data-pct="${(gWins / total) * 100}"></div>
        </div>
      </div>
      <div style="text-align:right">
        <div class="tally__num tally__num--g">${gWins}<span style="font-size:1rem;color:var(--muted)"> / ${total}</span></div>
        <div class="tally__label">Gautam Gambhir · ${gWins === 1 ? "category" : "categories"}</div>
      </div>`;

    const list = $("#scorecardList");
    list.innerHTML = "";
    SCORECARD.forEach((s) => {
      const card = el("article", "cat");
      card.style.setProperty("--accent", accentOf(s.winner));
      card.appendChild(el("div", "cat__top", `
        <span class="cat__name">${esc(s.cat)}</span>
        <span class="cat__winner">${esc(PLAYERS[s.winner].name)}</span>`));
      card.appendChild(el("p", "cat__why", esc(s.why)));
      list.appendChild(reveal(card));
    });

    animateFills();
    return { dWins, gWins, total };
  }

  /* ============================================================
     5. CAPTAINCY
     ============================================================ */
  function capCard(key) {
    const p = PLAYERS[key];
    const c = CAPTAINCY[key];
    const card = el("article", "cap");
    card.style.setProperty("--accent", p.accent);

    card.appendChild(el("h3", "cap__name",
      `<span class="cap__dot"></span>${esc(p.name)}`));

    card.appendChild(el("div", "cap__big", `
      <div class="cap__stat"><b>${fmtInt(c.total.mat)}</b><span>matches as captain</span></div>
      <div class="cap__stat"><b>${fmtInt(c.total.won)}</b><span>won</span></div>
      <div class="cap__stat"><b>${c.total.pct.toFixed(2)}%</b><span>win rate</span></div>`));

    const tbl = el("table");
    tbl.innerHTML = `<thead><tr>
        <th>Format</th><th>Mat</th><th>Won</th><th>Lost</th><th>Win %</th>
      </tr></thead>`;
    const tb = el("tbody");
    c.rows.forEach((r) => {
      const tr = el("tr");
      tr.innerHTML = `<td>${esc(r.type)}</td><td>${r.mat}</td><td>${r.won}</td><td>${r.lost}</td><td>${r.pct.toFixed(2)}</td>`;
      tb.appendChild(tr);
    });
    const tot = el("tr");
    tot.innerHTML = `<td>Total</td><td>${c.total.mat}</td><td>${c.total.won}</td><td>${c.total.lost}</td><td>${c.total.pct.toFixed(2)}</td>`;
    tb.appendChild(tot);
    tbl.appendChild(tb);
    card.appendChild(tbl);

    card.appendChild(el("p", "cap__note", esc(c.note)));
    if (c.caveat) card.appendChild(el("p", "cap__caveat", esc(c.caveat)));
    return card;
  }

  function renderCaptaincy() {
    const grid = $("#capGrid");
    grid.innerHTML = "";
    grid.appendChild(capCard("dhoni"));
    grid.appendChild(capCard("gambhir"));
  }

  /* ============================================================
     6. TROPHIES
     ============================================================ */
  function renderTrophies() {
    const grid = $("#trophyGrid");
    grid.innerHTML = "";
    Object.values(PLAYERS).forEach((p) => {
      const box = el("section", "trophies");
      box.style.setProperty("--accent", p.accent);
      const list = TROPHIES[p.key];

      box.appendChild(el("div", "trophies__head",
        `<span class="cap__dot"></span>${esc(p.name)}
         <span class="trophies__count">${list.length}</span>`));

      const ol = el("ol");
      list.forEach((x) => {
        const li = el("li");
        li.innerHTML = `<span class="yr">${esc(x.year)}</span>
                        <span>${esc(x.what)}</span>
                        <span class="rl">${esc(x.role)}</span>`;
        ol.appendChild(li);
      });
      box.appendChild(ol);
      grid.appendChild(box);
    });
  }

  /* ============================================================
     7. TIMELINE
     ============================================================ */
  function renderTimeline() {
    const ol = $("#timeline");
    ol.innerHTML = "";
    MOMENTS.forEach((m) => {
      const p = PLAYERS[m.who];
      const li = el("li");
      li.style.setProperty("--accent", p.accent);
      li.innerHTML = `<span class="yr">${esc(m.year)}</span>
                      <span class="who">${esc(p.name)}</span>
                      <span class="txt">${esc(m.text)}</span>`;
      ol.appendChild(reveal(li));
    });
  }

  /* ============================================================
     8. VERDICT
     ============================================================ */
  function renderVerdict(result) {
    const body = $("#verdictBody");
    const { dWins, gWins, total } = result;

    const dhoniCats = SCORECARD.filter((s) => s.winner === "dhoni").map((s) => s.cat);
    const gambhirCats = SCORECARD.filter((s) => s.winner === "gambhir").map((s) => s.cat);

    const lede = el("p", "verdict-lede");
    lede.innerHTML = `On this scorecard, <strong style="color:${accentOf("dhoni")}">MS Dhoni</strong> takes
      <strong>${dWins} of ${total}</strong> categories and
      <strong style="color:${accentOf("gambhir")}">Gautam Gambhir</strong> takes <strong>${gWins}</strong>.
      That is the honest shape of it — but the categories Gambhir wins are not consolation prizes.`;
    body.appendChild(lede);

    const b1 = el("div", "verdict-block");
    b1.style.setProperty("--accent", accentOf("dhoni"));
    b1.innerHTML = `<h3>Why Dhoni leads</h3>
      <p>Volume and longevity separate them, not peak skill. Dhoni played roughly twice as much international
      cricket as Gambhir and scored at a higher average in ODIs (50.57 v 39.68) and T20Is (37.60 v 27.41). He also
      kept wicket at the top level, adding 123 ODI stumpings and 321 catches to his batting — and he captained India
      332 times, winning all three ICC limited-overs trophies, a feat no other captain has matched.</p>
      <ul>${dhoniCats.map((c) => `<li>${esc(c)}</li>`).join("")}</ul>`;
    body.appendChild(b1);

    const b2 = el("div", "verdict-block");
    b2.style.setProperty("--accent", accentOf("gambhir"));
    b2.innerHTML = `<h3>Why Gambhir has a case</h3>
      <p>As a pure batter, Gambhir's Test record is the stronger of the two: 4,154 runs at 41.95 with nine centuries,
      including 445 runs in New Zealand in 2009. In the two finals that defined Indian white-ball cricket — 2007 and
      2011 — he made 75 and 97, and in 2011 his 97 off 122 was the innings that kept the chase alive before Dhoni
      finished it. As a captain he won all six ODIs he led, and as a coach he has already won a T20 World Cup, a
      Champions Trophy and an Asia Cup.</p>
      <ul>${gambhirCats.map((c) => `<li>${esc(c)}</li>`).join("")}</ul>`;
    body.appendChild(b2);

    const b3 = el("div", "verdict-block");
    b3.style.setProperty("--accent", "var(--muted)");
    b3.innerHTML = `<h3>The fair conclusion</h3>
      <p>These are not like-for-like cricketers. Gambhir was a specialist opening batter whose value was concentrated
      in a handful of enormous innings; Dhoni was a wicketkeeper-batter who also carried the captaincy for a decade.
      Compare them purely as Test batters and Gambhir wins. Compare whole careers — format, role, leadership,
      longevity — and Dhoni wins comfortably. The one thing both share is a place in the two finals that Indian fans
      will keep replaying: Gambhir built the innings, Dhoni finished it.</p>`;
    body.appendChild(b3);
  }

  /* ============================================================
     9. SOURCES
     ============================================================ */
  function renderSources() {
    $("#methodNote").innerHTML =
      `<strong>How this page was built.</strong> International career figures are final — both men have retired
       from international cricket — and are taken from the career-statistics and captaincy tables on their Wikipedia
       articles, which in turn cite ESPNcricinfo scorecards. IPL totals for MS Dhoni are current as of the 2026
       season and are taken from IPL player records; Gautam Gambhir's IPL playing career ended in 2018.
       Where sources disagreed on a rounding (win percentage, strike rate), the more specific figure is shown.
       The ten-category scorecard is an editorial judgement based on those numbers — it is not a statistic.`;

    const ul = $("#sourceList");
    ul.innerHTML = "";
    SOURCES.forEach((s) => {
      const li = el("li");
      const a = document.createElement("a");
      a.href = s.url; a.textContent = s.label;
      a.target = "_blank"; a.rel = "noopener noreferrer";
      li.appendChild(a);
      ul.appendChild(li);
    });

    $("#footData").textContent = META.dataThrough.replace(" season", "");
  }

  /* ============================================================
     BOOT
     ============================================================ */
  function init() {
    renderProfiles();
    renderTabs();
    renderCompare();
    renderCareerTable();
    const result = renderScorecard();
    renderCaptaincy();
    renderTrophies();
    renderTimeline();
    renderVerdict(result);
    renderSources();

    /* Reveal-on-scroll */
    if ("IntersectionObserver" in window) {
      const io = new IntersectionObserver((entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
        });
      }, { rootMargin: "0px 0px -8% 0px", threshold: 0.05 });
      revealTargets.forEach((t) => io.observe(t));
      /* Also reveal section wrappers */
      document.querySelectorAll(".section").forEach((s) => {
        s.classList.add("reveal"); io.observe(s);
      });
    } else {
      document.querySelectorAll(".reveal").forEach((n) => n.classList.add("in"));
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
