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
  }

  if (hasMirror && bridges.length) {
    await browser.browserAction.setBadgeText({ text: "🧅", tabId });
  }
  if (hasMirror) {
    await browser.browserAction.setIcon({ path: redIcons });
  } else if (isMirror) {
    // If we have proxies but we don't have mirrors, must already be a mirror
    await browser.browserAction.setIcon({ path: greenIcons });
  } else {
    await browser.browserAction.setIcon({ path: defaultIcons });
  }
}

// Run the updateTab() function on tab switch (Ctrl+Tab), creation or target
// update
browser.tabs.onActivated.addListener(({ tabId }) => updateButton(tabId));
browser.tabs.onUpdated.addListener(updateButton);
browser.browserAction.onClicked.addListener(async () => {
  //const { click_copy }: { click_copy: boolean } = await options.getAll();
  const click_copy = true;
  console.error(`click_copy: ${click_copy}`);
  if (click_copy) {
    console.error("CLIPBOARD");
  } else {
    browser.browserAction.openPopup();
  }
})
