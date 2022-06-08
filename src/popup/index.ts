import { getCurrentTabDomain } from '../utils/tabs';
import { getCachedMirrors } from '../utils/mirrors';

async function popup() {
  const mirrors = await getCachedMirrors();
  let domain: string;
  try {
    domain = await getCurrentTabDomain();
  } catch (error) {
    console.error('Failed to get tab domain:', error);
  }
  const popup = document.getElementById('popup');
  const message = document.createElement('div');
  let hasMirror = false;
  let proxies = [];
  if (domain && mirrors) {
    let alts = [];
    hasMirror = mirrors.has(domain);
    if (hasMirror) {
      alts = mirrors.get(domain);
    } else if (mirrors.hasRev(domain)) {
      alts = mirrors.getRev(domain);
    }

    if (alts.length > 0) {
      proxies = [...alts].filter((item) => item.proto === 'https');
    }
    if (proxies.length > 0) {
      if (hasMirror) {
        message.innerText = browser.i18n.getMessage('hasmirror');
        const button = document.createElement('button');
        button.innerText = browser.i18n.getMessage('hasmirror_button');
        button.addEventListener('click', async () => {
          const proxy = proxies[Math.floor(Math.random() * proxies.length)];
          await browser.tabs.update({ url: `${proxy.url}` });
          window.close(); // TODO: won't work in Firefox Android
        });
        popup.appendChild(message);
        popup.appendChild(button);
      } else if (proxies.length > 1) {
        message.innerText = browser.i18n.getMessage('ismirror');
        const button = document.createElement('button');
        button.innerText = browser.i18n.getMessage('ismirror_button');
        button.addEventListener('click', async () => {
          const proxy = proxies.filter((item) => item.url !== domain)[Math.floor(Math.random() * proxies.length)];
          await browser.tabs.update({ url: `${proxy.url}` });
          window.close(); // TODO: won't work in Firefox Android
        });
        popup.appendChild(message);
        popup.appendChild(button);
      } else {
        message.innerText = browser.i18n.getMessage('onemirror');
      popup.appendChild(message);
      }
    } else {
      message.innerText = browser.i18n.getMessage('nomirror');
      popup.appendChild(message);
    }
  }
}

document.addEventListener('DOMContentLoaded', popup);
