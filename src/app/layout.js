import "./styles/globals.css"; // Importar estilos globales
import ConditionalLayout from "../components/ConditionalLayout"; // Importar nuestro layout condicional

export const metadata = {
  title: "Gestión de Albaranes",
  description: "Aplicación para gestionar clientes, proyectos y albaranes.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>
        {/* Aquí usamos el ConditionalLayout */}
        <ConditionalLayout>{children}</ConditionalLayout>
      </body>
    </html>
  );
}
