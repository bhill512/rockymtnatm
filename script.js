/* Rocky Mountain ATM Services landing page */

// TODO: Replace with your Formspree endpoint after you create the form.
// Example: https://formspree.io/f/xxxxxxx
const FORMSPREE_ENDPOINT = "";

function $(selector, root = document) {
  return root.querySelector(selector);
}

function $all(selector, root = document) {
  return Array.from(root.querySelectorAll(selector));
}

function setHidden(el, hidden) {
  if (!el) return;
  el.hidden = hidden;
  el.setAttribute("aria-hidden", hidden ? "true" : "false");
}

function lockScroll(locked) {
  document.documentElement.style.overflow = locked ? "hidden" : "";
}

function isProbablyValidEmail(value) {
  // Lightweight check; server-side validation still happens at Formspree.
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || "").trim());
}

function showFieldError(name, message) {
  const el = document.querySelector(`[data-error-for="${name}"]`);
  if (!el) return;
  el.textContent = message;
  el.hidden = false;
}

function clearFieldError(name) {
  const el = document.querySelector(`[data-error-for="${name}"]`);
  if (!el) return;
  el.textContent = "";
  el.hidden = true;
}

function hideStatuses() {
  setHidden($("[data-status-success]"), true);
  setHidden($("[data-status-error]"), true);
  setHidden($("[data-status-warn]"), true);
}

function showStatus(type) {
  hideStatuses();
  setHidden($(`[data-status-${type}]`), false);
}

function createFocusTrap(container) {
  let active = false;
  const handleKeyDown = (e) => {
    if (!active) return;
    if (e.key !== "Tab") return;

    const focusables = $all(
      'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])',
      container
    ).filter((el) => !el.hasAttribute("disabled") && !el.getAttribute("aria-hidden"));

    if (focusables.length === 0) return;

    const first = focusables[0];
    const last = focusables[focusables.length - 1];

    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  };

  return {
    activate() {
      if (active) return;
      active = true;
      document.addEventListener("keydown", handleKeyDown);
    },
    deactivate() {
      if (!active) return;
      active = false;
      document.removeEventListener("keydown", handleKeyDown);
    },
  };
}

document.addEventListener("DOMContentLoaded", () => {
  const year = $("#year");
  if (year) year.textContent = String(new Date().getFullYear());

  const backdrop = $("[data-modal-backdrop]");
  const openButtons = $all("[data-open-contact]");
  const closeButtons = $all("[data-close-contact]");
  const modal = backdrop ? $(".modal", backdrop) : null;

  const form = $("#contactForm");
  const submitBtn = $("#contactSubmit");

  let lastActive = null;
  const focusTrap = modal ? createFocusTrap(modal) : null;

  function openModal() {
    if (!backdrop || !modal) return;
    lastActive = document.activeElement;

    hideStatuses();
    clearFieldError("name");
    clearFieldError("email");
    clearFieldError("message");

    setHidden(backdrop, false);
    lockScroll(true);
    focusTrap?.activate();

    // Focus the first input shortly after opening.
    window.setTimeout(() => {
      const name = $("#name");
      if (name) name.focus();
    }, 0);
  }

  function closeModal() {
    if (!backdrop) return;
    setHidden(backdrop, true);
    lockScroll(false);
    focusTrap?.deactivate();
    if (lastActive && typeof lastActive.focus === "function") lastActive.focus();
  }

  openButtons.forEach((btn) => btn.addEventListener("click", (e) => {
    // Allow anchor buttons to not jump.
    e.preventDefault();
    openModal();
  }));

  closeButtons.forEach((btn) => btn.addEventListener("click", closeModal));

  if (backdrop) {
    backdrop.addEventListener("click", (e) => {
      if (e.target === backdrop) closeModal();
    });
  }

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && backdrop && !backdrop.hidden) closeModal();
  });

  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      hideStatuses();

      const name = $("#name")?.value?.trim() ?? "";
      const business = $("#business")?.value?.trim() ?? "";
      const email = $("#email")?.value?.trim() ?? "";
      const phone = $("#phone")?.value?.trim() ?? "";
      const message = $("#message")?.value?.trim() ?? "";
      const subject = form.querySelector('input[name="_subject"]')?.value ?? "";
      const gotcha = form.querySelector('input[name="_gotcha"]')?.value ?? "";

      let ok = true;

      if (!name) {
        showFieldError("name", "Please enter your name.");
        ok = false;
      } else {
        clearFieldError("name");
      }

      if (!email || !isProbablyValidEmail(email)) {
        showFieldError("email", "Please enter a valid email address.");
        ok = false;
      } else {
        clearFieldError("email");
      }

      if (!message) {
        showFieldError("message", "Please enter a short message.");
        ok = false;
      } else {
        clearFieldError("message");
      }

      if (!ok) return;

      if (!FORMSPREE_ENDPOINT) {
        showStatus("warn");
        return;
      }

      // Spam honeypot: if filled, pretend success.
      if (String(gotcha || "").trim()) {
        showStatus("success");
        form.reset();
        return;
      }

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = "Sending…";
      }

      try {
        const payload = {
          name,
          business,
          email,
          phone,
          message,
          _subject: subject,
        };

        const res = await fetch(FORMSPREE_ENDPOINT, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(payload),
        });

        if (!res.ok) throw new Error(`Form submit failed: ${res.status}`);

        showStatus("success");
        form.reset();
      } catch {
        showStatus("error");
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = "Send message";
        }
      }
    });
  }
});


