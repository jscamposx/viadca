import React from 'react';

const AdminTrashPage = () => {
  return (
    <div className="min-h-screen bg-white py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">Papelera</h1>
          <p className="mt-4 text-lg text-gray-600">
            Aquí podrás ver y recuperar los elementos eliminados.
          </p>
          <div className="mt-8">
            {/* A futuro, aquí se listarán los elementos eliminados */}
            <div className="bg-gray-100 p-8 rounded-lg">
              <p className="text-gray-500">No hay elementos en la papelera.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminTrashPage;