"use client"; // Marcamos este componente como Client Component

import { usePathname } from "next/navigation";
import Header from "./Header";
import Sidebar from "./Sidebar";
import Footer from "./Footer";

export default function ConditionalLayout({ children }) {
  const pathname = usePathname();
  const isAuthPage = pathname.startsWith("/auth");// Determina si estamos en una página de autenticación
  const isMainPage = pathname === "/"; // Determina si estamos en la página principal
  const is404Page = pathname === "/404"; // Determina si estamos en la página

  return (
    <div className="flex h-screen bg-gray-100">
      {!(isAuthPage || isMainPage || is404Page) && <Sidebar />}
      <div className={`flex-1 flex flex-col ${(isAuthPage || isMainPage || is404Page) ? "justify-center items-center" : ""}`}>
        {!(isAuthPage || isMainPage || is404Page) && <Header />}
        <main className={`flex-1 ${(isAuthPage || isMainPage || is404Page) ? "" : "overflow-y-auto p-6"}`}>{children}</main>
        {!(isAuthPage || isMainPage || is404Page) && <Footer />}
      </div>
    </div>
  );
}
