document.documentElement.classList.add('js');

const Cendekia = {
  init() {
    this.initExportMode();
    this.initDialogs();
    this.initMobileNav();
    this.initTabs();
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
          restoreFocus();
        }
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
      if (event.target.closest('a') && window.innerWidth < 980) {
        closeNav(false);
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
