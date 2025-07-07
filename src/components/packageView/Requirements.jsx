const Requirements = ({ requisitos }) => (
  <div>
    <h2 className="text-3xl font-semibold border-b-2 border-gray-200 pb-2 mb-4">
      Requisitos para el Viaje
    </h2>
    <div className="bg-gray-100 p-4 rounded-lg">
      <p className="text-gray-700">{requisitos}</p>
    </div>
  </div>
);

export default Requirements;
