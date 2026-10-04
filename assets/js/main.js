/* ==========================================================================
   shivlambda — site behaviour
   Shared header/footer, intro, scroll reveals, parallax, carousel,
   portfolio filters and lightbox. No dependencies.
   ========================================================================== */

const SITE = {
  name: "shivlambda",
  tagline: "Choreographer ~ Director ~ Instructor ~ Entrepreneur",
  bookingUrl: "https://dnce.club/imgestudios",
  email: "shivlambda@gmail.com",
  instagram: "https://www.instagram.com/shivlambda/",
  nav: [
    { href: "index.html", label: "About" },
    { href: "portfolio.html", label: "Portfolio" },
    { href: "choreography.html", label: "Event Choreography" },
    { href: "classes.html", label: "Book a Class" },
    { href: "contact.html", label: "Contact" },
  ],
};

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const currentPage = location.pathname.split("/").pop() || "index.html";

/* ---------- Header + footer ---------- */
function renderChrome() {
  const link = (n) =>
    `<a href="${n.href}"${n.href === currentPage ? ' aria-current="page"' : ""}>${n.label}</a>`;
  const left = SITE.nav.slice(0, 3).map(link).join("");
  const right = SITE.nav.slice(3).map(link).join("");

  const header = document.getElementById("site-header");
  if (header) {
    header.className = "site-header" + (header.dataset.onDark !== undefined ? " on-dark" : "");
    header.innerHTML = `
      <nav class="nav" aria-label="Primary">${left}</nav>
      <a class="brand" href="index.html">${SITE.name}<small>${SITE.tagline}</small></a>
      <nav class="nav nav--right" aria-label="Secondary">${right}</nav>
      <button class="menu-toggle" aria-expanded="false" aria-controls="mobile-menu">Menu</button>`;

    const menu = document.createElement("nav");
    menu.id = "mobile-menu";
    menu.className = "mobile-menu";
    menu.setAttribute("aria-label", "Mobile");
    menu.innerHTML = SITE.nav.map(link).join("");
    header.after(menu);

    const toggle = header.querySelector(".menu-toggle");
    toggle.addEventListener("click", () => {
      const open = document.body.classList.toggle("menu-open");
      document.body.classList.toggle("is-locked", open);
      toggle.setAttribute("aria-expanded", open);
      toggle.textContent = open ? "Close" : "Menu";
    });
  }

  const footer = document.getElementById("site-footer");
  if (footer) {
    footer.className = "site-footer";
    footer.innerHTML = `
      <div class="footer-cols">
        <div><h4>Explore</h4>${SITE.nav.map((n) => `<a href="${n.href}">${n.label}</a>`).join("")}</div>
        <div><h4>Classes</h4><a href="${SITE.bookingUrl}" target="_blank" rel="noopener">Book here ↗</a></div>
        <div><h4>Follow</h4><a href="${SITE.instagram}" target="_blank" rel="noopener">Instagram ↗</a></div>
        ${SITE.email ? `<div><h4>Contact</h4><a href="mailto:${SITE.email}">${SITE.email}</a></div>` : ""}
      </div>
      <div class="footer-word" aria-hidden="true">${SITE.name}</div>
      <div class="footer-base"><span>© ${new Date().getFullYear()} ${SITE.name}</span><span>${SITE.tagline}</span></div>`;
  }

  // Any element with data-book becomes a booking link
  document.querySelectorAll("[data-book]").forEach((a) => {
    a.href = SITE.bookingUrl;
    a.target = "_blank";
    a.rel = "noopener";
  });
}

/* ---------- Header state on scroll ---------- */
function headerScroll() {
  const header = document.getElementById("site-header");
  if (!header) return;
  const hero = document.querySelector(".hero");
  let lastY = 0;
  const onScroll = () => {
    const y = window.scrollY;
    const threshold = hero ? hero.offsetHeight - 80 : 20;
    header.classList.toggle("is-scrolled", y > threshold);
    header.classList.toggle("is-hidden", y > lastY && y > 400 && !document.body.classList.contains("menu-open"));
    lastY = y;
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
}

/* ---------- Intro wordmark (home only, once per session) ---------- */
function intro() {
  const el = document.querySelector(".intro");
  if (!el) return;
  let seen = false;
  try { seen = sessionStorage.getItem("introSeen") === "1"; } catch (e) {}
  if (seen || reduceMotion) { el.remove(); return; }

  const word = el.querySelector(".intro__word");
  word.innerHTML = [...word.textContent].map((c, i) =>
    `<span style="animation-delay:${0.15 + i * 0.05}s">${c === " " ? "&nbsp;" : c}</span>`).join("");

  document.body.classList.add("is-locked");
  setTimeout(() => {
    el.classList.add("is-done");
    document.body.classList.remove("is-locked");
    try { sessionStorage.setItem("introSeen", "1"); } catch (e) {}
    setTimeout(() => el.remove(), 1300);
  }, 2300);
}

/* ---------- Split headings into lines for the line reveal ---------- */
function splitLines() {
  document.querySelectorAll("[data-split]").forEach((el) => {
    const lines = el.innerHTML.split(/<br\s*\/?>/i);
    el.innerHTML = lines.map((l) => `<span class="split-line"><span>${l.trim()}</span></span>`).join("");
    el.classList.add("reveal-lines");
  });
}

/* ---------- Scroll reveals ---------- */
function reveals() {
  const targets = document.querySelectorAll(".reveal, .reveal-img, [data-split]");
  if (reduceMotion || !("IntersectionObserver" in window)) {
    targets.forEach((t) => t.classList.add("is-in"));
    return;
  }
  // A fully clipped .reveal-img has zero visible area, so the browser never reports it as
  // intersecting. Watch its (unclipped) parent instead and reveal the child.
  const revealFor = new Map();
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      (revealFor.get(e.target) || []).forEach((t) => t.classList.add("is-in"));
      io.unobserve(e.target);
    });
  }, { rootMargin: "0px 0px -12% 0px", threshold: 0 });
  targets.forEach((t) => {
    const watched = t.classList.contains("reveal-img") ? t.parentElement : t;
    if (!revealFor.has(watched)) revealFor.set(watched, []);
    revealFor.get(watched).push(t);
    io.observe(watched);
  });
}

