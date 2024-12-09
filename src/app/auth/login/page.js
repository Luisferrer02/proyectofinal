"use client";
import { setCookie } from "nookies"; // Necesitarás instalar 'nookies' si no lo tienes instalado
import * as Yup from "yup";
import { useRouter, useSearchParams } from "next/navigation";
import BaseForm from "../../../components/BaseForm";
import FormWrapper from "../../../components/FormWrapper";
import Button from "@/components/Button";

const LoginPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Valores iniciales del formulario
  const initialValues = {
    email: searchParams.get("email") || "",
    password: searchParams.get("password") || "",
  };

  // Esquema de validación con Yup
  const validationSchema = Yup.object({
    email: Yup.string().email("Correo inválido").required("Correo requerido"),
    password: Yup.string().required("Contraseña requerida"),
  });

  // Lógica para enviar los datos del formulario
  const onSubmit = async (values, { setSubmitting, setFieldError }) => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
      const url = `${baseUrl}/user/login`;

      console.log("Enviando credenciales:", values);

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      console.log("Respuesta del servidor:", response);

      if (response.ok) {
        const data = await response.json();
        console.log("Datos recibidos:", data);

        // Guardar el token en localStorage
        localStorage.setItem("jwt", data.token);
        // Guardar el token en cookies para que lo detecte el middleware
        setCookie(null, "jwt", data.token, {
          path: "/", // Disponible en todas las rutas
          maxAge: 30 * 24 * 60 * 60, // Expira en 30 días
          secure: process.env.NODE_ENV === "production", // Solo en HTTPS en producción
          sameSite: "strict",
        });
        // Redirigir al dashboard
        console.log("Redirigiendo a /clients...");

        router.push("/clients");
      } else if (response.status === 401) {
        setFieldError("password", "Credenciales incorrectas.");
      } else {
        setFieldError("email", "Error desconocido. Intente nuevamente.");
      }
    } catch (err) {
      console.error("Error al iniciar sesión:", err);
      setFieldError("email", "Error de red. Intente más tarde.");
    } finally {
      setSubmitting(false);
    }
  };

  // Campos del formulario
  const fields = [
    {
      name: "email",
      type: "email",
      placeholder: "correo@example.com",
      label: "Correo Electrónico",
    },
    {
      name: "password",
      type: "password",
      placeholder: "********",
      label: "Contraseña",
      showTogglePassword: true, // Activar el botón de mostrar contraseña
    },
  ];

  // Renderizado del componente
  return (
    <FormWrapper title="Inicio de Sesión">
      <BaseForm
        initialValues={initialValues}
        validationSchema={validationSchema}
        fields={fields}
        onSubmit={onSubmit}
      />
      <div className="text-center mt-4">
        <button 
          onClick={() => router.push("/register")}
          className="text-black underline font-bold py-2 px-4"
        >
          Crear una cuenta
        </button>
      </div>
    </FormWrapper>
  );
};

export default LoginPage;
