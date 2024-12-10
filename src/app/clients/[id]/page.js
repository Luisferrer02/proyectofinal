"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

const ClientDetailsPage = () => {
  const params = useParams(); // Desencapsula params dinámicos
  const { id } = params || {}; // Extraer el ID
  const router = useRouter();

  const [client, setClient] = useState(null);
  const [projects, setProjects] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [projectsLoading, setProjectsLoading] = useState(true);

  useEffect(() => {
    if (!id) {
      console.error("Client ID is undefined");
      setError("Error: No se proporcionó un ID de cliente.");
      setLoading(false);
      return;
    }
    fetchClientDetails(id);
    fetchClientProjects(id);
  }, [id]);

  const fetchClientDetails = async (clientId) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("jwt");
      if (!token) {
        setError(
          "Error: No se encontró el token JWT. Por favor, inicia sesión."
        );
        setLoading(false);
        return;
      }

      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
      const url = `${baseUrl}/client/${clientId}`;

      console.log(`Fetching client details for ID: ${clientId}`);

      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const clientData = await response.json();
        console.log("Client details fetched:", clientData);
        setClient(clientData);
      } else {
        const errorText = await response.text();
        console.error("Error fetching client details:", errorText);
        setError("No se pudieron cargar los detalles del cliente.");
      }
    } catch (err) {
      console.error("Error al obtener detalles del cliente:", err);
      setError("Error de red. Intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  const fetchClientProjects = async (clientId) => {
    setProjectsLoading(true);
    try {
      const token = localStorage.getItem("jwt");
      if (!token) {
        setError(
          "Error: No se encontró el token JWT. Por favor, inicia sesión."
        );
        setProjectsLoading(false);
        return;
      }

      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
      const url = `${baseUrl}/project/${clientId}`;

      console.log(`Fetching projects for Client ID: ${clientId}`);

      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const projectData = await response.json();
        console.log("Projects fetched:", projectData);
        setProjects(projectData.slice(0, 4)); // Mostrar los 4 proyectos más recientes
      } else {
        const errorText = await response.text();
        console.error("Error fetching projects:", errorText);
        setError("No se pudieron cargar los proyectos.");
      }
    } catch (err) {
      console.error("Error al obtener proyectos:", err);
      setError("Error de red. Intenta nuevamente.");
    } finally {
      setProjectsLoading(false);
    }
  };

  const handleViewAllProjects = () => {
    router.push(`/clients/${id}/projects`); // Usa "id" extraído de params
  };

  if (loading) {
    return (
      <div className="p-6 text-gray-500">Cargando detalles del cliente...</div>
    );
  }

  if (error) {
    return <div className="p-6 text-red-500">{error}</div>;
  }

  if (!client) {
    return (
      <div className="p-6 text-gray-500">
        No se encontraron datos para este cliente.
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Sección de detalles del cliente */}
      <h1 className="text-3xl font-bold text-black mb-6">
        Detalles del Cliente
      </h1>
      <div className="bg-white shadow-md rounded-lg p-6">
        <div className="space-y-4">
          <div>
            <strong className="text-black">Nombre:</strong>
            <p className="text-black">{client.name || "N/A"}</p>
          </div>
          <div>
            <strong className="text-black">CIF:</strong>
            <p className="text-black">{client.cif || "N/A"}</p>
          </div>
          <div>
            <strong className="text-black">Dirección:</strong>
            <p className="text-black">
              {client.address?.street || "Calle desconocida"}{" "}
              {client.address?.number || "Número desconocido"}
              <br />
              {client.address?.postal || "C.P. desconocido"}{" "}
              {client.address?.city || "Ciudad desconocida"}
              <br />
              {client.address?.province || "Provincia desconocida"}
            </p>
          </div>
        </div>
      </div>

      {/* Sección de proyectos recientes */}
      <h2 className="text-2xl font-bold mt-8 mb-4 text-gray-900">
        Proyectos Recientes
      </h2>
      <div className="bg-white shadow-md rounded-lg p-6">
        {projectsLoading ? (
          <p className="text-gray-500">Cargando proyectos...</p>
        ) : projects.length > 0 ? (
          <ul className="space-y-4 ">
            {projects.map((project) => (
              <li key={project._id} className = "text-gray-900">{project.name}</li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No hay proyectos recientes.</p>
        )}
      </div>

      <div className="mt-6 flex space-x-4">
        <button
          onClick={handleViewAllProjects}
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
        >
          Ver Todos los Proyectos
        </button>
      </div>

      <button
        onClick={() => router.push("/clients")}
        className="mt-6 bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
      >
        Volver a la Lista
      </button>
    </div>
  );
};

export default ClientDetailsPage;
