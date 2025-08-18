// Maneja el access_token con persistencia opcional en sessionStorage
// Persistimos solo en iOS (cualquier navegador WebKit) y Safari en macOS.
let accessToken = null;

const isBrowser =
  typeof window !== "undefined" && typeof navigator !== "undefined";

const isIOSLike = () => {
  if (!isBrowser) return false;
  const ua = navigator.userAgent || "";
  const isIPhoneIPadIPod = /iPhone|iPad|iPod/i.test(ua);
  // iPadOS en modo escritorio reporta MacIntel con touch
  const isIPadOSDesktop =
    navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1;
  return isIPhoneIPadIPod || isIPadOSDesktop;
};

const isSafariDesktop = () => {
  if (!isBrowser) return false;
  const ua = navigator.userAgent || "";
  const isSafari = /Safari/i.test(ua);
  const isChrome = /Chrome|Chromium|CriOS/i.test(ua);
  const isEdge = /Edg/i.test(ua);
  const isOpera = /OPR|Opera/i.test(ua);
  return isSafari && !isChrome && !isEdge && !isOpera && !isIOSLike();
};

const SHOULD_PERSIST = isIOSLike() || isSafariDesktop();
const STORAGE_KEY = "auth_access_token";

const readFromSession = () => {
  if (!isBrowser) return null;
  try {
    return window.sessionStorage.getItem(STORAGE_KEY);
  } catch (_) {
    return null;
  }
};

const writeToSession = (token) => {
  if (!isBrowser) return;
  try {
    if (!token) {
      window.sessionStorage.removeItem(STORAGE_KEY);
    } else {
      window.sessionStorage.setItem(STORAGE_KEY, token);
    }
  } catch (_) {
    // noop
  }
};

// Cargar token inicial desde sessionStorage solo en iOS/Safari
if (SHOULD_PERSIST) {
  const stored = readFromSession();
  if (stored) accessToken = stored;
}

export const setAccessToken = (token) => {
  accessToken = token || null;
  if (SHOULD_PERSIST) {
    writeToSession(accessToken);
  } else if (!accessToken) {
    // asegurar limpieza si se setea null
    writeToSession(null);
  }
};

export const getAccessToken = () => accessToken;

export const clearAccessToken = () => {
  accessToken = null;
  writeToSession(null);
};

export const shouldPersistToken = () => SHOULD_PERSIST;

export default {
  setAccessToken,
  getAccessToken,
  clearAccessToken,
  shouldPersistToken,
};
