import * as packagesService from "./packagesService";
import * as flightsService from "./flightsService";
import * as imageService from "./imageService"; // <-- Asegúrate de que esta línea esté presente

const api = {
  packages: { ...packagesService },
  flights: { ...flightsService },
  // --- LÍNEA CLAVE ---
  // Aquí agregamos las funciones del imageService al objeto api
  images: { ...imageService },
};

export default api;