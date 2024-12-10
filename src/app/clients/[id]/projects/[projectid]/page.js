"use client";
import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import AddDeliveryNoteModal from "@/components/AddDeliveryNoteModal";
import ViewDeliveryNoteModal from "@/components/ViewDeliveryNoteModal";

const ProjectDetailsPage = () => {
  const params = useParams();
  const { projectid } = params || {};
  const [project, setProject] = useState(null);
  const [deliveryNotes, setDeliveryNotes] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedNote, setSelectedNote] = useState(null);
  const [isAddModalOpen, setAddModalOpen] = useState(false); // Modal para añadir albarán
  const [isViewModalOpen, setViewModalOpen] = useState(false);

  useEffect(() => {
    if (!projectid) {
      setError("Error: No se proporcionó el ID del proyecto.");
      setLoading(false);
      return;
    }
    console.log("Fetching project details for ID:", projectid);
    fetchProjectDetails(projectid);
    fetchDeliveryNotes(projectid);
  }, [projectid]);

  useEffect(() => {
    if (!projectid) {
      setError("Error: ID del proyecto no proporcionado.");
      return;
    }
    fetchDeliveryNotes();
  }, [projectid]);

  const fetchProjectDetails = async (id) => {
    try {
      const token = localStorage.getItem("jwt");
      if (!token) {
        setError("Error: No se encontró el token JWT.");
        return;
      }

      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
      const url = `${baseUrl}/project/one/${id}`;

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
        console.log("Estado actualizado de project:", projectData);
      } else {
        const errorText = await response.text();
        console.error("Error en fetchProjectDetails:", errorText);
        setError(`Error al obtener detalles del proyecto: ${errorText}`);
      }
    } catch (err) {
      console.error("Error de red al obtener detalles del proyecto:", err);
      setError("Error de red. Intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  const fetchDeliveryNotes = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("jwt");
      if (!token) {
        setError("Error: No se encontró el token JWT.");
        setLoading(false);
        return;
      }

      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
      const url = `${baseUrl}/deliverynote/project/${projectid}`; // Usar el endpoint correcto

      console.log(`Fetching delivery notes for project ID: ${projectid}`);

      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Delivery notes fetched:", data);
        setDeliveryNotes(data);
      } else {
        const errorText = await response.text();
        setError(`Error al obtener los albaranes: ${errorText}`);
      }
    } catch (err) {
      setError("Error al cargar los albaranes. Intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateNote = (updatedNote) => {
    setDeliveryNotes((prevNotes) =>
      prevNotes.map((note) =>
        note._id === updatedNote._id ? updatedNote : note
      )
    );
  };

  const fetchDeliveryNoteDetails = async (noteId) => {
    try {
      const token = localStorage.getItem("jwt");
      if (!token) {
        setError("Error: No se encontró el token JWT.");
        return;
      }

      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
      const url = `${baseUrl}/deliverynote/${noteId}`;

      console.log(`Fetching delivery note details for ID: ${noteId}`);

      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const noteDetails = await response.json();
        console.log("Detalles del albarán:", noteDetails);
        setSelectedNote(noteDetails); // Guardar los detalles del albarán
        setViewModalOpen(true); // Abrir el modal
      } else {
        const errorText = await response.text();
        setError(`Error al obtener detalles del albarán: ${errorText}`);
      }
    } catch (err) {
      setError("Error al cargar los detalles del albarán. Intenta nuevamente.");
    }
  };

  const handleAddDeliveryNote = async (data) => {
    try {
      const token = localStorage.getItem("jwt");
      if (!token) {
        alert("Error: No se encontró el token JWT.");
        return;
      }

      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
      const url = `${baseUrl}/deliverynote`;

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          clientId: project.clientId, // ID del cliente relacionado
          projectId: projectid, // ID del proyecto
          format: data.format,
          material: data.format === "material" ? data.material : null,
          hours: data.format === "hours" ? data.hours : null,
          description: data.description,
          workdate: data.workdate,
        }),
      });

      if (response.ok) {
        const newNote = await response.json();
        setDeliveryNotes((prev) => [...prev, newNote]);
      } else {
        const errorText = await response.text();
        console.error("Error al crear el albarán:", errorText);
      }
    } catch (err) {
      console.error("Error de red al crear el albarán:", err);
    }
  };

  const handleOpenModal = () => {
    setAddModalOpen(true);
  };

  const handleCloseModal = () => {
    setAddModalOpen(false);
  };

  const handleCloseViewModal = () => {
    setViewModalOpen(false);
  };

  if (loading) {
    return (
      <div className="p-6 text-gray-500">Cargando detalles del proyecto...</div>
    );
  }

  if (error) {
    return <div className="p-6 text-red-500">{error}</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Detalles del Proyecto
      </h1>
      {project ? (
        <div className="bg-white shadow-md rounded-lg p-6 mb-6">
          <div className="space-y-4">
            <div className="text-gray-800">
              <strong>Nombre:</strong>
              <p>{project.name || "N/A"}</p>
            </div>
            <div className="text-gray-800">
              <strong>Descripción:</strong>
              <p>{project.description || "Sin descripción"}</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-gray-500">Cargando detalles del proyecto...</div>
      )}

      {/* Tabla de albaranes */}
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Albaranes</h2>
      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        {deliveryNotes.length > 0 ? (
          <table className="min-w-full bg-white border border-gray-200 rounded-lg">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-2 px-4 border-b border-gray-200 text-left text-sm font-bold text-gray-800">
                  Formato
                </th>
                <th className="py-2 px-4 border-b border-gray-200 text-left text-sm font-bold text-gray-800">
                  Descripción
                </th>
                <th className="py-2 px-4 border-b border-gray-200 text-left text-sm font-bold text-gray-800">
                  Fecha de Trabajo
                </th>
                <th className="py-2 px-4 border-b border-gray-200 text-left text-sm font-bold text-gray-800">
                  Horas
                </th>
              </tr>
            </thead>
            <tbody>
              {deliveryNotes.map((note) => (
                <tr key={note._id} className="hover:bg-gray-50">
                  <td
                    className="py-2 px-4 border-b border-gray-200 text-sm text-blue-600 cursor-pointer"
                    onClick={() => fetchDeliveryNoteDetails(note._id)} // Cargar detalles al hacer clic
                  >
                    {note.format}
                  </td>
                  <td className="py-2 px-4 border-b border-gray-200 text-sm text-black">
                    {note.description}
                  </td>
                  <td className="py-2 px-4 border-b border-gray-200 text-sm text-black">
                    {note.workdate}
                  </td>
                  <td className="py-2 px-4 border-b border-gray-200 text-sm text-black">
                    {note.format === "material" ? "N/A" : note.hours || "N/A"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-gray-500">No hay albaranes disponibles.</p>
        )}
      </div>

      <button
        onClick={handleOpenModal}
        className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
      >
        Añadir Albarán
      </button>

      {/* Modal para añadir albarán */}
      {isAddModalOpen && (
        <AddDeliveryNoteModal
          onSubmit={handleAddDeliveryNote}
          onClose={handleCloseModal}
        />
      )}

      {/* Modal para ver detalles del albarán */}
      {isViewModalOpen && selectedNote ? (
        project ? (
          <ViewDeliveryNoteModal
            noteDetails={selectedNote}
            clientid={project.clientId}
            projectid={projectid}
            isOpen={isViewModalOpen}
            onClose={handleCloseViewModal}
            onUpdate={handleUpdateNote}
          />
        ) : (
          <div className="text-gray-500">Cargando detalles del proyecto...</div>
        )
      ) : (
        isViewModalOpen && (
          <div className="text-gray-500">Cargando detalles del albarán...</div>
        )
      )}
    </div>
  );
};

export default ProjectDetailsPage;
