/* ============================================================
   DANHA HOME — ui.js
   header / nav / mega-menu / mobile-nav / top-band
   ============================================================ */

window.initUI = function initUI() {
  initHeaderScroll();
  initMegaNav();
  initMobileNav();
  initTopBand();
  initBestsellerClock();
};

/* ---------- Header scroll state ---------- */
function initHeaderScroll() {
  const header = document.querySelector(".header");
  if (!header) return;

  let ticking = false;
  const update = () => {
    header.classList.toggle("is-scrolled", window.scrollY > 4);
    ticking = false;
  };
  const onScroll = () => {
    if (ticking) return;
    requestAnimationFrame(update);
    ticking = true;
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  update();
}

/* ---------- Mega navigation (desktop hover/focus) ---------- */
function initMegaNav() {
  const items = document.querySelectorAll(".nav-item");
  if (!items.length) return;

  items.forEach((item) => {
    const trigger = item.querySelector(".nav-item__trigger");
    if (!trigger) return;

    const close = () => {
      item.classList.remove("is-open");
      trigger.setAttribute("aria-expanded", "false");
    };
    const open = () => {
      items.forEach((other) => {
        if (other !== item) {
          other.classList.remove("is-open");
          const t = other.querySelector(".nav-item__trigger");
          if (t) t.setAttribute("aria-expanded", "false");
        }
      });
      item.classList.add("is-open");
      trigger.setAttribute("aria-expanded", "true");
    };

    item.addEventListener("mouseenter", open);
    item.addEventListener("mouseleave", close);
    trigger.addEventListener("focus", open);
    item.addEventListener("focusout", (e) => {
      if (!item.contains(e.relatedTarget)) close();
    });
  });
}

/* ---------- Mobile navigation ---------- */
function initMobileNav() {
  const toggle = document.querySelector(".mobile-toggle");
  const panel = document.getElementById("mobile-panel");
  const dim = document.getElementById("mobile-dim");
  if (!toggle || !panel) return;

  const close = () => {
    toggle.setAttribute("aria-expanded", "false");
    panel.hidden = true;
    if (dim) dim.hidden = true;
    document.body.classList.remove("is-nav-open");
  };
  const open = () => {
    toggle.setAttribute("aria-expanded", "true");
    panel.hidden = false;
    if (dim) dim.hidden = false;
    document.body.classList.add("is-nav-open");
  };

  toggle.addEventListener("click", () => {
    toggle.getAttribute("aria-expanded") === "true" ? close() : open();
  });
  if (dim) dim.addEventListener("click", close);
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !panel.hidden) close();
  });
  window.addEventListener("resize", () => {
    if (window.innerWidth > 1024 && !panel.hidden) close();
  });
}

/* ---------- Top band rotation + dismiss ---------- */
function initTopBand() {
  const band = document.querySelector(".top-band");
  const text = document.getElementById("top-band-text");
  const closeBtn = document.getElementById("top-band-close");
  const STORAGE_KEY = "danha_top_band_dismissed";

  const isDismissed = () => {
    try { return localStorage.getItem(STORAGE_KEY) === "1"; } catch { return false; }
  };

  if (!band) return;
  if (isDismissed()) { band.hidden = true; return; }

  let timer = null;
  if (text) {
    const messages = [
      "단하 뉴 시즌 오픈 · 첫 구매 10% · 스타일 테스트 완료 시 추가 쿠폰",
      "오늘 뭐 입지? · 상황 기반 추천으로 10초 만에 스타일 찾기",
      "코디 그대로 구매 · 상세에서 코디 점수와 추천 이유 확인",
    ];
    let i = 0;
    timer = setInterval(() => {
      text.classList.add("is-fading");
      setTimeout(() => {
        i = (i + 1) % messages.length;
        text.textContent = messages[i];
        text.classList.remove("is-fading");
      }, 180);
    }, 3400);
  }

  if (closeBtn) {
    closeBtn.addEventListener("click", () => {
      band.hidden = true;
      try { localStorage.setItem(STORAGE_KEY, "1"); } catch {}
      if (timer) clearInterval(timer);
    });
  }
}

