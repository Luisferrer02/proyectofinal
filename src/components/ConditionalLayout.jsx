"use client"; // Marcamos este componente como Client Component
import UserDropdown from "./UserDropdown";
import { usePathname } from "next/navigation";
import Header from "./Header";
import Footer from "./Footer";

export default function ConditionalLayout({ children }) {
  const pathname = usePathname();
  const isAuthPage = pathname.startsWith("/auth");
  const isMainPage = pathname === "/";
  const is404Page = pathname === "/404";

  const userName = "Luis Ferrer"; // Simulando el nombre del usuario, cámbialo dinámicamente si tienes la información en el estado o contexto

  return (
    <div className="flex h-screen bg-gray-100">
      <div
        className={`flex-1 flex flex-col ${
          isAuthPage || isMainPage || is404Page
            ? "justify-center items-center"
            : ""
        }`}
      >
        {/* Mostrar Header solo si no estamos en auth, main o 404 */}
        {!(isAuthPage || isMainPage || is404Page) && (
          <header className="flex items-center justify-between bg-blue-600 text-white p-4 shadow-md">
            {/* Título del sistema */}
            <h1 className="text-xl font-bold">Gestión de Albaranes</h1>
            {/* Contenedor para UserDropdown y nombre de usuario */}
            <div className="flex items-center gap-4">
              {/* Nombre del Usuario */}
              <span className="text-white text-md font-medium">{userName}</span>
              {/* UserDropdown */}
              <UserDropdown />
              {/* Botón de cerrar sesión */}
              <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md">
                Cerrar Sesión
              </button>
            </div>
          </header>
        )}
        <main
          className={`flex-1 ${
            isAuthPage || isMainPage || is404Page ? "" : "overflow-y-auto p-6"
          }`}
        >
          {children}
        </main>
        {!(isAuthPage || isMainPage || is404Page) && <Footer />}
      </div>
    </div>
  );
}
