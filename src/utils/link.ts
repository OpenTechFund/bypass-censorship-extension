import cache from 'webext-storage-cache';
import { options } from '../utils/options';

export async function fetchLink(url: URL) {
  const { api, key }: { api: string, key: string } = await options.getAll();
  let response: Response;
  let result: any;

  const api_url = new URL(`${api}/link`);
  api_url.searchParams.append('url', url.href);
  if (key) {
    api_url.searchParams.append('key', key);
    api_url.searchParams.append('type', 'short');
  } else {
    api_url.searchParams.append('type', 'direct');
  }

  try {
    console.log(`Fetching mirror link for ${url}`);
    console.debug(`Calling API at ${api_url}`);
    response = await fetch(api_url, { headers: { 'Content-Type': 'application/json' } });
    if (!response.ok) {
      throw new Error(`HTTP Error ${response.status}: ${response.statusText}`);
    }
  } catch (err) {
    throw new Error(`Failed to fetch mirror link for ${url}`, { cause: err });
  }

  try {
    result = await response.json();
  } catch (err) {
    throw new Error(`Invalid JSON fetched for ${url}`, { cause: err });
  }

  await cache.set(result.url, true);
  return result.url;
}
