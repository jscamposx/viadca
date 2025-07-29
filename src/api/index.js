import * as packagesService from "./packagesService";
import * as imageService from "./imageService";
import * as hotelsService from "./hotelsService";

const api = {
  packages: { ...packagesService },
  images: { ...imageService },
  hotels: { ...hotelsService },
};

export default api;
