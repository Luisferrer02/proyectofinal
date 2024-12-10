"use client";

import { useRouter } from "next/navigation";

const Custom404 = () => {
  const router = useRouter();

  const handleGoHome = () => {
    router.push("/");
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100 text-center">
      <h1 className="text-6xl font-bold text-blue-600">404</h1>
      <h2 className="text-3xl font-semibold text-gray-800 mt-4">
        Página no encontrada
      </h2>
      <p className="text-gray-600 mt-2">
        Lo sentimos, no pudimos encontrar la página que estás buscando.
      </p>
      <button
        onClick={handleGoHome}
        className="mt-6 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
      >
        Regresar al Inicio
      </button>
      <img
        src="https://via.placeholder.com/400x300.png?text=404+Not+Found"
        alt="404 Illustration"
        className="mt-8 w-64 h-64 object-cover"
      />
    </div>
  );
};

export default Custom404;
