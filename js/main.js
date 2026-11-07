document.documentElement.classList.add('js');

const LEAD_PROGRAMS = {
  'english-teens': { name: 'English for Teens', language: 'inggris', schedule: 'weekday-sore' },
  'english-campus': { name: 'English for Campus', language: 'inggris', schedule: 'weekday-malam' },
  'english-work': { name: 'English for Work', language: 'inggris', schedule: 'online' },
  'japanese-n5': { name: 'Japanese N5', language: 'jepang', schedule: 'sabtu' },
  'japanese-n4': { name: 'Japanese N4', language: 'jepang', schedule: 'sabtu' },
  'mandarin-hsk1-2': { name: 'Mandarin HSK 1–2', language: 'mandarin', schedule: 'weekday-malam' },
};

const LEAD_LABELS = {
  audience: { sma: 'SMA', mahasiswa: 'Mahasiswa', pekerja: 'Pekerja' },
  language: { inggris: 'Inggris', jepang: 'Jepang', mandarin: 'Mandarin' },
  level: { pemula: 'Pemula', 'pernah-belajar': 'Pernah belajar', menengah: 'Menengah' },
  schedule: {
    'weekday-sore': 'Weekday sore (16.00–18.00)',
    'weekday-malam': 'Weekday malam (18.30–20.30)',
    sabtu: 'Sabtu (09.00–15.30)',
    online: 'Online',
  },
};

const LEAD_FIELDS = [
  'name',
  'whatsapp',
  'email',
  'audience',
  'language',
  'level',
  'schedule',
  'goal',
  'consent',
];