/* ---------- Parallax ---------- */
function parallax() {
  const items = [...document.querySelectorAll("[data-parallax]")];
  if (!items.length || reduceMotion) return;
  let ticking = false;
  const update = () => {
    const vh = window.innerHeight;
    items.forEach((el) => {
      const r = el.getBoundingClientRect();
      if (r.bottom < 0 || r.top > vh) return;
      const progress = (r.top + r.height / 2 - vh / 2) / vh; // -1 … 1
      const strength = parseFloat(el.dataset.parallax) || 8;
      el.style.setProperty("--p", `${(-progress * strength).toFixed(2)}%`);
    });
    ticking = false;
  };
  window.addEventListener("scroll", () => {
    if (!ticking) { requestAnimationFrame(update); ticking = true; }
  }, { passive: true });
  update();
}

/* ---------- Carousel: buttons + drag to scroll ---------- */
function carousels() {
  document.querySelectorAll(".carousel").forEach((c) => {
    const track = c.querySelector(".carousel__track");
    const step = () => (track.querySelector(".carousel__item")?.offsetWidth || 300) + 24;
    c.querySelector("[data-prev]")?.addEventListener("click", () => track.scrollBy({ left: -step(), behavior: "smooth" }));
    c.querySelector("[data-next]")?.addEventListener("click", () => track.scrollBy({ left: step(), behavior: "smooth" }));

    let down = false, startX = 0, startScroll = 0, moved = false;
    track.addEventListener("pointerdown", (e) => {
      if (e.pointerType !== "mouse") return;
      down = true; moved = false; startX = e.clientX; startScroll = track.scrollLeft;
      track.classList.add("is-dragging");
    });
    window.addEventListener("pointermove", (e) => {
      if (!down) return;
      const dx = e.clientX - startX;
      if (Math.abs(dx) > 4) moved = true;
      track.scrollLeft = startScroll - dx;
    });
    window.addEventListener("pointerup", () => { down = false; track.classList.remove("is-dragging"); });
    track.addEventListener("click", (e) => { if (moved) { e.preventDefault(); e.stopPropagation(); } }, true);
  });
}

/* ---------- Portfolio filters ---------- */
function filters() {
  const bar = document.querySelector(".filters");
  if (!bar) return;
  const works = document.querySelectorAll(".work[data-cat]");
  bar.addEventListener("click", (e) => {
    const btn = e.target.closest(".filter");
    if (!btn) return;
    bar.querySelectorAll(".filter").forEach((b) => b.setAttribute("aria-pressed", b === btn));
    const cat = btn.dataset.filter;
    works.forEach((w) => w.classList.toggle("is-hidden", cat !== "all" && !w.dataset.cat.split(" ").includes(cat)));
  });
  // Allow deep links like portfolio.html#film
  const hash = location.hash.slice(1);
  if (hash) bar.querySelector(`[data-filter="${hash}"]`)?.click();
}

/* ---------- Lightbox for images and videos ---------- */
function lightbox() {
  const triggers = document.querySelectorAll("[data-lightbox]");
  if (!triggers.length) return;
  const box = document.createElement("div");
  box.className = "lightbox";
  box.setAttribute("role", "dialog");
  box.setAttribute("aria-modal", "true");
  box.innerHTML = `<button class="lightbox__close">Close</button><div class="lightbox__stage"></div>`;
  document.body.append(box);
  const stage = box.querySelector(".lightbox__stage");

  const close = () => {
    box.classList.remove("is-open");
    document.body.classList.remove("is-locked");
    setTimeout(() => (stage.innerHTML = ""), 400);
  };
  triggers.forEach((t) => t.addEventListener("click", (e) => {
    e.preventDefault();
    const src = t.getAttribute("href") || t.dataset.src;
    if (/youtube(-nocookie)?\.com|youtu\.be|vimeo\.com/.test(src)) {
      stage.innerHTML = `<iframe src="${src}" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe>`;
    } else if (/\.(mp4|webm|mov)$/i.test(src)) {
      stage.innerHTML = `<video src="${src}" controls autoplay playsinline></video>`;
    } else {
      stage.innerHTML = `<img src="${src}" alt="${t.querySelector("img")?.alt || ""}">`;
    }
    box.classList.add("is-open");
    document.body.classList.add("is-locked");
  }));
  box.addEventListener("click", (e) => { if (e.target === box || e.target.closest(".lightbox__close")) close(); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") close(); });
}

renderChrome();
headerScroll();
intro();
splitLines();
reveals();
parallax();
carousels();
filters();
lightbox();
