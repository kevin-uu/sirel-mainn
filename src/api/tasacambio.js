import { API } from "../api/config";

/** Consultar tasa de cambio entre dos monedas */
export async function consultarTasaCambio(id_moneda_origen, id_moneda_destino) {
  try {
    const res = await fetch(
      `${API}?endpoint=tasacambio&tipo=consultar&id_moneda_origen=${id_moneda_origen}&id_moneda_destino=${id_moneda_destino}`
    );
    return await res.json();
  } catch (error) {
    console.error("❌ Error al consultar tasa de cambio:", error);
    return { success: 0, message: "No se pudo consultar la tasa de cambio" };
  }
}

/** Crear o actualizar tasa de cambio */
export async function crearTasaCambio(id_moneda_origen, id_moneda_destino, tasa) {
  try {
    const res = await fetch(`${API}?endpoint=tasacambio&tipo=crear`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id_moneda_origen,
        id_moneda_destino,
        tasa,
      }),
    });
    return await res.json();
  } catch (error) {
    console.error("❌ Error al crear/actualizar tasa de cambio:", error);
    return { success: 0, message: "No se pudo registrar la tasa de cambio" };
  }
}

/** Editar tasa de cambio existente */
export async function editarTasaCambio(id_tasa_cambio, tasa) {
  try {
    const res = await fetch(`${API}?endpoint=tasacambio&tipo=editar`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id_tasa_cambio,
        tasa,
      }),
    });
    return await res.json();
  } catch (error) {
    console.error("❌ Error al editar tasa de cambio:", error);
    return { success: 0, message: "No se pudo editar la tasa de cambio" };
  }
}