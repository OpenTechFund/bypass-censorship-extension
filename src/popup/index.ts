import { browser } from 'webextension-polyfill-ts';
import { getCurrentTabDomain } from '../utils/tabs';
import { getCachedMirrors } from '../utils/mirrors';

async function popup() {
	const mirrors = await getCachedMirrors();
	const domain = await getCurrentTabDomain();
	const popup = document.getElementById('popup');
	const message = document.createElement('div');
	if (mirrors.has(domain)) {
		message.innerText = browser.i18n.getMessage('mirror');
		const button = document.createElement('button');
		button.innerText = browser.i18n.getMessage('mirror_button');
		button.addEventListener("click", async () => {
			const alts = mirrors.get(domain);
			const proxies = [...alts].filter(item => item.proto === 'https');
			const proxy = proxies[Math.floor(Math.random() * proxies.length)];
			await browser.tabs.update({ url: `${proxy.url}` });
		})
		popup.appendChild(message);
		popup.appendChild(button);
	} else {
		message.innerText = browser.i18n.getMessage('nomirror');
		popup.appendChild(message);
	}
}

document.addEventListener("DOMContentLoaded", popup);
