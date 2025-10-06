// Utilidades centrales para Google Maps / Places
// Centraliza obtención de API key y warnings para evitar logs repetidos

let cachedKey;
let warned = false;

export function getGoogleMapsApiKey() {
  if (cachedKey) return cachedKey;
  const env = import.meta?.env || {};
  const key =
    env.VITE_GOOGLE_MAPS_API_KEY ||
    env.VITE_Maps_API_KEY ||
    env.VITE_GOOGLE_API_KEY ||
    env.VITE_GMAPS_KEY ||
    "";
  cachedKey = key;
  if (!key && env.DEV && !warned) {
    console.warn(
      "⚠️ Falta Google Maps API Key. Define VITE_GOOGLE_MAPS_API_KEY en .env.local (habilita Maps JavaScript, Places, Geocoding).",
    );
    warned = true;
  }
  return key;
}

export function hasGoogleMapsLoaded() {
  return !!window.google?.maps;
}

export function safeCreateGeocoder() {
  if (!hasGoogleMapsLoaded()) return null;
  try {
    return new window.google.maps.Geocoder();
  } catch (e) {
    if (import.meta.env.DEV) console.warn("No se pudo crear Geocoder:", e);
    return null;
  }
}
