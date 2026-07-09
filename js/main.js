/* ==========================================================
   SWAN EVENTS — Main script
   ========================================================== */

/* -------------------------------------------------
   0. CONFIG — replace with your own Google Apps Script
      Web App URL once deployed. See /google-apps-script.gs
      and README-IMAGES.md for full setup instructions.
   ------------------------------------------------- */
const GOOGLE_SCRIPT_URL = "https://sheetdb.io/api/v1/0ma8ko0j1m6jb";

/* -------------------------------------------------
   Image placeholder fallback — called via onerror="imgFallback(this)"
   Shows an elegant gold/teal placeholder with the expected file
   path instead of a broken-image icon, until the real photo is
   dropped into the /images folder.
   ------------------------------------------------- */
function imgFallback(img) {
  img.style.display = "none";
  const frame = img.parentElement;
  frame.classList.add("is-placeholder");
  if (!frame.querySelector(".ph-label")) {
    const label = document.createElement("span");
    label.className = "ph-label";
    label.textContent = frame.getAttribute("data-expect") || img.getAttribute("src");
    frame.appendChild(label);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  initNavbar();
  initLanguage();
  initGallery();
  initReveal();
  initForm();
  initSwanDraw();
});

/* -------------------------------------------------
   1. NAVBAR — transparent -> solid on scroll, mobile toggle
   ------------------------------------------------- */
function initNavbar() {
  const navbar = document.querySelector(".navbar");
  const toggle = document.querySelector(".nav-toggle");
  const links = document.querySelector(".nav-links");

  const onScroll = () => {
    navbar.classList.toggle("is-scrolled", window.scrollY > 40);
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  toggle.addEventListener("click", () => {
    toggle.classList.toggle("open");
    links.classList.toggle("open");
  });

  links.querySelectorAll("a").forEach((a) => {
    a.addEventListener("click", () => {
      toggle.classList.remove("open");
      links.classList.remove("open");
    });
  });

  // Keep sidebar open when clicking language buttons on mobile
  links.querySelectorAll(".lang-switch button").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      // Don't close sidebar when changing language
    });
  });
}

/* -------------------------------------------------
   2. LANGUAGE SWITCHING — FR default, AR = RTL
   ------------------------------------------------- */
function initLanguage() {
  const buttons = document.querySelectorAll("[data-lang]");
  const stored = localStorage.getItem("swan_lang");
  const initial = stored && TRANSLATIONS[stored] ? stored : "fr";
  applyLanguage(initial);

  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const lang = btn.getAttribute("data-lang");
      applyLanguage(lang);
      localStorage.setItem("swan_lang", lang);
    });
  });
}

function applyLanguage(lang) {
  const dict = TRANSLATIONS[lang];
  if (!dict) return;

  document.documentElement.setAttribute("lang", lang);
  document.documentElement.setAttribute("dir", dict.dir);

  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    if (dict[key] !== undefined) el.textContent = dict[key];
  });

  document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
    const key = el.getAttribute("data-i18n-placeholder");
    if (dict[key] !== undefined) el.setAttribute("placeholder", dict[key]);
  });

  document.querySelectorAll("[data-lang]").forEach((btn) => {
    btn.classList.toggle("active", btn.getAttribute("data-lang") === lang);
  });
}

/* -------------------------------------------------
   3. GALLERY FILTER — fade transition, no popup
   ------------------------------------------------- */
function initGallery() {
  const filters = document.querySelectorAll(".gallery-filters button");
  const items = document.querySelectorAll(".gallery-item");

  filters.forEach((btn) => {
    btn.addEventListener("click", () => {
      filters.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      const cat = btn.getAttribute("data-filter");

      items.forEach((item) => {
        const match = cat === "all" || item.getAttribute("data-category") === cat;
        if (match) {
          item.classList.remove("hide");
          requestAnimationFrame(() => item.classList.add("show"));
        } else {
          item.classList.remove("show");
          item.classList.add("hide");
        }
      });
    });
  });
}

/* -------------------------------------------------
   4. SCROLL REVEAL
   ------------------------------------------------- */
function initReveal() {
  const els = document.querySelectorAll(".reveal");
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
  );
  els.forEach((el) => io.observe(el));

  // gallery items appear immediately once section is in view
  document.querySelectorAll(".gallery-item").forEach((item, i) => {
    setTimeout(() => item.classList.add("show"), 40 * i);
  });
}

/* -------------------------------------------------
   5. RESERVATION FORM -> Google Sheets
   ------------------------------------------------- */
function initForm() {
  const form = document.getElementById("reservation-form");
  const card = document.querySelector(".res-card");
  const successBox = document.querySelector(".res-success");
  const dateInput = document.getElementById("date");
  
  // Set min date to today to prevent selecting past dates
  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.setAttribute('min', today);
  }
  
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const submitBtn = form.querySelector("button[type='submit']");
    submitBtn.disabled = true;
    const originalText = submitBtn.textContent;
    submitBtn.textContent = "...";

    const data = {
      eventType: form.eventType.value,
      name: form.name.value,
      phone: form.phone.value,
      date: form.date.value,
      location: form.location.value,
      guests: form.guests.value,
      description: form.description.value,
      language: document.documentElement.getAttribute("lang"),
      submittedAt: new Date().toISOString()
    };

    try {
      console.log("Form submission started");
      console.log("SHEETDB_URL:", GOOGLE_SCRIPT_URL);
      console.log("Form data:", data);

      if (GOOGLE_SCRIPT_URL && !GOOGLE_SCRIPT_URL.startsWith("PASTE_")) {
        console.log("Sending to SheetDB...");
        // SheetDB API format - data must be wrapped in an array
        const sheetData = [{
          date: new Date().toISOString(),
          "type-evenment": data.eventType || "",
          nom: data.name || "",
          "num-tel": data.phone || "",
          "date-événement": data.date || "",
          lieu: data.location || "",
          invites: data.guests || "",
          desc: data.description || "",
          lang: data.language || ""
        }];

        const response = await fetch(GOOGLE_SCRIPT_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(sheetData)
        });

        if (!response.ok) {
          throw new Error(`SheetDB API error: ${response.status}`);
        }
        console.log("Request sent successfully to SheetDB");
      } else {
        console.warn(
          "SHEETDB_URL is not configured yet. Form data:",
          data
        );
      }

      card.classList.add("is-submitted");
      successBox.classList.add("show");
      form.reset();
      console.log("Form reset and success message shown");
    } catch (err) {
      console.error("Reservation submission failed:", err);
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
      alert(
        document.documentElement.getAttribute("lang") === "ar"
          ? "حدث خطأ، يرجى المحاولة مرة أخرى."
          : document.documentElement.getAttribute("lang") === "en"
          ? "Something went wrong, please try again."
          : "Une erreur est survenue, veuillez réessayer."
      );
    }
  });
}

/* -------------------------------------------------
   6. HERO SWAN LINE — restart draw if re-entering viewport
   ------------------------------------------------- */
function initSwanDraw() {
  // animation runs once on load via CSS; nothing else required,
  // kept as a hook for future enhancement.
}
