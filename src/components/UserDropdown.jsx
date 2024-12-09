import { useState } from "react";

const UserDropdown = ({ userName, onEditProfile }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      {/* Botón del dropdown */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center bg-gray-200 p-2 rounded-full hover:shadow-md focus:outline-none"
      >
        <img
          src="https://via.placeholder.com/40"
          alt="User Profile"
          className="w-8 h-8 rounded-full object-cover"
        />
        <span className="ml-2 text-gray-800 font-semibold">
          {userName || "Usuario"}
        </span>
      </button>

      {/* Contenido del dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg z-50">
          <p className="px-4 py-2 text-sm font-bold text-gray-800 border-b">
            Usuario
          </p>
          <button
            onClick={onEditProfile}
            className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
          >
            Editar Perfil
          </button>
          <button
            onClick={() => {
              localStorage.removeItem("jwt");
              window.location.href = "/auth/login";
            }}
            className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
          >
            Cerrar Sesión
          </button>
        </div>
      )}
    </div>
  );
};

export default UserDropdown;
