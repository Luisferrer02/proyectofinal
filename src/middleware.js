import { NextResponse } from "next/server";

export function middleware(request) {
  const token = request.cookies.get("jwt");
  const { pathname } = request.nextUrl;

  // Excluir rutas específicas del middleware
  if (
    pathname === "/auth/login" || // Excluir página de login
    pathname.endsWith(".css") || // Excluir archivos CSS
    pathname.startsWith("/_next/") || // Recursos internos de Next.js
    pathname === "/favicon.ico" // Excluir favicon
  ) {
    return NextResponse.next(); // Permitir acceso sin restricciones
  }

  // Si no hay token y no está en una ruta excluida, redirigir al login
  if (!token) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  // Si todo está bien, permitir acceso
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|auth/login|.*\\.css$|^/$).*)", // Excluir rutas y patrones específicos, incluyendo root
  ],
};
