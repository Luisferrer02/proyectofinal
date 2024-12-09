// components/Sidebar.jsx
import Link from "next/link";

const Sidebar = () => {
  return (
    <aside className="w-64 bg-gray-800 text-white h-screen shadow-lg">
      {/* Logo o Título */}
      <div className="p-4 bg-gray-900">
        <h2 className="text-lg font-bold">Menú Principal</h2>
      </div>

      {/* Opciones de navegación */}
      <nav className="mt-4">
        <ul>
          <li>
          <Link href="/clients" className="block py-2 px-4 hover:bg-gray-700">
            Clientes
            </Link>
          </li>
          <li>
          <Link href="/projects" className="block py-2 px-4 hover:bg-gray-700">
            Proyectos
            </Link>
          </li>
          <li>
          <Link href="/albaranes" className="block py-2 px-4 hover:bg-gray-700">
            Albaranes
            </Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
