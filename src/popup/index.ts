import { browser } from 'webextension-polyfill-ts';
import { getCurrentTabDomain } from '../utils/tabs';
import { getCachedMirrors } from '../utils/mirrors';

/**
 * Get the current URL.
 *
 * @param {function(string)} callback - called when the URL of the current tab
 * is found.
 */

const isMirror = `body > #mirror {
										display: block
									}
									#nomirror {
										display: none
									}`;

const isNotMirror = `body > #mirror {
										display: none
									}
									#nomirror {
										display: block
									}`;

async function popup() {
	const mirrors = await getCachedMirrors();
	const domain = await getCurrentTabDomain();
	if (mirrors.has(domain)) {
		console.log('***isMirror!***');
		await browser.tabs.removeCSS({ code: isNotMirror });
		await browser.tabs.insertCSS({ code: isMirror });
		const all = document.querySelectorAll("html");
		all.forEach(e => console.log(`***element***: ${e.id}`));
		console.log('***all***:', all);
		const elem = document.getElementById("mirror_button");
		console.log('***elem***:', elem);
		elem.addEventListener("click", async () => {
			console.log('***domain***:', domain);
			const alts = mirrors.get(domain);
			console.log('***alts***:', alts);
			const proxies = alts.values().filter(item => item.proto === 'https');
			const proxy = proxies[Math.floor(Math.random() * proxies.length)];
			await browser.tabs.update({ url: `${proxy.url}` });
		})
	} else {
		console.log('***isNotMirror!***');
		await browser.tabs.removeCSS({ code: isMirror });
		await browser.tabs.insertCSS({ code: isNotMirror });
	}
}

popup();
//document.addEventListener("DOMContentLoaded", popup);
