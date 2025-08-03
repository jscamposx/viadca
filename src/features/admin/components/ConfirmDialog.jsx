import { FiAlertTriangle, FiX, FiTrash2, FiCheck } from "react-icons/fi";

const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirmar eliminación",
  message = "¿Estás seguro de que quieres eliminar este elemento?",
  confirmText = "Eliminar",
  cancelText = "Cancelar",
  type = "danger", // danger, warning, info
  itemName = "",
}) => {
  if (!isOpen) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  const typeStyles = {
    danger: {
      icon: <FiTrash2 className="w-6 h-6 text-red-600" />,
      iconBg: "bg-red-100",
      confirmBtn: "bg-red-600 hover:bg-red-700 focus:ring-red-500",
      border: "border-red-200",
    },
    warning: {
      icon: <FiAlertTriangle className="w-6 h-6 text-yellow-600" />,
      iconBg: "bg-yellow-100",
      confirmBtn: "bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500",
      border: "border-yellow-200",
    },
    info: {
      icon: <FiCheck className="w-6 h-6 text-blue-600" />,
      iconBg: "bg-blue-100",
      confirmBtn: "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500",
      border: "border-blue-200",
    },
  };

  const currentStyle = typeStyles[type];

  return (
    <div
      className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      <div
        className={`bg-white rounded-2xl shadow-2xl border ${currentStyle.border} max-w-md w-full mx-4 transform transition-all duration-300 scale-100 opacity-100`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-full ${currentStyle.iconBg}`}>
              {currentStyle.icon}
            </div>
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200"
            aria-label="Cerrar"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-gray-600 leading-relaxed">
            {message}
            {itemName && (
              <span className="block mt-2 font-medium text-gray-900">
                "{itemName}"
              </span>
            )}
          </p>
          <p className="text-sm text-gray-500 mt-3">
            Esta acción no se puede deshacer.
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-100 bg-gray-50/50">
          <button
            onClick={onClose}
            className="px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 transition-all duration-200"
          >
            {cancelText}
          </button>
          <button
            onClick={handleConfirm}
            className={`px-4 py-2.5 text-sm font-medium text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200 ${currentStyle.confirmBtn}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
