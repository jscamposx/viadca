import * as packagesService from "./packagesService";
import * as flightsService from "./flightsService";
import * as imageService from "./imageService";
import * as hotelsService from "./hotelsService";
import * as trashService from "./trashService";

const api = {
  packages: { ...packagesService },
  flights: { ...flightsService },
  images: { ...imageService },
  hotels: { ...hotelsService },
  trash: { ...trashService },
};

export default api;
