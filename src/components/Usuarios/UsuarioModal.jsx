import React, { useState, useEffect, useRef } from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import {
  registrarUsuarioCompleto,
  actualizarUsuario,
  obtenerRoles,
  obtenerEstados,
  obtenerPaises,
  obtenerSucursalesPorPais,
  obtenerUsuarioPorId, // ✅ importada
} from "../../api/usuarios";

// Helper: fecha Mínima de nacimiento
function getFechaMaximaNacimiento() {
  const hoy = new Date();
  hoy.setFullYear(hoy.getFullYear() - 18);
  return hoy.toISOString().split("T")[0]; // formato YYYY-MM-DD
}
// Helper: devuelve cadena "YYYY-MM-DD" desde distintos formatos posibles
function formatToDateInput(value) {
  if (value === undefined || value === null || value === "") return "";
  const s = String(value).trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s;
  const m = s.match(/^(\d{4}-\d{2}-\d{2})/);
  if (m) return m[1];
  const iso = new Date(s);
  if (!Number.isNaN(iso.getTime())) {
    const yyyy = iso.getFullYear();
    const mm = String(iso.getMonth() + 1).padStart(2, "0");
    const dd = String(iso.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  }
  const n = Number(s);
  if (!Number.isNaN(n)) {
    const d = new Date(n);
    if (!isNaN(d)) {
      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, "0");
      const dd = String(d.getDate()).padStart(2, "0");
      return `${yyyy}-${mm}-${dd}`;
    }
  }
  return "";
}
// Helper: validar contraseña fuerte
function validarPassword(password) {
  const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{12,}$/;
  return regex.test(password);
}

