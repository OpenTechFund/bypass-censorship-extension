import { getCurrentTabDomain } from '../utils/tabs';
import { getCachedMirrors } from '../utils/mirrors';

const TOR_DOWNLOAD_URL = "https://torproject.org/download"

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
      } else if (!bridges.length){
        message.innerText = browser.i18n.getMessage('onemirror');
        popup.appendChild(message);
      }
      if (bridges.length) {
        const torMessage = document.createElement('div');
        const torButton = document.createElement('button');
        const torDownload = document.createElement('button');
			  torMessage.innerText = browser.i18n.getMessage('tor');
			  torButton.innerText = browser.i18n.getMessage('tor_button');
			  torDownload.innerText = browser.i18n.getMessage('tor_download');
			  torButton.addEventListener('click', async () => {
			  	const bridge = bridges[Math.floor(Math.random() * bridges.length)];
			  	navigator.clipboard.writeText(bridge.url).then(function() {
			  		popup.innerHTML += browser.i18n.getMessage('copy');
			  	}, function() {
			  		popup.innerHTML += browser.i18n.getMessage('copy_error');
			  	});
			  })
			  torDownload.addEventListener('click', async () => {
          await browser.tabs.create({ url: `${TOR_DOWNLOAD_URL}` });
          window.close(); // TODO: won't work in Firefox Android
			  })
        popup.appendChild(torMessage);
			  popup.appendChild(torDownload);
			  popup.appendChild(torButton);
      }
    } else {
      message.innerText = browser.i18n.getMessage('nomirror');
      popup.appendChild(message);
    }
  }
}

document.addEventListener('DOMContentLoaded', popup);