const Cendekia = {
  init() {
    this.initExportMode();
    this.initDialogs();
    this.initMobileNav();
    this.initTabs();
    this.initProgramFilters();
    this.initLeadForm();
    this.initWireframe();
    this.initStickyCta();
    this.initReveal();
  },

  initDialogs() {
    document.querySelectorAll('dialog[data-dialog]').forEach((dialog) => {
      const name = dialog.dataset.dialog;
      const triggers = document.querySelectorAll(`[data-dialog-open="${name}"]`);
      let lastTrigger = null;

      const unlockScroll = () => {
        document.body.classList.remove('has-dialog-open');
      };

      const restoreFocus = () => {
        unlockScroll();
        if (lastTrigger instanceof HTMLElement) {
          lastTrigger.focus();
        }
      };

      const close = () => {
        if (dialog.open) {
          dialog.close();
        } else {
          dialog.removeAttribute('open');
        }
        restoreFocus();
      };

      triggers.forEach((trigger) => {
        trigger.addEventListener('click', (event) => {
          event.preventDefault();
          lastTrigger = trigger;
          if (typeof dialog.showModal === 'function') {
            dialog.showModal();
          } else {
            dialog.setAttribute('open', '');
          }
          document.body.classList.add('has-dialog-open');
        });
      });

      dialog.querySelectorAll('[data-dialog-close]').forEach((button) => {
        button.addEventListener('click', close);
      });

      dialog.addEventListener('click', (event) => {
        if (event.target === dialog) {
          close();
        }
      });

      dialog.addEventListener('cancel', (event) => {
        event.preventDefault();
        close();
      });

      dialog.addEventListener('close', restoreFocus);
    });
  },

  initMobileNav() {
    const toggle = document.querySelector('[data-nav-toggle]');
    const nav = document.querySelector('[data-nav]');
    if (!toggle || !nav) return;

    let open = false;
    const label = toggle.querySelector('.nav-toggle-label');

    const links = () => [...nav.querySelectorAll('a[href]')];
    const focusables = () => [toggle, ...links()];

    const setOpen = (next) => {
      open = next;
      nav.classList.toggle('is-open', next);
      toggle.setAttribute('aria-expanded', String(next));
      if (label) {
        label.textContent = next ? 'Tutup' : 'Menu';
      }
    };

    const openNav = () => {
      setOpen(true);
      links()[0]?.focus();
    };

    const closeNav = (returnFocus = true) => {
      setOpen(false);
      if (returnFocus) {
        toggle.focus();
      }
    };

    toggle.addEventListener('click', () => (open ? closeNav() : openNav()));

    document.addEventListener('keydown', (event) => {
      if (!open) return;

      if (event.key === 'Escape') {
        event.preventDefault();
        closeNav();
        return;
      }

      if (event.key !== 'Tab') return;

      const items = focusables();
      if (items.length === 0) return;

      const first = items[0];
      const last = items[items.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth >= 980 && open) {
        closeNav(false);
      }
    });

    nav.addEventListener('click', (event) => {
      const link = event.target.closest('a');
      if (!link || window.innerWidth >= 980) return;

      closeNav(false);

      const url = new URL(link.href, window.location.href);
      const samePage = url.pathname === window.location.pathname;
      const target = samePage && url.hash ? document.getElementById(url.hash.slice(1)) : null;

      if (target) {
        target.setAttribute('tabindex', '-1');
        target.focus({ preventScroll: true });
      }
    });
  },

  initTabs() {
    const list = document.querySelector('[role="tablist"]');
    if (!list) return;

    const tabs = [...list.querySelectorAll('[data-tab]')];
    const panels = tabs.map((tab) => document.getElementById(tab.getAttribute('aria-controls')));

    if (tabs.length === 0 || panels.some((panel) => !panel)) return;

    const activate = (index, { focus = false } = {}) => {
      tabs.forEach((tab, tabIndex) => {
        const selected = tabIndex === index;
        tab.setAttribute('aria-selected', String(selected));
        tab.tabIndex = selected ? 0 : -1;
        panels[tabIndex].hidden = !selected;
      });

      if (focus) {
        tabs[index].focus();
      }
    };

    tabs.forEach((tab, index) => {
      tab.addEventListener('click', () => activate(index));

      tab.addEventListener('keydown', (event) => {
        let next = null;

        if (event.key === 'ArrowRight') {
          next = (index + 1) % tabs.length;
        } else if (event.key === 'ArrowLeft') {
          next = (index - 1 + tabs.length) % tabs.length;
        } else if (event.key === 'Home') {
          next = 0;
        } else if (event.key === 'End') {
          next = tabs.length - 1;
        }

        if (next === null) return;
        event.preventDefault();
        activate(next, { focus: true });
      });
    });

    const initial = tabs.findIndex((tab) => tab.getAttribute('aria-selected') === 'true');
    activate(initial < 0 ? 0 : initial);
  },

  initProgramFilters() {
    const bar = document.querySelector('[data-program-filters]');
    if (!bar) return;

    const buttons = [...bar.querySelectorAll('[data-filter]')];
    const cards = [...document.querySelectorAll('[data-program-card]')];
    if (buttons.length === 0 || cards.length === 0) return;

    const apply = (filter) => {
      buttons.forEach((button) => {
        button.setAttribute('aria-pressed', String(button.dataset.filter === filter));
      });

      cards.forEach((card) => {
        card.hidden = filter !== 'all' && card.dataset.language !== filter;
      });
    };

    buttons.forEach((button) => {
      button.addEventListener('click', () => apply(button.dataset.filter));
    });
  },

  initLeadForm() {
    const form = document.querySelector('[data-lead-form]');
    if (!form) return;

    this.prefillLeadProgram(form);

    const submit = form.querySelector('[data-submit]');
    if (submit) {
      submit.addEventListener('click', (event) => {
        event.preventDefault();
        this.submitLeadForm(form);
      });
    }

    form.addEventListener('keydown', (event) => {
      if (event.key !== 'Enter' || event.target instanceof HTMLTextAreaElement) return;
      event.preventDefault();
      this.submitLeadForm(form);
    });

    form.addEventListener('input', (event) => {
      const field = event.target.name;
      if (!field) return;
      const error = form.querySelector(`[data-error-for="${field}"]`);
      if (!error || error.hidden) return;
      error.textContent = '';
      error.hidden = true;
      form
        .querySelectorAll(`[name="${field}"]`)
        .forEach((control) => control.removeAttribute('aria-invalid'));
    });
  },

  prefillLeadProgram(form) {
    const slug = new URLSearchParams(window.location.search).get('program');
    if (!slug || !Object.hasOwn(LEAD_PROGRAMS, slug)) return;

    const program = LEAD_PROGRAMS[slug];

    const note = document.querySelector('[data-program-note]');
    const name = document.querySelector('[data-program-name]');
    if (name) name.textContent = program.name;
    if (note) note.hidden = false;

    const language = form.querySelector(`[name="language"][value="${program.language}"]`);
    if (language) language.checked = true;

    const schedule = form.querySelector('[name="schedule"]');
    if (schedule) schedule.value = program.schedule;
  },

  normalizePhone(value) {
    return String(value ?? '')
      .replace(/[\s-]/g, '')
      .replace(/^\+/, '');
  },

  isIndonesianPhone(value) {
    const phone = this.normalizePhone(value);
    return /^08\d{8,11}$/.test(phone) || /^628\d{8,11}$/.test(phone);
  },

  validateLeadForm(form) {
    const data = new FormData(form);
    const read = (name) => String(data.get(name) ?? '').trim();
    const errors = {};

    if (read('name').length < 2) {
      errors.name = 'Nama minimal 2 karakter.';
    }

    if (!this.isIndonesianPhone(read('whatsapp'))) {
      errors.whatsapp = 'Masukkan nomor WhatsApp Indonesia yang valid (08… atau 628…).';
    }

    const email = read('email');
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = 'Format email belum benar.';
    }

    if (!read('audience')) errors.audience = 'Pilih salah satu.';
    if (!read('language')) errors.language = 'Pilih bahasa yang ingin dipelajari.';
    if (!read('level')) errors.level = 'Pilih level kamu.';
    if (!read('schedule')) errors.schedule = 'Pilih jadwal favorit.';
    if (read('goal').length > 300) errors.goal = 'Maksimal 300 karakter.';

    const consent = form.querySelector('[name="consent"]');
    if (!consent || !consent.checked) {
      errors.consent = 'Kamu perlu setuju untuk dihubungi via WhatsApp.';
    }

    LEAD_FIELDS.forEach((field) => {
      const message = errors[field];
      const error = form.querySelector(`[data-error-for="${field}"]`);

      form.querySelectorAll(`[name="${field}"]`).forEach((control) => {
        if (message) {
          control.setAttribute('aria-invalid', 'true');
        } else {
          control.removeAttribute('aria-invalid');
        }
      });

      if (error) {
        error.textContent = message ?? '';
        error.hidden = !message;
      }
    });

    const firstInvalid = LEAD_FIELDS.find((field) => errors[field]) ?? null;
    if (firstInvalid) {
      form.querySelector(`[name="${firstInvalid}"]`)?.focus();
    }

    return { valid: firstInvalid === null, firstInvalid };
  },

  submitLeadForm(form) {
    const result = this.validateLeadForm(form);
    if (!result.valid) return;

    const data = new FormData(form);
    const read = (name) => String(data.get(name) ?? '').trim();
    const values = {
      name: read('name'),
      whatsapp: this.normalizePhone(read('whatsapp')),
      audience: LEAD_LABELS.audience[read('audience')] ?? read('audience'),
      language: LEAD_LABELS.language[read('language')] ?? read('language'),
      level: LEAD_LABELS.level[read('level')] ?? read('level'),
      schedule: LEAD_LABELS.schedule[read('schedule')] ?? read('schedule'),
    };

    const panel = document.querySelector('[data-form-success]');
    if (!panel) return;

    panel.querySelectorAll('[data-summary]').forEach((slot) => {
      slot.textContent = values[slot.dataset.summary] ?? '';
    });

    form.hidden = true;
    panel.hidden = false;
    panel.querySelector('h2')?.focus();
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    panel.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
  },

  initWireframe() {
    const stage = document.querySelector('[data-wireframe-stage]');
    if (!stage) return;

    const frames = [...document.querySelectorAll('[data-artboard-frame]')];
    const tabs = [...document.querySelectorAll('[data-artboard-tab]')];
    if (frames.length === 0) return;

    const params = new URLSearchParams(window.location.search);
    if (params.get('export') === '1') {
      document.documentElement.classList.add('is-export', 'is-wireframe-export');
    }

    const setActive = (name) => {
      if (!frames.some((frame) => frame.dataset.artboardFrame === name)) return;
      frames.forEach((frame) => {
        frame.classList.toggle('is-active', frame.dataset.artboardFrame === name);
      });
      tabs.forEach((tab) => {
        tab.setAttribute('aria-pressed', String(tab.dataset.artboardTab === name));
      });
      document.documentElement.dataset.wireframeArtboard = name;
    };

    const requested = params.get('artboard');
    const hasRequest = ['desktop', 'mobile'].includes(requested);

    if (hasRequest) {
      document.documentElement.classList.add('has-artboard-request');
    }

    const initial = hasRequest
      ? requested
      : window.matchMedia('(max-width: 759px)').matches
        ? 'mobile'
        : 'desktop';

    setActive(initial);

    let userChosen = false;

    if (!hasRequest) {
      const media = window.matchMedia('(max-width: 759px)');
      media.addEventListener('change', (event) => {
        if (!userChosen) setActive(event.matches ? 'mobile' : 'desktop');
      });
    }

    tabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        userChosen = true;
        setActive(tab.dataset.artboardTab);
      });
    });
  },

  initStickyCta() {
    const bar = document.querySelector('[data-sticky-cta]');
    const hero = document.querySelector('[data-hero]');
    if (!bar || !hero) return;

    const setVisible = (visible) => {
      bar.hidden = !visible;
      document.body.classList.toggle('has-sticky-cta', visible);
    };

    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => setVisible(!entry.isIntersecting));
        },
        { threshold: 0 },
      );
      observer.observe(hero);
      return;
    }

    const update = () => setVisible(window.scrollY > hero.offsetTop + hero.offsetHeight);
    window.addEventListener('scroll', update, { passive: true });
    update();
  },

  initReveal() {
    const items = [...document.querySelectorAll('[data-reveal]')];
    if (items.length === 0) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion || !('IntersectionObserver' in window)) {
      items.forEach((item) => item.classList.add('is-visible'));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.12 },
    );

    items.forEach((item) => observer.observe(item));
  },

  initExportMode() {
    const params = new URLSearchParams(window.location.search);
    if (params.get('export') === '1') {
      document.documentElement.classList.add('is-export');
    }
  },
};

window.Cendekia = Cendekia;
document.addEventListener('DOMContentLoaded', () => Cendekia.init());
