import { FiUpload, FiLink, FiImage, FiInfo } from "react-icons/fi";

const ImagesSummary = ({ images = [] }) => {
  if (!images || images.length === 0) {
    return null;
  }

  const uploadedImages = images.filter(
    (img) => img.isUploaded || img.tipo === "base64",
  );
  const urlImages = images.filter(
    (img) => !img.isUploaded && img.tipo !== "base64",
  );

  return (
    <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
      <div className="flex items-center gap-2 mb-3">
        <FiImage className="w-4 h-4 text-slate-600" />
        <h4 className="font-medium text-slate-800">
          Resumen de imágenes ({images.length} total)
        </h4>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {uploadedImages.length > 0 && (
          <div className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
            <div className="p-2 bg-green-100 rounded-full">
              <FiUpload className="w-4 h-4 text-green-700" />
            </div>
            <div>
              <div className="font-medium text-green-800">
                {uploadedImages.length} imagen
                {uploadedImages.length !== 1 ? "es" : ""} subida
                {uploadedImages.length !== 1 ? "s" : ""}
              </div>
              <div className="text-xs text-green-600">
                Se enviarán como archivos base64
              </div>
            </div>
          </div>
        )}

        {urlImages.length > 0 && (
          <div className="flex items-center gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="p-2 bg-blue-100 rounded-full">
              <FiLink className="w-4 h-4 text-blue-700" />
            </div>
            <div>
              <div className="font-medium text-blue-800">
                {urlImages.length} imagen{urlImages.length !== 1 ? "es" : ""} de
                URL
              </div>
              <div className="text-xs text-blue-600">
                Se enviarán como enlaces
              </div>
            </div>
          </div>
        )}
      </div>

      {images.length > 0 && (
        <div className="mt-3 p-2 bg-white rounded-lg border border-slate-200">
          <div className="flex items-center gap-2 text-xs text-slate-600">
            <FiInfo className="w-3 h-3" />
            <span>La primera imagen será la imagen principal del paquete</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImagesSummary;
