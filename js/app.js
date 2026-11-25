/* ==========================================================================
   Tibyan Hub — Official Public Showcase Application Logic (v2 Complete)
   Bilingual RTL/LTR Engine, 6-Tab Product Theater, 3-in-1 Live Playground,
   Curriculum & Comparison Matrices, 4-Stage Roadmap, Projector QR, & Releases
   ========================================================================== */

(function () {
  "use strict";

  const DATA = window.TIBYAN_SITE_DATA;
  const EXTRA = window.TIBYAN_EXTRA_DATA;
  if (!DATA || !EXTRA) return;

  const state = {
    lang: detectInitialLang(),
    activeTab: "study",
    playMode: "terms",
    termIndex: 0,
    termQuery: "",
    bugIndex: 0,
    quizSelected: null,
    activeSem: "s1",
    faqFilter: "all",
    detectedOs: detectVisitorOs(),
    releaseTag: "v" + DATA.links.fallbackDesktopVer,
    releaseDate: "2026-11-22",
    assets: Object.assign({}, DATA.links.fallbackAssets)
  };

  function detectInitialLang() {
    const params = new URLSearchParams(window.location.search);
    const q = params.get("lang");
    if (q === "en" || q === "ar") return q;
    try {
      const saved = localStorage.getItem("tibyan_site_lang");
      if (saved === "en" || saved === "ar") return saved;
    } catch (_) {}
    return "ar";
  }

  function detectVisitorOs() {
    const ua = (navigator.userAgent || "").toLowerCase();
    if (ua.includes("android")) return "android";
    if (ua.includes("linux") && !ua.includes("android")) return "linux";
    if (ua.includes("win")) return "win";
    return "win";
  }

  function esc(str) {
    const d = document.createElement("div");
    d.textContent = str == null ? "" : String(str);
    return d.innerHTML;
  }

  function normSearch(s) {
    return String(s || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f\u064B-\u065F\u0670]/g, "")
      .replace(/[أإآ]/g, "ا")
      .trim();
  }

  function setText(id, val) {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
  }

  function renderProjectorQr() {
    const box = document.getElementById("projector-qr-svg");
    if (!box || !EXTRA.qrMatrix) return;
    const mat = EXTRA.qrMatrix;
    const n = mat.length;
    let rects = "";
    for (let y = 0; y < n; y++) {
      for (let x = 0; x < n; x++) {
        if (mat[y][x]) {
          rects += `<rect x="${x}" y="${y}" width="1.03" height="1.03" fill="#111419"/>`;
        }
      }
    }
    box.innerHTML = `<svg viewBox="0 0 ${n} ${n}" width="96" height="96" shape-rendering="crispEdges" role="img" aria-label="QR Code">${rects}</svg>`;
  }

  function renderAll() {
    const t = DATA[state.lang];
    const ex = EXTRA[state.lang];
    const html = document.documentElement;
    html.lang = state.lang;
    html.dir = state.lang === "ar" ? "rtl" : "ltr";

    document.title = t.metaTitle;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute("content", t.metaDesc);

    // Header
    setText("brand-title", t.brandTitle);
    setText("brand-sub", t.brandSub);
    setText("nav-product", t.nav.product);
    setText("nav-playground", ex.navPlayground);
    setText("nav-curriculum", t.nav.curriculum);
    setText("nav-audiences", t.nav.audiences);
    setText("nav-roadmap", ex.navRoadmap);
    setText("nav-pricing", t.nav.pricing);
    setText("nav-faq", t.nav.faq);
    setText("header-download-cta", t.nav.downloadCta);
    setText("lang-toggle-btn", t.langToggleLabel);

    // Hero
    setText("hero-eyebrow-text", t.hero.eyebrow);
    setText("hero-title", t.hero.title);
    setText("hero-lead", t.hero.lead);
    setText("hero-primary-cta-label", t.hero.primaryCta);
    setText("hero-video-cta-label", t.hero.videoCta);
    setText("hero-window-caption", t.hero.windowCaption);

    const heroDesktopImg = document.getElementById("hero-desktop-img");
    const heroPhoneImg = document.getElementById("hero-phone-img");
    if (heroDesktopImg) {
      heroDesktopImg.src = `assets/screens/${state.lang}/study-dark.webp`;
      heroDesktopImg.alt = t.hero.windowCaption;
    }
    if (heroPhoneImg) {
      heroPhoneImg.src = `assets/screens/${state.lang}/phone-today.webp`;
      heroPhoneImg.alt = state.lang === "ar" ? "تطبيق تبيان هب على أندرويد" : "Tibyan Hub Android Companion";
    }

    const checksWrap = document.getElementById("hero-checks");
    if (checksWrap) {
      checksWrap.innerHTML = t.hero.checks
        .map((c) => `<span class="hero-meta-item"><span class="meta-check" aria-hidden="true">✓</span> ${esc(c)}</span>`)
        .join("");
    }

    // Verified Facts Strip
    const factsWrap = document.getElementById("facts-strip");
    if (factsWrap) {
      factsWrap.innerHTML = t.facts
        .map(
          (f) => `
          <div class="fact-item">
            <div class="fact-num mono">${esc(f.num)}</div>
            <div class="fact-label">${esc(f.label)}</div>
          </div>`
        )
        .join("");
    }

    // Theater
    setText("theater-kicker", t.theater.kicker);
    setText("theater-title", t.theater.title);
    setText("theater-desc", t.theater.desc);
    renderTheater();

    // Live Playground
    setText("play-kicker", ex.playground.kicker);
    setText("play-title", ex.playground.title);
    setText("play-desc", ex.playground.desc);
    renderPlayground();

    // Nour & Privacy
    setText("nour-kicker", t.nour.kicker);
    setText("nour-title", t.nour.title);
    setText("nour-desc", t.nour.desc);
    const nourPillars = document.getElementById("nour-pillars");
    if (nourPillars) {
      nourPillars.innerHTML = t.nour.pillars
        .map(
          (p) => `
          <div class="pillar-row">
            <h3>${esc(p.title)}</h3>
            <p>${esc(p.body)}</p>
          </div>`
        )
        .join("");
    }
    setText("ledger-title", t.nour.ledgerTitle);
    setText("ledger-sub", t.nour.ledgerSub);
    const ledgerRows = document.getElementById("ledger-rows");
    if (ledgerRows) {
      ledgerRows.innerHTML = t.nour.ledgerRows
        .map(
          (r) => `
          <div class="ledger-item">
            <span class="ledger-key">${esc(r.k)}</span>
            <span class="ledger-val">${esc(r.v)}</span>
          </div>`
        )
        .join("");
    }

    // Curriculum
    setText("curr-kicker", t.curriculum.kicker);
    setText("curr-title", t.curriculum.title);
    setText("curr-desc", t.curriculum.desc);
    setText("sem-btn-s1", t.curriculum.s1Btn);
    setText("sem-btn-s2", t.curriculum.s2Btn);
    setText("curr-honesty-note", t.curriculum.honestyNote);
    renderCurriculum();

    // Comparison Matrix
    setText("comp-kicker", ex.comparison.kicker);
    setText("comp-title", ex.comparison.title);
    setText("comp-desc", ex.comparison.desc);
    renderComparison();

    // Stakeholders
    setText("stake-kicker", t.stakeholders.kicker);
    setText("stake-title", t.stakeholders.title);
    setText("stake-desc", t.stakeholders.desc);
    const stakeGrid = document.getElementById("stakeholder-grid");
    if (stakeGrid) {
      stakeGrid.innerHTML = t.stakeholders.cards
        .map((c, idx) => {
          const href = c.ctaHref
            ? c.ctaHref
            : `mailto:${DATA.links.email}?subject=${encodeURIComponent(c.ctaSubject || "Tibyan Hub")}`;
          return `
            <article class="stakeholder-card" id="stakeholder-card-${idx}">
              <div>
                <span class="stakeholder-role">${esc(c.role)}</span>
                <h3>${esc(c.title)}</h3>
                <p class="stakeholder-lead">${esc(c.lead)}</p>
                <ul class="stakeholder-list">
                  ${c.points.map((pt) => `<li>${esc(pt)}</li>`).join("")}
                </ul>
              </div>
              <a class="btn btn-secondary" href="${esc(href)}">${esc(c.ctaLabel)}</a>
            </article>`;
        })
        .join("");
    }

    // Roadmap
    setText("road-kicker", ex.roadmap.kicker);
    setText("road-title", ex.roadmap.title);
    setText("road-desc", ex.roadmap.desc);
    const roadGrid = document.getElementById("roadmap-grid");
    if (roadGrid) {
      roadGrid.innerHTML = ex.roadmap.steps
        .map((s) => {
          const cls = s.tone === "ready" ? "status-ready" : s.tone === "partial" ? "status-partial" : "status-prep";
          return `
            <div class="roadmap-step">
              <span class="roadmap-phase ${cls}">${esc(s.phase)}</span>
              <h3>${esc(s.title)}</h3>
              <p>${esc(s.body)}</p>
            </div>`;
        })
        .join("");
    }

    // Pricing & Grants
    setText("pricing-kicker", t.pricing.kicker);
    setText("pricing-title", t.pricing.title);
    setText("pricing-desc", t.pricing.desc);
    setText("taco-title", t.pricing.tacoTitle);
    setText("taco-price", t.pricing.price);
    setText("taco-currency", t.pricing.currency);
    setText("taco-quote", t.pricing.quote);
    const tacoPerks = document.getElementById("taco-perks");
    if (tacoPerks) {
      tacoPerks.innerHTML = t.pricing.perks
        .map((p) => `<li><span class="point-mark" aria-hidden="true">✓</span> <span>${esc(p)}</span></li>`)
        .join("");
    }
    const buyBtn = document.getElementById("taco-buy-btn");
    if (buyBtn) {
      buyBtn.textContent = t.pricing.buyLabel;
      buyBtn.href = DATA.links.facebook;
    }

    setText("trial-box-title", t.pricing.trialBox.title);
    setText("trial-box-body", t.pricing.trialBox.body);
    setText("trial-box-cta", t.pricing.trialBox.cta);

    setText("grant-box-title", t.pricing.grantBox.title);
    setText("grant-box-body", t.pricing.grantBox.body);
    const grantBtn = document.getElementById("grant-box-cta");
    if (grantBtn) {
      grantBtn.textContent = t.pricing.grantBox.cta;
      grantBtn.href = DATA.links.facebook;
    }

    setText("custom-box-title", t.pricing.customBox.title);
    setText("custom-box-body", t.pricing.customBox.body);
    const customBtn = document.getElementById("custom-box-cta");
    if (customBtn) {
      customBtn.textContent = t.pricing.customBox.cta;
      customBtn.href = `mailto:${DATA.links.email}?subject=${encodeURIComponent(
        state.lang === "ar" ? "تواصل (أساتذة / شراكات / استثمار) — تبيان هب" : "Faculty / Partnership / Investor Inquiry — Tibyan Hub"
      )}`;
    }

    // FAQ
    setText("faq-kicker", t.faq.kicker);
    setText("faq-title", t.faq.title);
    renderFaq();

    // Downloads & QR Banner
    setText("dl-kicker", t.downloads.kicker);
    setText("dl-title", t.downloads.title);
    setText("dl-desc", t.downloads.desc);
    setText("qr-banner-title", ex.qrBanner.title);
    setText("qr-banner-sub", ex.qrBanner.sub);
    renderDownloads();
    renderProjectorQr();

    // Contact & Footer
    setText("contact-kicker", t.contact.kicker);
    setText("contact-title", t.contact.title);
    setText("contact-desc", t.contact.desc);
    setText("contact-email-title", t.contact.emailTitle);
    setText("contact-email-desc", t.contact.emailDesc);
    setText("contact-fb-title", t.contact.fbTitle);
    setText("contact-fb-desc", t.contact.fbDesc);
    setText("footer-disclaimer", t.footer.disclaimer);
    setText("footer-copyright", t.footer.copyright);

    // Modal
    setText("video-modal-title", t.modal.title);
    setText("video-modal-close", t.modal.close);
  }

  function renderTheater() {
    const t = DATA[state.lang].theater;
    const tabsBar = document.getElementById("theater-tabs");
    const panel = document.getElementById("theater-panel");
    if (!tabsBar || !panel) return;

    tabsBar.innerHTML = t.tabs
      .map(
        (tab) => `
        <button
          type="button"
          role="tab"
          id="tab-btn-${esc(tab.id)}"
          class="theater-tab"
          aria-selected="${tab.id === state.activeTab ? "true" : "false"}"
          aria-controls="theater-panel"
          data-tab="${esc(tab.id)}"
        >${esc(tab.tabLabel)}</button>`
      )
      .join("");

    const cur = t.tabs.find((x) => x.id === state.activeTab) || t.tabs[0];
    let screenHtml = "";
    if (cur.layout === "phones") {
      screenHtml = `
        <div class="theater-screen-frame is-phone-pair">
          <div class="theater-phone-card">
            <img src="assets/screens/${state.lang}/${esc(cur.screen)}.webp" alt="${esc(cur.heading)}" loading="lazy" />
          </div>
          <div class="theater-phone-card">
            <img src="assets/screens/${state.lang}/${esc(cur.screenSecondary)}.webp" alt="${esc(cur.tabLabel)}" loading="lazy" />
          </div>
        </div>`;
    } else {
      screenHtml = `
        <div class="theater-screen-frame">
          <div class="window-bar">
            <span class="mono">Tibyan Hub · ${esc(cur.id)}</span>
            <span class="window-controls" aria-hidden="true">─  □  ×</span>
          </div>
          <img src="assets/screens/${state.lang}/${esc(cur.screen)}.webp" alt="${esc(cur.heading)}" loading="lazy" />
        </div>`;
    }

    panel.innerHTML = `
      <div class="theater-copy">
        <span class="theater-badge">${esc(cur.badge)}</span>
        <h3 class="theater-heading">${esc(cur.heading)}</h3>
        <p class="theater-body">${esc(cur.body)}</p>
        <ul class="theater-points">
          ${cur.points.map((pt) => `<li><span class="point-mark" aria-hidden="true">◆</span> <span>${esc(pt)}</span></li>`).join("")}
        </ul>
      </div>
      <div class="theater-screen-wrap">
        ${screenHtml}
      </div>`;

    tabsBar.querySelectorAll(".theater-tab").forEach((btn) => {
      btn.addEventListener("click", () => {
        state.activeTab = btn.getAttribute("data-tab");
        renderTheater();
      });
    });
  }

  function renderPlayground() {
    const p = EXTRA[state.lang].playground;
    const modesEl = document.getElementById("play-modes");
    const shell = document.getElementById("play-shell");
    if (!modesEl || !shell) return;

    modesEl.innerHTML = p.modes
      .map(
        (m) => `
        <button
          type="button"
          role="tab"
          id="play-mode-${esc(m.id)}"
          class="lab-mode-btn"
          aria-selected="${m.id === state.playMode ? "true" : "false"}"
          data-mode="${esc(m.id)}"
        >${esc(m.label)}</button>`
      )
      .join("");

    modesEl.querySelectorAll(".lab-mode-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        state.playMode = btn.getAttribute("data-mode");
        renderPlayground();
      });
    });

    if (state.playMode === "terms") {
      const q = normSearch(state.termQuery);
      const filtered = p.terms
        .map((item, idx) => ({ item, idx }))
        .filter(({ item }) => {
          if (!q) return true;
          const hay = normSearch(`${item.ar} ${item.en} ${item.fr} ${item.def}`);
          return hay.includes(q);
        });
      const activeIdx = filtered.some((x) => x.idx === state.termIndex)
        ? state.termIndex
        : filtered.length
        ? filtered[0].idx
        : 0;
      const cur = p.terms[activeIdx] || p.terms[0];

      shell.innerHTML = `
        <div class="term-explorer-grid">
          <div>
            <input
              type="search"
              class="term-search-input"
              id="live-term-search"
              placeholder="${esc(p.searchPlaceholder)}"
              value="${esc(state.termQuery)}"
            />
            <div class="term-chips-list" id="live-term-list">
              ${filtered
                .map(
                  ({ item, idx }) => `
                  <button type="button" class="term-chip-btn ${idx === activeIdx ? "active" : ""}" data-tidx="${idx}">
                    <span class="term-chip-ar">${esc(item.ar)}</span>
                    <span class="term-chip-lat">${esc(item.en)} · ${esc(item.fr)}</span>
                  </button>`
                )
                .join("")}
            </div>
          </div>
          <div class="term-detail-card">
            <span class="term-subj-tag">${esc(cur.subj)}</span>
            <div class="term-tri-head">
              <span class="term-tri-ar">${esc(cur.ar)}</span>
              <span class="term-tri-en">EN: ${esc(cur.en)}</span>
              <span class="term-tri-fr">FR: ${esc(cur.fr)}</span>
            </div>
            <p class="term-def-text">${esc(cur.def)}</p>
            <div class="term-example-box">${esc(cur.ex)}</div>
          </div>
        </div>`;

      const inp = document.getElementById("live-term-search");
      if (inp) {
        inp.addEventListener("input", (e) => {
          state.termQuery = e.target.value;
          const pos = e.target.selectionStart;
          renderPlayground();
          const nextInp = document.getElementById("live-term-search");
          if (nextInp) {
            nextInp.focus();
            try { nextInp.setSelectionRange(pos, pos); } catch (_) {}
          }
        });
      }
      shell.querySelectorAll(".term-chip-btn").forEach((b) => {
        b.addEventListener("click", () => {
          state.termIndex = Number(b.getAttribute("data-tidx")) || 0;
          renderPlayground();
        });
      });
    } else if (state.playMode === "bugs") {
      const bug = p.bugs[state.bugIndex] || p.bugs[0];
      shell.innerHTML = `
        <div class="bug-picker-row">
          ${p.bugs
            .map(
              (b, idx) => `
              <button type="button" class="bug-pill ${idx === state.bugIndex ? "active" : ""}" data-bidx="${idx}">
                ${esc(b.title)}
              </button>`
            )
            .join("")}
        </div>
        <div class="bug-workbench">
          <div class="code-editor-pane" aria-label="Code Sample">
            ${bug.lines
              .map(
                (ln, idx) => `
                <div class="code-line ${idx + 1 === bug.bugLine ? "is-bug" : ""}">
                  <span class="code-ln">${idx + 1}</span>
                  <span>${esc(ln)}</span>
                </div>`
              )
              .join("")}
          </div>
          <div class="evidence-pane">
            <div class="evidence-card">
              <span class="evidence-tag">${esc(bug.badge)}</span>
              <h3 style="font-size: 1.04rem; margin-bottom: 6px;">${esc(bug.ruleTitle)}</h3>
              <p style="font-size: 0.92rem; color: var(--ink-700); line-height: 1.7;">${esc(bug.ruleBody)}</p>
            </div>
            <div class="nour-socratic-box">
              <span class="nour-socratic-label">✦ ${esc(bug.nourLabel)}</span>
              <p>${esc(bug.nourPrompt)}</p>
            </div>
          </div>
        </div>`;

      shell.querySelectorAll(".bug-pill").forEach((b) => {
        b.addEventListener("click", () => {
          state.bugIndex = Number(b.getAttribute("data-bidx")) || 0;
          renderPlayground();
        });
      });
    } else {
      const qz = p.quiz;
      const chosen = qz.options.find((o) => o.id === state.quizSelected) || null;
      shell.innerHTML = `
        <div class="quiz-box">
          <h3 class="quiz-q-title">${esc(qz.question)}</h3>
          <div class="quiz-options">
            ${qz.options
              .map((opt) => {
                let cls = "";
                if (state.quizSelected === opt.id) {
                  cls =
                    opt.kind === "correct"
                      ? "selected-correct"
                      : opt.kind === "unsure"
                      ? "selected-unsure"
                      : "selected-wrong";
                }
                return `<button type="button" class="quiz-opt-btn ${cls}" data-qid="${esc(opt.id)}">${esc(opt.text)}</button>`;
              })
              .join("")}
          </div>
          ${chosen ? `<div class="quiz-feedback" role="status">${esc(chosen.feedback)}</div>` : ""}
        </div>`;

      shell.querySelectorAll(".quiz-opt-btn").forEach((b) => {
        b.addEventListener("click", () => {
          state.quizSelected = b.getAttribute("data-qid");
          renderPlayground();
        });
      });
    }
  }

  function renderCurriculum() {
    const c = DATA[state.lang].curriculum;
    const btnS1 = document.getElementById("sem-btn-s1");
    const btnS2 = document.getElementById("sem-btn-s2");
    if (btnS1) btnS1.setAttribute("aria-selected", state.activeSem === "s1" ? "true" : "false");
    if (btnS2) btnS2.setAttribute("aria-selected", state.activeSem === "s2" ? "true" : "false");

    const thead = document.getElementById("curr-thead");
    const tbody = document.getElementById("curr-tbody");
    if (!thead || !tbody) return;

    thead.innerHTML = `<tr>${c.cols.map((col) => `<th scope="col">${esc(col)}</th>`).join("")}</tr>`;
    const rows = state.activeSem === "s1" ? c.s1Rows : c.s2Rows;
    tbody.innerHTML = rows
      .map((r) => {
        const cls = r.tone === "ready" ? "status-ready" : r.tone === "partial" ? "status-partial" : "status-prep";
        const dot = r.tone === "ready" ? "✓" : r.tone === "partial" ? "◐" : "◷";
        return `
          <tr>
            <td class="mono">${esc(r.unit)}</td>
            <td>
              <span class="subj-name">${esc(r.name)}</span>
              <span class="subj-fr bdi-iso">${esc(r.fr)}</span>
            </td>
            <td>${esc(r.cr)}</td>
            <td>${esc(r.items)}</td>
            <td><span class="status-tag ${cls}">${dot} ${esc(r.status)}</span></td>
          </tr>`;
      })
      .join("");
  }

  function renderComparison() {
    const comp = EXTRA[state.lang].comparison;
    const thead = document.getElementById("comp-thead");
    const tbody = document.getElementById("comp-tbody");
    if (!thead || !tbody) return;

    thead.innerHTML = `<tr>${comp.cols.map((col) => `<th scope="col">${esc(col)}</th>`).join("")}</tr>`;
    tbody.innerHTML = comp.rows
      .map(
        (r) => `
        <tr>
          <td><strong>${esc(r[0])}</strong></td>
          <td>${esc(r[1])}</td>
          <td>${esc(r[2])}</td>
          <td>✓ ${esc(r[3])}</td>
        </tr>`
      )
      .join("");
  }

  function renderFaq() {
    const f = DATA[state.lang].faq;
    const filterWrap = document.getElementById("faq-filters");
    const listWrap = document.getElementById("faq-list");
    if (!filterWrap || !listWrap) return;

    filterWrap.innerHTML = f.filters
      .map(
        (fl) => `
        <button
          type="button"
          id="faq-filter-${esc(fl.id)}"
          class="faq-filter-btn"
          aria-pressed="${fl.id === state.faqFilter ? "true" : "false"}"
          data-filter="${esc(fl.id)}"
        >${esc(fl.label)}</button>`
      )
      .join("");

    filterWrap.querySelectorAll(".faq-filter-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        state.faqFilter = btn.getAttribute("data-filter");
        renderFaq();
      });
    });

    const visible = f.items.filter((item) => state.faqFilter === "all" || item.aud === state.faqFilter);
    listWrap.innerHTML = visible
      .map(
        (item, idx) => `
        <details class="faq-item" id="faq-item-${idx}" ${idx === 0 ? "open" : ""}>
          <summary class="faq-q">
            <span class="faq-q-left">
              <span class="faq-aud-tag">${esc(f.audLabels[item.aud] || "")}</span>
              <span>${esc(item.q)}</span>
            </span>
            <span class="faq-chevron" aria-hidden="true">+</span>
          </summary>
          <div class="faq-a">${esc(item.a)}</div>
        </details>`
      )
      .join("");
  }

  function renderDownloads() {
    const d = DATA[state.lang].downloads;
    const grid = document.getElementById("download-grid");
    const statusEl = document.getElementById("release-live-status");
    if (!grid) return;

    const cards = [
      {
        key: "win",
        name: d.win.name,
        req: d.win.req,
        primaryLabel: d.win.primary,
        primaryUrl: state.assets.winSetupX64,
        subs: [
          { label: d.win.subPort, url: state.assets.winPortX64 },
          { label: d.win.subArm, url: state.assets.winSetupArm }
        ]
      },
      {
        key: "linux",
        name: d.linux.name,
        req: d.linux.req,
        primaryLabel: d.linux.primary,
        primaryUrl: state.assets.linuxDebX64,
        subs: [
          { label: d.linux.subAppImage, url: state.assets.linuxAppImageX64 },
          { label: d.linux.subArm, url: state.assets.linuxDebArm }
        ]
      },
      {
        key: "android",
        name: d.android.name,
        req: d.android.req,
        primaryLabel: d.android.primary,
        primaryUrl: state.assets.androidApk,
        subs: []
      }
    ];

    grid.innerHTML = cards
      .map((c) => {
        const isRec = c.key === state.detectedOs;
        return `
          <div class="os-card ${isRec ? "detected-os" : ""}" id="os-card-${c.key}">
            <div class="os-top">
              <div class="os-badge-row">
                <span class="os-name mono">${esc(c.name)}</span>
                ${isRec ? `<span class="os-rec-tag">${esc(d.recommendedBadge)}</span>` : ""}
              </div>
              <p class="os-req">${esc(c.req)}</p>
            </div>
            <div class="os-links">
              <a class="btn ${isRec ? "btn-brass" : "btn-ghost-dark"}" href="${esc(c.primaryUrl)}" id="dl-primary-${c.key}">
                ${esc(c.primaryLabel)}
              </a>
              ${c.subs.length ? `<div class="os-sub-links">${c.subs.map((s) => `<a href="${esc(s.url)}">${esc(s.label)}</a>`).join("")}</div>` : ""}
            </div>
          </div>`;
      })
      .join("");

    if (statusEl) {
      statusEl.innerHTML = `${esc(d.liveStatusPrefix)} <strong class="mono">${esc(state.releaseTag)}</strong> · <span class="mono">${esc(state.releaseDate)}</span>`;
    }
  }

  async function hydrateLatestRelease() {
    try {
      const res = await fetch(DATA.links.releasesApi, { headers: { Accept: "application/vnd.github+json" } });
      if (!res.ok) return;
      const json = await res.json();
      if (json.tag_name) state.releaseTag = json.tag_name;
      if (json.published_at) state.releaseDate = String(json.published_at).slice(0, 10);

      const assets = Array.isArray(json.assets) ? json.assets : [];
      const findUrl = (re) => {
        const hit = assets.find((a) => re.test(a.name || ""));
        return hit ? hit.browser_download_url : null;
      };

      state.assets.winSetupX64 = findUrl(/x64-setup\.exe$/i) || state.assets.winSetupX64;
      state.assets.winPortX64 = findUrl(/x64-portable\.exe$/i) || state.assets.winPortX64;
      state.assets.winSetupArm = findUrl(/arm64-setup\.exe$/i) || state.assets.winSetupArm;
      state.assets.linuxDebX64 = findUrl(/amd64\.deb$/i) || state.assets.linuxDebX64;
      state.assets.linuxAppImageX64 = findUrl(/x86_64\.AppImage$/i) || state.assets.linuxAppImageX64;
      state.assets.linuxDebArm = findUrl(/arm64\.deb$/i) || state.assets.linuxDebArm;
      state.assets.androidApk = findUrl(/\.apk$/i) || state.assets.androidApk;

      renderDownloads();
    } catch (_) {}
  }

  function initScrollAndReveal() {
    const header = document.getElementById("site-header");
    const prog = document.getElementById("scroll-progress-bar");

    function onScroll() {
      const y = window.scrollY;
      if (header) header.classList.toggle("scrolled", y > 12);
      if (prog) {
        const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
        prog.style.width = `${Math.min(100, Math.max(0, (y / max) * 100)).toFixed(1)}%`;
      }
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    if ("IntersectionObserver" in window) {
      const revObs = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) {
              e.target.classList.add("is-visible");
              revObs.unobserve(e.target);
            }
          });
        },
        { threshold: 0.08 }
      );
      document.querySelectorAll(".reveal-block").forEach((el) => revObs.observe(el));

      const navLinks = Array.from(document.querySelectorAll(".main-nav .nav-link"));
      const secObs = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting && e.target.id) {
              navLinks.forEach((lnk) => {
                lnk.classList.toggle("is-active", lnk.getAttribute("href") === `#${e.target.id}`);
              });
            }
          });
        },
        { rootMargin: "-35% 0px -55% 0px" }
      );
      ["product", "playground", "curriculum", "audiences", "roadmap", "pricing", "faq"].forEach((id) => {
        const el = document.getElementById(id);
        if (el) secObs.observe(el);
      });
    } else {
      document.querySelectorAll(".reveal-block").forEach((el) => el.classList.add("is-visible"));
    }
  }

  function initEvents() {
    const langBtn = document.getElementById("lang-toggle-btn");
    if (langBtn) {
      langBtn.addEventListener("click", () => {
        state.lang = state.lang === "ar" ? "en" : "ar";
        try {
          localStorage.setItem("tibyan_site_lang", state.lang);
        } catch (_) {}
        const url = new URL(window.location.href);
        url.searchParams.set("lang", state.lang);
        window.history.replaceState({}, "", url.toString());
        renderAll();
      });
    }

    const semS1 = document.getElementById("sem-btn-s1");
    const semS2 = document.getElementById("sem-btn-s2");
    if (semS1) {
      semS1.addEventListener("click", () => {
        state.activeSem = "s1";
        renderCurriculum();
      });
    }
    if (semS2) {
      semS2.addEventListener("click", () => {
        state.activeSem = "s2";
        renderCurriculum();
      });
    }

    const menuBtn = document.getElementById("mobile-menu-btn");
    const mainNav = document.getElementById("main-nav");
    if (menuBtn && mainNav) {
      menuBtn.addEventListener("click", () => {
        const open = mainNav.classList.toggle("open");
        menuBtn.setAttribute("aria-expanded", open ? "true" : "false");
      });
      mainNav.querySelectorAll("a").forEach((a) => {
        a.addEventListener("click", () => {
          mainNav.classList.remove("open");
          menuBtn.setAttribute("aria-expanded", "false");
        });
      });
    }

    const openVideoBtn = document.getElementById("hero-video-cta");
    const modal = document.getElementById("video-modal");
    const closeBtn = document.getElementById("video-modal-close");
    const player = document.getElementById("promo-video-player");

    function openModal() {
      if (!modal || !player) return;
      const wantedSrc = `assets/video/promo_${state.lang}.mp4`;
      if (player.getAttribute("data-src") !== wantedSrc) {
        player.src = wantedSrc;
        player.setAttribute("data-src", wantedSrc);
      }
      modal.setAttribute("aria-hidden", "false");
      player.play().catch(() => {});
      closeBtn && closeBtn.focus();
    }

    function closeModal() {
      if (!modal || !player) return;
      player.pause();
      modal.setAttribute("aria-hidden", "true");
    }

    if (openVideoBtn) openVideoBtn.addEventListener("click", openModal);
    if (closeBtn) closeBtn.addEventListener("click", closeModal);
    if (modal) {
      modal.addEventListener("click", (e) => {
        if (e.target === modal) closeModal();
      });
    }
    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && modal && modal.getAttribute("aria-hidden") === "false") {
        closeModal();
      }
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    initEvents();
    renderAll();
    initScrollAndReveal();
    hydrateLatestRelease();
  });
})();
