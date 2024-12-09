"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

const withAuth = (WrappedComponent) => {
  const AuthenticatedComponent = (props) => {
    const router = useRouter();

    useEffect(() => {
      const token = localStorage.getItem("jwt");

      if (!token) {
        console.error("Token no encontrado, redirigiendo al login...");
        router.push("/auth/login");
        return;
      }

      // Verificación básica del token (sin decodificación)
      const parts = token.split(".");
      if (parts.length !== 3) {
        console.error("Token inválido, redirigiendo al login...");
        localStorage.removeItem("jwt");
        router.push("/auth/login");
        return;
      }

      // Opcional: Validar el formato y verificar expiración si está incluido en otro lugar
      const payload = JSON.parse(atob(parts[1])); // Decodificar el payload del JWT
      const currentTime = Math.floor(Date.now() / 1000);
      if (payload.exp && payload.exp < currentTime) {
        console.error("El token ha expirado, redirigiendo al login...");
        localStorage.removeItem("jwt");
        router.push("/auth/login");
      }
    }, [router]);

    return <WrappedComponent {...props} />;
  };

  return AuthenticatedComponent;
};

export default withAuth;
