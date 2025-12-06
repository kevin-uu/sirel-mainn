import React from "react";

export default function ClienteCard({ cliente }) {
  if (!cliente) return null;

  return (
    <div className="mt-4 p-2 border rounded bg-gray-50">
      <p><strong>Nobre:</strong> {cliente.nombre} {cliente.apellido}</p>
      <p><strong>Identificación:</strong> {cliente.identificacion}</p>
      <p><strong>Teléfono:</strong> {cliente.telefono}</p>
      <p><strong>Email:</strong> {cliente.email}</p>
      <p><strong>Dirección:</strong> {cliente.direccion}</p>
    </div>
  );
}