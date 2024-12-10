import { useState } from "react";

const ViewDeliveryNoteModal = ({ noteDetails, clientid, projectid, isOpen, onClose, onUpdate }) => {
    const [isEditing, setIsEditing] = useState(false); // Modo de edición
    const [formData, setFormData] = useState(noteDetails || {});
  
    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    };
  
    const handleEdit = () => {
      setIsEditing(true); // Habilitar modo de edición
    };
  
    const handleSave = async () => {
      try {
        const token = localStorage.getItem("jwt");
        if (!token) {
          alert("Error: No se encontró el token JWT.");
          return;
        }
  
        const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
        const url = `${baseUrl}/deliverynote/${formData._id}`;
  
        // Formato según el esquema proporcionado
        const body = {
          clientId: clientid,
          projectId: projectid,
          format: formData.format,
          material: formData.format === "material" ? formData.material : null,
          hours: formData.format === "hours" ? formData.hours : null,
          description: formData.description,
          workdate: formData.workdate,
        };
  
        console.log("Datos enviados al PUT:", body);
  
        // Validar los datos antes de enviarlos
        if (!body.clientId || !body.projectId) {
          alert("Error: clientId o projectId no están definidos.");
          return;
        }
  
        const response = await fetch(url, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(body),
        });
  
        if (response.ok) {
          const updatedNote = await response.json();
          console.log("Albarán actualizado:", updatedNote);
  
          // Llamar a onUpdate para actualizar el estado en el componente padre
          onUpdate(updatedNote);
  
          setIsEditing(false); // Salir del modo de edición
          onClose(); // Cerrar el modal después de guardar
        } else {
          const errorText = await response.text();
          console.error("Error al actualizar el albarán:", errorText);
          alert(`Error al actualizar el albarán: ${errorText}`);
        }
      } catch (err) {
        console.error("Error de red al actualizar el albarán:", err);
      }
    };
  
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white w-full max-w-lg rounded-lg shadow-lg p-6 relative">
          <h2 className="text-xl font-bold mb-4 text-gray-900">
            {isEditing ? "Editar Albarán" : "Detalles del Albarán"}
          </h2>
  
          <form>
            {/* Formato */}
            <div className="mb-4">
              <label className="block text-gray-900 font-bold mb-2">
                Formato:
              </label>
              <select
                name="format"
                value={formData.format}
                onChange={handleInputChange}
                className="w-full border rounded p-2 text-gray-800"
                disabled={!isEditing}
              >
                <option value="material">Material</option>
                <option value="hours">Horas</option>
              </select>
            </div>
  
            {/* Tipo de material */}
            {formData.format === "material" && (
              <div className="mb-4">
                <label className="block text-gray-900 font-bold mb-2">
                  Tipo de Material:
                </label>
                <input
                  type="text"
                  name="material"
                  value={formData.material || ""}
                  onChange={handleInputChange}
                  className="w-full border rounded p-2 text-gray-800"
                  disabled={!isEditing}
                />
              </div>
            )}
  
            {/* Horas */}
            {formData.format === "hours" && (
              <div className="mb-4">
                <label className="block text-gray-900 font-bold mb-2">
                  Horas:
                </label>
                <input
                  type="number"
                  name="hours"
                  value={formData.hours || ""}
                  onChange={handleInputChange}
                  className="w-full border rounded p-2 text-gray-800"
                  disabled={!isEditing}
                />
              </div>
            )}
  
            {/* Descripción */}
            <div className="mb-4">
              <label className="block text-gray-900 font-bold mb-2">
                Descripción:
              </label>
              <textarea
                name="description"
                value={formData.description || ""}
                onChange={handleInputChange}
                className="w-full border rounded p-2 text-gray-800"
                disabled={!isEditing}
              ></textarea>
            </div>
  
            {/* Fecha de trabajo */}
            <div className="mb-4">
              <label className="block text-gray-900 font-bold mb-2">
                Fecha de Trabajo:
              </label>
              <input
                type="date"
                name="workdate"
                value={formData.workdate || ""}
                onChange={handleInputChange}
                className="w-full border rounded p-2 text-gray-800"
                disabled={!isEditing}
              />
            </div>
  
            {/* Botones */}
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={onClose}
                className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
              >
                Cerrar
              </button>
  
              {!isEditing ? (
                <button
                  type="button"
                  onClick={handleEdit}
                  className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                >
                  Editar
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSave}
                  className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
                >
                  Guardar
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    );
  };
  
  export default ViewDeliveryNoteModal;
  