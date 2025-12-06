import React from "react";
import Header from "./Header";
import { sirelTheme } from "../../theme/sirelTheme";

/**
 * Layout principal de la aplicación
 * Controla la estructura visual y navegación lateral.
 * Ahora incluye control de visibilidad basado en roles.
 */
/**
 * Layout principal de la aplicación (tematizado SIREL)
 */
export default function Layout({
  children,
  usuario,
  onCerrarSesion,
  onPaginaCambio,
  paginaActual,
}) {
  const [sidebarAbierto, setSidebarAbierto] = React.useState(false);

  // 🔹 Determina si una opción de menú está activa
  const isActive = (page) =>
    paginaActual === page
      ? "text-white font-semibold"
      : "text-teal-100 hover:text-white hover:bg-opacity-10";

  // 🔹 Determina el rol del usuario (para controlar permisos)
  const esGerente = usuario?.rol_id === 5;
  const esAutorizador = usuario?.rol_id === 4;
  const esAuditor = usuario?.rol_id === 3;
  const esSupervisor = usuario?.rol_id === 2;
  const esCajero = usuario?.rol_id === 1;

  return (
    <div
      className="flex h-screen"
      style={{ backgroundColor: sirelTheme.colors.light }}
    >
      {/* Overlay en móvil */}
      {sidebarAbierto && (
        <div
          className="fixed inset-0 bg-black opacity-40 z-40"
          onClick={() => setSidebarAbierto(false)}
        />
      )}

      {/* ===== SIDEBAR ===== */}
      <div
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out ${
          sidebarAbierto
            ? "translate-x-0"
            : "-translate-x-full lg:translate-x-0"
        }`}
        style={{
          background: sirelTheme.layout.sidebar.background,
          color: sirelTheme.layout.sidebar.text,
        }}
      >
        {/* Logo */}
        <div className="p-6 border-b border-white/10 flex items-center gap-3">
          <br></br>
          <br></br>
        </div>

        {/* ===== MENÚ ===== */}
        <nav className="mt-8 px-4 space-y-2">
  {/* Dashboard visible para todos */}
  {(esCajero || esAuditor || esGerente || esSupervisor || esAutorizador) && (
    <button
      onClick={() => onPaginaCambio("dashboard")}
      className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl transition ${isActive("dashboard")}`}
    >
      <span>📊</span>
      <span>Dashboard</span>
    </button>
  )}

  {/* 👥 Usuarios → Solo Auditores y Gerente */}
  {(esAuditor || esGerente) && (
    <button
      onClick={() => onPaginaCambio("usuarios")}
      className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl transition ${isActive("usuarios")}`}
    >
      <span>👥</span>
      <span>Usuarios</span>
    </button>
  )}

  {/* 💳 Transacciones → Supervisores y Cajeros */}
  {(esSupervisor || esCajero) && (
    <button
      onClick={() => onPaginaCambio("transacciones")}
      className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl transition ${isActive("transacciones")}`}
    >
      <span>💳</span>
      <span>Crear Remesas</span>
    </button>
  )}

  {/* 🔹 Redimir Remesas → Solo Cajeros y Supervisores */}
  {(esCajero || esSupervisor) && (
    <button
      onClick={() => onPaginaCambio("redimir")}
      className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl transition ${isActive("redimir")}`}
    >
      <span>🧾</span>
      <span>Redimir Remesas</span>
    </button>
  )}

  {/* 📈 Reportes → Supervisores, Auditores, Autorizadores y Gerente */}
  {(esSupervisor || esAuditor || esAutorizador || esGerente) && (
    <button
      disabled
      className="flex items-center gap-3 w-full px-4 py-3 text-teal-100 opacity-60 rounded-xl"
    >
      <span>📈</span>
      <span>Reportes</span>
    </button>
  )}

  {/* 🌍 Países → Solo Gerente */}
  {esGerente && (
    <button
      onClick={() => onPaginaCambio("paises")}
      className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl transition ${isActive("paises")}`}
    >
      <span>🌍</span>
      <span>Países</span>
    </button>
  )}

  {/* 💰 Maestro Financiero → Solo Gerente */}
  {esGerente && (
    <button
      onClick={() => onPaginaCambio("maestro_financiero")}
      className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl transition ${isActive("maestro_financiero")}`}
    >
      <span>💰</span>
      <span>Maestro Financiero</span>
    </button>
  )}
        </nav>

        {/* ===== Usuario ===== */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10">
          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
              style={{ backgroundColor: sirelTheme.colors.secondary }}
            >
              {usuario?.nombre?.charAt(0)?.toUpperCase() || "U"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">
                {usuario?.nombre}
              </p>
              <p className="text-xs text-teal-100 truncate opacity-80">
                {usuario?.rol_id === 5
                  ? "Gerente"
                  : usuario?.rol_id === 4
                  ? "Autorizador"
                  : usuario?.rol_id === 3
                  ? "Auditor"
                  : usuario?.rol_id === 2
                  ? "Supervisor"
                  : usuario?.rol_id === 1
                  ? "Cajero"
                  : "Desconocido"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ===== CONTENIDO PRINCIPAL ===== */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header
          usuario={usuario}
          onCerrarSesion={onCerrarSesion}
          onToggleSidebar={() => setSidebarAbierto(!sidebarAbierto)}
        />
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
    </div>
  );
}
