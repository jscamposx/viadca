import * as packagesService from "./packagesService";
import * as imageService from "./imageService";
import * as mayoristasService from "./mayoristasService";
import * as queueService from "./queueService";

export * from "./packagesService";

const api = {
  packages: { ...packagesService },
  images: { ...imageService },
  mayoristas: { ...mayoristasService },
  queue: { ...queueService },
};

export default api;
