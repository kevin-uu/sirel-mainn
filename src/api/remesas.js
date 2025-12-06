import { API } from "../api/config";

/** Registrar una remesa */
export async function registrarRemesa(datos) {
  try {
    const res = await fetch(`${API}?endpoint=remesas`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(datos),
    });
    return await res.json();
  } catch (error) {
    console.error("❌ Error al registrar remesa:", error);
    return { success: 0, message: "No se pudo registrar la remesa" };
  }
}

/** Obtener lista de parentescos */
export async function obtenerParentescos() {
  try {
    const res = await fetch(`${API}?endpoint=remesas_aux&tipo=parentescos`);
    return await res.json();
  } catch (error) {
    console.error("❌ Error al obtener parentescos:", error);
    return { success: 0, message: "No se pudo obtener la lista de parentescos" };
  }
}

/** Obtener lista de monedas disponibles */
export async function obtenerMonedas() {
  try {
    const res = await fetch(`${API}?endpoint=remesas_aux&tipo=monedas`);
    return await res.json();
  } catch (error) {
    console.error("❌ Error al obtener monedas:", error);
    return { success: 0, message: "No se pudo obtener la lista de monedas" };
  }
}

/** Consultar comisión según país origen, destino y monto */
export async function consultarComision(pais_origen, pais_destino, monto) {
  try {
    const url = `${API}?endpoint=remesas_aux&tipo=comision&pais_origen=${pais_origen}&pais_destino=${pais_destino}&monto=${monto}`;
    const res = await fetch(url);
    return await res.json();
  } catch (error) {
    console.error("❌ Error al consultar comisión:", error);
    return { success: 0, message: "No se pudo calcular la comisión" };
  }
}


/** Consultar remesas por identificación */
export async function consultarRemesasPorIdentificacion(identificacion) {
  try {
    const res = await fetch(
      `${API}?endpoint=consultar_remesas&identificacion=${identificacion}`
    );
    return await res.json();
  } catch (error) {
    console.error("❌ Error al consultar remesas:", error);
    return { success: 0, message: "No se pudo consultar las remesas" };
  }
}

/** Redimir remesa */
export async function redimirRemesa(idRemesa) {
  try {
    const res = await fetch(`${API}?endpoint=redimir_remesa`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id_remesa: idRemesa }),
    });
    return await res.json();
  } catch (error) {
    console.error("❌ Error al redimir remesa:", error);
    return { success: 0, message: "No se pudo redimir la remesa" };
  }
}
