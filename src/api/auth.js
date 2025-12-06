import { API } from "../api/config";

export async function login(correo, clave) {
    const res = await fetch(`${API}?endpoint=auth`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ correo, clave }),
    });
    return res.json();
}

export async function verificarSesion(sesion_id) {
    const res = await fetch(`${API}?endpoint=verificar_sesion`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sesion_id }),
    });
    return res.json();
}

export async function cerrarSesion(sesion_id) {
    const res = await fetch(`${API}?endpoint=cerrar_sesion`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sesion_id }),
    });
    return res.json();
}