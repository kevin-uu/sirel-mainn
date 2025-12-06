/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useCallback, useMemo } from "react";
import UsuariosTable from "./UsuariosTable";
import UsuarioModal from "./UsuarioModal";
import {
  obtenerRoles,
  obtenerEstados,
  obtenerPaises,
  obtenerSucursalesPorPais,
  obtenerUsuarios,
  eliminarUsuario,
  reactivarUsuario,
  obtenerUsuarioPorId,
} from "../../api/usuarios";
import { motion, AnimatePresence } from "framer-motion";

export default function UsuariosPage() {
  const [usuarios, setUsuarios] = useState([]);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [usuarioEditando, setUsuarioEditando] = useState(null);
  const [busqueda, setBusqueda] = useState("");

  const [filtroPais, setFiltroPais] = useState("");
  const [filtroSucursal, setFiltroSucursal] = useState("");
  const [filtroRol, setFiltroRol] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("");

  const [roles, setRoles] = useState([]);
  const [estados, setEstados] = useState([]);
  const [paises, setPaises] = useState([]);
  const [sucursales, setSucursales] = useState([]);

  // usuarioActual del localStorage; comparar robustamente
  const usuarioActual = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("usuario"));
    } catch {
      return null;
    }
  }, []);

  // cargar filtros (roles, estados (solo Activo/Inactivo), paises)
  const cargarFiltros = useCallback(async () => {
    let mounted = true;
    try {
      const [r, e, p] = await Promise.all([
        obtenerRoles(),
        obtenerEstados(),
        obtenerPaises(),
      ]);

      if (!mounted) return;

      if (r && r.success) setRoles(r.roles || []);

      if (e && e.success) {
        const estadosFiltrados = (e.estados || []).filter((item) => {
          const tipo = String(item.Tipo || "").toLowerCase();
          return tipo === "activo" || tipo === "inactivo";
        });
        setEstados(estadosFiltrados);
      }

      if (p && p.success) setPaises(p.paises || []);
    } catch (err) {
      console.error("Error cargarFiltros:", err);
    }
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    cargarFiltros();
  }, [cargarFiltros]);

  // cargar sucursales cuando cambie filtroPais (envía Id_Pais)
  useEffect(() => {
    let mounted = true;
    if (!filtroPais) {
      setSucursales([]);
      return;
    }
    obtenerSucursalesPorPais(filtroPais)
      .then((res) => {
        if (!mounted) return;
        if (res && res.success) setSucursales(res.sucursales || []);
      })
      .catch((err) => {
        console.error("Error obtenerSucursalesPorPais:", err);
      });
    return () => {
      mounted = false;
    };
  }, [filtroPais]);

  // cargar usuarios (lista completa)
  const cargarUsuarios = useCallback(async () => {
    try {
      const res = await obtenerUsuarios();
      if (res && res.success) {
        setUsuarios(res.usuarios || []);
      } else {
        setUsuarios([]);
      }
    } catch (err) {
      console.error("Error cargarUsuarios:", err);
      setUsuarios([]);
    }
  }, []);

  useEffect(() => {
    cargarUsuarios();
  }, [cargarUsuarios]);

  // acciones
  const handleNuevo = () => {
    setUsuarioEditando(null);
    setModalAbierto(true);
  };

