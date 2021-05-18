import { browser } from 'webextension-polyfill-ts';

function translate(): void {
  document.querySelectorAll('[data-i18n]').forEach(element => {
    element.innerText = browser.i18n.getMessage(element.dataset.i18n);
  })
}

translate();
