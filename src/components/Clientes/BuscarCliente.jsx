import React from "react";

export default function BuscarCliente({
  identificacion,
  setIdentificacion,
  onBuscar,
  mensaje,
  cliente
}) {
  return (
    <div className="space-y-3">
      {cliente && (
        <div className="mt-2 p-2 border rounded bg-gray-50">
          <p><strong>Registro Creado:</strong> </p>
        </div>
      )}
    </div>
  );
}