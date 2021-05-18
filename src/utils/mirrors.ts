import { String, Array, Record, Optional } from 'runtypes';
import cache from 'webext-storage-cache';

async function _fetchMirrors() {
  const { mirror_lists } = await window.options.getAll();
  const lists = mirror_lists.split(',');
  const map = new Map();
  await Promise.all(lists.map(async list => {
    let response;
    try {
      response = await fetch(list);
    } catch (error) {
      console.error(`Failed to fetch ${list}:`, error);
      return;
    }

    try {
      response = await response.json();
    } catch (error) {
      console.error(`Invalid JSON fetched from ${list}:`, error.message);
      return;
    }

    try {
      //response = List.check(response);
    } catch (error) {
      console.error(`Invalid list fetched from ${list}:`, error.message);
      return;
    }

    for (const site of response.sites) {
      let set = map.get(site.main_domain);
      if (!set) {
        set = new Set();
      }
      for (const a of site.available_alternatives) {
        set.add({ type: a.type, proto: a.proto, url: a.url });
      }
      map.set(site.main_domain, set);
    }
  }));
  return map;
}

export const getCachedMirrors = cache.function(_fetchMirrors, {
  cacheKey: () => 'cached-mirrors'
});

const Alternative = Record({
  created_at: String,
  updated_at: String,
  type: String,
  proto: String,
  url: String,
});

const Site = Record({
  main_domain: String,
  available_mirrors: Optional(Array(String)),
  available_onions: Optional(Array(String)),
  available_alternatives: Array(Alternative),
});

const List = Record({
  version: String,
  sites: Array(Site),
});
