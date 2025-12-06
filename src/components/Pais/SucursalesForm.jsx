import React, { useState } from "react";

export default function SucursalesForm({ paises, onCrearSucursal }) {
  const [sucursal, setSucursal] = useState({ nombre: "", id_pais: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSucursal((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    if (!sucursal.nombre ||  !sucursal.id_pais) {
      alert("Todos los campos son obligatorios");
      return;
    }
    onCrearSucursal(sucursal);
    setSucursal({ nombre: "",  id_pais: "" });
  };

  return (
    <div className="bg-white shadow rounded-lg p-6 mb-6">
      <h2 className="text-lg font-semibold mb-4">🏢 Crear Sucursal</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <input
          type="text"
          name="nombre"
          placeholder="Nombre de la sucursal"
          value={sucursal.nombre}
          onChange={handleChange}
          className="border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-green-400"
        />
       
        <select
          name="id_pais"
          value={sucursal.id_pais}
          onChange={handleChange}
          className="border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-green-400"
        >
          <option value="">Seleccione un país</option>
          {paises.map((p) => (
            <option key={p.Id_Pais} value={p.Id_Pais}>
              {p.Nombre_Pais}
            </option>
          ))}
        </select>
      </div>
      <button
        onClick={handleSubmit}
        className="bg-green-600 text-white px-4 py-2 rounded mt-4 hover:bg-green-700 transition"
      >
        ➕ Guardar Sucursal
      </button>
    </div>
  );
}