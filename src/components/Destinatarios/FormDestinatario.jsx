import React from "react";

export default function FormDestinatario({
  formDestinatario,
  handleChangeDestinatario,
  paises,
  sucursales,
  parentescos,
  onCrearDestinatario
}) {
  return (
    <div className="space-y-2 bg-white p-4 rounded shadow border mt-4">
      <h3 className="font-semibold text-gray-800">Registrar nuevo destinatario</h3>

      <input
        name="identificacion"
        placeholder="Identificación"
        value={formDestinatario.identificacion}
        onChange={handleChangeDestinatario}
        className="border p-2 w-full rounded"
      />
      <input
        name="nombre"
        placeholder="Nombre"
        value={formDestinatario.nombre}
        onChange={handleChangeDestinatario}
        className="border p-2 w-full rounded"
      />
      <input
        name="apellido"
        placeholder="Apellido"
        value={formDestinatario.apellido}
        onChange={handleChangeDestinatario}
        className="border p-2 w-full rounded"
      />
      <input
        name="fecha_nacimiento"
        type="date"
        value={formDestinatario.fecha_nacimiento}
        onChange={handleChangeDestinatario}
        className="border p-2 w-full rounded"
      />
      <input
        name="telefono"
        placeholder="Teléfono"
        value={formDestinatario.telefono}
        onChange={handleChangeDestinatario}
        className="border p-2 w-full rounded"
      />
      <input
        name="email"
        placeholder="Email"
        value={formDestinatario.email}
        onChange={handleChangeDestinatario}
        className="border p-2 w-full rounded"
      />
      <input
        name="direccion"
        placeholder="Dirección"
        value={formDestinatario.direccion}
        onChange={handleChangeDestinatario}
        className="border p-2 w-full rounded"
      />

      <select
        name="id_pais"
        value={formDestinatario.id_pais}
        onChange={(e) =>
          handleChangeDestinatario({
            target: { name: "id_pais", value: parseInt(e.target.value) },
          })
        }
        className="border p-2 w-full rounded"
      >
        <option value="">Seleccione país</option>
        {paises.map((p) => (
          <option key={p.Id_Pais} value={p.Id_Pais}>
            {p.Nombre_Pais}
          </option>
        ))}
      </select>

      <select
        name="id_sucursal"
        value={formDestinatario.id_sucursal}
        onChange={handleChangeDestinatario}
        className="border p-2 w-full rounded"
      >
        <option value="">Sucursal</option>
        {sucursales.map((s) => (
          <option key={s.Id_Sucursal} value={s.Id_Sucursal}>
            {s.Nombre_Sucursal}
          </option>
        ))}
      </select>

      <select
        name="id_parentesco"
        value={formDestinatario.id_parentesco}
        onChange={handleChangeDestinatario}
        className="border p-2 w-full rounded"
      >
        <option value="">Parentesco</option>
        {parentescos.map((p) => (
          <option key={p.Id_Parentesco} value={p.Id_Parentesco}>
            {p.Tipo}
          </option>
        ))}
      </select>

      <select
        name="pais_destino"
        value={formDestinatario.pais_destino}
        onChange={handleChangeDestinatario}
        className="border p-2 w-full rounded"
      >
        <option value="">País destino</option>
        {paises.map((p) => (
          <option key={p.Id_Pais} value={p.Id_Pais}>
            {p.Nombre_Pais}
          </option>
        ))}
      </select>

      <button
        onClick={onCrearDestinatario}
        disabled={
          !formDestinatario.identificacion ||
          !formDestinatario.nombre ||
          !formDestinatario.apellido ||
          !formDestinatario.fecha_nacimiento ||
          !formDestinatario.telefono ||
          !formDestinatario.email ||
          !formDestinatario.direccion ||
          !formDestinatario.id_pais ||
          !formDestinatario.id_parentesco ||
          !formDestinatario.pais_destino
        }
        className="bg-green-600 text-white px-4 py-2 rounded mt-2 disabled:opacity-50"
      >
        Crear Destinatario
      </button>
    </div>
  );
}