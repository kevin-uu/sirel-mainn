import { API } from "../api/config";

export async function listarFacturas() {
  try {
    const res = await fetch(`${API}?endpoint=facturas_listar`);
    return await res.json();
  } catch {
    return { success: 0, message: "Error al listar facturas" };
  }
}

export async function obtenerFacturaDetalle(idFactura) {
  try {
    const res = await fetch(`${API}?endpoint=facturas_detalle&idFactura=${idFactura}`);
    return await res.json();
  } catch {
    return { success: 0, message: "Error al obtener detalle de factura" };
  }
}

export async function obtenerFacturaPorRemesa(idRemesa) {
  try {
    const res = await fetch(`${API}?endpoint=facturas_por_remesa&idRemesa=${idRemesa}`);
    return await res.json();
  } catch {
    return { success: 0, message: "Error al obtener factura por remesa" };
  }
}

/** Generar Factura Parte 1 (Remesa inicial) */
export async function generarFacturaPdf(idRemesa) {
  try {
    const res = await fetch(`${API}?endpoint=facturas_pdf&idRemesa=${idRemesa}`);
    if (!res.ok) throw new Error("Error generando PDF");
    const blob = await res.blob();
    return URL.createObjectURL(blob); // URL local para mostrar en iframe
  } catch {
    return null;
  }
}

/** Generar Factura Parte 2 (Entrega al destinatario) */
export async function generarFacturaEntregaPdf(idRemesa) {
  try {
    const res = await fetch(`${API}?endpoint=facturas_entrega_pdf&idRemesa=${idRemesa}`);
    if (!res.ok) throw new Error("Error generando PDF de entrega");
    const blob = await res.blob();
    return URL.createObjectURL(blob); // URL local para mostrar en iframe
  } catch {
    return null;
  }
}