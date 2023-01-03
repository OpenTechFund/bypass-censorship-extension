import * as browser from 'webextension-polyfill';
import { getCurrentTabUrl } from '../utils/tabs';
import { getCachedMirrors } from '../utils/mirrors';
import { fetchLink } from '../utils/link';

const TOR_DOWNLOAD_URL = "https://torproject.org/download"

async function popup() {
  const mirrors = await getCachedMirrors();
  let url: URL;
  try {
    url = await getCurrentTabUrl();
  } catch (error) {
    console.error('Failed to get tab domain:', error);
  }
  const domain = url.hostname.replace('www.', '')
  const popup = document.getElementById('popup');
  const message = document.createElement('div');
  let hasMirror = false;
  let proxies = [];
  let bridges = [];
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
      bridges = [...alts].filter(item => item.type === 'tor' || item.type === 'eotk');
    }
    if (proxies.length || bridges.length) {
      if (hasMirror && proxies.length) {
        message.innerText = browser.i18n.getMessage('hasmirror');
        const button = document.createElement('button');
        button.innerText = browser.i18n.getMessage('hasmirror_button');
        button.addEventListener('click', async () => {
          const proxy = await fetchLink(url);
          console.error('proxy:', proxy);
          //const proxy = proxies[Math.floor(Math.random() * proxies.length)];
          url.hostname = new URL(proxy).hostname;
          await browser.tabs.update({ url: `${url.toString()}` });
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
          url.hostname = new URL(proxy.url).hostname;
          await browser.tabs.update({ url: `${url.toString()}` });
          window.close(); // TODO: won't work in Firefox Android
        });
        popup.appendChild(message);
        popup.appendChild(button);
      } else if (!bridges.length) {
        message.innerText = browser.i18n.getMessage('onemirror');
        popup.appendChild(message);
      }
      if (bridges.length) {
        const torMessage = document.createElement('div');
        const torButton = document.createElement('button');
        const torDownload = document.createElement('button');
        const copyMessage = document.createElement('div');
        torMessage.innerText = browser.i18n.getMessage('tor');
        torButton.innerText = browser.i18n.getMessage('tor_button');
        torDownload.innerText = browser.i18n.getMessage('tor_download');
        torButton.addEventListener('click', async () => {
          const bridge = bridges[Math.floor(Math.random() * bridges.length)];
          url.hostname = new URL(bridge.url).hostname;
          navigator.clipboard.writeText(url.toString()).then(function() {
            copyMessage.innerText = browser.i18n.getMessage('copy');
          }, function() {
            copyMessage.innerText = browser.i18n.getMessage('copy_error');
          });
        })
        torDownload.addEventListener('click', async () => {
          await browser.tabs.create({ url: `${TOR_DOWNLOAD_URL}` });
          window.close(); // TODO: won't work in Firefox Android
        })
        popup.appendChild(torMessage);
        popup.appendChild(torDownload);
        popup.appendChild(torButton);
        popup.appendChild(copyMessage);
      }
    } else {
      message.innerText = browser.i18n.getMessage('nomirror');
      popup.appendChild(message);
    }
  }
}

document.addEventListener('DOMContentLoaded', popup);
