import { API } from "../api/config"; 

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

/**Obtener lista de usuarios */
export async function obtenerUsuarios() {
  try {
    const res = await fetch(`${API}?endpoint=usuarios`);
    return await safeParseJson(res);
  } catch (error) {
    console.error("❌ Error al obtener usuarios:", error);
    return { success: 0, message: "No se pudo conectar con el servidor" };
  }
}

/**Obtener usuario por ID */
export async function obtenerUsuarioPorId(id) {
  try {
    const res = await fetch(`${API}?endpoint=usuarios&id=${encodeURIComponent(id)}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    return await safeParseJson(res);
  } catch (error) {
    console.error("❌ Error al obtener usuario por ID:", error);
    return { success: 0, message: "No se pudo conectar con el servidor" };
  }
}

/** Filtrar usuarios (placeholder: ahora mismo devuelve todos) */
export async function filtrarUsuarios(filtros = {}) {
  try {
    console.info("Filtros recibidos:", filtros);
    // TODO: implementar filtros en API
    return await obtenerUsuarios();
  } catch (error) {
    console.error("❌ Error al filtrar usuarios:", error);
    return { success: 0, message: "No se pudo conectar con el servidor" };
  }
}

/** Registrar usuario completo */
export async function registrarUsuarioCompleto(datos) {
  try {
    const res = await fetch(`${API}?endpoint=usuarios`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(datos),
    });
    return await safeParseJson(res);
  } catch (error) {
    console.error("❌ Error al registrar usuario:", error);
    return { success: 0, message: "No se pudo conectar con el servidor" };
  }
}

export async function buscarClientePorIdentificacion(identificacion) {
  try {
    const res = await fetch(`${API}?endpoint=usuarios&tipo=buscar&identificacion=${identificacion}`);
    return await res.json();
  } catch (error) {
    console.error("❌ Error al buscar cliente:", error);
    return { success: 0, message: "No se pudo buscar el cliente" };
  }
}

/** Actualizar usuario existente */
export async function actualizarUsuario(datos) {
  try {
    const res = await fetch(`${API}?endpoint=usuarios&accion=editar`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(datos),
    });
    return await safeParseJson(res);
  } catch (error) {
    console.error("❌ Error al actualizar usuario:", error);
    return { success: 0, message: "No se pudo conectar con el servidor" };
  }
}

/** Inactivar usuario */
export async function eliminarUsuario(id, usuarioActual) {
  try {
    const token = usuarioActual ? btoa(JSON.stringify({ id: usuarioActual.id, rol_id: usuarioActual.rol_id })) : "";
    const res = await fetch(`${API}?endpoint=usuarios`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: token } : {})
      },
      body: JSON.stringify({ id }),
    });
    return await safeParseJson(res);
  } catch (error) {
    console.error("❌ Error al inactivar usuario:", error);
    return { success: 0, message: "No se pudo conectar con el servidor" };
  }
}

/** Reactivar usuario */
export async function reactivarUsuario(id) {
  try {
    const res = await fetch(`${API}?endpoint=usuarios&accion=reactivar`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    return await safeParseJson(res);
  } catch (error) {
    console.error("❌ Error al reactivar usuario:", error);
    return { success: 0, message: "No se pudo conectar con el servidor" };
  }
}

/** Obtener lista de roles */
export async function obtenerRoles(sesionId) {
  try {
    const res = await fetch(`${API}?endpoint=roles`, {
      method: "GET",
      headers: {
        ...(sesionId ? { Authorization: sesionId } : {})
      },
    });
    return await safeParseJson(res);
  } catch (error) {
    console.error("❌ Error al obtener roles:", error);
    return { success: 0, message: "No se pudo conectar con el servidor" };
  }
}

/** Obtener lista de estados */
export async function obtenerEstados() {
  try {
    const res = await fetch(`${API}?endpoint=estados`);
    return await safeParseJson(res);
  } catch (error) {
    console.error("❌ Error al obtener estados:", error);
    return { success: 0, message: "No se pudo conectar con el servidor" };
  }
}

/** Obtener lista de países */
export async function obtenerPaises() {
  try {
    const res = await fetch(`${API}?endpoint=paises&tipo=listar`);
    const text = await res.text();
    console.log("Respuesta cruda de obtenerPaises:", text);
    try {
      return JSON.parse(text);
    } catch {
      return { success: 0, message: "Respuesta inválida del servidor" };
    }
  } catch (error) {
    console.error("❌ Error al obtener países:", error);
    return { success: 0, message: "No se pudo conectar con el servidor" };
  }
}

/** Obtener sucursales por país */
export async function obtenerSucursalesPorPais(idPais) {
  try {
    const body = { id_pais: idPais ? Number(idPais) : 0 };
    const res = await fetch(`${API}?endpoint=sucursales_por_pais`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    return await safeParseJson(res);
  } catch (error) {
    console.error("❌ Error al obtener sucursales:", error);
    return { success: 0, message: "No se pudo conectar con el servidor" };
  }
}