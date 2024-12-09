"use client";

import React, { useState, useEffect } from "react";

const EditProfileModal = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: "",
    surnames: "",
    nif: "",
    email: "",
  });
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen) {
      // Inicializar datos del formulario cuando el modal se abre
      const fetchUserData = async () => {
        try {
          const token = localStorage.getItem("jwt");
          const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
          const url = `${baseUrl}/user`;

          const response = await fetch(url, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (response.ok) {
            const data = await response.json();
            setFormData({
              name: data.name || "",
              surnames: data.surnames || "",
              nif: data.nif || "",
              email: data.email || "",
            });
          } else {
            setError("Error al recuperar los datos del usuario.");
          }
        } catch (err) {
          setError("Error de red al cargar los datos. Intente nuevamente.");
        }
      };

      fetchUserData();
    }
  }, [isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await onSubmit(formData); // Enviar los datos actualizados al servidor
    } catch (err) {
      setError("Error al actualizar el perfil. Intente nuevamente.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-1/2">
        <h2 className="text-xl font-bold mb-4">Editar Perfil</h2>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-gray-700">
              Nombre
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border rounded p-2"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="surnames" className="block text-gray-700">
              Apellidos
            </label>
            <input
              type="text"
              id="surnames"
              name="surnames"
              value={formData.surnames}
              onChange={handleChange}
              className="w-full border rounded p-2"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="nif" className="block text-gray-700">
              NIF
            </label>
            <input
              type="text"
              id="nif"
              name="nif"
              value={formData.nif}
              onChange={handleChange}
              className="w-full border rounded p-2"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700">
              Correo Electrónico
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border rounded p-2"
              disabled
            />
          </div>
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-4 rounded"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
            >
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfileModal;
