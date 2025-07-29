import * as packagesService from "./packagesService";
import * as imageService from "./imageService";
import * as hotelsService from "./hotelsService";
import * as mayoristasService from "./mayoristasService";

const api = {
  packages: { ...packagesService },
  images: { ...imageService },
  hotels: { ...hotelsService },
  mayoristas: { ...mayoristasService },
};

export default api;
