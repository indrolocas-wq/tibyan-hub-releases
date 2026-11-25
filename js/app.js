/* ==========================================================================
   Tibyan Hub — Official Public Showcase Application Logic
   Bilingual RTL/LTR Engine, Interactive Product Theater, Curriculum Matrix,
   Audience-Filtered FAQ, Promo Video Lightbox, and Live Releases Hydrator
   ========================================================================== */

(function () {
  "use strict";

  const DATA = window.TIBYAN_SITE_DATA;
  if (!DATA) return;

  const state = {
    lang: detectInitialLang(),
    activeTab: "study",
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

  function setText(id, val) {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
  }

  function renderAll() {
    const t = DATA[state.lang];
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
    setText("nav-curriculum", t.nav.curriculum);
    setText("nav-nour", t.nav.nour);
    setText("nav-audiences", t.nav.audiences);
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

    // Downloads
    setText("dl-kicker", t.downloads.kicker);
    setText("dl-title", t.downloads.title);
    setText("dl-desc", t.downloads.desc);
    renderDownloads();

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
    const allLink = document.getElementById("release-all-link");
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
        subs: [{ label: d.android.subAll, url: DATA.links.releasesPage }]
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
              <div class="os-sub-links">
                ${c.subs.map((s) => `<a href="${esc(s.url)}">${esc(s.label)}</a>`).join("")}
              </div>
            </div>
          </div>`;
      })
      .join("");

    if (statusEl) {
      statusEl.innerHTML = `${esc(d.liveStatusPrefix)} <strong class="mono">${esc(state.releaseTag)}</strong> · <span class="mono">${esc(state.releaseDate)}</span>`;
    }
    if (allLink) {
      allLink.textContent = d.allReleasesLink;
      allLink.href = DATA.links.releasesPage;
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
    } catch (_) {
      // Fallback URLs remain active offline or under API rate-limits
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

    // Mobile Navigation Menu
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

    // Sticky Header Shadow on Scroll
    const header = document.getElementById("site-header");
    window.addEventListener(
      "scroll",
      () => {
        if (header) header.classList.toggle("scrolled", window.scrollY > 12);
      },
      { passive: true }
    );

    // Promo Video Lightbox Modal
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
    hydrateLatestRelease();
  });
})();
