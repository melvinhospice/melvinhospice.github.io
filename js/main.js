(() => {
  const root = document.documentElement;
  const body = document.body;

  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)");
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const mobileMenuMedia = window.matchMedia("(max-width: 920px)");

  const themeToggle = document.querySelector("[data-theme-toggle]");

  const getCurrentTheme = () => {
    const explicit = root.getAttribute("data-theme");
    if (explicit === "light" || explicit === "dark") return explicit;
    return prefersDark.matches ? "dark" : "light";
  };

  const updateThemeToggleLabel = () => {
    if (!themeToggle) return;
    const current = getCurrentTheme();
    const next = current === "dark" ? "clair" : "sombre";

    themeToggle.setAttribute("aria-pressed", String(current === "dark"));
    themeToggle.setAttribute("aria-label", `Activer le mode ${next}`);
    themeToggle.textContent = current === "dark" ? "Mode clair" : "Mode sombre";
  };

  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "light" || savedTheme === "dark") {
    root.setAttribute("data-theme", savedTheme);
  }

  updateThemeToggleLabel();

  themeToggle?.addEventListener("click", () => {
    const current = getCurrentTheme();
    const next = current === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
    updateThemeToggleLabel();
  });

  prefersDark.addEventListener?.("change", () => {
    if (!localStorage.getItem("theme")) {
      updateThemeToggleLabel();
    }
  });

  const menuToggle = document.querySelector("[data-menu-toggle]");
  const menu = document.querySelector("[data-menu]");
  const focusableSelector = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';
  let lastFocusedElement = null;

  const isMenuOpen = () => body.classList.contains("menu-open");

  const getFocusableInMenu = () => {
    if (!menu) return [];
    return [...menu.querySelectorAll(focusableSelector)].filter((element) => {
      const style = window.getComputedStyle(element);
      return style.display !== "none" && style.visibility !== "hidden";
    });
  };

  const syncMenuAccessibility = () => {
    if (!menu) return;

    if (mobileMenuMedia.matches) {
      menu.inert = !isMenuOpen();
    } else {
      body.classList.remove("menu-open");
      menu.inert = false;
      menuToggle?.setAttribute("aria-expanded", "false");
    }
  };

  const openMenu = () => {
    if (!menu || !mobileMenuMedia.matches) return;
    lastFocusedElement = document.activeElement;
    body.classList.add("menu-open");
    menuToggle?.setAttribute("aria-expanded", "true");
    syncMenuAccessibility();

    const focusables = getFocusableInMenu();
    focusables[0]?.focus();
  };

  const closeMenu = (restoreFocus = true) => {
    if (!menu) return;

    body.classList.remove("menu-open");
    menuToggle?.setAttribute("aria-expanded", "false");
    syncMenuAccessibility();

    if (restoreFocus && lastFocusedElement instanceof HTMLElement) {
      lastFocusedElement.focus();
    }
  };

  menuToggle?.addEventListener("click", () => {
    if (isMenuOpen()) {
      closeMenu(false);
    } else {
      openMenu();
    }
  });

  menu?.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      if (isMenuOpen()) {
        closeMenu(false);
      }
    });
  });

  document.addEventListener("click", (event) => {
    if (!isMenuOpen() || !menu || !menuToggle) return;

    const target = event.target;
    if (!(target instanceof Node)) return;

    if (menu.contains(target) || menuToggle.contains(target)) return;
    closeMenu(false);
  });

  document.addEventListener("keydown", (event) => {
    if (!isMenuOpen()) return;

    if (event.key === "Escape") {
      closeMenu(false);
      menuToggle?.focus();
      return;
    }

    if (event.key !== "Tab") return;

    const focusables = getFocusableInMenu();
    if (!focusables.length) return;

    const first = focusables[0];
    const last = focusables[focusables.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });

  mobileMenuMedia.addEventListener?.("change", syncMenuAccessibility);
  syncMenuAccessibility();

  const header = document.querySelector(".site-header");
  const getHeaderOffset = () => (header ? header.offsetHeight + 10 : 0);

  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      const href = link.getAttribute("href");
      if (!href || href.length < 2) return;

      const target = document.querySelector(href);
      if (!target) return;

      const targetUrl = new URL(link.href, window.location.href);
      if (targetUrl.pathname !== window.location.pathname) return;

      event.preventDefault();

      const top = target.getBoundingClientRect().top + window.scrollY - getHeaderOffset();
      if (prefersReducedMotion.matches) {
        window.scrollTo(0, top);
      } else {
        window.scrollTo({ top, behavior: "smooth" });
      }

      history.replaceState(null, "", href);
    });
  });

  const spyLinks = [...document.querySelectorAll("[data-scrollspy][href^='#']")]
    .map((link) => {
      const id = link.getAttribute("href")?.slice(1);
      const section = id ? document.getElementById(id) : null;
      if (!section || !id) return null;
      return { link, id, section };
    })
    .filter(Boolean);

  const setCurrentLink = (activeId) => {
    spyLinks.forEach(({ link, id }) => {
      if (id === activeId) {
        link.setAttribute("aria-current", "page");
      } else {
        link.removeAttribute("aria-current");
      }
    });
  };

  if (spyLinks.length > 0 && "IntersectionObserver" in window) {
    const ratios = new Map();

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const id = entry.target.id;
          ratios.set(id, entry.isIntersecting ? entry.intersectionRatio : 0);
        });

        const mostVisible = [...ratios.entries()].sort((a, b) => b[1] - a[1])[0];
        if (mostVisible && mostVisible[1] > 0) {
          setCurrentLink(mostVisible[0]);
        }
      },
      {
        rootMargin: "-18% 0px -62% 0px",
        threshold: [0.1, 0.25, 0.5, 0.75]
      }
    );

    spyLinks.forEach(({ section }) => observer.observe(section));
  }

  const revealElements = [...document.querySelectorAll("[data-reveal]")];
  if (revealElements.length > 0) {
    if (prefersReducedMotion.matches || !("IntersectionObserver" in window)) {
      revealElements.forEach((element) => element.classList.add("is-visible"));
    } else {
      const revealObserver = new IntersectionObserver(
        (entries, observer) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          });
        },
        {
          threshold: 0.15,
          rootMargin: "0px 0px -8% 0px"
        }
      );

      revealElements.forEach((element) => revealObserver.observe(element));
    }
  }

  document.querySelectorAll("[data-current-year]").forEach((element) => {
    element.textContent = String(new Date().getFullYear());
  });
})();