const handleEditar = async (usuarioResumen) => {
  try {
    const id = usuarioResumen.Id_Usuario || usuarioResumen.id;
    if (!id) {
      setUsuarioEditando(usuarioResumen);
      setModalAbierto(true);
      return;
    }

    const res = await obtenerUsuarioPorId(id);   // ✅ usar la función correcta
    if (res && res.success && res.usuario) {
      setUsuarioEditando(res.usuario);
    } else {
      setUsuarioEditando(usuarioResumen);
      if (res && res.message) alert(res.message);
    }
    setModalAbierto(true);
  } catch (err) {
    console.error("handleEditar error:", err);
    setUsuarioEditando(usuarioResumen);
    setModalAbierto(true);
  }
};


  const handleEliminar = async (id) => {
    if (!usuarioActual) return alert("Error: sesión expirada");

    if (!window.confirm("¿Seguro que deseas inactivar este usuario?")) return;

    try {
      const res = await eliminarUsuario(id, usuarioActual);
      alert(res.message);
      if (res.success) {
        if (String(usuarioActual.Id_Usuario) === String(id)) {
          alert("Tu cuenta ha sido desactivada. Se cerrará la sesión.");
          localStorage.removeItem("usuario");
          window.location.reload();
        } else {
          cargarUsuarios();
        }
      }
    } catch (err) {
      console.error("handleEliminar:", err);
      alert("Error al inactivar usuario");
    }
  };

  const handleReactivar = async (id) => {
    if (!window.confirm("¿Deseas reactivar este usuario?")) return;
    try {
      const res = await reactivarUsuario(id);
      alert(res.message);
      if (res.success) cargarUsuarios();
    } catch (err) {
      console.error("handleReactivar:", err);
      alert("Error al reactivar usuario");
    }
  };

  // helpers para obtener nombre por id (seguro)
  const getPaisNombre = useCallback(
    (id) => paises.find((p) => String(p.Id_Pais) === String(id))?.Nombre_Pais || "",
    [paises]
  );
  const getSucursalNombre = useCallback(
    (id) => sucursales.find((s) => String(s.Id_Sucursal) === String(id))?.Nombre_Sucursal || "",
    [sucursales]
  );
  const getRolNombre = useCallback(
    (id) => roles.find((r) => String(r.Id_Rol) === String(id))?.Nombre || "",
    [roles]
  );
  const getEstadoNombre = useCallback(
    (id) => estados.find((es) => String(es.Id_Estado) === String(id))?.Tipo || "",
    [estados]
  );

  // traducir ids seleccionados a nombres (si vienen ids)
  const filtroPaisNombre = useMemo(() => (filtroPais ? getPaisNombre(filtroPais) : ""), [
    filtroPais,
    getPaisNombre,
  ]);
  const filtroSucursalNombre = useMemo(
    () => (filtroSucursal ? getSucursalNombre(filtroSucursal) : ""),
    [filtroSucursal, getSucursalNombre]
  );
  const filtroRolNombre = useMemo(() => (filtroRol ? getRolNombre(filtroRol) : ""), [
    filtroRol,
    getRolNombre,
  ]);
  const filtroEstadoNombre = useMemo(
    () => (filtroEstado ? getEstadoNombre(filtroEstado) : ""),
    [filtroEstado, getEstadoNombre]
  );

  // filtrado en cliente: excluir usuario actual y Gerente, aplicar búsqueda y filtros por nombre (case-insensitive)
  const usuariosFiltrados = useMemo(() => {
    const q = (busqueda || "").toLowerCase().trim();
    return (usuarios || [])
      .filter((u) => {
        // evitar mostrarse a sí misma/o
        if (!usuarioActual) return true;
        return String(u.Id_Usuario) !== String(usuarioActual.Id_Usuario);
      })
      .filter((u) => {
        // excluir rol Gerente (case-insensitive)
        return String((u.Rol || "")).toLowerCase() !== "gerente";
      })
      .filter((u) => {
        if (!q) return true;
        const nombreCompleto = `${u.Nombre || ""} ${u.Apellido || ""}`.toLowerCase();
        return nombreCompleto.includes(q);
      })
      .filter((u) => {
        if (!filtroPaisNombre) return true;
        return String(u.Pais || "").toLowerCase().includes(filtroPaisNombre.toLowerCase());
      })
      .filter((u) => {
        if (!filtroSucursalNombre) return true;
        return String(u.Sucursal || "").toLowerCase().includes(filtroSucursalNombre.toLowerCase());
      })
      .filter((u) => {
        if (!filtroRolNombre) return true;
        return String(u.Rol || "").toLowerCase().includes(filtroRolNombre.toLowerCase());
      })
      .filter((u) => {
        if (!filtroEstadoNombre) return true;
        return String(u.Estado || "").toLowerCase().includes(filtroEstadoNombre.toLowerCase());
      });
  }, [
    usuarios,
    usuarioActual,
    busqueda,
    filtroPaisNombre,
    filtroSucursalNombre,
    filtroRolNombre,
    filtroEstadoNombre,
  ]);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* 🔹 Encabezado */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">👥 Gestión de Usuarios</h1>
        <button
          onClick={handleNuevo}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow"
        >
          ➕ Nuevo Usuario
        </button>
      </div>

      {/* 🎛️ Filtros */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <select value={filtroPais} onChange={(e) => setFiltroPais(e.target.value)}>
          <option value="">🌍 País</option>
          {paises.map((p) => (
            <option key={p.Id_Pais} value={p.Id_Pais}>
              {p.Nombre_Pais}
            </option>
          ))}
        </select>

        <select value={filtroSucursal} onChange={(e) => setFiltroSucursal(e.target.value)}>
          <option value="">🏢 Sucursal</option>
          {sucursales.map((s) => (
            <option key={s.Id_Sucursal} value={s.Id_Sucursal}>
              {s.Nombre_Sucursal}
            </option>
          ))}
        </select>

        <select value={filtroRol} onChange={(e) => setFiltroRol(e.target.value)}>
          <option value="">🎓 Rol</option>
          {roles.map((r) => (
            <option key={r.Id_Rol} value={r.Id_Rol}>
              {r.Nombre}
            </option>
          ))}
        </select>

        <select value={filtroEstado} onChange={(e) => setFiltroEstado(e.target.value)}>
          <option value="">⚙️ Estado</option>
          {estados.map((es) => (
            <option key={es.Id_Estado} value={es.Id_Estado}>
              {es.Tipo}
            </option>
          ))}
        </select>
      </div>

      {/* 🔍 Buscador */}
      <input
        type="text"
        placeholder="Buscar por nombre..."
        className="w-full mb-4 p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400"
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
      />

      {/* 📋 Tabla */}
      <UsuariosTable
        usuarios={usuariosFiltrados}
        onEditar={handleEditar}
        onEliminar={handleEliminar}
        onReactivar={handleReactivar}
      />

      {/* 💫 Modal */}
      <AnimatePresence>
        {modalAbierto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
          >
            <UsuarioModal usuario={usuarioEditando} onClose={() => setModalAbierto(false)} onGuardado={cargarUsuarios} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}