import React from "react";

export default function DestinatarioCard({ destinatario }) {
  if (!destinatario) return null;

  return (
    <div className="mt-4 p-2 border rounded bg-gray-50">
      <p><strong>Nombre:</strong> {destinatario.nombre} {destinatario.apellido}</p>
      <p><strong>Identificación:</strong> {destinatario.identificacion}</p>
      <p><strong>Teléfono:</strong> {destinatario.telefono}</p>
      <p><strong>Email:</strong> {destinatario.email}</p>
      <p><strong>Dirección:</strong> {destinatario.direccion}</p>
    </div>
  );
}