/* ---------- Bestseller updated time ---------- */
function initBestsellerClock() {
  const el = document.getElementById("bestseller-updated-time");
  if (!el) return;
  const update = () => {
    const d = new Date();
    const hh = String(d.getHours()).padStart(2, "0");
    const mm = String(d.getMinutes()).padStart(2, "0");
    el.textContent = `${hh}:${mm}`;
    el.setAttribute("datetime", d.toISOString());
  };
  update();
  setInterval(update, 60 * 1000);
}
/* ============================================================
   DANHA HOME — interaction.js
   reveal-on-scroll · clickable cards · style-result sort · newsletter
   ============================================================ */

window.initInteraction = function initInteraction() {
  initRevealOnScroll();
  initClickableCards();
  initStyleResultSort();
  initNewsletterForm();
};

/* ---------- Reveal on scroll (10% interaction) ---------- */
function initRevealOnScroll() {
  if (!("IntersectionObserver" in window)) return;

  // auto-decorate: section text-wrap, content__media, card-list
  document.querySelectorAll(
    ".section .text-wrap, .section .content__media, .card-list"
  ).forEach((el) => {
    if (!el.classList.contains("fade-up")) el.classList.add("fade-up");
  });

  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible", "is-revealed");
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });

  document.querySelectorAll(".fade-up, [data-reveal]").forEach((el) => io.observe(el));
}

/* ---------- Clickable cards (whole card → primary link) ---------- */
function initClickableCards() {
  const cards = document.querySelectorAll(".card[data-href], .scene-card[data-href], .complete-card[data-href], .lookbook-flow__item[data-href]");
  cards.forEach((card) => {
    const href = card.getAttribute("data-href");
    if (!href) return;
    card.addEventListener("click", (e) => {
      const target = e.target;
      if (!(target instanceof Element)) return;
      if (target.closest("a, button")) return;
      window.location.href = href;
    });
    card.style.cursor = "pointer";
  });
}

/* ---------- Style test result sort by URL params ---------- */
function initStyleResultSort() {
  const grid = document.querySelector("[data-style-result]");
  if (!grid) return;
  const cards = Array.from(grid.querySelectorAll(".card[data-result-score]"));
  if (!cards.length) return;

  const params = new URLSearchParams(window.location.search);
  const targetMood = (params.get("mood") || "").trim().toLowerCase();
  const targetScene = (params.get("scene") || "").trim().toLowerCase();

  const norm = (v) => (v || "").trim().toLowerCase();

  const sorted = [...cards].sort((a, b) => {
    const aMood = norm(a.dataset.resultMood);
    const bMood = norm(b.dataset.resultMood);
    const aScene = norm(a.dataset.resultScene);
    const bScene = norm(b.dataset.resultScene);
    const aScore = Number(a.dataset.resultScore || "0");
    const bScore = Number(b.dataset.resultScore || "0");

    if (targetMood) {
      const am = aMood === targetMood ? 1 : 0;
      const bm = bMood === targetMood ? 1 : 0;
      if (am !== bm) return bm - am;
    }
    if (targetScene) {
      const as = aScene === targetScene ? 1 : 0;
      const bs = bScene === targetScene ? 1 : 0;
      if (as !== bs) return bs - as;
    }
    return bScore - aScore;
  });

  sorted.forEach((card, i) => {
    const li = card.closest("li");
    grid.appendChild(li || card);
    const rank = card.querySelector(".styletest-rank");
    if (rank) rank.textContent = `TOP PICK ${i + 1}`;
  });
}

/* ---------- Newsletter (prevent submit) ---------- */
function initNewsletterForm() {
  const form = document.querySelector(".footer__newsletter-form");
  if (!form) return;
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const input = form.querySelector(".footer__newsletter-input");
    if (input && input.value) {
      input.value = "";
      const note = form.parentElement.querySelector(".footer__newsletter-note");
      if (note) note.textContent = "구독 신청이 완료되었습니다. 감사합니다.";
    }
  });
}
/* ============================================================
   DANHA HOME — main.js
   entry point
   ============================================================ */

document.addEventListener("DOMContentLoaded", () => {
  if (typeof window.initUI === "function") window.initUI();
  if (typeof window.initInteraction === "function") window.initInteraction();
});
