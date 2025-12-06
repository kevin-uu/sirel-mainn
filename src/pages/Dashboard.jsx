import React, { useEffect, useState } from "react";
import {
  //obtenerEstadisticas,
  obtenerActividadReciente,
  obtenerDatosGraficos,
  getDashboardStats
} from "../api/dashboard";
import {
  obtenerMonedas,
  consultarComision,
  registrarRemesa
} from "../api/remesas";
import StatsCards from "../components/Dashboard/StatsCards";
import RecentActivity from "../components/Dashboard/RecentActivity";
import BarChart from "../components/Dashboard/Charts/BarChart";
import PieChart from "../components/Dashboard/Charts/PieChart";
import { sirelTheme } from "../theme/sirelTheme";

export default function Dashboard() {
  const [estadisticas, setEstadisticas] = useState(null);
  const [actividad, setActividad] = useState([]);
  const [datosGraficos, setDatosGraficos] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

   // ✅ ADAPTADORES (PONER AQUÍ)
  const coloresRoles = {
    "Administrador": "#3B82F6",
    "Supervidor": "#10B981",
    "Supervisor": "#10B981",
    "Cajero": "#8B5CF6",
    "Cliente": "#F59E0B",
    "Gerente": "#EF4444",
    "Auditor": "#6366F1",
    "Autorizador": "#14B8A6"
  };

  const pieData = (datosGraficos?.usuariosPorRol || []).map((x) => ({
    rol: x.rol,
    cantidad: x.total,
    color: coloresRoles[x.rol] || "#9CA3AF" // gris por defecto
  }));

  const barData = (datosGraficos?.transaccionesMensuales || []).map((x) => ({
    mes: x.mes, 
    transacciones: x.transacciones,
    monto: x.monto
  }));

  // Remesa
  const [mostrarRemesa, setMostrarRemesa] = useState(false);
  const [monedas, setMonedas] = useState([]);
  const [form, setForm] = useState({
    monto: "",
    id_moneda_origen: "",
    id_moneda_destino: "",
    tasa_cambio: "",
    comision: "",
    detalle: ""
  });

  const cargarDashboard = async () => {
    try {
      setCargando(true);
      setError(null);
      const [estadisticasRes, actividadRes, graficosRes] = await Promise.all([
        getDashboardStats(),
        obtenerActividadReciente(),
        obtenerDatosGraficos()
      ]);
      if (estadisticasRes.success) setEstadisticas(estadisticasRes);
      if (actividadRes.success) setActividad(actividadRes.data);
      if (graficosRes.success) setDatosGraficos(graficosRes.data ?? graficosRes);
    } catch (err) {
      console.error("Error cargando dashboard:", err);
      setError("Error al cargar los datos del dashboard");
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarDashboard();
  }, []);

  useEffect(() => {
    if (mostrarRemesa) {
      obtenerMonedas().then((res) => {
        if (res.success) setMonedas(res.monedas || []);
        else alert("Error al cargar monedas");
      });
    }
  }, [mostrarRemesa]);

  useEffect(() => {
    const { monto, id_moneda_origen, id_moneda_destino } = form;
    if (!monto || !id_moneda_origen || !id_moneda_destino) return;

    const paisOrigen = monedas.find(m => m.Id_Moneda === id_moneda_origen)?.Pais;
    const paisDestino = monedas.find(m => m.Id_Moneda === id_moneda_destino)?.Pais;

    if (!paisOrigen || !paisDestino) return;

    consultarComision(paisOrigen, paisDestino, parseFloat(monto)).then((res) => {
      if (res.success) {
        const porcentaje = parseFloat(res.Porcentaje);
        const comisionCalculada = ((porcentaje / 100) * parseFloat(monto)).toFixed(2);
        setForm((prev) => ({ ...prev, comision: comisionCalculada }));
      } else {
        setForm((prev) => ({ ...prev, comision: "" }));
        alert(res.message);
      }
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.monto, form.id_moneda_origen, form.id_moneda_destino]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleRegistrarRemesa = async (e) => {
    e.preventDefault();
    const payload = {
      id_usuario: JSON.parse(localStorage.getItem("usuario")).Id_Usuario,
      id_remitente: 1, 
      id_destinatario: 1, 
      ...form
    };
    const res = await registrarRemesa(payload);
    alert(res.message);
    if (res.success) {
      setMostrarRemesa(false);
      cargarDashboard();
    }
  };

  

  if (cargando) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: sirelTheme.colors.light }}>
        <div className="text-center">
          <div className="w-16 h-16 border-4 rounded-full animate-spin mx-auto mb-4"
            style={{ borderColor: sirelTheme.colors.primary, borderTopColor: "transparent" }} />
          <p className="text-gray-700">Cargando dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: sirelTheme.colors.light }}>
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">⚠️</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Error al cargar</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={cargarDashboard}
            className="px-6 py-2 rounded-lg shadow hover:opacity-90 transition"
            style={{
              backgroundColor: sirelTheme.buttons.primary.background,
              color: sirelTheme.buttons.primary.text
            }}
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }
    
  return (
    <div className="min-h-screen p-6" style={{ backgroundColor: sirelTheme.colors.light }}>
      <div className="max-w-7xl mx-auto space-y-8">
        {/* 🏷️ Encabezado */}
        <header className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold" style={{ color: sirelTheme.colors.primary }}>
              Panel Principal SIREL
            </h1>
            <p className="text-gray-600 mt-1">Resumen de operaciones, usuarios y métricas clave</p>
          </div>
          <div className="flex space-x-4">
            <button
              onClick={cargarDashboard}
              className="flex items-center space-x-2 px-4 py-2 rounded-lg shadow-sm border hover:shadow transition"
              style={{
                backgroundColor: sirelTheme.colors.white,
                color: sirelTheme.colors.dark
              }}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span>Actualizar</span>
            </button>

            
          </div>
        </header>

        {/* 📊 Tarjetas */}
        <StatsCards estadisticas={estadisticas} />

        {/* 📈 Gráficos y Actividad */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-xl shadow p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Transacciones Mensuales</h3>
            <div className="h-80">
              <BarChart datos={barData} />
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Usuarios por Rol</h3>
              <div className="h-64">
                <PieChart datos={pieData} />
              </div>
            </div>

            <RecentActivity actividad={actividad} />
          </div>
        </section>

        {/* 📌 Footer */}
        <footer className="text-center pt-10 text-gray-500 text-sm">
          © {new Date().getFullYear()} SIREL — Sistema de Remesas
              </footer>
      </div>

      {/* 📨 Modal de Registro de Remesa */}
      {mostrarRemesa && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Registrar nueva remesa</h2>

            <form onSubmit={handleRegistrarRemesa} className="grid grid-cols-2 gap-4">
              <input
                name="monto"
                type="number"
                step="0.01"
                placeholder="Monto"
                value={form.monto}
                onChange={handleChange}
                required
              />

              <select
                name="id_moneda_origen"
                value={form.id_moneda_origen}
                onChange={handleChange}
                required
              >
                <option value="">Moneda Origen</option>
                {monedas.map((m) => (
                  <option key={m.Id_Moneda} value={m.Id_Moneda}>
                    {m.Nombre_Moneda} ({m.Simbolo})
                  </option>
                ))}
              </select>

              <select
                name="id_moneda_destino"
                value={form.id_moneda_destino}
                onChange={handleChange}
                required
              >
                <option value="">Moneda Destino</option>
                {monedas.map((m) => (
                  <option key={m.Id_Moneda} value={m.Id_Moneda}>
                    {m.Nombre_Moneda} ({m.Simbolo})
                  </option>
                ))}
              </select>

              <input
                name="tasa_cambio"
                type="number"
                step="0.000001"
                placeholder="Tasa Cambio"
                value={form.tasa_cambio}
                onChange={handleChange}
                required
              />

              <input
                name="comision"
                type="number"
                step="0.01"
                placeholder="Comisión"
                value={form.comision}
                onChange={handleChange}
                required
                disabled
              />

              <input
                name="detalle"
                placeholder="Detalle"
                value={form.detalle}
                onChange={handleChange}
              />

              <div className="col-span-2 flex justify-end space-x-4 mt-4">
                <button
                  type="button"
                  onClick={() => setMostrarRemesa(false)}
                  className="px-4 py-2 rounded border text-gray-600 hover:bg-gray-100"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded text-white"
                  style={{ backgroundColor: sirelTheme.colors.primary }}
                >
                  Registrar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}