import React from "react";

export default function BuscarDestinatario({
  formDestinatario,
  handleChangeDestinatario,
  onBuscarDestinatario,
  mensajeDestinatario,
  mostrarFormDestinatario,
  setMostrarFormDestinatario,
  destinatario,
}) {
  return (
    <div className="space-y-3">
      <h3 className="font-semibold text-gray-800">
        Buscar o crear destinatario
      </h3>

      {!mostrarFormDestinatario && !destinatario && (
        <div className="space-y-2">
          <input
            name="identificacion"
            placeholder="Identificación del destinatario"
            value={formDestinatario.identificacion}
            onChange={handleChangeDestinatario}
            className="border p-2 w-full"
          />
          <button
            onClick={onBuscarDestinatario}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Buscar Destinatario
          </button>

          {mensajeDestinatario && (
            <p className="text-red-600 mt-2">{mensajeDestinatario}</p>
          )}

          {mensajeDestinatario && !destinatario && (
            <button
              onClick={() => setMostrarFormDestinatario(true)}
              className="mt-4 bg-yellow-500 text-white px-4 py-2 rounded"
            >
              Crear nuevo destinatario
            </button>
          )}
        </div>
      )}

      {destinatario && destinatario.Estado === "DESTINATARIO" && (
        <div className="mt-4 p-2 border rounded bg-gray-50">
          <p>
            <strong>Nombre:</strong> {destinatario.nombre}{" "}
            {destinatario.apellido}
          </p>
          <p>
            <strong>Identificación:</strong> {destinatario.identificacion}
          </p>
          <p>
            <strong>Teléfono:</strong> {destinatario.telefono}
          </p>
          <p>
            <strong>Email:</strong> {destinatario.email}
          </p>
          <p>
            <strong>Dirección:</strong> {destinatario.direccion}
          </p>
        </div>
      )}

      {destinatario && destinatario.Estado === "CLIENTE" && (
        <div className="mt-4 p-2 border rounded bg-yellow-50">
          <p>
            <strong>Cliente encontrado:</strong>
          </p>
          <p>
            <strong>Nombre:</strong> {destinatario.nombre}{" "}
            {destinatario.apellido}
          </p>
          <p>
            <strong>Identificación:</strong> {destinatario.identificacion}
          </p>
          <p>
            <strong>Teléfono:</strong> {destinatario.telefono}
          </p>
          <p>
            <strong>Email:</strong> {destinatario.email}
          </p>
          <p>
            <strong>Dirección:</strong> {destinatario.direccion}
          </p>

          {/* Selector de parentesco */}
          <div className="mt-3">
            <label className="block text-sm font-medium text-gray-700">
              Vincular como destinatario (Parentesco):
            </label>
            <select
              className="border p-2 w-full mt-1"
              onChange={(e) =>
                console.log("Parentesco seleccionado:", e.target.value)
              }
            >
              <option value="">Seleccione parentesco</option>
              <option value="PADRE">Padre</option>
              <option value="MADRE">Madre</option>
              <option value="HIJO">Hijo</option>
              <option value="HERMANO">Hermano</option>
              <option value="OTRO">Otro</option>
            </select>
            <button className="mt-2 bg-green-600 text-white px-4 py-2 rounded">
              Vincular
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
