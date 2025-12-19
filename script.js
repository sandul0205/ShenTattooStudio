
// Mobile nav toggle
const ham = document.querySelector(".hamburger");
const nav = document.getElementById("nav");
if (ham && nav) {
  ham.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    ham.setAttribute("aria-expanded", open ? "true" : "false");
  });
}


// Year
const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

// Reveal on scroll (+stagger children)
const io = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        const el = e.target;
        el.classList.add("in");
        // subtle stagger for children in grids
        const kids = el.querySelectorAll(":scope > *");
        kids.forEach((k, i) => (k.style.transitionDelay = `${Math.min(i * 60, 360)}ms`));
        io.unobserve(el);
      }
    });
  },
  { threshold: 0.12 }
);
document.querySelectorAll("[data-animate]").forEach((el) => io.observe(el));

// Split headline letters for subtle stagger
const splitTargets = document.querySelectorAll("[data-split]");
splitTargets.forEach((target) => {
  target.innerHTML = target.textContent.replace(/\S/g, '<span class="ch">$&</span>');
  const chars = target.querySelectorAll(".ch");
  chars.forEach((c, i) => {
    c.style.display = "inline-block";
    c.style.transform = "translateY(22px)";
    c.style.opacity = "0";
    c.style.transition = `transform .6s ${i * 12}ms, opacity .6s ${i * 12}ms`;
    requestAnimationFrame(() => {
      c.style.transform = "translateY(0)";
      c.style.opacity = "1";
    });
  });
});

// ===== WhatsApp link (set your number below) =====
(function initWhatsApp() {
  const wa = document.getElementById("waLink"); // anchor in your contact list
  if (!wa) return;
  const number = "94770000000"; // your number, no +, e.g., 9477xxxxxxx
  const text = encodeURIComponent("Hi! I'd like to book a session.");
  wa.href = `https://wa.me/${number}?text=${text}`;
  wa.target = "_blank";
  wa.rel = "noopener";
})();

// ===== Copy email to clipboard =====
document.getElementById("copyEmail")?.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText("hello@mrlookstudio.com"); // set your email
    showStatus("Email copied ✔");
  } catch {
    showStatus("Could not copy email. Long-press to copy on mobile.", true);
  }
});

// ===== Form submit: basic validation + mailto fallback =====
document.getElementById("contactForm")?.addEventListener("submit", (e) => {
  e.preventDefault();
  const f = e.currentTarget;
  const data = Object.fromEntries(new FormData(f).entries());

  if (!data.name || !data.email || !data.phone || !data.subject || !data.message) {
    showStatus("Please fill all fields.", true);
    return;
  }

  const body = encodeURIComponent(
    `Name: ${data.name}\nEmail: ${data.email}\nPhone: ${data.phone}\n\n${data.message}`
  );
  const mail = `mailto:hello@mrlookstudio.com?subject=${encodeURIComponent(
    data.subject
  )}&body=${body}`; // set your email
  window.location.href = mail;

  showStatus("Opening your email app…");
  f.reset();
});

// ===== Helper: status message =====
function showStatus(msg, isError = false) {
  const el = document.getElementById("formStatus");
  if (!el) return;
  el.textContent = msg;
  el.classList.toggle("err", !!isError);
  el.classList.toggle("ok", !isError);
}

// Back-to-top button reveal
(function () {
  const btn = document.getElementById("toTopBtn");
  if (!btn) return;
  const toggle = () => {
    if (window.scrollY > 300) btn.classList.add("show");
    else btn.classList.remove("show");
  };
  toggle();
  window.addEventListener("scroll", toggle, { passive: true });
})();

/* ========= NEW: Trending micro-interactions ========= */

// 1) Sticky topbar blur + section scrollspy
(function () {
  const header = document.querySelector(".topbar");
  const links = [...document.querySelectorAll(".nav a[href^='#']")];

  if (!header) return;

  const setScrolled = () => header.classList.toggle("scrolled", window.scrollY > 4);
  setScrolled();
  window.addEventListener("scroll", setScrolled, { passive: true });

  // Scrollspy
  const sections = links
    .map((a) => document.querySelector(a.getAttribute("href")))
    .filter(Boolean);

  const spy = new IntersectionObserver(
    (entries) => {
      entries.forEach((en) => {
        const id = "#" + en.target.id;
        const l = links.find((a) => a.getAttribute("href") === id);
        if (!l) return;
        if (en.isIntersecting) {
          links.forEach((a) => a.classList.remove("active"));
          l.classList.add("active");
        }
      });
    },
    { rootMargin: "-50% 0px -45% 0px", threshold: 0 }
  );

  sections.forEach((sec) => spy.observe(sec));
})();

