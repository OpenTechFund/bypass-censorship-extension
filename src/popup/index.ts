import { browser } from 'webextension-polyfill-ts';
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
  const hasMirror = domain && mirrors ? mirrors.has(domain) : false;
  let proxies = [];
  if (hasMirror) {
    const alts = mirrors.get(domain);
    proxies = [...alts].filter(item => item.proto === 'https');
  }
  if (proxies.length > 0) {
    message.innerText = browser.i18n.getMessage('mirror');
    const mirrorButton = document.createElement('button');
    mirrorButton.classList.add('button');
    mirrorButton.innerText = browser.i18n.getMessage('mirror_button');
    mirrorButton.addEventListener('click', async () => {
      const proxy = proxies[Math.floor(Math.random() * proxies.length)];
      await browser.tabs.update({ url: `${proxy.url}` });
      window.close(); // TODO: won't work in Firefox Android
    });
    popup.appendChild(message);
    popup.appendChild(mirrorButton);
  } else {
    message.innerText = browser.i18n.getMessage('nomirror');
    popup.appendChild(message);
  }
  const issueButton = document.createElement('button');
  issueButton.classList.add('button', 'button-issue');
  issueButton.innerText = browser.i18n.getMessage('issue');
  issueButton.addEventListener('click', async () => {
    console.log('button clicked...');
  });
  popup.appendChild(issueButton);
}

document.addEventListener('DOMContentLoaded', popup);
