import React from "react";
import { FiUser } from "react-icons/fi";

const UserAvatar = ({
  name = "Administrador",
  email = "admin@viadca.com",
  avatarUrl = null,
  size = "md",
  showInfo = true,
}) => {
  const sizeClasses = {
    sm: "w-8 h-8 text-sm",
    md: "w-10 h-10 text-base",
    lg: "w-12 h-12 text-lg",
  };

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="flex items-center gap-3">
      <div
        className={`relative ${sizeClasses[size]} rounded-full overflow-hidden`}
      >
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt={name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-700 flex items-center justify-center text-white font-semibold shadow-md">
            {name ? getInitials(name) : <FiUser className="w-1/2 h-1/2" />}
          </div>
        )}

        {/* Indicator en línea */}
        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white shadow-sm"></div>
      </div>

      {showInfo && (
        <div className="min-w-0 flex-1">
          <p className="font-semibold text-gray-800 truncate">{name}</p>
          <p className="text-xs text-gray-500 truncate">{email}</p>
        </div>
      )}
    </div>
  );
};

export default UserAvatar;