// 2) Button ripple + subtle magnetic hover
(function () {
  const buttons = document.querySelectorAll(".btn, .btn-sm, .btn-lg");
  buttons.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const r = document.createElement("span");
      r.className = "ripple";
      const rect = btn.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      r.style.width = r.style.height = `${size}px`;
      r.style.left = `${e.clientX - rect.left - size / 2}px`;
      r.style.top = `${e.clientY - rect.top - size / 2}px`;
      btn.appendChild(r);
      setTimeout(() => r.remove(), 600);
    });

    // magnetic
    btn.addEventListener("mousemove", (e) => {
      const b = btn.getBoundingClientRect();
      const x = (e.clientX - b.left - b.width / 2) / b.width;
      const y = (e.clientY - b.top - b.height / 2) / b.height;
      btn.style.transform = `translate(${x * 4}px, ${y * 4}px)`;
    });
    btn.addEventListener("mouseleave", () => {
      btn.style.transform = "";
    });
  });
})();

// 3) Tilt on media cards (hero, gallery, about)
(function () {
  const tiltables = [
    ...document.querySelectorAll(".media-tile"),
    ...document.querySelectorAll(".gallery .card"),
    ...document.querySelectorAll(".about-gallery .shot"),
  ];
  const strength = 8; // degrees
  tiltables.forEach((el) => {
    el.addEventListener("mousemove", (e) => {
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      el.style.transform = `rotateY(${px * strength}deg) rotateX(${ -py * strength }deg)`;
    });
    el.addEventListener("mouseleave", () => {
      el.style.transform = "";
    });
  });
})();

// 4) Parallax on accent boxes & feature image
(function () {
  const parts = [
    ...document.querySelectorAll(".accent-box"),
    ...document.querySelectorAll(".accent-box.alt"),
  ];
  const featureImg = document.querySelector(".feature-side img");

  const raf = (fn => (cb => fn(cb)))(window.requestAnimationFrame.bind(window));

  const onScroll = () => {
    const y = window.scrollY;
    parts.forEach((el, i) => {
      const speed = i % 2 ? 0.25 : -0.18;
      el.style.transform = `translate3d(0, ${y * speed}px, 0)`;
    });
    if (featureImg) {
      const rect = featureImg.getBoundingClientRect();
      const inView = rect.top < window.innerHeight && rect.bottom > 0;
      if (inView) {
        const p =
          1 -
          Math.abs(
            (rect.top + rect.height / 2 - window.innerHeight / 2) /
              (window.innerHeight / 2)
          );
        featureImg.style.transform = `scale(${1 + p * 0.04})`;
      }
    }
  };

  onScroll();
  window.addEventListener("scroll", () => raf(onScroll), { passive: true });
})();

// 5) Blur-up lazy load for images (graceful even if native lazy already)
(function () {
  const imgs = document.querySelectorAll("img");
  imgs.forEach((img) => {
    if (!img.hasAttribute("loading")) img.setAttribute("loading", "lazy");
    img.classList.add("lazyfx");
    if (img.complete) img.classList.remove("lazyfx");
    img.addEventListener("load", () => img.classList.remove("lazyfx"));
  });
})();

// 6) Scroll progress bar (auto insert)
(function () {
  const bar = document.createElement("div");
  bar.id = "scrollProgress";
  document.body.appendChild(bar);

  const update = () => {
    const h = document.documentElement;
    const max = h.scrollHeight - h.clientHeight;
    const pct = max ? (h.scrollTop / max) * 100 : 0;
    bar.style.width = pct + "%";
  };

  update();
  window.addEventListener("scroll", update, { passive: true });
  window.addEventListener("resize", update);
})();

