const Modal = ({ isOpen, title, children, onClose, onConfirm }) => {
  // If not open, return null
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm ">
      <div className="relative w-full mx-4 bg-white rounded-xl shadow-2xl animate-fade-in-up max-w-md w-full max-h-[90vh]  overflow-y-auto">
        {/* Close button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-700 hover:text-gray-900 focus:outline-none"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-6 w-6" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Modal Content */}
        <div className="p-6">
          {title && (
            <h2 className="text-xl font-semibold text-gray-900 mb-4 border-b pb-3">
              {title}
            </h2>
          )}
          
          <div className="mt-4 text-gray-900">
            {children}
          </div>
        </div>

        {/* Action Buttons */}
        {(onClose || onConfirm) && (
          <div className="bg-gray-50 px-6 py-4 rounded-b-xl flex justify-end space-x-3">
            {onClose && (
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
              >
                Cancelar
              </button>
            )}
            {onConfirm && (
              <button
                onClick={onConfirm}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Confirmar
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;