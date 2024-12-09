"use client";

import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  const navigateToLogin = () => {
    router.push("/auth/login");
  };

  const navigateToRegister = () => {
    router.push("/auth/register");
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-4xl font-bold mb-6">Bienvenido a Gestión de Albaranes</h1>
      <p className="text-gray-700 mb-10 text-center max-w-md">
        Una aplicación para gestionar tus clientes, proyectos y albaranes de forma eficiente y rápida.
      </p>
      <div className="flex gap-4">
        <button
          onClick={navigateToLogin}
          className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
        >
          Iniciar Sesión
        </button>
        <button
          onClick={navigateToRegister}
          className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded"
        >
          Registrarse
        </button>
      </div>
    </div>
  );
}