/* =========================
   REVIEWS MODULE
   - localStorage-backed
   - live average + distribution
   - filters
   - DESKTOP: show 3 only + Load more reveals 3 more each click
   - MOBILE: show all (your CSS makes it a swipe/slide)
========================= */
(function () {
  const KEY = "shenReviews_v1";

  // --- seed data (edit or remove as you like)
  const seed = [
    {
      name: "Kasun P.",
      rating: 5,
      text: "Clean studio, super friendly. Fine-line came out exactly as the reference.",
      date: "2025-06-05",
    },
    {
      name: "Minali D.",
      rating: 5,
      text: "My helix piercing healed beautifully. Clear aftercare and hypoallergenic jewelry.",
      date: "2025-05-22",
    },
    {
      name: "Tharaka S.",
      rating: 4,
      text: "Great shading work on my forearm. Could improve parking info, but art is top-notch.",
      date: "2025-04-10",
    },
    {
      name: "Ruwini J.",
      rating: 5,
      text: "First tattoo! They walked me through sizing and placement. Love the result.",
      date: "2025-03-02",
    },
    {
      name: "Ishan G.",
      rating: 5,
      text: "Cover-up exceeded expectations. You can’t see the old piece at all.",
      date: "2025-02-14",
    },
    {
      name: "Nirmala K.",
      rating: 5,
      text: "Sterile, professional, and kind. Will be back for a watercolor piece.",
      date: "2025-01-28",
    },
    {
      name: "Sasindu L.",
      rating: 4,
      text: "Artist was very patient with adjustments. Linework is crisp.",
      date: "2024-12-12",
    },
  ];

  // load user + seed
  const stored = JSON.parse(localStorage.getItem(KEY) || "[]");
  let all = [...seed, ...stored].sort((a, b) => new Date(b.date) - new Date(a.date));

  // Elements
  const avgNum = document.getElementById("avgNum");
  const avgStars = document.getElementById("avgStars");
  const reviewCount = document.getElementById("reviewCount");
  const distWrap = document.getElementById("ratingDist");
  const filters = document.getElementById("ratingFilters");
  const grid = document.getElementById("reviewGrid");
  const loadBtn = document.getElementById("loadMoreReviews");

  const dlg = document.getElementById("reviewDialog");
  const openBtn = document.getElementById("openReviewForm");
  const closeBtn = document.getElementById("closeReviewForm");
  const form = document.getElementById("reviewForm");
  const starsInput = document.getElementById("starsInput");
  const ratingValue = document.getElementById("ratingValue");

  if (!avgNum || !grid) return;

  // Desktop paging config
  const DESKTOP_FIRST = 3;
  const DESKTOP_STEP = 3;
  const isDesktop = () => window.matchMedia("(min-width: 901px)").matches;

  // Helpers
  const clamp = (n, min, max) => Math.max(min, Math.min(max, n));
  const fmtDate = (iso) =>
    new Date(iso).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });

  function escapeHtml(s = "") {
    return s.replace(/[&<>"']/g, (m) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    }[m]));
  }

  function starIcons(r) {
    const full = Math.floor(r);
    const half = r - full >= 0.5 ? 1 : 0;
    const empty = 5 - full - half;
    return (
      '<i class="ri-star-fill"></i>'.repeat(full) +
      (half ? '<i class="ri-star-half-line"></i>' : "") +
      '<i class="ri-star-line"></i>'.repeat(empty)
    );
  }

  function computeSummary(list) {
    const total = list.length || 0;
    const sum = list.reduce((s, x) => s + (x.rating || 0), 0);
    const avg = total ? sum / total : 0;
    const dist = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    list.forEach((x) => (dist[x.rating] = (dist[x.rating] || 0) + 1));
    return { total, avg: Math.round(avg * 10) / 10, dist };
  }

  function renderSummary(list) {
    const { total, avg, dist } = computeSummary(list);
    avgNum.textContent = avg.toFixed(1);
    avgStars.innerHTML = starIcons(avg);
    avgStars.setAttribute("aria-label", `Average rating ${avg} of 5`);
    reviewCount.textContent = total;

    distWrap.innerHTML = "";
    for (let s = 5; s >= 1; s--) {
      const count = dist[s] || 0;
      const pct = Math.round((count / Math.max(total, 1)) * 100);
      const row = document.createElement("div");
      row.className = "row";
      row.innerHTML = `
        <div class="label">${s}★</div>
        <div class="bar"><div class="fill" style="width:${pct}%"></div></div>
        <div class="num">${count}</div>
      `;
      distWrap.appendChild(row);
    }
  }

  function createCard(r) {
    const el = document.createElement("article");
    el.className = "review-card";
    el.innerHTML = `
      <div class="r-head">
        <div class="r-author">${escapeHtml(r.name)}</div>
        <div class="r-rating" aria-label="${r.rating} out of 5">${starIcons(r.rating)}</div>
      </div>
      <p class="r-text">${escapeHtml(r.text)}</p>
      <div class="r-meta">${fmtDate(r.date)}</div>
    `;
    return el;
  }

  // Filters + paging
  let currentFilter = "all";
  let shown = 0;

  function getFiltered() {
    return currentFilter === "all" ? all : all.filter((r) => r.rating === Number(currentFilter));
  }

  function render(reset = true) {
    const list = getFiltered();

    // MOBILE: show all, hide load more (CSS handles swipe/slide)
    if (!isDesktop()) {
      grid.innerHTML = "";
      list.forEach((r) => grid.appendChild(createCard(r)));
      shown = list.length;
      if (loadBtn) loadBtn.style.display = "none";
      renderSummary(list);
      return;
    }

    // DESKTOP: show 3 first, then load more +3
    if (reset) {
      grid.innerHTML = "";
      shown = 0;
    }

    const batch = shown === 0 ? DESKTOP_FIRST : DESKTOP_STEP;
    const next = list.slice(shown, shown + batch);
    next.forEach((r) => grid.appendChild(createCard(r)));
    shown += next.length;

    if (loadBtn) loadBtn.style.display = shown < list.length ? "" : "none";
    renderSummary(list);
  }

  // Filter click
  filters?.addEventListener("click", (e) => {
    const btn = e.target.closest(".chip");
    if (!btn) return;
    filters.querySelectorAll(".chip").forEach((c) => c.classList.remove("active"));
    btn.classList.add("active");
    currentFilter = btn.dataset.filter || "all";
    render(true); // reset to 3 on desktop
  });

  // Load more click
  loadBtn?.addEventListener("click", () => {
    if (!isDesktop()) return;
    render(false);
  });

  // Re-render on resize (so desktop returns to 3 / mobile shows all)
  window.addEventListener("resize", () => render(true));

  // Init
  render(true);

  // Dialog wiring
  openBtn?.addEventListener("click", () => {
    if (typeof dlg.showModal === "function") dlg.showModal();
    else alert("Please update your browser to write a review.");
  });
  closeBtn?.addEventListener("click", () => dlg.close());

  // Build stars input (5 buttons)
  if (starsInput && ratingValue) {
    starsInput.innerHTML = "";
    for (let i = 1; i <= 5; i++) {
      const b = document.createElement("button");
      b.type = "button";
      b.setAttribute("aria-label", `${i} star`);
      b.innerHTML = '<i class="ri-star-fill"></i>';
      starsInput.appendChild(b);
    }

    const updateStars = (val) => {
      ratingValue.value = String(val);
      [...starsInput.children].forEach((btn, idx) => btn.classList.toggle("active", idx < val));
    };

    starsInput.addEventListener("click", (e) => {
      const b = e.target.closest("button");
      if (!b) return;
      const idx = [...starsInput.children].indexOf(b);
      if (idx >= 0) updateStars(idx + 1);
    });

    updateStars(5); // default 5★
  }

  // Submit review
  form?.addEventListener("submit", (e) => {
    e.preventDefault();
    const f = new FormData(form);

    const name = (f.get("name") || "").toString().trim();
    const text = (f.get("text") || "").toString().trim();
    const rating = clamp(Number(f.get("rating") || 0), 1, 5);

    if (!name || !text || !rating) return;

    const review = { name, rating, text, date: new Date().toISOString() };
    const cur = JSON.parse(localStorage.getItem(KEY) || "[]");
    cur.unshift(review);
    localStorage.setItem(KEY, JSON.stringify(cur));

    all = [review, ...all].sort((a, b) => new Date(b.date) - new Date(a.date));

    dlg.close();
    form.reset();

    // reset default 5★
    if (ratingValue) ratingValue.value = "5";
    if (starsInput) [...starsInput.children].forEach((b, i) => b.classList.toggle("active", i < 5));

    render(true);
    alert("Thanks for your review!");
  });
})();

