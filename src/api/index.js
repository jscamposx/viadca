import * as packagesService from "./packagesService";
import * as flightsService from "./flightsService";
import * as imageService from "./imageService";

const api = {
  packages: { ...packagesService },
  flights: { ...flightsService },
  images: { ...imageService },
};

export default api;
