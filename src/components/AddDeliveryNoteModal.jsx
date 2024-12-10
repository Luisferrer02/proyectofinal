import React, { useState } from "react";

const AddDeliveryNoteModal = ({ onSubmit, onClose }) => {
    const [formData, setFormData] = useState({
        format: "material", // Valor por defecto
        material: "",
        hours: "",
        description: "",
        workdate: "",
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Validar los campos según el formato
        if (formData.format === "material" && !formData.material) {
            alert("Por favor, ingresa el tipo de material.");
            return;
        }
        if (formData.format === "hours" && !formData.hours) {
            alert("Por favor, ingresa el número de horas.");
            return;
        }

        onSubmit(formData); // Llama a la función de envío con los datos del formulario
        onClose(); // Cierra el modal
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white w-full max-w-lg rounded-lg shadow-lg p-6 relative text-gray-800">
                <form onSubmit={handleSubmit} className="text-gray-700">
                    <h2 className="text-xl font-bold mb-4">Añadir Albarán</h2>

                    {/* Selector de formato */}
                    <div className="mb-4">
                        <label className="block font-bold mb-2">Formato:</label>
                        <select
                            name="format"
                            value={formData.format}
                            onChange={handleInputChange}
                            className="w-full border rounded p-2"
                        >
                            <option value="material">Material</option>
                            <option value="hours">Horas</option>
                        </select>
                    </div>

                    {/* Campo condicional para material */}
                    {formData.format === "material" && (
                        <div className="mb-4">
                            <label className="block font-bold mb-2">
                                Tipo de Material:
                            </label>
                            <input
                                type="text"
                                name="material"
                                value={formData.material}
                                onChange={handleInputChange}
                                className="w-full border rounded p-2"
                                placeholder="Ej. Cemento, Acero"
                            />
                        </div>
                    )}

                    {/* Campo condicional para horas */}
                    {formData.format === "hours" && (
                        <div className="mb-4">
                            <label className="block font-bold mb-2">Horas:</label>
                            <input
                                type="number"
                                name="hours"
                                value={formData.hours}
                                onChange={handleInputChange}
                                className="w-full border rounded p-2"
                                placeholder="Ej. 8"
                            />
                        </div>
                    )}

                    {/* Descripción */}
                    <div className="mb-4">
                        <label className="block font-bold mb-2">
                            Descripción:
                        </label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            className="w-full border rounded p-2"
                            placeholder="Detalles del albarán"
                        ></textarea>
                    </div>

                    {/* Fecha */}
                    <div className="mb-4">
                        <label className="block font-bold mb-2">
                            Fecha de Trabajo:
                        </label>
                        <input
                            type="date"
                            name="workdate"
                            value={formData.workdate}
                            onChange={handleInputChange}
                            className="w-full border rounded p-2"
                        />
                    </div>

                    {/* Botones */}
                    <div className="flex justify-end space-x-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                        >
                            Añadir
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddDeliveryNoteModal;
