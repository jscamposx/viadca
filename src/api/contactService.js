import api from "./axiosConfig";

const CONTACT_FIELDS = [
  "telefono",
  "email",
  "whatsapp",
  "direccion",
  "horario",
  "facebook",
  "instagram",
  "tiktok",
  "youtube",
];

// Caché y promesa en vuelo a nivel de módulo
let contactoCache = null; // objeto normalizado o null
let contactoInFlight = null; // Promise o null

const normalize = (data = {}) => {
  const result = {};
  CONTACT_FIELDS.forEach((k) => {
    result[k] = Object.prototype.hasOwnProperty.call(data, k) ? data[k] : null;
  });
  return result;
};

const pickAllowed = (data = {}) => {
  const result = {};
  CONTACT_FIELDS.forEach((k) => {
    if (Object.prototype.hasOwnProperty.call(data, k)) {
      result[k] = data[k];
    }
  });
  return result;
};

// Convierte strings vacíos en null y trimea strings
const toNullIfEmpty = (v) => {
  if (v === undefined || v === null) return null;
  if (typeof v === "string") {
    const t = v.trim();
    return t === "" ? null : t;
  }
  return v;
};

const contactService = {
  async getContacto(force = false) {
    // Usar caché si existe y no es forzado
    if (contactoCache && !force) {
      return contactoCache;
    }

    // Si hay una promesa en vuelo y no es forzado, esperar
    if (contactoInFlight && !force) {
      return contactoInFlight;
    }

    // Lanzar nueva petición (con query anti-cache del lado del servidor si aplica)
    contactoInFlight = api
      .get("/contacto", { params: { _ts: Date.now() } })
      .then((res) => normalize(res.data))
      .then((data) => {
        contactoCache = data;
        return data;
      })
      .finally(() => {
        contactoInFlight = null;
      });

    return contactoInFlight;
  },

  async createOrReplaceContacto(contacto) {
    // Enviar todos los campos con '' -> null
    const payload = CONTACT_FIELDS.reduce((acc, k) => {
      acc[k] = toNullIfEmpty(contacto?.[k]);
      return acc;
    }, {});
    const res = await api.post("/contacto", payload);
    // Invalida y actualiza caché
    contactoCache = normalize(res.data);
    return contactoCache;
  },

  async updateContacto(partialContacto) {
    // Enviar solo campos provistos; '' -> null para vaciar
    const provided = pickAllowed(partialContacto);
    const payload = Object.fromEntries(
      Object.entries(provided).map(([k, v]) => [k, toNullIfEmpty(v)]),
    );
    const res = await api.patch("/contacto", payload);
    // Invalida y actualiza caché
    contactoCache = normalize(res.data);
    return contactoCache;
  },

  async clearContacto() {
    const res = await api.delete("/contacto");
    // Invalida y actualiza caché
    contactoCache = normalize(res.data);
    return contactoCache;
  },

  async hardDeleteContacto() {
    const res = await api.delete("/contacto", { params: { hard: true } });
    // Invalida caché (el backend puede ya no devolver el objeto)
    contactoCache = null;
    return res.data; // puede no devolver el objeto
  },
};

export default contactService;
