import React from "react";
import { sirelTheme } from "../../theme/sirelTheme";

/**
 * Header de la aplicación con menú de usuario y notificaciones.
 * Incluye la detección de roles actualizada (1=Cajero, 2=Supervisor, 3=Auditor, 4=Autorizador, 5=Gerente).
 */
export default function Header({ usuario, onCerrarSesion, onToggleSidebar }) {
    const [userMenuOpen, setUserMenuOpen] = React.useState(false);

    // 🔹 Determina el nombre legible del rol según el ID
    const obtenerRolNombre = (rol_id) => {
        switch (rol_id) {
        case 5:
            return "Gerente";
        case 4:
            return "Autorizador";
        case 3:
            return "Auditor";
        case 2:
            return "Supervisor";
        case 1:
            return "Cajero";
        default:
            return "Desconocido";
        }
    };

    return (
        <header
        className="shadow-sm border-b z-10"
        style={{
            background: sirelTheme.layout.header.background,
            color: sirelTheme.layout.header.text,
        }}
        >
        <div className="flex items-center justify-between px-6 py-4">
            {/* ===== Botón menú móvil y título ===== */}
            <div className="flex items-center space-x-4">
            <button
                onClick={onToggleSidebar}
                className="lg:hidden p-2 rounded-lg text-white hover:bg-white/10 transition"
            >
                <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                />
                </svg>
            </button>

            {/* Logo + título */}
            <div className="flex items-center gap-3">
                <img src="/sirel_logo.jpeg" alt="SIREL" className="h-8 w-8 rounded-md" />
                <div>
                <h1 className="text-xl font-semibold tracking-wide">SIREL</h1>
                <p className="text-sm opacity-80">Sistema de Remesas</p>
                </div>
            </div>
            </div>

            {/* ===== Usuario ===== */}
            <div className="flex items-center gap-4 relative">
            <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/10 transition"
            >
                <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold"
                style={{ backgroundColor: sirelTheme.colors.secondary }}
                >
                {usuario?.nombre?.charAt(0)?.toUpperCase() || "U"}
                </div>
                <div className="hidden md:block text-left">
                <p className="text-sm font-medium">{usuario?.nombre || "Usuario"}</p>
                <p className="text-xs opacity-80">{obtenerRolNombre(usuario?.rol_id)}</p>
                </div>
                <svg
                className="w-4 h-4 opacity-80"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {/* Dropdown */}
            {userMenuOpen && (
                <div
                        className="absolute right-0 top-full mt-2 w-52 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-[9999] text-gray-800"
                        style={{ position: "absolute" }}
                        >
                        <a
                            href="#perfil"
                            className="flex items-center space-x-3 px-4 py-2 text-sm hover:bg-[#e0f2f1] hover:text-[#0b6c50] transition-colors duration-200"
                            >
                            <span>👤</span>
                            <span>Mi Perfil</span>
                        </a>

                        <a
                            href="#configuracion"
                            className="flex items-center space-x-3 px-4 py-2 text-sm hover:bg-[#e0f2f1] hover:text-[#0b6c50] transition-colors duration-200"
                        >
                            <span>⚙️</span>
                            <span>Configuración</span>
                        </a>

                        <div className="border-t border-gray-200 my-1"></div>

                        <button
                            onClick={onCerrarSesion}
                            className="flex items-center space-x-3 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors duration-200"
                        >
                            <span>🚪</span>
                            <span>Cerrar Sesión</span>
                        </button>
                        </div>

                    )}
                </div>
            </div>
        </header>
    );
}


