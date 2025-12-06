import { API } from "./config"; // tu archivo de configuración con la URL base

// Listar países
export async function listarPaises() {
  const res = await fetch(`${API}?endpoint=paises&tipo=listar`);
  return await res.json();
}

// Crear país
export async function crearPais(pais) {
  const res = await fetch(`${API}?endpoint=paises&tipo=crear`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(pais),
  });
  return await res.json();
}

// Editar país
export async function editarPais(pais) {
  const res = await fetch(`${API}?endpoint=paises&tipo=editar`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(pais),
  });
  return await res.json();
}