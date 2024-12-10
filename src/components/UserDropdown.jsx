import { useState } from "react";

const UserDropdown = ({ userName, onEditProfile }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleDeleteUser = async () => {
    const confirmed = window.confirm(
      "¿Estás seguro de que deseas eliminar tu cuenta? Esta acción no se puede deshacer."
    );

    if (!confirmed) return;

    try {
      const token = localStorage.getItem("jwt");
      if (!token) {
        alert("No se encontró un token válido. Por favor, inicia sesión nuevamente.");
        return;
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/user`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        alert("Tu cuenta ha sido eliminada exitosamente.");
        localStorage.removeItem("jwt");
        window.location.href = "/auth/login";
      } else if (response.status === 401) {
        alert("No autorizado. Por favor, inicia sesión nuevamente.");
      } else {
        alert("Ocurrió un error al intentar eliminar tu cuenta. Intenta nuevamente más tarde.");
      }
    } catch (error) {
      console.error("Error al eliminar la cuenta:", error);
      alert("Ocurrió un error de red. Intenta nuevamente más tarde.");
    }
  };

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
          <button
            onClick={handleDeleteUser}
            className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
          >
            Eliminar Usuario
          </button>
        </div>
      )}
    </div>
  );
};

export default UserDropdown;