export default function UsuarioModal({ usuario, onClose, onGuardado }) {
  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    fecha_nacimiento: "",
    identificacion: "",
    telefono: "",
    correo: "", // ✅ corregido: usar correo en vez de email
    direccion: "",
    pais_id: "",
    sucursal_id: "",
    rol_id: "",
    estado_id: "",
    password: "",
  });

  const [roles, setRoles] = useState([]);
  const [estados, setEstados] = useState([]);
  const [paises, setPaises] = useState([]);
  const [sucursales, setSucursales] = useState([]);
  const [loading, setLoading] = useState(false);

  const usuarioRef = useRef(usuario);
  useEffect(() => {
    usuarioRef.current = usuario;
  }, [usuario]);

  // cargar auxiliares
  useEffect(() => {
    obtenerRoles().then((res) => {
      if (res && res.success) setRoles(res.roles || []);
      else console.warn("Error al cargar roles:", res?.message);
    });
    obtenerEstados().then((res) => {
      if (res && res.success) setEstados(res.estados || []);
      else console.warn("Error al cargar estados:", res?.message);
    });
    obtenerPaises().then((res) => {
      if (res && res.success) setPaises(res.paises || []);
      else console.warn("Error al cargar paises:", res?.message);
    });
  }, []);

  // inicializar / actualizar formulario
  useEffect(() => {
    if (!usuario) {
      setForm({
        nombre: "",
        apellido: "",
        fecha_nacimiento: "",
        identificacion: "",
        telefono: "",
        correo: "",
        direccion: "",
        pais_id: "",
        sucursal_id: "",
        rol_id: "",
        estado_id: "",
        password: "",
      });
      setSucursales([]);
      return;
    }

    // ✅ Si tenemos Id_Usuario, pedimos datos completos al backend
    if (usuario.Id_Usuario || usuario.id) {
      obtenerUsuarioPorId(usuario.Id_Usuario ?? usuario.id).then((res) => {
        if (res.success && res.usuario) {
          const u = res.usuario;
          const mapped = {
            nombre: u.Nombre ?? "",
            apellido: u.Apellido ?? "",
            fecha_nacimiento: formatToDateInput(u.Fecha_Nacimiento ?? ""),
            identificacion: u.Identificacion ?? "",
            telefono: u.Telefono ?? "",
            correo: u.correo ?? "",
            direccion: u.Direccion ?? "",
            pais_id: u.Id_Pais ?? "",
            sucursal_id: u.Id_Sucursal ?? "",
            rol_id: u.Id_Rol ?? "",
            estado_id: u.Id_Estado ?? "",
            password: "",
          };
          setForm(mapped);

          // cargar sucursales según país
          if (mapped.pais_id) {
            obtenerSucursalesPorPais(mapped.pais_id).then((resSuc) => {
              if (resSuc.success) {
                setSucursales(resSuc.sucursales || []);
              } else {
                setSucursales([]);
              }
            });
          }
        } else {
          alert("No se pudo cargar datos completos del usuario");
        }
      });
    }
  }, [usuario]);

  // cuando cambia país en form, recargar sucursales
  useEffect(() => {
    const pid = form.pais_id;
    if (!pid) {
      setSucursales([]);
      setForm((prev) => ({ ...prev, sucursal_id: "" }));
      return;
    }
    obtenerSucursalesPorPais(pid).then((res) => {
      if (res && res.success) {
        setSucursales(res.sucursales || []);
      } else {
        setSucursales([]);
      }
    });
  }, [form.pais_id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const parsed =
      name.endsWith("_id") && value !== ""
        ? Number.isNaN(Number(value))
          ? value
          : parseInt(value)
        : value;
    setForm((prev) => ({ ...prev, [name]: parsed }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!usuario && !validarPassword(form.password)) {
      alert(
        "La contraseña debe tener al menos 12 caracteres, una mayúscula, un número y un carácter especial."
      );
      return;
    }
    // Validación de campos obligatorios
    const camposObligatorios = usuario
      ? ["nombre", "apellido", "identificacion"] // edición SIN correo
      : ["nombre", "apellido", "identificacion", "correo"]; // creación CON correo

    const incompletos = camposObligatorios.filter((campo) => {
      const v = form[campo];
      return v === undefined || v === null || String(v).trim() === "";
    });

    if (incompletos.length > 0) {
      alert("Completa todos los campos obligatorios.");
      return;
    }

    setLoading(true);
    try {
      let res;
      if (usuario && (usuario.Id_Usuario || usuario.id)) {
        const idEnviar = usuario.Id_Usuario ?? usuario.id;
        const payload = { id: idEnviar, ...form };
        if (
          payload.fecha_nacimiento &&
          payload.fecha_nacimiento.length === 10
        ) {
          payload.fecha_nacimiento = `${payload.fecha_nacimiento} 00:00:00`;
        }
        res = await actualizarUsuario(payload);
      } else {
        const payload = { ...form };
        if (
          payload.fecha_nacimiento &&
          payload.fecha_nacimiento.length === 10
        ) {
          payload.fecha_nacimiento = `${payload.fecha_nacimiento} 00:00:00`;
        }
        res = await registrarUsuarioCompleto(payload);
      }

      // ✅ Diferenciar éxito de error
      if (res.success) {
        alert(res.message ?? "Operación completada");
        if (typeof onGuardado === "function") onGuardado();
        if (typeof onClose === "function") onClose();
      } else {
        // Mostrar el mensaje exacto que manda el SP
        alert(`Error: ${res.message}`);
      }
    } catch (err) {
      console.error("Error al guardar usuario:", err);
      alert("Error en la operación. Revisa la consola.");
    } finally {
      setLoading(false);
    }
  };

  // Excluir rol Gerente (case-insensitive)
  const rolesFiltrados = (roles || []).filter(
    (r) =>
      String(r.Nombre || "")
        .toLowerCase()
        .trim() !== "gerente"
  );

  // Estados según modo: creación -> solo Activo; edición -> Activo e Inactivo
  const estadosCreacion = (estados || []).filter((es) =>
    ["activo"].includes(
      String(es.Tipo || "")
        .toLowerCase()
        .trim()
    )
  );

  const estadosEdicion = (estados || []).filter((es) =>
    ["activo", "inactivo"].includes(
      String(es.Tipo || "")
        .toLowerCase()
        .trim()
    )
  );

  const estadosFiltrados = usuario ? estadosEdicion : estadosCreacion;

  // Aquí seguiría tu JSX para renderizar el formulario con form, rolesFiltrados, estadosFiltrados, sucursales, etc.

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
      {/* Light blue overlay instead of black */}
      <div className="absolute inset-0 bg-blue-800/100 backdrop-blur-sm" />

      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="relative bg-white rounded-3xl shadow-2xl p-8 w-full max-w-4xl mx-auto border border-yellow-200"
      >
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-2xl font-extrabold text-gray-800 mb-1">
              {usuario ? "✏️ Editar Usuario" : "➕ Nuevo Usuario"}
            </h2>
            <p className="text-sm text-gray-600">
              {usuario
                ? "Actualiza los datos del usuario"
                : "Completa los datos para crear un usuario"}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
          <input
            name="nombre"
            placeholder="Nombre"
            value={form.nombre}
            onChange={handleChange}
            required
            className="p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
          <input
            name="apellido"
            placeholder="Apellido"
            value={form.apellido}
            onChange={handleChange}
            required
            className="p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
          />

          <input
            type="date"
            name="fecha_nacimiento"
            value={form.fecha_nacimiento}
            onChange={handleChange}
            max={getFechaMaximaNacimiento()}
            required
          />
          <input
            name="identificacion"
            placeholder="Identificación"
            value={form.identificacion}
            onChange={handleChange}
            required
            className="p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
          />

          <input
            type="tel"
            name="telefono"
            value={form.telefono}
            onChange={(e) => {
              const soloNumeros = e.target.value.replace(/\D/g, "");
              setForm((prev) => ({ ...prev, telefono: soloNumeros }));
            }}
            pattern="[0-9]+"
            maxLength={15}
            placeholder="Ej: 888888888888888"
            required
          />
          {!usuario && (
            <input
              name="correo"
              type="email"
              placeholder="Correo"
              value={form.correo}
              onChange={handleChange}
              required
              className="p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
          )}

          <input
            name="direccion"
            placeholder="Dirección"
            value={form.direccion}
            onChange={handleChange}
            className="p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 col-span-2"
          />

          <select
            name="pais_id"
            value={form.pais_id ?? ""}
            onChange={handleChange}
            className="p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
          >
            <option value="">Selecciona país</option>
            {paises.map((p) => (
              <option key={p.Id_Pais} value={p.Id_Pais}>
                {p.Nombre_Pais}
              </option>
            ))}
          </select>

          <select
            name="sucursal_id"
            value={form.sucursal_id ?? ""}
            onChange={handleChange}
            className="p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
          >
            <option value="">Selecciona sucursal</option>
            {sucursales.map((s) => (
              <option key={s.Id_Sucursal} value={s.Id_Sucursal}>
                {s.Nombre_Sucursal}
              </option>
            ))}
          </select>

          <select
            name="rol_id"
            value={form.rol_id ?? ""}
            onChange={handleChange}
            required
            className="p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
          >
            <option value="">Selecciona rol</option>
            {rolesFiltrados.map((r) => (
              <option key={r.Id_Rol} value={r.Id_Rol}>
                {r.Nombre}
              </option>
            ))}
          </select>

          <select
            name="estado_id"
            value={form.estado_id ?? ""}
            onChange={handleChange}
            required
            className="p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
          >
            <option value="">Selecciona estado</option>
            {estadosFiltrados.map((es) => (
              <option key={es.Id_Estado} value={es.Id_Estado}>
                {es.Tipo}
              </option>
            ))}
          </select>

          {!usuario && (
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Contraseña segura"
              required
            />
          )}

          <div className="col-span-2 flex justify-between items-center mt-4">
            <div className="text-sm text-gray-600">
              Completa los campos requeridos para guardar
            </div>
            <div className="flex items-center space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-lg border border-gray-200 bg-white hover:bg-gray-50"
                disabled={loading}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-6 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow"
                disabled={loading}
              >
                {loading ? "Guardando..." : "Guardar"}
              </button>
            </div>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
