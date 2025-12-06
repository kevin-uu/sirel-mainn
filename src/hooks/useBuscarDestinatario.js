// src/hooks/useBuscarDestinatario.js
import { useState } from "react";
import { buscarDestinatarioPorId } from "../api/destinatarios";
import { API } from "../api/config"; 

export function useBuscarDestinatario() {
  const [destinatario, setDestinatario] = useState(null);
  const [mensaje, setMensaje] = useState("");
  const [cargando, setCargando] = useState(false);

  // buscar por Id_Persona (ID ya resuelto) y idUsuarioRemitente
  const buscarPorIds = async (idPersona, idUsuarioRemitente = 0) => {
    setCargando(true);
    setMensaje("");
    setDestinatario(null);
    try {
      if (!idPersona) {
        setMensaje("Falta idPersona");
        return { success: 0, message: "Falta idPersona" };
      }
      const resp = await buscarDestinatarioPorId(idPersona, idUsuarioRemitente);
      if (!resp.success) {
        setMensaje(resp.message || "Error en búsqueda");
        return resp;
      }
      const d = resp.data;
      if (!d || !d.estado) {
        setMensaje("Respuesta inválida");
        return { success: 0, message: "Respuesta inválida" };
      }

      // Normalizar estados esperados: NO_EXISTE_PERSONA | NO_DESTINATARIO | DESTINATARIO
      setDestinatario(d);
      return { success: 1, data: d };
    } catch (err) {
      setMensaje(err.message || "Error");
      return { success: 0, message: err.message || "Error" };
    } finally {
      setCargando(false);
    }
  };

  // crear destinatario mínimo (usa tu endpoint existente)
  const crearDestinatario = async ({ id_persona, id_usuario = null, id_parentesco = null, pais_destino = null }) => {
    setCargando(true);
    try {
      const res = await fetch(`${API}?endpoint=destinatarios&accion=solo`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id_persona, id_usuario, id_parentesco, pais_destino })
      });
      const json = await res.json();
      return json;
    } catch (err) {
      return { success: 0, message: err.message || err };
    } finally {
      setCargando(false);
    }
  };

  return {
    destinatario,
    setDestinatario,
    mensaje,
    cargando,
    buscarPorIds,
    crearDestinatario
  };
}