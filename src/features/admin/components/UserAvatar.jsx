import React from "react";
import { FiUser } from "react-icons/fi";
import { useAuth } from "../../../contexts/AuthContext";

const UserAvatar = ({
  name = null,
  email = null,
  avatarUrl = null,
  size = "md",
  showInfo = true,
}) => {
  const { user } = useAuth();

  // Usar datos del usuario autenticado si no se pasan props específicos
  const displayName = name || user?.nombre || user?.usuario || "Usuario";
  const displayEmail =
    email || user?.correo || user?.email || "No especificado";

  const sizeClasses = {
    sm: "w-8 h-8 text-sm",
    md: "w-10 h-10 text-base",
    lg: "w-12 h-12 text-lg",
  };

  const getInitials = (name) => {
    if (!name) return "U";

    // Si es un solo nombre o palabra, tomar primera letra
    const words = name.trim().split(" ");
    if (words.length === 1) {
      return words[0].charAt(0).toUpperCase();
    }

    // Si son múltiples palabras, tomar primeras letras de las primeras dos palabras
    return words
      .slice(0, 2)
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase();
  };

  return (
    <div className="flex items-center gap-3">
      <div
        className={`relative ${sizeClasses[size]} rounded-full overflow-hidden`}
      >
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt={displayName}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-700 flex items-center justify-center text-white font-semibold shadow-md">
            {displayName ? (
              getInitials(displayName)
            ) : (
              <FiUser className="w-1/2 h-1/2" />
            )}
          </div>
        )}

        {/* Indicator en línea */}
        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white shadow-sm"></div>
      </div>

      {showInfo && (
        <div className="min-w-0 flex-1">
          <p className="font-semibold text-gray-800 truncate">{displayName}</p>
          <p className="text-xs text-gray-500 truncate">{displayEmail}</p>
        </div>
      )}
    </div>
  );
};

export default UserAvatar;
