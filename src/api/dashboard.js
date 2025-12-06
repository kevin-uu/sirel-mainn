import { API } from "../api/config"; 

/**
 * Obtiene las estadísticas generales del sistema
 * @returns {Promise} Promesa con los datos del dashboard
 */

export async function getDashboardStats() {
    try {
        const res = await fetch(`${API}?endpoint=dashboard_stats`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        });

        const json = await res.json();
        return json; // <- IMPORTANTÍSIMO: devuelve {success, data}

    } catch (error) {
        console.error("Error getDashboardStats:", error);
        return {
        success: 0,
        message: "Error de conexión",
        data: {
            totalUsuarios: 0,
            totalClientes: 0,
            transaccionesHoy: 0,
            montoTotalHoy: 0,
            usuariosActivos: 0,
            transaccionesMes: 0
        }
        };
    }
    }


/**
 * Obtiene la actividad reciente del sistema
 * @returns {Promise} Promesa con la actividad reciente
 */

export async function obtenerActividadReciente() {
    try {
        const res = await fetch(`${API}?endpoint=actividad`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            ...getAuthHeader(),
        },
        });
        return await res.json();
    } catch (error) {
        console.error("Error al obtener actividad reciente:", error);
        return { success: 0, message: "Error de conexión", data: [] };
    }
}

/**
 * Obtiene datos para gráficos (usuarios por rol, transacciones por mes)
 * @returns {Promise} Promesa con datos para gráficos
 */
export async function obtenerDatosGraficos() {
    try {
        const res = await fetch(`${API}?endpoint=graficos`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            ...getAuthHeader(),
        },
        });
        return await res.json();
    } catch (error) {
        console.error("Error al obtener datos para gráficos:", error);
        return {
        success: 0,
        message: "Error de conexión",
        data: { usuariosPorRol: [], transaccionesMensuales: [] },
        };
    }
}

function getAuthHeader() {
    const usuario = JSON.parse(localStorage.getItem("usuario") || "null");
    const token = usuario?.sesion_id; // en tu login guardas "sesion_id"
    return token ? { Authorization: token } : {};
}