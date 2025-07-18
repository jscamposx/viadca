import { FiCheckSquare } from "react-icons/fi";

const Requirements = ({ requisitos }) => {
  const procesarRequisitos = (reqs) => {
    if (Array.isArray(reqs)) {
      return reqs;
    }
    if (typeof reqs === "string") {
      if (reqs.includes("\n") || reqs.includes("•") || reqs.includes("-")) {
        return reqs
          .split(/\n|•|-/)
          .map((req) => req.trim())
          .filter((req) => req.length > 0);
      }

      return [reqs];
    }

    return [];
  };

  const requisitosArray = procesarRequisitos(requisitos);

  return (
    <div>
      {requisitosArray.length === 0 ? (
        <div className="border-l-4 border-gray-400 p-6 rounded-r-lg">
          <p className="text-gray-500 italic">
            No hay requisitos especificados.
          </p>
        </div>
      ) : (
        <div className="space-y-4 border-l-4 border-blue-500 p-6 rounded-r-lg">
          {requisitosArray.map((requisito, index) => (
            <div key={index} className="flex items-start">
              <FiCheckSquare className="w-6 h-6 text-blue-600 mr-4 mt-1 flex-shrink-0" />
              <p className="text-gray-700 leading-relaxed">{requisito}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Requirements;
