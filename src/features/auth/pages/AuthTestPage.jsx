import { useState } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { FiCheck, FiX, FiUser, FiShield, FiRefreshCw, FiLogIn, FiClock } from 'react-icons/fi';

const AuthTestPage = () => {
  const { 
    user, 
    token, 
    loading, 
    isAuthenticated, 
    isAdmin, 
    hasRole,
    updateProfile 
  } = useAuth();
  
  const [testResults, setTestResults] = useState([]);

  // Función simulada para desarrollo (solo para testing)
  const simulateLogin = (role = 'admin') => {
    const mockUsers = {
      admin: {
        id: 1,
        usuario: 'admin_test',
        correo: 'admin@test.com',
        rol: 'admin',
        verificado: true
      },
      'pre-autorizado': {
        id: 2,
        usuario: 'pending_user',
        correo: 'pending@test.com',
        rol: 'pre-autorizado',
        verificado: true
      },
      usuario: {
        id: 3,
        usuario: 'regular_user',
        correo: 'user@test.com',
        rol: 'usuario',
        verificado: true
      }
    };
    
    const mockUser = mockUsers[role];
    const mockToken = 'mock_jwt_token_for_development';
    
    // Simular autenticación en localStorage
    localStorage.setItem('auth_token', mockToken);
    localStorage.setItem('mock_user_role', role); // Para identificar el rol simulado
    
    // Esto forzará una recarga de la página para simular login real
    window.location.reload();
  };

  const runTests = async () => {
    const results = [];
    
    // Test 1: Verificar estado de autenticación
    results.push({
      name: 'Estado de autenticación',
      status: isAuthenticated() ? 'success' : 'warning',
      message: isAuthenticated() ? 'Usuario autenticado' : 'Usuario no autenticado'
    });

    // Test 2: Verificar token
    results.push({
      name: 'Token JWT',
      status: token ? 'success' : 'error',
      message: token ? 'Token presente' : 'Token no encontrado'
    });

    // Test 3: Verificar datos de usuario
    results.push({
      name: 'Datos de usuario',
      status: user ? 'success' : 'error',
      message: user ? `Usuario: ${user.usuario} (${user.rol})` : 'Datos de usuario no disponibles'
    });

    // Test 4: Verificar permisos de admin
    results.push({
      name: 'Permisos de administrador',
      status: isAdmin() ? 'success' : 'info',
      message: isAdmin() ? 'Usuario tiene permisos de admin' : 'Usuario no es admin'
    });

    // Test 5: Verificar función hasRole
    const testRole = user?.rol || 'none';
    results.push({
      name: 'Verificación de rol',
      status: hasRole(testRole) ? 'success' : 'error',
      message: hasRole(testRole) ? `Rol ${testRole} verificado correctamente` : 'Error en verificación de rol'
    });

    setTestResults(results);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'success':
        return <FiCheck className="text-green-600" />;
      case 'error':
        return <FiX className="text-red-600" />;
      case 'warning':
        return <FiUser className="text-yellow-600" />;
      default:
        return <FiShield className="text-blue-600" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'success':
        return 'bg-green-50 border-green-200';
      case 'error':
        return 'bg-red-50 border-red-200';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200';
      default:
        return 'bg-blue-50 border-blue-200';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Pruebas del Sistema de Autenticación
            </h1>
            <p className="text-gray-600">
              Verificación de funcionalidades principales
            </p>
          </div>

          {/* Estado actual */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-700 mb-2">Estado</h3>
              <p className="text-sm text-gray-600">
                {loading ? 'Cargando...' : isAuthenticated() ? 'Autenticado' : 'No autenticado'}
              </p>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-700 mb-2">Usuario</h3>
              <p className="text-sm text-gray-600">
                {user ? user.usuario : 'No disponible'}
              </p>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-700 mb-2">Rol</h3>
              <p className="text-sm text-gray-600">
                {user ? user.rol : 'No disponible'}
              </p>
            </div>
          </div>

          {/* Botones de pruebas */}
          <div className="text-center mb-8 space-y-4">
            <button
              onClick={runTests}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center gap-2 mx-auto"
            >
              <FiRefreshCw className={loading ? 'animate-spin' : ''} />
              {loading ? 'Ejecutando...' : 'Ejecutar Pruebas'}
            </button>
            
            {/* Botón de simulación solo para desarrollo */}
            {import.meta.env.DEV && !isAuthenticated() && (
              <div className="pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-600 mb-4">
                  <strong>Solo Desarrollo:</strong> Simular autenticación con diferentes roles
                </p>
                <div className="space-y-3">
                  <button
                    onClick={() => simulateLogin('admin')}
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <FiShield />
                    Simular Login como Admin
                  </button>
                  
                  <button
                    onClick={() => simulateLogin('pre-autorizado')}
                    className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <FiClock />
                    Simular Login como Pre-autorizado
                  </button>
                  
                  <button
                    onClick={() => simulateLogin('usuario')}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <FiUser />
                    Simular Login como Usuario
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Resultados */}
          {testResults.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Resultados de las Pruebas
              </h2>
              
              {testResults.map((result, index) => (
                <div
                  key={index}
                  className={`border rounded-lg p-4 ${getStatusColor(result.status)}`}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0">
                      {getStatusIcon(result.status)}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-800">
                        {result.name}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        {result.message}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Datos detallados del usuario */}
          {user && (
            <div className="mt-8 pt-8 border-t border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Información Detallada del Usuario
              </h2>
              <div className="bg-gray-50 rounded-lg p-4">
                <pre className="text-sm text-gray-700 overflow-auto">
                  {JSON.stringify(user, null, 2)}
                </pre>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthTestPage;
