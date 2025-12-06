import React from "react";

export default function SucursalesTable({
  sucursales = [],
  editandoId,
  editandoData,
  setEditandoId,
  setEditandoData,
  onGuardar,
  paises = [], // 👈 recibimos la lista de países
}) {
  return (
    <div className="bg-white shadow rounded-xl overflow-x-auto mt-6">
      <table className="min-w-full border-collapse">
        <thead className="bg-gray-100">
          <tr>
            <th className="py-3 px-4 text-left">Nombre</th>
            <th className="py-3 px-4 text-left">País</th>
            <th className="py-3 px-4 text-center">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {sucursales.map((s) => (
            <tr key={s.Id_Sucursal} className="border-b hover:bg-gray-50">
              {/* Nombre */}
              <td className="py-3 px-4">
                {editandoId === s.Id_Sucursal ? (
                  <input
                    type="text"
                    value={editandoData.nombre || ""}
                    onChange={(e) =>
                      setEditandoData((prev) => ({ ...prev, nombre: e.target.value }))
                    }
                    className="border border-gray-300 rounded px-2 py-1 w-full"
                  />
                ) : (
                  s.Nombre_Sucursal
                )}
              </td>

              {/* País como select en edición */}
              <td className="py-3 px-4">
                {editandoId === s.Id_Sucursal ? (
                  <select
                    value={editandoData.id_pais || ""}
                    onChange={(e) =>
                      setEditandoData((prev) => ({ ...prev, id_pais: e.target.value }))
                    }
                    className="border border-gray-300 rounded px-2 py-1 w-full"
                  >
                    <option value="">Seleccione un país</option>
                    {paises.map((p) => (
                      <option key={p.Id_Pais} value={p.Id_Pais}>
                        {p.Nombre_Pais}
                      </option>
                    ))}
                  </select>
                ) : (
                  s.Nombre_Pais // 👈 cuando no está en edición, mostramos el nombre del país
                )}
              </td>

              {/* Acciones */}
              <td className="py-3 px-4 text-center space-x-2">
                {editandoId === s.Id_Sucursal ? (
                  <>
                    <button
                      onClick={() => onGuardar()}
                      className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded"
                    >
                      Guardar
                    </button>
                    <button
                      onClick={() => setEditandoId(null)}
                      className="bg-gray-400 hover:bg-gray-500 text-white px-3 py-1 rounded"
                    >
                      Cancelar
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => {
                      setEditandoId(s.Id_Sucursal);
                      setEditandoData({
                        id_sucursal: s.Id_Sucursal,
                        id_pais: s.Id_Pais,
                        nombre: s.Nombre_Sucursal,
                      });
                    }}
                    className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded"
                  >
                    ✏️ Editar
                  </button>
                )}
              </td>
            </tr>
          ))}
          {sucursales.length === 0 && (
            <tr>
              <td colSpan={3} className="py-4 px-4 text-center text-gray-500">
                No hay sucursales para este país.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}