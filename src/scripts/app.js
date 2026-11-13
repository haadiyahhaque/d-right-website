(() => {
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

  const year = $("[data-year]");
  if (year) year.textContent = String(new Date().getFullYear());

  /* Header */
  const header = $("[data-header]");
  const onScroll = () => header?.classList.toggle("is-scrolled", window.scrollY > 16);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* Mobile nav */
  const toggle = $("[data-nav-toggle]");
  const mobileNav = $("[data-mobile-nav]");
  const setNav = (open) => {
    if (!mobileNav || !toggle) return;
    mobileNav.toggleAttribute("hidden", !open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  };
  toggle?.addEventListener("click", () => setNav(mobileNav.hasAttribute("hidden")));
  $$("a", mobileNav).forEach((a) => a.addEventListener("click", () => setNav(false)));

  /* Desktop nav dropdowns */
  const navItems = $$("[data-nav-item]");
  const closeMenus = (except) => {
    navItems.forEach((item) => {
      if (item === except) return;
      const trigger = $("[data-menu-trigger]", item);
      const menu = $("[data-menu]", item);
      trigger?.setAttribute("aria-expanded", "false");
      menu?.setAttribute("hidden", "");
      item.classList.remove("is-open");
    });
  };
  const openMenu = (item) => {
    const trigger = $("[data-menu-trigger]", item);
    const menu = $("[data-menu]", item);
    closeMenus(item);
    trigger?.setAttribute("aria-expanded", "true");
    menu?.removeAttribute("hidden");
    item.classList.add("is-open");
  };
  navItems.forEach((item) => {
    const trigger = $("[data-menu-trigger]", item);
    let hoverTimer;
    trigger?.addEventListener("click", (e) => {
      e.stopPropagation();
      const open = trigger.getAttribute("aria-expanded") === "true";
      if (open) closeMenus();
      else openMenu(item);
    });
    item.addEventListener("mouseenter", () => {
      if (window.matchMedia("(min-width: 960px)").matches) {
        clearTimeout(hoverTimer);
        openMenu(item);
      }
    });
    item.addEventListener("mouseleave", () => {
      if (window.matchMedia("(min-width: 960px)").matches) {
        hoverTimer = setTimeout(() => closeMenus(), 160);
      }
    });
  });
  document.addEventListener("click", () => closeMenus());
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeMenus();
  });

  /* Reveal */
  const reveals = $$("[data-reveal]");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          e.target.classList.add("is-in");
          io.unobserve(e.target);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" }
    );
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add("is-in"));
  }

  /* Hero appointment pulse */
  const apptList = $("[data-appt-list]");
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!reduce && apptList) {
    const cycle = () => {
      const first = $(".appt.is-new", apptList);
      if (first) {
        first.classList.remove("is-new");
        void first.offsetWidth;
        first.classList.add("is-new");
      }
      setTimeout(cycle, 4800);
    };
    cycle();
  }

  /* MGW letter panels */
  const letters = $$("[data-letter]");
  letters.forEach((panel) => {
    const activate = () => {
      letters.forEach((p) => p.classList.toggle("is-active", p === panel));
    };
    panel.addEventListener("mouseenter", activate);
    panel.addEventListener("focusin", activate);
    panel.addEventListener("click", activate);
    panel.setAttribute("tabindex", "0");
  });

  /* Without / With MGW compare */
  const compare = $("[data-compare]");
  if (compare) {
    const tabs = $$("[data-compare-tab]", compare);
    const panels = $$("[data-compare-panel]", compare);
    tabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        const id = tab.dataset.compareTab;
        tabs.forEach((t) => {
          const on = t === tab;
          t.classList.toggle("is-active", on);
          t.setAttribute("aria-pressed", String(on));
        });
        panels.forEach((p) => {
          const match = p.dataset.comparePanel === id;
          p.toggleAttribute("hidden", !match);
          p.classList.toggle("is-active", match);
        });
      });
    });
  }

  /* LARIS Standalone / ClinTa Extended mockup */
  const hims = $("[data-hims]");
  if (hims) {
    const modes = $$("[data-hims-mode]", hims);
    const cap = $("[data-hims-cap]", hims);
    const captions = {
      standalone: "Standalone: LARIS runs the whole laboratory on its own.",
      hims: "With ClinTa Extended: patient and order details flow in, verified results and billing flow back.",
    };
    const setMode = (mode) => {
      hims.classList.toggle("is-connected", mode === "hims");
      modes.forEach((btn) => btn.setAttribute("aria-pressed", String(btn.dataset.himsMode === mode)));
      if (cap) cap.textContent = captions[mode] || captions.standalone;
    };
    modes.forEach((btn) => {
      btn.addEventListener("click", () => setMode(btn.dataset.himsMode || "standalone"));
    });
  }

  /* Portal doors */
  const doorWall = $("[data-doors]");
  let counted = false;
  const animateMoney = () => {
    const el = $(".money[data-count]", doorWall || document);
    if (!el || counted) return;
    counted = true;
    const target = Number(el.dataset.count || 0);
    const start = performance.now();
    const tick = (now) => {
      const t = Math.min(1, (now - start) / 1100);
      const eased = 1 - Math.pow(1 - t, 3);
      el.textContent = `PKR ${Math.round(target * eased).toLocaleString("en-PK")}`;
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  if (doorWall) {
    const doors = $$("[data-door]", doorWall);
    const rooms = $$("[data-room]", doorWall);
    doors.forEach((door) => {
      door.addEventListener("click", () => {
        const id = door.dataset.door;
        doors.forEach((d) => {
          const on = d === door;
          d.classList.toggle("is-open", on);
          d.setAttribute("aria-selected", String(on));
        });
        rooms.forEach((room) => {
          const match = room.dataset.room === id;
          room.toggleAttribute("hidden", !match);
          room.classList.toggle("is-active", match);
        });
        if (id === "admin") animateMoney();
      });
    });
  }

  /* Usage calculator */
  const inv = $("[data-inv]");
  const rx = $("[data-rx]");
  const invOut = $("[data-inv-out]");
  const rxOut = $("[data-rx-out]");
  const total = $("[data-usage-total]");
  const fmt = (n) => `PKR ${Math.round(n).toLocaleString("en-PK")}`;
  const updateUsage = () => {
    if (!inv || !rx) return;
    const i = Number(inv.value);
    const r = Number(rx.value);
    if (invOut) invOut.textContent = String(i);
    if (rxOut) rxOut.textContent = String(r);
    if (total) total.textContent = `${fmt(i + r * 5)} / month`;
  };
  inv?.addEventListener("input", updateUsage);
  rx?.addEventListener("input", updateUsage);
  updateUsage();

  /* Demo forms — auto-advance + progress (page + modal) */
  const bindDemoForm = (form) => {
    if (!(form instanceof HTMLFormElement)) return;
    const step1 = $('[data-step="1"]', form);
    const step2 = $('[data-step="2"]', form);
    const success = $("[data-success]", form);
    const successName = $("[data-success-name]", form);
    const stepMeta = $("[data-step-meta]", form);
    const progItems = $$("[data-prog]", form);

    const setProgress = (step) => {
      if (stepMeta) {
        stepMeta.textContent =
          step >= 3 ? "Step 3 of 3 · Complete" : `Step ${step} of 3`;
      }
      progItems.forEach((item) => {
        const n = Number(item.dataset.prog);
        item.classList.toggle("is-current", n === step);
        item.classList.toggle("is-done", n < step);
      });
    };

    const goStep = (n) => {
      if (step1) {
        step1.hidden = n !== 1;
        step1.classList.toggle("is-active", n === 1);
      }
      if (step2) {
        step2.hidden = n !== 2;
        step2.classList.toggle("is-active", n === 2);
      }
      if (success) success.hidden = n !== 3;
      setProgress(n);
      if (n === 2) {
        const nameInput = form.querySelector('input[name="name"]');
        setTimeout(() => nameInput?.focus(), 50);
      }
    };

    setProgress(1);

    form.querySelectorAll('input[name="variant"]').forEach((input) => {
      input.addEventListener("change", () => {
        if (!input.checked) return;
        goStep(2);
      });
    });

    $("[data-back]", form)?.addEventListener("click", () => goStep(1));

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const fd = new FormData(form);
      const variant = String(fd.get("variant") || "Doctor");
      const payload = {
        variant,
        name: String(fd.get("name") || "").trim(),
        phone: String(fd.get("phone") || "").trim(),
        city: String(fd.get("city") || "").trim(),
        email: String(fd.get("email") || "").trim(),
      };
      const submitBtn = form.querySelector('button[type="submit"]');
      if (submitBtn instanceof HTMLButtonElement) {
        submitBtn.disabled = true;
      }
      try {
        const res = await fetch("/api/demo", {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok || !data.ok) {
          window.alert(
            typeof data.error === "string" ? data.error : "Could not submit. Please try again."
          );
          return;
        }
        if (successName) successName.textContent = variant;
        goStep(3);
      } catch {
        window.alert("Could not submit. Please check your connection and try again.");
      } finally {
        if (submitBtn instanceof HTMLButtonElement) {
          submitBtn.disabled = false;
        }
      }
    });

    return { goStep, form };
  };

  $$("[data-demo-form]").forEach((form) => bindDemoForm(form));

  /* Site demo modal (homepage + navbar) */
  const demoModal = $("[data-demo-modal]");
  if (demoModal) {
    const dialog = $("[data-demo-dialog]", demoModal);
    const modalForm = $("[data-demo-modal-form]", demoModal);
    let lastFocus = null;

    const openModal = () => {
      lastFocus = document.activeElement;
      demoModal.hidden = false;
      document.body.classList.add("demo-modal-open");
      if (modalForm instanceof HTMLFormElement) {
        modalForm.reset();
        const step1 = $('[data-step="1"]', modalForm);
        const step2 = $('[data-step="2"]', modalForm);
        const success = $("[data-success]", modalForm);
        if (step1) {
          step1.hidden = false;
          step1.classList.add("is-active");
        }
        if (step2) {
          step2.hidden = true;
          step2.classList.remove("is-active");
        }
        if (success) success.hidden = true;
        const stepMeta = $("[data-step-meta]", modalForm);
        if (stepMeta) stepMeta.textContent = "Step 1 of 3";
        $$("[data-prog]", modalForm).forEach((item) => {
          const n = Number(item.dataset.prog);
          item.classList.toggle("is-current", n === 1);
          item.classList.toggle("is-done", false);
        });
      }
      setTimeout(() => {
        const first = dialog?.querySelector('input[name="variant"]');
        if (first instanceof HTMLElement) first.focus();
        else if (dialog instanceof HTMLElement) dialog.focus();
      }, 30);
    };

    const closeModal = () => {
      demoModal.hidden = true;
      document.body.classList.remove("demo-modal-open");
      if (lastFocus instanceof HTMLElement) lastFocus.focus();
    };

    $$("[data-demo-open]").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        const mobileNav = $("[data-mobile-nav]");
        const toggle = $("[data-nav-toggle]");
        if (mobileNav && !mobileNav.hasAttribute("hidden")) {
          mobileNav.setAttribute("hidden", "");
          toggle?.setAttribute("aria-expanded", "false");
        }
        openModal();
      });
    });

    $$("[data-demo-close]", demoModal).forEach((el) => {
      el.addEventListener("click", () => closeModal());
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && !demoModal.hidden) closeModal();
    });
  }

  /* Careers applications */
  const careersForm = $("[data-careers-form]");
  if (careersForm instanceof HTMLFormElement) {
    const success = $("[data-careers-success]", careersForm);
    const errorEl = $("[data-careers-error]", careersForm);
    const orgField = $("[data-careers-org]", careersForm);
    const cityField = $("[data-careers-city]", careersForm);
    const emailField = $("[data-careers-email]", careersForm);
    const cvField = $("[data-careers-cv]", careersForm);
    const cvRow = $("[data-careers-cv-row]", careersForm);
    const noteField = $("[data-careers-note]", careersForm);
    const submitBtn = $("[data-careers-submit]", careersForm);
    const switchRoot = $("[data-careers-switch]", careersForm);
    const orgInput = orgField?.querySelector("input");
    const cvInput = cvField?.querySelector("input");
    const fileField = $("[data-careers-file]", careersForm);
    const fileInput = $("[data-careers-file-input]", careersForm);
    const fileNameEl = $("[data-careers-file-name]", careersForm);
    const noteInput = noteField?.querySelector("textarea");
    const cvLabel = $("[data-careers-cv-label]", careersForm);
    const fileLabel = $("[data-careers-file-label]", careersForm);
    const noteLabel = $("[data-careers-note-label]", careersForm);

    const syncFileName = () => {
      if (!(fileNameEl instanceof HTMLElement)) return;
      const file = fileInput instanceof HTMLInputElement ? fileInput.files?.[0] : null;
      fileNameEl.textContent = file ? file.name : "No file chosen";
      fileNameEl.classList.toggle("has-file", Boolean(file));
    };

    fileInput?.addEventListener("change", syncFileName);

    const setTrack = (track) => {
      $$('input[name="track"]', careersForm).forEach((r) => {
        if (!(r instanceof HTMLInputElement)) return;
        r.checked = r.value === track;
        r.closest("label")?.classList.toggle("is-active", r.checked);
      });

      const isCorp = track === "corporate";
      if (orgField) orgField.hidden = !isCorp;
      if (cityField) cityField.hidden = false;
      if (emailField) emailField.classList.remove("careers-span-2");
      if (fileField) fileField.hidden = false;
      if (cvRow) cvRow.classList.remove("is-link-only");
      if (orgInput instanceof HTMLInputElement) orgInput.required = isCorp;
      if (cvInput instanceof HTMLInputElement) {
        cvInput.required = false;
        cvInput.placeholder = "https://";
      }
      if (fileLabel) {
        fileLabel.textContent = isCorp ? "Supporting document" : "Curriculum vitae";
      }
      if (cvLabel) {
        cvLabel.textContent = isCorp ? "Document URL" : "Online profile URL";
      }
      if (noteInput instanceof HTMLTextAreaElement) {
        noteInput.required = isCorp;
        noteInput.placeholder = isCorp
          ? "Describe the partnership you have in mind"
          : "Relevant experience or availability";
      }
      if (noteLabel) {
        noteLabel.innerHTML = isCorp
          ? "Partnership overview *"
          : 'Additional information <span class="opt">(optional)</span>';
      }
      if (submitBtn) {
        submitBtn.textContent = isCorp ? "Submit inquiry" : "Submit application";
      }
      if (success) success.hidden = true;
      if (errorEl) {
        errorEl.hidden = true;
        errorEl.textContent = "";
      }
    };

    switchRoot?.addEventListener("change", (e) => {
      const t = e.target;
      if (t instanceof HTMLInputElement && t.name === "track") setTrack(t.value);
    });

    $$("[data-careers-pick]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const track = btn.getAttribute("data-careers-pick") || "mg-developer";
        setTrack(track);
        $("[data-careers-form]")?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
      });
    });

    setTrack("mg-developer");

    careersForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      if (success) success.hidden = true;
      if (errorEl) {
        errorEl.hidden = true;
        errorEl.textContent = "";
      }

      const fd = new FormData(careersForm);
      const track = String(fd.get("track") || "").trim();
      const cvLink = String(fd.get("cv") || "").trim();
      const file = fd.get("cvFile");
      const hasFile = file instanceof File && file.size > 0;

      if (track !== "corporate" && !hasFile && !cvLink) {
        const msg = "Please attach a CV or provide an online profile URL.";
        if (errorEl) {
          errorEl.textContent = msg;
          errorEl.hidden = false;
        } else {
          window.alert(msg);
        }
        return;
      }

      if (hasFile && file instanceof File) {
        if (file.size > 5 * 1024 * 1024) {
          const msg = "CV file must be 5 MB or smaller.";
          if (errorEl) {
            errorEl.textContent = msg;
            errorEl.hidden = false;
          }
          return;
        }
        const name = file.name.toLowerCase();
        if (!/\.(pdf|doc|docx)$/.test(name)) {
          const msg = "Upload a PDF, DOC or DOCX file.";
          if (errorEl) {
            errorEl.textContent = msg;
            errorEl.hidden = false;
          }
          return;
        }
      }

      if (submitBtn instanceof HTMLButtonElement) submitBtn.disabled = true;

      try {
        const res = await fetch("/api/careers", {
          method: "POST",
          headers: { Accept: "application/json" },
          body: fd,
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok || !data.ok) {
          const msg =
            typeof data.error === "string" ? data.error : "Could not submit. Please try again.";
          if (errorEl) {
            errorEl.textContent = msg;
            errorEl.hidden = false;
          } else {
            window.alert(msg);
          }
          return;
        }
        careersForm.querySelectorAll("input:not([type=radio]), textarea").forEach((el) => {
          if (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement) el.value = "";
        });
        setTrack(track);
        syncFileName();
        if (success) success.hidden = false;
      } catch {
        const msg = "Could not submit. Please check your connection and try again.";
        if (errorEl) {
          errorEl.textContent = msg;
          errorEl.hidden = false;
        } else {
          window.alert(msg);
        }
      } finally {
        if (submitBtn instanceof HTMLButtonElement) submitBtn.disabled = false;
      }
    });
  }

  /* Contact form */
  const contactForm = $("[data-contact-form]");
  if (contactForm instanceof HTMLFormElement) {
    const success = $("[data-contact-success]", contactForm);
    const errorEl = $("[data-contact-error]", contactForm);
    const submitBtn = contactForm.querySelector('button[type="submit"]');

    contactForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      if (success) success.hidden = true;
      if (errorEl) {
        errorEl.hidden = true;
        errorEl.textContent = "";
      }

      const fd = new FormData(contactForm);
      const payload = {
        name: String(fd.get("name") || "").trim(),
        email: String(fd.get("email") || "").trim(),
        phone: String(fd.get("phone") || "").trim(),
        subject: String(fd.get("subject") || "").trim(),
        message: String(fd.get("message") || "").trim(),
      };

      if (submitBtn instanceof HTMLButtonElement) submitBtn.disabled = true;

      try {
        const res = await fetch("/api/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok || !data.ok) {
          const msg =
            typeof data.error === "string" ? data.error : "Could not send. Please try again.";
          if (errorEl) {
            errorEl.textContent = msg;
            errorEl.hidden = false;
          } else {
            window.alert(msg);
          }
          return;
        }
        contactForm.reset();
        if (success) success.hidden = false;
      } catch {
        const msg = "Could not send. Please check your connection and try again.";
        if (errorEl) {
          errorEl.textContent = msg;
          errorEl.hidden = false;
        } else {
          window.alert(msg);
        }
      } finally {
        if (submitBtn instanceof HTMLButtonElement) submitBtn.disabled = false;
      }
    });
  }

  /* FAQ accordion */
  const faq = $("[data-faq]");
  faq?.addEventListener(
    "toggle",
    (e) => {
      const t = e.target;
      if (!(t instanceof HTMLDetailsElement) || !t.open) return;
      $$("details", faq).forEach((d) => {
        if (d !== t) d.open = false;
      });
    },
    true
  );

  /* Subtle parallax on hero watermark */
  const watermark = $(".hero-watermark");
  if (watermark && !reduce) {
    window.addEventListener(
      "scroll",
      () => {
        const y = Math.min(120, window.scrollY * 0.18);
        watermark.style.transform = `translate(-50%, calc(-50% + ${y}px))`;
      },
      { passive: true }
    );
  }

  /* Horizontal review / shorts sliders */
  const initScrollSlider = (root, opts) => {
    if (!root) return;
    const track = $(opts.track, root);
    if (!track) return;
    const controlsRoot = $(opts.controls) || root;
    const prev = $(opts.prev, controlsRoot);
    const next = $(opts.next, controlsRoot);
    const loop = Boolean(opts.loop);
    let timer = null;
    let paused = false;
    let jumping = false;
    let cycle = 0;

    const originals = $$(opts.item, track);
    if (loop && originals.length) {
      originals.forEach((card) => {
        const clone = card.cloneNode(true);
        clone.setAttribute("aria-hidden", "true");
        track.appendChild(clone);
      });
    }

    const step = () => {
      const card = $(opts.item, track);
      if (!card) return 240;
      const styles = getComputedStyle(track);
      const gap = parseFloat(styles.columnGap || styles.gap) || 0;
      return card.getBoundingClientRect().width + gap;
    };

    const measureCycle = () => {
      if (!loop || !originals.length) return 0;
      return originals.length * step();
    };

    const maxScroll = () => track.scrollWidth - track.clientWidth;

    const snapOff = () => {
      track.style.scrollSnapType = "none";
    };
    const snapOn = () => {
      track.style.scrollSnapType = "";
    };

    const normalize = () => {
      if (!loop || jumping) return;
      cycle = measureCycle();
      if (cycle <= 2) return;
      if (track.scrollLeft >= cycle - 2) {
        jumping = true;
        snapOff();
        track.scrollLeft = track.scrollLeft - cycle;
        requestAnimationFrame(() => {
          snapOn();
          jumping = false;
          sync();
        });
      }
    };

    const sync = () => {
      if (!prev || !next) return;
      if (loop) {
        prev.disabled = false;
        next.disabled = false;
        return;
      }
      const max = maxScroll() - 2;
      prev.disabled = track.scrollLeft <= 2;
      next.disabled = track.scrollLeft >= max;
    };

    const go = (dir) => {
      cycle = measureCycle();
      if (loop && cycle > 2) {
        if (dir < 0 && track.scrollLeft <= 2) {
          jumping = true;
          snapOff();
          track.scrollLeft = track.scrollLeft + cycle;
          requestAnimationFrame(() => {
            snapOn();
            jumping = false;
            track.scrollBy({ left: dir * step(), behavior: "smooth" });
          });
          return;
        }
        track.scrollBy({ left: dir * step(), behavior: "smooth" });
        return;
      }
      const max = maxScroll();
      if (max <= 2) return;
      if (dir > 0 && track.scrollLeft >= max - 4) {
        track.scrollTo({ left: 0, behavior: "smooth" });
      } else if (dir < 0 && track.scrollLeft <= 2) {
        track.scrollTo({ left: max, behavior: "smooth" });
      } else {
        track.scrollBy({ left: dir * step(), behavior: "smooth" });
      }
    };

    const advance = () => {
      if (paused || reduce) return;
      go(1);
    };

    const start = () => {
      stop();
      if (reduce || paused) return;
      timer = window.setInterval(advance, 3200);
    };

    const stop = () => {
      if (timer) {
        clearInterval(timer);
        timer = null;
      }
    };

    prev?.addEventListener("click", () => {
      go(-1);
      start();
    });
    next?.addEventListener("click", () => {
      go(1);
      start();
    });

    const pauseZone = opts.pause ? $(opts.pause) || root : root;
    pauseZone.addEventListener("mouseenter", () => {
      paused = true;
      stop();
    });
    pauseZone.addEventListener("mouseleave", () => {
      paused = false;
      start();
    });
    pauseZone.addEventListener("focusin", () => {
      paused = true;
      stop();
    });
    pauseZone.addEventListener("focusout", (e) => {
      if (!pauseZone.contains(e.relatedTarget)) {
        paused = false;
        start();
      }
    });

    track.addEventListener(
      "scroll",
      () => {
        sync();
      },
      { passive: true }
    );
    track.addEventListener("scrollend", normalize);
    /* Fallback when scrollend is unavailable */
    if (!("onscrollend" in window)) {
      let settleTimer = null;
      track.addEventListener(
        "scroll",
        () => {
          if (settleTimer) clearTimeout(settleTimer);
          settleTimer = window.setTimeout(normalize, 140);
        },
        { passive: true }
      );
    }
    window.addEventListener(
      "resize",
      () => {
        cycle = measureCycle();
        sync();
      },
      { passive: true }
    );

    if ("IntersectionObserver" in window) {
      const vio = new IntersectionObserver(
        (entries) => {
          const on = entries.some((e) => e.isIntersecting);
          if (on) start();
          else stop();
        },
        { threshold: 0.2 }
      );
      vio.observe(root);
    } else {
      start();
    }

    cycle = measureCycle();
    sync();
  };

  initScrollSlider($("[data-shorts-slider]"), {
    track: "[data-shorts-track]",
    controls: "[data-shorts-controls]",
    prev: "[data-shorts-prev]",
    next: "[data-shorts-next]",
    item: ".short",
    pause: ".reviews",
  });

  initScrollSlider($("[data-proof-slider]"), {
    track: "[data-proof-track]",
    controls: "[data-proof-controls]",
    prev: "[data-proof-prev]",
    next: "[data-proof-next]",
    item: ".proof-card",
    pause: ".home-proof",
    loop: true,
  });
})();
