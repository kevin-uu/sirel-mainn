import React, { useState } from "react";
import RemitenteSection from "../components/Transacciones/RemitenteSection";
import DestinatarioSection from "../components/Transacciones/DestinatarioSection";
import ConsultaVinculacion from "../components/Transacciones/ConsultaVinculacion";
import Resumen from "../components/Transacciones/Resumen";
import RegistrarRemesa from "../components/Remesas/RegistrarRemesa";
import FacturaView from "./FacturaView";

export default function TransaccionesPage() {
  const [remitenteSeleccionado, setRemitenteSeleccionado] = useState(null);
  const [destinatarioSeleccionado, setDestinatarioSeleccionado] = useState(null);
  const [vinculacionConfirmada, setVinculacionConfirmada] = useState(false);
  const [idRemesaGenerada, setIdRemesaGenerada] = useState(null);

  return (
    <div className="space-y-6">
      <RemitenteSection setRemitenteSeleccionado={setRemitenteSeleccionado} />
      <hr />
      <DestinatarioSection setDestinatarioSeleccionado={setDestinatarioSeleccionado} />
      <hr />
      <ConsultaVinculacion
        remitenteSeleccionado={remitenteSeleccionado}
        destinatarioSeleccionado={destinatarioSeleccionado}
        onVinculacionConfirmada={() => setVinculacionConfirmada(true)}
      />
      <hr />
      <Resumen
        remitenteSeleccionado={remitenteSeleccionado}
        destinatarioSeleccionado={destinatarioSeleccionado}
      />
      <hr />

      {vinculacionConfirmada && remitenteSeleccionado && destinatarioSeleccionado && (
        <RegistrarRemesa
          remitente={remitenteSeleccionado}
          destinatario={destinatarioSeleccionado}
          onClose={() => setVinculacionConfirmada(false)}
          onGuardado={(idRemesa) => {
            // 🔹 Guardar el ID de la remesa creada
            setIdRemesaGenerada(idRemesa);

            // 🔹 Limpiar remitente y destinatario seleccionados
            setRemitenteSeleccionado(null);
            setDestinatarioSeleccionado(null);
          }}
        />
      )}

      {/* 🔹 Mostrar la factura inmediatamente después de crear la remesa */}
      {idRemesaGenerada && (
        <FacturaView idRemesa={idRemesaGenerada} />
      )}
    </div>
  );
}