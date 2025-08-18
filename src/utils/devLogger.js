export const devLog = {
  info: (message, data = null) => {
    if (import.meta.env.DEV) {
      if (data) {
        console.log(`ℹ️ ${message}`, data);
      } else {
        console.log(`ℹ️ ${message}`);
      }
    }
  },

  success: (message, data = null) => {
    if (import.meta.env.DEV) {
      if (data) {
        console.log(`✅ ${message}`, data);
      } else {
        console.log(`✅ ${message}`);
      }
    }
  },

  error: (message, error = null) => {
    if (import.meta.env.DEV) {
      if (error) {
        console.error(`❌ ${message}`, error);
      } else {
        console.error(`❌ ${message}`);
      }
    }
  },

  loading: (message) => {
    if (import.meta.env.DEV) {
      console.log(`🔄 ${message}`);
    }
  },

  auth: (message, data = null) => {
    if (import.meta.env.DEV) {
      if (data) {
        console.log(`🔐 ${message}`, data);
      } else {
        console.log(`🔐 ${message}`);
      }
    }
  },
};

// Helper para limitar logs repetitivos
export const createThrottledLogger = (fn, delay = 1000) => {
  let lastCall = 0;
  return (...args) => {
    const now = Date.now();
    if (now - lastCall >= delay) {
      fn(...args);
      lastCall = now;
    }
  };
};
