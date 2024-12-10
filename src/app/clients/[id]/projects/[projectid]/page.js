"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Modal from "@/components/Modal";

const ProjectDetailsPage = () => {
  const params = useParams();
  const { projectid } = params || {};
  const [project, setProject] = useState(null);
  const [deliveryNotes, setDeliveryNotes] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    description: "",
    date: "",
    amount: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadingNotes, setLoadingNotes] = useState(true);

  useEffect(() => {
    if (!projectid) {
      setError("Error: No se proporcionó el ID del proyecto.");
      setLoading(false);
      return;
    }
    fetchProjectDetails(projectid);
    fetchDeliveryNotes(projectid);
  }, [projectid]);

  const fetchProjectDetails = async (id) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("jwt");
      if (!token) {
        setError("Error: No se encontró el token JWT.");
        setLoading(false);
        return;
      }

      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
      const url = `${baseUrl}/project/one/${id}`;

      console.log(`Fetching project details for ID: ${id}`);

      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const projectData = await response.json();
        console.log("Detalles del proyecto obtenidos:", projectData);
        setProject(projectData);
      } else {
        const errorText = await response.text();
        console.error("Error al obtener detalles del proyecto:", errorText);
        setError("No se pudieron cargar los detalles del proyecto.");
      }
    } catch (err) {
      console.error("Error de red al obtener detalles del proyecto:", err);
      setError("Error de red. Intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  const fetchDeliveryNotes = async (id) => {
    setLoadingNotes(true);
    try {
      const token = localStorage.getItem("jwt");
      if (!token) {
        setError("Error: No se encontró el token JWT.");
        setLoadingNotes(false);
        return;
      }

      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
      const url = `${baseUrl}/deliverynote/${id}`;

      console.log(`Fetching delivery notes for project ID: ${id}`);

      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const notesData = await response.json();
        console.log("Albaranes obtenidos:", notesData);
        setDeliveryNotes(notesData);
      } else {
        const errorText = await response.text();
        console.error("Error al obtener albaranes:", errorText);
        setError("No se pudieron cargar los albaranes.");
      }
    } catch (err) {
      console.error("Error de red al obtener albaranes:", err);
      setError("Error de red. Intenta nuevamente.");
    } finally {
      setLoadingNotes(false);
    }
  };

  const handleAddDeliveryNote = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("jwt");
      if (!token) {
        setError("Error: No se encontró el token JWT.");
        return;
      }

      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
      const url = `${baseUrl}/deliverynote`;

      console.log("Enviando solicitud para crear albarán...");

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          clientId: project.clientId, // Asociar albarán con el cliente
          projectId: projectid, // Asociar albarán con el proyecto
        }),
      });

      if (response.ok) {
        const newNote = await response.json();
        setDeliveryNotes((prev) => [...prev, newNote]); // Actualiza la lista de albaranes
        setModalOpen(false); // Cierra el modal
        setFormData({
          format: "material",
          material: "",
          hours: "",
          description: "",
          workdate: "",
        }); // Reinicia el formulario
      } else {
        const errorText = await response.text();
        setError(`Error al crear el albarán: ${errorText}`);
      }
    } catch (err) {
      console.error("Error de red al crear el albarán:", err);
      setError("Error de red. Intenta nuevamente.");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  if (loading) {
    return (
      <div className="p-6 text-gray-500">Cargando detalles del proyecto...</div>
    );
  }

  if (error) {
    return <div className="p-6 text-red-500">{error}</div>;
  }

  if (!project) {
    return (
      <div className="p-6 text-gray-500">
        No se encontraron datos para este proyecto.
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Detalles del Proyecto
      </h1>
      <div className="bg-white shadow-md rounded-lg p-6">
        {/* Detalles del proyecto */}
        <div className="space-y-4">
          <div>
            <strong className="text-gray-700">Nombre:</strong>
            <p className="text-gray-900">{project.name || "N/A"}</p>
          </div>
          <div>
            <strong className="text-gray-700">Descripción:</strong>
            <p className="text-gray-900">
              {project.description || "Sin descripción"}
            </p>
          </div>
        </div>
      </div>

      {/* Tabla de albaranes */}
      <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4">Albaranes</h2>
      <div className="bg-white shadow-md rounded-lg p-6">
        {loadingNotes ? (
          <p className="text-gray-500">Cargando albaranes...</p>
        ) : deliveryNotes.length > 0 ? (
          <table className="min-w-full bg-white border border-gray-200 rounded-lg">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-2 px-4 border-b border-gray-200 text-left text-sm font-bold text-gray-800">
                  Descripción
                </th>
                <th className="py-2 px-4 border-b border-gray-200 text-left text-sm font-bold text-gray-800">
                  Fecha
                </th>
                <th className="py-2 px-4 border-b border-gray-200 text-left text-sm font-bold text-gray-800">
                  Monto
                </th>
              </tr>
            </thead>
            <tbody>
              {deliveryNotes.map((note) => (
                <tr key={note._id} className="hover:bg-gray-50">
                  <td className="py-2 px-4 border-b border-gray-200 text-sm text-gray-800">
                    {note.description}
                  </td>
                  <td className="py-2 px-4 border-b border-gray-200 text-sm text-gray-800">
                    {note.date || "Sin fecha"}
                  </td>
                  <td className="py-2 px-4 border-b border-gray-200 text-sm text-gray-800">
                    {note.amount || "Sin monto"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-gray-500">
            No se encontraron albaranes para este proyecto.
          </p>
        )}
      </div>

      {/* Botón para añadir albaranes */}
      <div className="mt-6">
        <button
          onClick={() => setModalOpen(true)}
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
        >
          Añadir Albarán
        </button>
      </div>

      {/* Modal para crear albarán */}
      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setModalOpen(false)}
          title="Añadir Albarán"
        >
          <form onSubmit={handleAddDeliveryNote}>
            {/* Formato */}
            <div className="mb-4">
              <label className="block text-gray-700">Formato</label>
              <select
                name="format"
                value={formData.format}
                onChange={handleInputChange}
                className="w-full border rounded p-2"
                required
              >
                <option value="material">Material</option>
                <option value="hours">Horas</option>
              </select>
            </div>

            {/* Tipo de material (solo si el formato es material) */}
            {formData.format === "material" && (
              <div className="mb-4">
                <label className="block text-gray-700">Material</label>
                <input
                  type="text"
                  name="material"
                  value={formData.material}
                  onChange={handleInputChange}
                  className="w-full border rounded p-2"
                />
              </div>
            )}

            {/* Horas (solo si el formato es horas) */}
            {formData.format === "hours" && (
              <div className="mb-4">
                <label className="block text-gray-700">Horas</label>
                <input
                  type="number"
                  name="hours"
                  value={formData.hours}
                  onChange={handleInputChange}
                  className="w-full border rounded p-2"
                />
              </div>
            )}

            {/* Descripción */}
            <div className="mb-4">
              <label className="block text-gray-700">Descripción</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="w-full border rounded p-2"
                required
              />
            </div>

            {/* Fecha de trabajo */}
            <div className="mb-4">
              <label className="block text-gray-700">Fecha de Trabajo</label>
              <input
                type="date"
                name="workdate"
                value={formData.workdate}
                onChange={handleInputChange}
                className="w-full border rounded p-2"
                required
              />
            </div>

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="py-2 px-4 rounded border border-gray-400 hover:bg-gray-100"
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
        </Modal>
      )}
    </div>
  );
};

export default ProjectDetailsPage;
