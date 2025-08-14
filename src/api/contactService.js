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
  async getContacto() {
    // Evitar headers no permitidos por CORS; usar query anti-cache
    const res = await api.get("/contacto", { params: { _ts: Date.now() } });
    return normalize(res.data);
  },

  async createOrReplaceContacto(contacto) {
    // Enviar todos los campos con '' -> null
    const payload = CONTACT_FIELDS.reduce((acc, k) => {
      acc[k] = toNullIfEmpty(contacto?.[k]);
      return acc;
    }, {});
    const res = await api.post("/contacto", payload);
    return normalize(res.data);
  },

  async updateContacto(partialContacto) {
    // Enviar solo campos provistos; '' -> null para vaciar
    const provided = pickAllowed(partialContacto);
    const payload = Object.fromEntries(
      Object.entries(provided).map(([k, v]) => [k, toNullIfEmpty(v)]),
    );
    const res = await api.patch("/contacto", payload);
    return normalize(res.data);
  },

  async clearContacto() {
    const res = await api.delete("/contacto");
    return normalize(res.data);
  },

  async hardDeleteContacto() {
    const res = await api.delete("/contacto", { params: { hard: true } });
    return res.data; // puede no devolver el objeto
  },
};

export default contactService;
