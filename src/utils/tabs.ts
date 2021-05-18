import { browser } from 'webextension-polyfill-ts';

export async function getCurrentTabUrl(): Promise<browser.tabs.Tab> {
  try {
    const [tab] = await browser.tabs.query({ currentWindow: true, active: true })
    console.assert(tab.url && typeof tab.url === 'string', 'Invalid tab URL.');
    return tab;
  } catch (error) {
    console.error('Failed to get current tab URL!', error);
    throw error;
  }
}

export async function getCurrentTabDomain(): Promise<string | undefined> {
  let tab: browser.tabs.Tab;
  try {
    tab = await getCurrentTabUrl();
  } catch (error) {
    console.error('Failed to get current tab domain!', error);
    throw error;
  }
  const domain = tab.url.match(/:\/\/(www\.)?([^\/]+)\//);
  return domain ? domain.slice(-1)[0] : undefined;
}
