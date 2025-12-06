const API = "http://localhost/sirel_api/index.php";
/** Helper para parsear JSON con manejo de errores */
async function safeParseJson(response) {
  const text = await response.text();
  try {
    return JSON.parse(text);
  } catch (err) {
    console.error("❌ Respuesta no JSON recibida:", text);
    return { success: 0, message: "Respuesta inválida del servidor" };
  }
}


export async function obtenerPaises() {
  try {
    const res = await fetch(`${API}/países.php?tipo=listar`);
    const data = await res.json();
    return { ...data, success: data.success === true || data.success === 1 };
  } catch {
    return { success: 0, message: "Error al obtener países" };
  }
}


export async function obtenerSucursalesPorPais(id_pais) {
  try {
    const res = await fetch(`${API}?endpoint=sucursales&tipo=listar&id_pais=${id_pais}`);
    return await safeParseJson(res);
  } catch {
    return { success: 0, message: "Error al obtener sucursales" };
  }
}

export async function obtenerParentescos() {
  try {
    const res = await fetch(`${API}?endpoint=remesas_aux&tipo=parentescos`);
    return await safeParseJson(res);
  } catch {
    return { success: 0, message: "Error al obtener parentescos" };
  }
}