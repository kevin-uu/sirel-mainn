import { API } from "./config";

// Función auxiliar para parsear JSON de forma segura
async function safeParseJson(res) {
  const text = await res.text();
  try {
    return JSON.parse(text);
  } catch (err) {
    console.error("❌ Respuesta no válida JSON en sucursales:", text);
    return { success: 0, message: "Respuesta inválida del servidor" };
  }
}

// 🔹 Listar todas las sucursales
export async function listarSucursales() {
  const res = await fetch(`${API}?endpoint=sucursales&tipo=listar`, {
    method: "GET",
  });
  return await safeParseJson(res);
}

// 🔹 Listar sucursales por país (usa sucursales_por_pais.php con POST)
export async function listarSucursalesPorPais(id_pais) {
  const res = await fetch(`${API}?endpoint=sucursales_por_pais`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id_pais }),
  });
  return await safeParseJson(res);
}

// 🔹 Crear sucursal
export async function crearSucursal(sucursal) {
  const res = await fetch(`${API}?endpoint=sucursales&tipo=crear`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(sucursal),
  });
  return await safeParseJson(res);
}

// 🔹 Editar sucursal
export async function editarSucursal(sucursal) {
  const res = await fetch(`${API}?endpoint=sucursales&tipo=editar`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(sucursal),
  });
  return await safeParseJson(res);
}