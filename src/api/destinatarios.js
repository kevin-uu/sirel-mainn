const API = "http://localhost/sirel_api/index.php?endpoint=destinatarios";

// Busca por idPersona 
export async function buscarDestinatarioPorId(
  idPersona,
  idUsuarioRemitente = 0
) {
  try {
    const url = `${API}&idPersona=${encodeURIComponent(
      Number(idPersona)
    )}&idUsuarioRemitente=${encodeURIComponent(Number(idUsuarioRemitente))}`;
    console.log("[API] GET", url);
    const res = await fetch(url, { method: "GET" });
    const payload = await res.json();
    console.log("[API] payload:", payload);
    if (!payload)
      return { success: 0, message: "Respuesta vacía del servidor" };

    // payload.data o payload directamente (según tu Response::success)
    const raw = payload.data ?? payload;

    // Normalizar (minimamente)
    const d = {
      estado: raw.Estado ?? raw.estado ?? null,
      id_persona: raw.Id_Persona ?? raw.id_persona ?? null,
      id_usuario: raw.Id_Usuario ?? raw.id_usuario ?? null,
      id_destinatario: raw.Id_Destinatario ?? raw.id_destinatario ?? null,
      id_parentesco: raw.Id_Parentesco ?? raw.id_parentesco ?? null,
      pais_destino: raw.Pais_Destino ?? raw.pais_destino ?? null,
      nombre: raw.Nombre ?? raw.nombre ?? null,
      apellido: raw.Apellido ?? raw.apellido ?? null,
      identificacion: raw.Identificacion ?? raw.identificacion ?? null,
    };

    return { success: 1, data: d };
  } catch (err) {
    return {
      success: 0,
      message: "Error al buscar destinatario",
      error: err.message || err,
    };
  }
}

export const PARENTESCO_MAP = {
  1: "Padre",
  2: "Madre",
  3: "Hijo",
  4: "Esposo/a",
  5: "Hermano/a",
  6: "Tío/a",
  7: "Primo/a",
  8: "Amigo",
  null: "No definido",
};

export function mapParentesco(id) {
  return PARENTESCO_MAP[id] ?? "Otro";
}
// Registrar un nuevo destinatario
export async function registrarDestinatario(payload) {
  try {
    const res = await fetch(API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    console.log("[API] registrarDestinatario payload:", payload);
    console.log("[API] registrarDestinatario response:", data);

    if (data && data.success === 1) {
      return { success: 1, data: data.data };
    }
    return { success: 0, message: data.message || "Error registrando destinatario" };
  } catch (err) {
    return { success: 0, message: "Error en la API registrarDestinatario", error: err.message || err };
  }
}