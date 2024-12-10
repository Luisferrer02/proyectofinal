"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Modal from "@/components/Modal";

const ProjectsPage = () => {
  const params = useParams();
  const { id: clientId } = params || {};
  const [projects, setProjects] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    startDate: "",
    endDate: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const router = useRouter();


  useEffect(() => {
    if (!clientId) {
      setError("Error: ID del cliente no proporcionado.");
      setLoading(false);
      return;
    }
    fetchProjects();
  }, [clientId]);

  const fetchProjects = async () => {
    try {
      const token = localStorage.getItem("jwt");
      if (!token) {
        setError("Error: No se encontró el token JWT.");
        return;
      }

      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
      const url = `${baseUrl}/project/${clientId}`; // Corrige la URL aquí

      console.log(`Fetching projects for client ID: ${clientId}`);

      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();

        // Añadir console.log para inspeccionar los datos recibidos
        console.log("Datos recibidos de la API:", data);

        setProjects(data);
      } else {
        const errorText = await response.text();
        setError(`Error al obtener proyectos: ${errorText}`);
      }
    } catch (err) {
      setError("Error al cargar los proyectos. Intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Evita el comportamiento por defecto del formulario
    setError("");

    try {
      const token = localStorage.getItem("jwt");
      if (!token) {
        setError("Error: No se encontró el token JWT.");
        return;
      }

      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
      const url = `${baseUrl}/project`; // Cambia la URL para no incluir el clientId en la ruta

      console.log("Enviando solicitud para crear proyecto...");

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          clientId, // Enviar el ID del cliente en el cuerpo de la solicitud
        }),
      });

      if (response.ok) {
        const newProject = await response.json();
        setProjects((prev) => [...prev, newProject]); // Actualiza la lista de proyectos
        setModalOpen(false); // Cierra el modal
        setFormData({
          name: "",
          description: "",
          startDate: "",
          endDate: "",
          internalCode: "",
          clientCode: "",
          projectAddress: "",
          email: "",
        }); // Reinicia el formulario
      } else {
        const errorText = await response.text();
        setError(`Error al crear el proyecto: ${errorText}`);
      }
    } catch (err) {
      setError("Error de red al crear el proyecto. Intenta nuevamente.");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleOpenModal = () => {
    setModalOpen(true); // Abre el modal
  };

  const handleProjectClick = (projectid) => {
    // Asegúrate de usar clientId en lugar de id
    if (!clientId) {
      console.error("Client ID no está definido.");
      return;
    }
    
    router.push(`/clients/${clientId}/projects/${projectid}`);
  };
  

  const handleCloseModal = () => {
    setModalOpen(false); // Cierra el modal
    setFormData({ name: "", description: "", startDate: "", endDate: "" }); // Reinicia el formulario
  };

  if (loading) {
    return <div className="text-gray-800">Cargando proyectos...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-gray-800 text-2xl font-bold mb-4">
        Proyectos del Cliente
      </h1>

      <button
        onClick={handleOpenModal} // Cambiado para manejar solo la apertura del modal
        className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
      >
        Crear Proyecto
      </button>

      {projects.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-2 px-4 border-b border-gray-200 text-left text-sm font-bold text-gray-800">
                  Nombre del Proyecto
                </th>
                <th className="py-2 px-4 border-b border-gray-200 text-left text-sm font-bold text-gray-800">
                  Correo Electrónico
                </th>
              </tr>
            </thead>
            <tbody>
              {projects.map((project) => (
                <tr key={project._id} className="hover:bg-gray-50">
                  <td
                    className="py-2 px-4 border-b border-gray-200 text-sm text-blue-600 cursor-pointer"
                    onClick={() => handleProjectClick(project._id)} // Llamamos a la función con _id
                  >
                    {project.name}
                  </td>
                  <td className="py-2 px-4 border-b border-gray-200 text-sm text-gray-800">
                    {project.email || "Sin correo electrónico"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-gray-700">
          No se encontraron proyectos para este cliente.
        </p>
      )}

      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setModalOpen(false)} // Cierra el modal
          title="Crear Proyecto"
        >
          <form onSubmit={handleSubmit}>
            {error && <p className="text-red-500">{error}</p>}

            {/* Nombre del Proyecto */}
            <div className="mb-4">
              <label className="block text-gray-800">Nombre del Proyecto</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full border rounded p-2"
                required
              />
            </div>

            {/* Descripción */}
            <div className="mb-4">
              <label className="block text-gray-800">Descripción</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="w-full border rounded p-2"
              />
            </div>

            {/* Código Interno del Proyecto */}
            <div className="mb-4">
              <label className="block text-gray-800">
                Código Interno del Proyecto
              </label>
              <input
                type="text"
                name="internalCode"
                value={formData.internalCode}
                onChange={handleInputChange}
                className="w-full border rounded p-2"
                required
              />
            </div>

            {/* Código de Cliente */}
            <div className="mb-4">
              <label className="block text-gray-800">Código de Cliente</label>
              <input
                type="text"
                name="clientCode"
                value={formData.clientCode}
                onChange={handleInputChange}
                className="w-full border rounded p-2"
                required
              />
            </div>

            {/* Línea de Dirección del Proyecto */}
            <div className="mb-4">
              <label className="block text-gray-800">
                Línea de Dirección del Proyecto
              </label>
              <input
                type="text"
                name="projectAddress"
                value={formData.projectAddress}
                onChange={handleInputChange}
                className="w-full border rounded p-2"
                required
              />
            </div>

            {/* Correo Electrónico */}
            <div className="mb-4">
              <label className="block text-gray-800">Correo Electrónico</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full border rounded p-2"
                required
              />
            </div>

            {/* Botones */}
            <div className="flex justify-end space-x-4">
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
              >
                Crear
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default ProjectsPage;
