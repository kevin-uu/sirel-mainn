/* eslint-disable no-unused-vars */
import React from "react";
import { motion } from "framer-motion";

/**
 * Tabla de usuarios con soporte para mostrar activos o inactivos.
 */
export default function UsuariosTable({ usuarios, onEditar, onEliminar, onReactivar }) {
  console.log("📦 Usuarios recibidos en la tabla:", usuarios);

  if (!Array.isArray(usuarios) || usuarios.length === 0)
    return (
      <p className="text-center text-gray-500 mt-10">
        No hay usuarios registrados.
      </p>
    );

  return (
    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="bg-white shadow rounded-xl overflow-x-auto">
      <table className="min-w-full border-collapse">
        <thead className="bg-blue-600 text-white">
          <tr>
            <th scope="col" className="py-3 px-4 text-left">Nombre</th>
            <th scope="col" className="py-3 px-4 text-left">Correo</th>
            <th scope="col" className="py-3 px-4 text-left">Rol</th>
            <th scope="col" className="py-3 px-4 text-left">Identificación</th>
            <th scope="col" className="py-3 px-4 text-left">País</th>
            <th scope="col" className="py-3 px-4 text-left">Sucursal</th>
            <th scope="col" className="py-3 px-4 text-left">Estado</th>
            <th scope="col" className="py-3 px-4 text-center">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map((u, index) => (
            <motion.tr
              key={`usuario-${u.Id_Usuario}-${index}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="border-b hover:bg-gray-50"
            >
              <td className="py-3 px-4 font-medium text-gray-800">{`${u.Nombre || ""} ${u.Apellido || ""}`.trim() || "—"}</td>
              <td className="py-3 px-4 text-gray-600">{String(u.Correo || "—")}</td>
              <td className="py-3 px-4 text-gray-500">{String(u.Rol || "—")}</td>
              <td className="py-3 px-4 text-gray-500">{String(u.Identificacion || "—")}</td>
              <td className="py-3 px-4 text-gray-500">{String(u.Pais || "—")}</td>
              <td className="py-3 px-4 text-gray-500">{String(u.Sucursal || "—")}</td>
              <td className="py-3 px-4">
                <span className={`px-2 py-1 rounded text-white text-sm ${u.Estado === "Activo" ? "bg-green-500" : "bg-gray-400"}`}>
                  {u.Estado || "—"}
                </span>
              </td>
              <td className="py-3 px-4 text-center space-x-2">
                {u.Estado === "Activo" ? (
                  <>
                    <button onClick={() => onEditar(u)} title="Editar usuario" className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded">✏️</button>
                    <button onClick={() => onEliminar(u.Id_Usuario)} title="Desactivar usuario" className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded">🚫</button>
                  </>
                ) : (
                  <button onClick={() => onReactivar(u.Id_Usuario)} title="Reactivar usuario" className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded">♻️ Reactivar</button>
                )}
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </motion.div>
  );
}