import React from "react";
import PropTypes from "prop-types";

export default function FormCliente({
  formCliente = {},
  handleChangeCliente = () => {},
  paises = [],
  onCrearCliente = () => {},
}) {
  const {
    nombre = "",
    apellido = "",
    fecha_nacimiento = "",
    identificacion = "",
    telefono = "",
    email = "",
    direccion = "",
    id_pais = "",
    id_sucursal = 1,
  } = formCliente || {};

  return (
    <div className="mt-6 bg-white p-6 rounded-lg shadow-md border w-[60%]">
      <h3 className="text-lg font-bold text-gray-800 mb-4">
        Registrar nuevo cliente
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          name="nombre"
          placeholder="Nombre"
          value={nombre}
          onChange={handleChangeCliente}
          className="border rounded px-3 py-2 focus:ring focus:ring-green-300 w-[70%]"
        />
        <input
          name="apellido"
          placeholder="Apellido"
          value={apellido}
          onChange={handleChangeCliente}
          className="border rounded px-3 py-2 focus:ring focus:ring-green-300 w-[70%]"
        />
        <input
          name="fecha_nacimiento"
          type="date"
          value={fecha_nacimiento}
          onChange={handleChangeCliente}
          className="border rounded px-3 py-2 focus:ring focus:ring-green-300 w-[70%]"
        />
        <input
          name="identificacion"
          placeholder="Identificación"
          value={identificacion}
          onChange={handleChangeCliente}
          className="border rounded px-3 py-2 focus:ring focus:ring-green-300 w-[70%]"
        />
        <input
          name="telefono"
          placeholder="Teléfono"
          value={telefono}
          onChange={handleChangeCliente}
          className="border rounded px-3 py-2 focus:ring focus:ring-green-300 w-[70%]"
        />
        <input
          name="email"
          placeholder="Email"
          value={email}
          onChange={handleChangeCliente}
          className="border rounded px-3 py-2 focus:ring focus:ring-green-300 w-[70%]"
        />
        <input
          name="direccion"
          placeholder="Dirección"
          value={direccion}
          onChange={handleChangeCliente}
          className="border rounded px-3 py-2 focus:ring focus:ring-green-300 w-[70%]"
        />

        <select
          name="id_pais"
          value={id_pais}
          onChange={handleChangeCliente}
          className="border rounded px-3 py-2 focus:ring focus:ring-green-300 w-[70%]"
        >
          <option value="">Seleccione un país</option>
          {Array.isArray(paises) &&
            paises.map((p) => (
              <option key={p.Id_Pais} value={p.Id_Pais}>
                {p.Nombre_Pais}
              </option>
            ))}
        </select>
      </div>

      <button
        onClick={onCrearCliente}
        disabled={
          !nombre ||
          !apellido ||
          !fecha_nacimiento ||
          !identificacion ||
          !telefono ||
          !direccion ||
          !id_pais
        }
        className="bg-green-600 text-white px-4 py-2 rounded mt-4 hover:bg-green-700 transition disabled:opacity-50"
      >
        Crear Cliente
      </button>
    </div>
  );
}

FormCliente.propTypes = {
  formCliente: PropTypes.object,
  handleChangeCliente: PropTypes.func,
  paises: PropTypes.array,
  onCrearCliente: PropTypes.func,
};