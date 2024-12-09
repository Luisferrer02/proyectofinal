"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const ResetPasswordPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";

  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleResetPassword = async () => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
      const url = `${baseUrl}/user/validation`;
  
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          code,
          password: newPassword, // Incluye la nueva contraseña
        }),
      });
  
      if (response.ok) {
        setSuccess("Contraseña cambiada con éxito. Redirigiendo...");
        setError("");
        setTimeout(() => router.push("/auth/login"), 2000);
      } else if (response.status === 422) {
        setError("El código ingresado no es válido.");
      } else {
        setError("Error al cambiar la contraseña. Intente nuevamente.");
      }
    } catch (err) {
      setError("Error de red. Intente más tarde.");
    }
  };
  

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold mb-6 text-gray-800 text-center">Restablecer Contraseña</h1>

        <div className="mb-4">
          <label htmlFor="code" className="block text-gray-700 font-medium mb-2">
            Código
          </label>
          <input
            id="code"
            type="text"
            placeholder="Ingresa el código"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="newPassword" className="block text-gray-700 font-medium mb-2">
            Nueva Contraseña
          </label>
          <input
            id="newPassword"
            type="password"
            placeholder="********"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          onClick={handleResetPassword}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg font-semibold transition duration-200"
        >
          Cambiar Contraseña
        </button>

        {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
        {success && <p className="text-green-500 mt-4 text-center">{success}</p>}
      </div>
    </div>
  );
};

export default ResetPasswordPage;
