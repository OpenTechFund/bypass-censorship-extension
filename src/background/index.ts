import * as browser from 'webextension-polyfill';
import cache from 'webext-storage-cache';
import { getCurrentTabUrl } from '../utils/tabs';
import { getCachedMirrors } from '../utils/mirrors';

const defaultIcons = {
  '16': 'src/icons/default/16.png',
  '48': 'src/icons/default/48.png',
  '96': 'src/icons/default/96.png',
  '128': 'src/icons/default/128.png',
};

const redIcons = {
  '16': 'src/icons/red/16.png',
  '48': 'src/icons/red/48.png',
  '96': 'src/icons/red/96.png',
  '128': 'src/icons/red/128.png',
};

const greenIcons = {
  '16': 'src/icons/green/16.png',
  '48': 'src/icons/green/48.png',
  '96': 'src/icons/green/96.png',
  '128': 'src/icons/green/128.png',
};

// ugly hack to get around Chrome permission & focus issue:
// Can't access clipboard API from popup, but fails in background
// because popup is focused. Have to use deprecated API.
function clipboardWriteText(text: string) {
  const input = document.createElement('input');
  document.body.appendChild(input);
  input.value = text;
  input.focus();
  input.select();
  document.execCommand('copy');
  input.remove();
}

// Check if the URL on the current tab is bound to a list of mirrors. If so,
// indicate it to the user by turning the icon red.
async function updateButton(tabId: number) {
  const mirrors = await getCachedMirrors();
  let url: URL;
  try {
    url = await getCurrentTabUrl();
  } catch (error) {
    console.error('Failed to get tab domain:', error);
  }
  const domain = url.hostname.replace('www.', '')
  let hasMirror = false;
  let isMirror = false;
  if (domain && mirrors) {
    hasMirror = mirrors.has(domain);
    isMirror = await cache.has(domain);
  }

  if (hasMirror) {
    await browser.browserAction.setIcon({ path: redIcons, tabId });
  } else if (isMirror) {
    // If we have proxies but we don't have mirrors, must already be a mirror
    await browser.browserAction.setIcon({ path: greenIcons, tabId });
  } else {
    await browser.browserAction.setIcon({ path: defaultIcons, tabId });
  }
}

// Run the updateTab() function on tab switch (Ctrl+Tab), creation or target
// update
browser.tabs.onActivated.addListener(({ tabId }) => updateButton(tabId));
browser.tabs.onUpdated.addListener(updateButton);
browser.runtime.onMessage.addListener((message) => {
  return clipboardWriteText(message.content);
});
