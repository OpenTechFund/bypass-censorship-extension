import * as browser from 'webextension-polyfill';

export async function getCurrentTabUrl(): Promise<URL> {
  try {
    const [tab] = await browser.tabs.query({
      currentWindow: true,
      active: true,
    });
    console.assert(tab.url && typeof tab.url === 'string', 'Invalid tab URL.');
    return new URL(tab.url);
  } catch (error) {
    console.error('Failed to get current tab URL!', error);
    throw error;
  }
}
