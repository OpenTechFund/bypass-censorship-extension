import arrayFrom from 'array-from';
import { Static, String, Array, Record, Optional } from 'runtypes';
import cache from 'webext-storage-cache';
import { options } from '../utils/options';

const CACHE_DAYS = 1;

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

type Site = Static<typeof Site>;
type Alternative = Static<typeof Alternative>;
type Entry = [string, Alternative];

class SiteMap extends Map {
  private rev: Map<string, string>;

  constructor(data?: Iterable<Entry>) {
    super(data);
    if (data) {
      for (const item of data) {
        const [domain, sites] = item;
        for (const { url } of sites) {
          this.rev.set(url, domain);
        }
      }
    }
  }

  set(key: any, value: any) {
    if (this.rev === undefined) {
      this.rev = new Map();
    }
    super.set(key, value);
    //Site.check(value);
    for (const { url } of value) {
      const domain = new URL(url).hostname;
      if (domain !== undefined) {
        this.rev.set(domain, key);
      }
    }
    return this;
  }

  delete(key: any) {
    const value = this.get(key);
    if (value !== undefined) {
      for (const [revKey, revValue] of this.rev.entries()) {
        if (revValue === key) {
          this.rev.delete(revKey);
        }
      }
    }
    return super.delete(key);
  }

  clear() {
    this.rev.clear();
    return super.clear();
  }

  getRev(value: string) {
    const key = this.rev.get(value);
    return key !== undefined ? this.get(key) : undefined;
  }

  hasRev(value: string) {
    return this.rev.has(value);
  }
}

function _replacer(key: string, value: unknown) {
  if (value instanceof Map || value instanceof SiteMap) {
    return {
      dataType: 'Map',
      value: arrayFrom(value.entries()),
    };
  } else if (value instanceof Set) {
    return arrayFrom(value);
  } else {
    return value;
  }
}

function _reviver(key: string, value: any) {
  if (typeof value === 'object' && value !== null) {
    if (value.dataType === 'Map') {
      return new SiteMap(value.value);
    }
  }
  return value;
}

async function _fetchMirrors() {
  const { mirror_lists } = await options.getAll();
  const lists = (mirror_lists as string).split('\n');
  const map = new SiteMap();
  await Promise.all(
    lists.map(async (list) => {
      let response: Response;
      let result: any;
      try {
        console.log(`Fetching list from ${list}`);
        response = await fetch(list);
      } catch (error) {
        console.error(`Failed to fetch ${list}:`, error);
        return;
      }

      try {
        result = await response.json();
      } catch (error) {
        console.error(`Invalid JSON fetched from ${list}:`, error.message);
        return;
      }

      try {
        //List.check(result);
      } catch (error) {
        console.error(`Invalid list fetched from ${list}:`, error.message);
        return;
      }

      for (const site of result.sites) {
        let set = map.get(site.main_domain);
        if (!set) {
          set = new Set();
        }
        if (site.available_alternatives.length) {
          for (const a of site.available_alternatives) {
            set.add({ type: a.type, proto: a.proto, url: a.url });
          }
          map.set(site.main_domain, set);
        }
      }
    }),
  );
  return JSON.stringify(map, _replacer);
}

export async function getCachedMirrors(): Promise<SiteMap> {
  const mirrors = cache.function(_fetchMirrors, {
    maxAge: {
      days: CACHE_DAYS,
    },
    cacheKey: () => 'cached-mirrors',
  });
  return JSON.parse(await mirrors(), _reviver);
}