// Carousel controls (safe)
(function () {
  const carousel = document.getElementById("carousel");
  const next = document.getElementById("next");
  const prev = document.getElementById("prev");
  if (!carousel || !next || !prev) return;

  next.addEventListener("click", () => {
    carousel.scrollBy({ left: 300, behavior: "smooth" });
  });

  prev.addEventListener("click", () => {
    carousel.scrollBy({ left: -300, behavior: "smooth" });
  });
})();

// Preloader hide
window.addEventListener("load", () => {
  const preloader = document.getElementById("preloader");
  if (!preloader) return;

  preloader.classList.add("pl--hide");
  document.body.classList.remove("is-loading");

  setTimeout(() => preloader.remove(), 600);
});

// Modern navbar: open/close mobile drawer + close on link click
(function(){
  const topbar = document.getElementById('topbar');
  const toggle = document.getElementById('navToggle');
  const drawer = document.getElementById('mobileNav');
  const closeBtn = document.getElementById('navClose');

  // scroll shadow
  const onScroll = () => topbar?.classList.toggle('scrolled', window.scrollY > 6);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive:true });

  const open = () => {
    drawer?.classList.add('open');
    toggle?.classList.add('is-open');
    toggle?.setAttribute('aria-expanded','true');
    drawer?.setAttribute('aria-hidden','false');
    document.body.style.overflow = 'hidden';
  };

  const close = () => {
    drawer?.classList.remove('open');
    toggle?.classList.remove('is-open');
    toggle?.setAttribute('aria-expanded','false');
    drawer?.setAttribute('aria-hidden','true');
    document.body.style.overflow = '';
  };

  toggle?.addEventListener('click', () => {
    drawer?.classList.contains('open') ? close() : open();
  });

  closeBtn?.addEventListener('click', close);

  // click outside card closes
  drawer?.addEventListener('click', (e) => {
    if(e.target === drawer) close();
  });

  // close when clicking a link
  drawer?.querySelectorAll('a').forEach(a => a.addEventListener('click', close));

  // ESC closes
  window.addEventListener('keydown', (e)=>{ if(e.key === 'Escape') close(); });
})();
