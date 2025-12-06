// Fragmento de uso en componente
import { useBuscarDestinatario } from "../hooks/useBuscarDestinatario";
import { mapParentesco } from "../api/destinatarios";

const hook = useBuscarDestinatario();

// cuando tengas el idPersona del destinatario y el idUsuarioRemitente (remitente seleccionado):
const resultado = await hook.buscarPorIds(idPersonaDest, idUsuarioRemitente);

if (resultado.success && resultado.data) {
  const d = resultado.data;
  if (d.estado === "DESTINATARIO") {
    // mostrar parentesco y pais destino
    console.log("Parentesco:", mapParentesco(d.id_parentesco), "Pais destino:", d.pais_destino);
  } else if (d.estado === "NO_DESTINATARIO") {
    // permitir crear y prellenar formulario con d.nombre/d.apellido/d.identificacion
  } else if (d.estado === "NO_EXISTE_PERSONA") {
    // notificar
  }
}