import * as packagesService from "./packagesService";
import * as imageService from "./imageService";
import * as mayoristasService from "./mayoristasService";

export * from './packagesService';

const api = {
  packages: { ...packagesService },
  images: { ...imageService },
  mayoristas: { ...mayoristasService },
};

export default api;
