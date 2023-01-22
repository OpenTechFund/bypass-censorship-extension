import * as browser from 'webextension-polyfill';
import cache from 'webext-storage-cache';
import { getCurrentTabUrl } from '../utils/tabs';
import { getCachedMirrors } from '../utils/mirrors';
import { options } from '../utils/options';
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
  const mirror = document.createElement('p');
  const message = document.createElement('div');
  let hasMirror = false;
  let isMirror = false;
  let bridges = [];
  if (domain && mirrors) {
    let alts = [];
    hasMirror = mirrors.has(domain);
    isMirror = await cache.has(domain);
    if (hasMirror) {
      alts = mirrors.get(domain);
    }

    if (alts.length) {
      bridges = [...alts].filter(item => item.type === 'tor' || item.type === 'eotk');
    }
    if (hasMirror) {
      const { key }: { key: string } = await options.getAll();
      const tabs = await browser.tabs.query({ active: true, lastFocusedWindow: true });
      if (key) {
        try {
          const proxy = await fetchLink(url);
          //url.hostname = new URL(proxy).hostname;
          await browser.runtime.sendMessage({ type: "copy-to-clipboard", content: proxy });
          browser.browserAction.setBadgeText({ text: "✅", tabId: tabs[0].id });
          browser.browserAction.setBadgeBackgroundColor({ color: null, tabId: tabs[0].id });
        } catch (err) {
          console.error(err);
          browser.browserAction.setBadgeText({ text: "❌", tabId: tabs[0].id });
          browser.browserAction.setBadgeBackgroundColor({ color: null, tabId: tabs[0].id });
        }
        window.close();
      }
      message.innerText = browser.i18n.getMessage('hasmirror');
      const button = document.createElement('button');
      button.innerText = browser.i18n.getMessage('hasmirror_button');
      button.addEventListener('click', async () => {
        const proxy = await fetchLink(url);
        //url.hostname = new URL(proxy).hostname;
        await browser.tabs.update({ url: `${proxy}` });
        window.close(); // TODO: won't work in Firefox Android
      });
      mirror.appendChild(message);
      mirror.appendChild(button);
      popup.appendChild(mirror);
      const tor = document.createElement('p');
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
      tor.appendChild(torMessage);
      tor.appendChild(torDownload);
      tor.appendChild(torButton);
      tor.appendChild(copyMessage);
      popup.appendChild(tor);
    } else if (isMirror) {
      message.innerText = browser.i18n.getMessage('onemirror');
      popup.appendChild(message);
    } else {
      message.innerText = browser.i18n.getMessage('nomirror');
      popup.appendChild(message);
    }
  }
}

document.addEventListener('DOMContentLoaded', popup);
