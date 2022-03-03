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
	let bridges = [];
	if (hasMirror) {
		const alts = mirrors.get(domain);
		proxies = [...alts].filter(item => item.proto === 'https');
		bridges = [...alts].filter(item => item.type === 'tor' || item.type === 'eotk');
	}
	if (proxies.length || bridges.length) {
		if (proxies.length) {
			message.innerText = browser.i18n.getMessage('mirror');
			const button = document.createElement('button');
			button.innerText = browser.i18n.getMessage('mirror_button');
			button.addEventListener("click", async () => {
				const proxy = proxies[Math.floor(Math.random() * proxies.length)];
				await browser.tabs.update({ url: `${proxy.url}` });
				window.close(); // TODO: won't work in Firefox Android
			})
			popup.appendChild(message);
			popup.appendChild(button);
		} 
		if (bridges.length) {
			const button = document.createElement('button');
			button.innerText = browser.i18n.getMessage('tor_button');
			button.addEventListener("click", async () => {
				const bridge = bridges[Math.floor(Math.random() * bridges.length)];
				navigator.clipboard.writeText(bridge.url).then(function() {
					popup.innerHTML += "Copied!";
				}, function(err) {
					popup.innerHTML += `Could not copy text: ${err}`;
				});
			})
			popup.appendChild(button);
		}
	} else {
		message.innerText = browser.i18n.getMessage('nomirror');
		popup.appendChild(message);
	}
}

document.addEventListener("DOMContentLoaded", popup);
