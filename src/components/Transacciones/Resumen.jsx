import React from "react";

export default function Resumen({ remitenteSeleccionado, destinatarioSeleccionado }) {
  return (
    <section>
      <h3 className="font-semibold text-gray-800">Resumen</h3>
      <div>
        <strong>Remitente:</strong>{" "}
        {remitenteSeleccionado
          ? `${remitenteSeleccionado.nombre} ${remitenteSeleccionado.apellido}`
          : "No seleccionado"}
      </div>
      <div>
        <strong>Destinatario:</strong>{" "}
        {destinatarioSeleccionado
          ? `${destinatarioSeleccionado.nombre} ${destinatarioSeleccionado.apellido}`
          : "No seleccionado"}
      </div>
    </section>
  );
}