import * as packagesService from "./packagesService";
import * as flightsService from "./flightsService";
import * as imageService from "./imageService";
import * as hotelsService from "./hotelsService";

const api = {
  packages: { ...packagesService },
  flights: { ...flightsService },
  images: { ...imageService },
  hotels: { ...hotelsService },
};

export default api;
