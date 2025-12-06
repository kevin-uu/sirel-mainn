import React, { useState, useEffect } from "react";
import { listarPaises, crearPais, editarPais } from "../api/paises";
import {
  listarSucursalesPorPais,
  crearSucursal,
  editarSucursal,
} from "../api/sucursales"; // 👈 eliminamos eliminarSucursal
import { sirelTheme } from "../theme/sirelTheme";
import PaisesTable from "../components/Pais/PaisesTable";
import SucursalesForm from "../components/Pais/SucursalesForm";
import SucursalesTable from "../components/Pais/SucursalesTable";

export default function PaisesPage() {
  const [paises, setPaises] = useState([]);
  const [nuevoPais, setNuevoPais] = useState({ codigo: "", nombre: "", continente: "" });
  const [editandoId, setEditandoId] = useState(null);
  const [editandoData, setEditandoData] = useState({});
  const [error, setError] = useState("");

  // Sucursales
  const [paisSeleccionado, setPaisSeleccionado] = useState("");
  const [sucursales, setSucursales] = useState([]);
  const [editandoSucursalId, setEditandoSucursalId] = useState(null);
  const [editandoSucursalData, setEditandoSucursalData] = useState({});

  useEffect(() => { cargarPaises(); }, []);

  const cargarPaises = async () => {
    const data = await listarPaises();
    if (data.success) setPaises(data.paises || []);
  };

  const handleCrearPais = async () => {
    if (!nuevoPais.codigo || !nuevoPais.nombre || !nuevoPais.continente) {
      setError("Todos los campos son obligatorios");
      return;
    }
    setError("");
    const data = await crearPais(nuevoPais);
    if (data.success) {
      await cargarPaises();
      setNuevoPais({ codigo: "", nombre: "", continente: "" });
    } else {
      setError(data.message || "Error al crear país");
    }
  };

  const handleEditar = (pais) => {
    setEditandoId(pais.Id_Pais);
    setEditandoData({
      id_pais: pais.Id_Pais,
      codigo: pais.Codigo_Pais,
      nombre: pais.Nombre_Pais,
      continente: pais.Continente,
    });
  };

  const handleGuardarEdicion = async () => {
    if (!editandoData.codigo || !editandoData.nombre || !editandoData.continente) {
      setError("Todos los campos son obligatorios");
      return;
    }
    setError("");
    const data = await editarPais(editandoData);
    if (data.success) {
      await cargarPaises();
      setEditandoId(null);
      setEditandoData({});
    } else {
      setError(data.message || "Error al editar país");
    }
  };

  // Sucursales: cargar por país
  useEffect(() => {
    async function cargarSucursales() {
      if (!paisSeleccionado) { setSucursales([]); return; }
      const data = await listarSucursalesPorPais(paisSeleccionado);
      if (data.success) setSucursales(data.sucursales || []);
      else setSucursales([]);
    }
    cargarSucursales();
  }, [paisSeleccionado]);

  const handleCrearSucursal = async (sucursal) => {
    const payload = { ...sucursal, id_pais: parseInt(sucursal.id_pais, 10) };
    const res = await crearSucursal(payload);
    if (res.success) {
      const recargar = await listarSucursalesPorPais(payload.id_pais);
      setSucursales(recargar.success ? (recargar.sucursales || []) : []);
      alert("Sucursal creada correctamente ✅");
    } else {
      alert(res.message || "Error al crear sucursal");
    }
  };

  const guardarEdicionSucursal = async () => {
    if (!editandoSucursalData?.nombre ) return;
    const res = await editarSucursal(editandoSucursalData);
    if (res.success) {
      const recargar = await listarSucursalesPorPais(editandoSucursalData.id_pais);
      setSucursales(recargar.success ? (recargar.sucursales || []) : []);
      setEditandoSucursalId(null);
      setEditandoSucursalData({});
    } else {
      alert(res.message || "Error al editar sucursal");
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* 🔹 Encabezado */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">🌍 Gestión de Países y Sucursales</h1>
        <button
          onClick={handleCrearPais}
          style={{ backgroundColor: sirelTheme.colors.secondary }}
          className="hover:opacity-90 text-white font-semibold py-2 px-4 rounded-lg shadow"
        >
          ➕ Guardar Nuevo País
        </button>
      </div>

      {error && <div className="bg-red-100 text-red-700 p-2 rounded mb-3">{error}</div>}

      {/* Formulario Crear País */}
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">➕ Crear País</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="Código"
            value={nuevoPais.codigo}
            onChange={(e) => setNuevoPais({ ...nuevoPais, codigo: e.target.value })}
            className="border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-green-400"
          />
          <input
            type="text"
            placeholder="Nombre"
            value={nuevoPais.nombre}
            onChange={(e) => setNuevoPais({ ...nuevoPais, nombre: e.target.value })}
            className="border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-green-400"
          />
          <input
            type="text"
            placeholder="Continente"
            value={nuevoPais.continente}
            onChange={(e) => setNuevoPais({ ...nuevoPais, continente: e.target.value })}
            className="border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-green-400"
          />
        </div>
      </div>

      {/* 📋 Tabla Países */}
      <PaisesTable
        paises={paises}
        editandoId={editandoId}
        editandoData={editandoData}
        handleEditar={handleEditar}
        handleGuardarEdicion={handleGuardarEdicion}
        setEditandoId={setEditandoId}
        setEditandoData={setEditandoData}
      />

      {/* 🏢 Gestión de Sucursales */}
      <div className="bg-white shadow rounded-lg p-6 mt-6">
        <h2 className="text-lg font-semibold mb-4">🏢 Sucursales por País</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <select
            value={paisSeleccionado}
            onChange={(e) => setPaisSeleccionado(e.target.value ? parseInt(e.target.value, 10) : "")}
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

        <SucursalesForm paises={paises} onCrearSucursal={handleCrearSucursal} />

        <SucursalesTable
          sucursales={sucursales}
          editandoId={editandoSucursalId}
          editandoData={editandoSucursalData}
          setEditandoId={setEditandoSucursalId}
          setEditandoData={setEditandoSucursalData}
          onGuardar={guardarEdicionSucursal}
          paises={paises}
        />
      </div>
    </div>
  );
}