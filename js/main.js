document.documentElement.classList.add('js');

const Cendekia = {
  init() {
    this.initDialogs();
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
};

window.Cendekia = Cendekia;
document.addEventListener('DOMContentLoaded', () => Cendekia.init());
