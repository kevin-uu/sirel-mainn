import React from "react";
import { motion } from "framer-motion";
import { sirelTheme } from "../../theme/sirelTheme";

export default function PaisesTable({ paises, editandoId, editandoData, handleEditar, handleGuardarEdicion, setEditandoId, setEditandoData }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white shadow rounded-xl overflow-x-auto"
    >
      <table className="min-w-full border-collapse">
        <thead style={{ backgroundColor: sirelTheme.colors.secondary, color: sirelTheme.colors.white }}>
          <tr>
            <th className="py-3 px-4 text-left">Código</th>
            <th className="py-3 px-4 text-left">Nombre</th>
            <th className="py-3 px-4 text-left">Continente</th>
            <th className="py-3 px-4 text-center">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {paises.map((p, index) => (
            <motion.tr
              key={`pais-${p.Id_Pais}-${index}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="border-b hover:bg-gray-50"
            >
              <td className="py-3 px-4 font-medium text-gray-800">
                {editandoId === p.Id_Pais ? (
                  <input
                    type="text"
                    value={editandoData.codigo}
                    onChange={(e) => setEditandoData({ ...editandoData, codigo: e.target.value })}
                    className="border border-gray-300 rounded px-2 py-1 w-full"
                  />
                ) : (
                  p.Codigo_Pais
                )}
              </td>
              <td className="py-3 px-4 text-gray-600">
                {editandoId === p.Id_Pais ? (
                  <input
                    type="text"
                    value={editandoData.nombre}
                    onChange={(e) => setEditandoData({ ...editandoData, nombre: e.target.value })}
                    className="border border-gray-300 rounded px-2 py-1 w-full"
                  />
                ) : (
                  p.Nombre_Pais
                )}
              </td>
              <td className="py-3 px-4 text-gray-500">
                {editandoId === p.Id_Pais ? (
                  <input
                    type="text"
                    value={editandoData.continente}
                    onChange={(e) => setEditandoData({ ...editandoData, continente: e.target.value })}
                    className="border border-gray-300 rounded px-2 py-1 w-full"
                  />
                ) : (
                  p.Continente
                )}
              </td>
              <td className="py-3 px-4 text-center space-x-2">
                {editandoId === p.Id_Pais ? (
                  <>
                    <button
                      onClick={handleGuardarEdicion}
                      style={{ backgroundColor: sirelTheme.colors.secondary }}
                      className="hover:opacity-90 text-white px-3 py-1 rounded"
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
                    onClick={() => handleEditar(p)}
                    className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded"
                  >
                    ✏️ Editar
                  </button>
                )}
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </motion.div>
  );
}