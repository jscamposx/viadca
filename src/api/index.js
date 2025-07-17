import * as packagesService from "./packagesService";
import * as flightsService from "./flightsService";
import * as imageService from "./imageService";
import * as hotelsService from "./hotelsService"; // <-- Añadido

const api = {
  packages: { ...packagesService },
  flights: { ...flightsService },
  images: { ...imageService },
  hotels: { ...hotelsService }, // <-- Añadido
};

export default api;