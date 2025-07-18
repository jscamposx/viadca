const Error = ({ message }) => (
  <div className="text-center p-6 bg-white rounded-xl shadow-sm border border-red-100">
    <div className="inline-flex items-center justify-center bg-red-50 rounded-full w-12 h-12 mb-3">
      <span className="text-red-500 text-xl">❌</span>
    </div>
    <h3 className="text-lg font-semibold text-gray-800 mb-1">Error</h3>
    <p className="text-red-500">{message}</p>
  </div>
);

export default Error;
