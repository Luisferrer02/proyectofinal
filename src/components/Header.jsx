"use client";

import { useEffect, useState } from "react";

const Header = () => {
  const [userEmail, setUserEmail] = useState("");
  const [userName, setUserName] = useState("");
  const [userSurnames, setUserSurnames] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
        const url = `${baseUrl}/user`;

        const token = localStorage.getItem("jwt");
        if (!token) {
          setError("No se encontró un token. Por favor, inicie sesión nuevamente.");
          return;
        }

        const response = await fetch(url, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setUserEmail(data.email);
          setUserName(data.name || "");
          setUserSurnames(data.surnames || "");

          // Mostrar nombre y apellidos solo si están disponibles
          if (data.name && data.surnames) {
            setDisplayName(`${data.name} ${data.surnames}`);
          } else {
            setDisplayName(data.email || "Usuario");
          }
        } else {
          setError("Error al recuperar la información del usuario.");
        }
      } catch (err) {
        setError("Error de red. Intente más tarde.");
      }
    };

    fetchUser();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("jwt");
    window.location.href = "/auth/login"; // Redirigir al login
  };

  return (
    <header className="bg-blue-600 text-white p-4 shadow-md flex justify-between items-center">
      {/* Título de la aplicación */}
      <h1 className="text-2xl font-bold">Gestión de Albaranes</h1>

      {/* Sección del usuario y cerrar sesión */}
      <div className="flex items-center space-x-4">
        {/* Dropdown del usuario */}
        <div className="flex items-center space-x-2">
          <img
            src="https://via.placeholder.com/40"
            alt="Usuario"
            className="w-10 h-10 rounded-full object-cover"
          />
          <p className="text-sm font-medium">{displayName}</p>
        </div>

        {/* Botón de cerrar sesión */}
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded"
        >
          Cerrar Sesión
        </button>
      </div>
    </header>
  );
};

export default Header;
