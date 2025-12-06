const API = "http://localhost/sirel_api/index.php?endpoint=clientes";

export async function buscarClientePorIdentificacion(identificacion) {
  try {
    // ✅ encodeURIComponent para evitar problemas con caracteres especiales
    const res = await fetch(`${API}&identificacion=${encodeURIComponent(identificacion)}`);
    return await res.json();
  } catch (err) {
    return { success: 0, message: "Error al buscar cliente" };
  }
}

export async function crearClienteConUsuario(datos) {
  try {
    // ✅ convertir teléfono a número antes de enviar
    const payload = {
      ...datos,
      telefono: datos.telefono ? parseInt(datos.telefono, 10) : 0,
      // ✅ uniformar nombres: usar 'correo' en lugar de 'email'
      correo: datos.correo ?? datos.email ?? ""
    };

    const res = await fetch(API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    return await res.json();
  } catch (err) {
    return { success: 0, message: "Error al crear cliente" };
  }
}