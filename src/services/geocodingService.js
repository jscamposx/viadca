const NOMINATIM_BASE = "https://nominatim.openstreetmap.org";
const SEARCH_CACHE = new Map();
const REVERSE_CACHE = new Map();
const CACHE_TTL = 300000;

const transliterate = (text) => {
  const cyrillicToLatin = {
    А: "A", Б: "B", В: "V", Г: "G", Д: "D", Е: "E", Ё: "Yo", Ж: "Zh",
    З: "Z", И: "I", Й: "Y", К: "K", Л: "L", М: "M", Н: "N", О: "O",
    П: "P", Р: "R", С: "S", Т: "T", У: "U", Ф: "F", Х: "Kh", Ц: "Ts",
    Ч: "Ch", Ш: "Sh", Щ: "Shch", Ъ: "", Ы: "Y", Ь: "", Э: "E", Ю: "Yu", Я: "Ya",
    а: "a", б: "b", в: "v", г: "g", д: "d", е: "e", ё: "yo", ж: "zh",
    з: "z", и: "i", й: "y", к: "k", л: "l", м: "m", н: "n", о: "o",
    п: "p", р: "r", с: "s", т: "t", у: "u", ф: "f", х: "kh", ц: "ts",
    ч: "ch", ш: "sh", щ: "shch", ъ: "", ы: "y", ь: "", э: "e", ю: "yu", я: "ya",
  };

  return text.replace(/[А-Яа-яЁё]/g, (char) => cyrillicToLatin[char] || char);
};

const cleanCache = (cache) => {
  const now = Date.now();
  for (const [key, value] of cache.entries()) {
    if (now - value.timestamp > CACHE_TTL) {
      cache.delete(key);
    }
  }
};

export const searchLocations = async (query, countrycode = null) => {
  if (!query || query.trim().length < 2) return [];

  const cacheKey = `search:${query}:${countrycode || "all"}`;
  const cached = SEARCH_CACHE.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }

  cleanCache(SEARCH_CACHE);

  try {
    const params = new URLSearchParams({
      q: query,
      format: "json",
      addressdetails: "1",
      limit: "10",
      "accept-language": "es",
    });

    if (countrycode) {
      params.append("countrycodes", countrycode);
    }

    const response = await fetch(`${NOMINATIM_BASE}/search?${params}`, {
      headers: {
        "User-Agent": "ViadcaApp/1.0",
      },
    });

    if (!response.ok) throw new Error("Search failed");

    const data = await response.json();
    const results = data.map((item) => {
      const addr = item.address || {};
      const displayName = transliterate(item.display_name || "");

      return {
        lat: parseFloat(item.lat),
        lng: parseFloat(item.lon),
        displayName,
        country: addr.country || "",
        state: addr.state || addr.region || "",
        city: addr.city || addr.town || addr.village || "",
        municipality: addr.municipality || addr.county || "",
        placeId: item.place_id,
      };
    });

    SEARCH_CACHE.set(cacheKey, { data: results, timestamp: Date.now() });
    return results;
  } catch (error) {
    console.error("Nominatim search error:", error);
    return [];
  }
};

export const reverseGeocode = async (lat, lng, returnObject = false) => {
  if (!lat || !lng) return returnObject ? null : "";

  const cacheKey = `reverse:${lat.toFixed(6)},${lng.toFixed(6)}`;
  const cached = REVERSE_CACHE.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return returnObject ? cached.data : cached.data.displayName;
  }

  cleanCache(REVERSE_CACHE);

  try {
    const params = new URLSearchParams({
      lat: lat.toString(),
      lon: lng.toString(),
      format: "json",
      addressdetails: "1",
      "accept-language": "es",
    });

    const response = await fetch(`${NOMINATIM_BASE}/reverse?${params}`, {
      headers: {
        "User-Agent": "ViadcaApp/1.0",
      },
    });

    if (!response.ok) throw new Error("Reverse geocode failed");

    const data = await response.json();
    const addr = data.address || {};
    const displayName = transliterate(data.display_name || "");

    const result = {
      lat,
      lng,
      displayName,
      country: addr.country || "",
      state: addr.state || addr.region || "",
      city: addr.city || addr.town || addr.village || "",
      municipality: addr.municipality || addr.county || "",
    };

    REVERSE_CACHE.set(cacheKey, { data: result, timestamp: Date.now() });
    return returnObject ? result : displayName;
  } catch (error) {
    console.error("Nominatim reverse geocode error:", error);
    return returnObject ? null : "";
  }
};
