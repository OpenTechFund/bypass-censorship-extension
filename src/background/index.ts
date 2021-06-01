import { browser } from 'webextension-polyfill-ts';
import { getCurrentTabDomain } from '../utils/tabs';
import { getCachedMirrors } from '../utils/mirrors';

const defaultIcons = {
  "16": "src/icons/default/16.png",
  "48": "src/icons/default/48.png",
  "96": "src/icons/default/96.png",
  "128": "src/icons/default/128.png"
};

const redIcons = {
  "16": "src/icons/red/16.png",
  "48": "src/icons/red/48.png",
  "96": "src/icons/red/96.png",
  "128": "src/icons/red/128.png"
};

// Check if the URL on the current tab is bound to a list of mirrors. If so,
// indicate it to the user by turning the icon red.
async function updateButton() {
  const mirrors = await getCachedMirrors();
	let domain: string;
	try {
		domain = await getCurrentTabDomain();
		//console.log('***browser.storage.local***:', browser.storage.local.get('cached-mirrors'));
	} catch (error) {
		console.error('Failed to get tab domain:', error);
	}
  if (domain && mirrors && mirrors.has(domain)) {
    await browser.browserAction.setIcon({ path: redIcons })
  } else {
    await browser.browserAction.setIcon({ path: defaultIcons })
  }
}

// Run the updateTab() function on tab switch (Ctrl+Tab), creation or target
// update
browser.tabs.onActivated.addListener(updateButton)
browser.tabs.onUpdated.addListener(updateButton)
