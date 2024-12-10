"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Table from "@/components/Table";
import Modal from "@/components/Modal";

const ClientsPage = () => {
  const router = useRouter();
  const [clients, setClients] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [isDetailsModalOpen, setDetailsModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    cif: "",
    address: {
      street: "",
      number: "",
      postal: "",
      city: "",
      province: "",
    },
  });
  const [error, setError] = useState("");

  useEffect(() => {
    fetchClients();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith("address.")) {
      const addressField = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        address: { ...prev.address, [addressField]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const fetchClients = async () => {
    try {
      console.log("Fetching clients - Starting request");
      const token = localStorage.getItem("jwt");
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
      const url = `${baseUrl}/client`;

      console.log(`Fetch URL: ${url}`);
      console.log(
        `Authorization Token: ${token ? "Token present" : "No token"}`
      );

      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log(`Response status: ${response.status}`);

      if (response.ok) {
        const data = await response.json();
        console.log("Clients fetched successfully:", data);
        setClients(data);
      } else {
        console.error(
          "Failed to fetch clients. Response:",
          await response.text()
        );
        setError("Error al cargar los clientes.");
      }
    } catch (err) {
      console.error("Network error when fetching clients:", err);
      setError("Error de red. Intenta nuevamente.");
    }
  };

  const deleteClient = async (clientId) => {
    if (!clientId) {
      console.error("Client ID is undefined");
      setError("Error: No se encontró el ID del cliente.");
      return;
    }

    try {
      const token = localStorage.getItem("jwt");
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
      const url = `${baseUrl}/client/${clientId}`;

      console.log(`Deleting client with ID: ${clientId}`);

      const response = await fetch(url, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        console.log(`Client with ID ${clientId} deleted successfully`);
        // Actualiza la lista de clientes después de eliminar
        setClients((prevClients) =>
          prevClients.filter((client) => client._id !== clientId)
        );
      } else {
        console.error("Error deleting client");
        setError("No se pudo eliminar el cliente.");
      }
    } catch (err) {
      console.error("Error al eliminar cliente:", err);
      setError("Error de red. Intenta nuevamente.");
    }
  };

  // New function to fetch client details
  const fetchClientDetails = async (clientId) => {
    if (!clientId) {
      console.error("Client ID is undefined");
      setError("Error: No se encontró el ID del cliente.");
      return;
    }

    try {
      const token = localStorage.getItem("jwt");
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
        const clientDetails = await response.json();
        console.log("Client details fetched:", clientDetails);
        setSelectedClient(clientDetails);
        setDetailsModalOpen(true);
      } else {
        console.error("Error fetching client details");
        setError("No se pudieron cargar los detalles del cliente.");
      }
    } catch (err) {
      console.error("Error al obtener detalles del cliente:", err);
      setError("Error de red. Intenta nuevamente.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      console.log("Creating client - Starting request");
      console.log("Form data to be sent:", JSON.stringify(formData));

      const token = localStorage.getItem("jwt");
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
      const url = `${baseUrl}/client`;

      console.log(`POST URL: ${url}`);
      console.log(
        `Authorization Token: ${token ? "Token present" : "No token"}`
      );

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      console.log(`Response status: ${response.status}`);

      if (response.ok) {
        const newClient = await response.json();
        console.log("Client created successfully:", newClient);
        setClients((prev) => [...prev, newClient]);
        setModalOpen(false);
        setFormData({
          name: "",
          cif: "",
          address: {
            street: "",
            number: "",
            postal: "",
            city: "",
            province: "",
          },
        });
      } else {
        const errorText = await response.text();
        console.error("Failed to create client. Response:", errorText);
        setError("Error al crear el cliente.");
      }
    } catch (err) {
      console.error("Network error when creating client:", err);
      setError("Error de red. Intenta nuevamente.");
    }
  };

  const data = clients.map((client) => ({
    id: client._id, // Cambia a client.id si es necesario
    name: client.name || "N/A",
    cif: client.cif || "N/A",
    address: client.address || {
      street: "N/A",
      number: "N/A",
      postal: "N/A",
      city: "N/A",
      province: "N/A",
    },
  }));


  const columns = [
    { header: "Nombre", accessor: "name" },
    { header: "CIF", accessor: "cif" },
    /*{
      header: "Dirección",
      accessor: (row) =>
        row.address
          ? `${row.address.street || "Calle desconocida"}, ${
              row.address.city || "Ciudad desconocida"
            }`
          : "Dirección no disponible",
    },*/
    {
      header: "Acciones",
      accessor: "actions",
      cell: (row) => (
        <div className="flex space-x-4">
          <button
            onClick={() => router.push(`/clients/${row.id}`)} // Redirige a la página del cliente
            className="text-blue-500 hover:text-blue-700 underline"
          >
            Detalles
          </button>
          <button
            onClick={() => deleteClient(row.id)} // Eliminar cliente
            className="text-red-500 hover:text-red-700 underline"
          >
            Eliminar
          </button>
        </div>
      ),
    },
  ];

  const handleCloseModal = () => {
    setModalOpen(false);
    setFormData({
      name: "",
      cif: "",
      address: {
        street: "",
        number: "",
        postal: "",
        city: "",
        province: "",
      },
    });
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">
          Gestión de Clientes
        </h1>
        <button
          onClick={() => setModalOpen(true)}
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
        >
          Nuevo Cliente
        </button>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <Table columns={columns} data={data} />
      </div>

      {isModalOpen && (
        <Modal
          isOpen={isModalOpen} // Explicitly pass the isOpen prop
          onClose={handleCloseModal}
          title="Crear Cliente" // Add a title prop
        >
          <form onSubmit={handleSubmit}>
            {error && <p className="text-red-500">{error}</p>}
            <div className="mb-4">
              <label className="block text-gray-700">Nombre</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full border rounded p-2"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">CIF</label>
              <input
                type="text"
                name="cif"
                value={formData.cif}
                onChange={handleInputChange}
                className="w-full border rounded p-2"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Calle</label>
              <input
                type="text"
                name="address.street"
                value={formData.address.street}
                onChange={handleInputChange}
                className="w-full border rounded p-2"
              />
            </div>
            <div className="flex space-x-4">
              <div className="flex-1">
                <label className="block text-gray-700">Número</label>
                <input
                  type="text"
                  name="address.number"
                  value={formData.address.number}
                  onChange={handleInputChange}
                  className="w-full border rounded p-2"
                />
              </div>
              <div className="flex-1">
                <label className="block text-gray-700">Código Postal</label>
                <input
                  type="text"
                  name="address.postal"
                  value={formData.address.postal}
                  onChange={handleInputChange}
                  className="w-full border rounded p-2"
                />
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Ciudad</label>
              <input
                type="text"
                name="address.city"
                value={formData.address.city}
                onChange={handleInputChange}
                className="w-full border rounded p-2"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Provincia</label>
              <input
                type="text"
                name="address.province"
                value={formData.address.province}
                onChange={handleInputChange}
                className="w-full border rounded p-2"
              />
            </div>
            <div className="flex justify-end space-x-4">
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

      {isDetailsModalOpen && selectedClient && (
        <Modal
          isOpen={isDetailsModalOpen}
          onClose={() => setDetailsModalOpen(false)}
          title="Detalles del Cliente"
        >
          <div className="space-y-4">
            <div>
              <strong className="text-gray-700">Nombre:</strong>
              <p>{selectedClient.name}</p>
            </div>
            <div>
              <strong className="text-gray-700">CIF:</strong>
              <p>{selectedClient.cif}</p>
            </div>
            <div>
              <strong className="text-gray-700">Dirección:</strong>
              <p>
                {selectedClient.address.street} {selectedClient.address.number}
                <br />
                {selectedClient.address.postal} {selectedClient.address.city}
                <br />
                {selectedClient.address.province}
              </p>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default ClientsPage;
