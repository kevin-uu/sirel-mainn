import React, { useState, useEffect } from "react";
import { login, verificarSesion } from "../api/auth";

export default function Login({ onLogin }) {
    const [correo, setCorreo] = useState("");
    const [clave, setClave] = useState("");
    const [error, setError] = useState("");
    const [cargando, setCargando] = useState(false);

    // Verificar sesión guardada al cargar
    useEffect(() => {
        const sesionGuardada = JSON.parse(localStorage.getItem("usuario"));
        if (sesionGuardada?.sesion_id) {
            verificarSesion(sesionGuardada.sesion_id)
                .then(data => {
                    if (data.success) {
                        onLogin(sesionGuardada);
                    } else {
                        localStorage.removeItem("usuario");
                    }
                })
                .catch(() => localStorage.removeItem("usuario"));
        }
    }, []);

    const manejarLogin = async (e) => {
        e.preventDefault();
        setError("");
        setCargando(true);

        const data = await login(correo, clave);

        if (data.success) {
            localStorage.setItem("usuario", JSON.stringify(data.usuario));
            onLogin(data.usuario);
        } else {
            setError(data.message);
        }

        setCargando(false);
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-blue-300">
            <div className="bg-white shadow-xl rounded-xl p-8 w-full max-w-md">
                <div className="flex flex-col items-center mb-6">
                    <img src="/sirel.JPG" alt="Logo SIREL" className="w-40 h-40 rounded-full shadow-md mb-2" />
                </div>

                <form onSubmit={manejarLogin} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Correo electrónico</label>
                        <input
                            type="email"
                            value={correo}
                            onChange={(e) => setCorreo(e.target.value)}
                            className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="ejemplo@correo.com"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Contraseña</label>
                        <input
                            type="password"
                            value={clave}
                            onChange={(e) => setClave(e.target.value)}
                            className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={cargando}
                        className={`w-full py-3 rounded-lg font-semibold text-white transition ${
                            cargando ? "bg-blue-300 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
                        }`}
                    >
                        {cargando ? "Validando..." : "Entrar"}
                    </button>
                </form>

                {error && <p className="text-red-500 text-sm mt-4 text-center">{error}</p>}
            </div>
        </div>
    );
}