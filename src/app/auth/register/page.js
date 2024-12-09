"use client";

import * as Yup from "yup";
import { useRouter } from "next/navigation";
import BaseForm from "../../../components/BaseForm";
import FormWrapper from "../../../components/FormWrapper";

const RegisterPage = () => {
  const router = useRouter();

  // Valores iniciales del formulario
  const initialValues = {
    email: "",
    password: "",
    confirmPassword: "",
  };

  // Esquema de validación con Yup
  const validationSchema = Yup.object({
    email: Yup.string().email("Correo inválido").required("Correo requerido"),
    password: Yup.string()
      .min(8, "La contraseña debe tener al menos 8 caracteres")
      .required("Contraseña requerida"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password")], "Las contraseñas no coinciden")
      .required("Debe confirmar la contraseña"),
  });

  // Lógica para manejar el registro
  const onSubmit = async (values, { setSubmitting, setFieldError }) => {
    const { email, password } = values;

    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
      const url = `${baseUrl}/user/register`;

      console.log("Enviando datos de registro a:", url, { email, password });

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      console.log("Respuesta del servidor:", response);

      if (response.ok) {
        const data = await response.json();
        console.log("Datos recibidos:", data);

        // Guardar el token en localStorage
        localStorage.setItem("jwt", data.token);

        // Redirigir a la página de validación
        router.push(`/auth/validate?email=${email}`);
      } else if (response.status === 409) {
        setFieldError("email", "El correo ya está en uso.");
      } else if (response.status === 422) {
        setFieldError("email", "Datos inválidos. Verifique el formato.");
      } else {
        setFieldError("email", "Error desconocido. Intente nuevamente.");
      }
    } catch (err) {
      console.error("Error al registrar usuario:", err);
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
      showTogglePassword: true, // Activar el botón de mostrar/ocultar contraseña
    },
    {
      name: "confirmPassword",
      type: "password",
      placeholder: "********",
      label: "Confirmar Contraseña",
      showTogglePassword: true, // Activar el botón de mostrar/ocultar contraseña
    },
  ];

  // Renderizado del componente
  return (
    <FormWrapper title="Crea tu cuenta">
      <BaseForm
        initialValues={initialValues}
        validationSchema={validationSchema}
        fields={fields}
        onSubmit={onSubmit}
      />
    </FormWrapper>
  );
};

export default RegisterPage;
