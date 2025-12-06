import React, { useState, useEffect } from "react";
import {
  registrarRemesa,
  obtenerMonedas,
  consultarComision,
} from "../../api/remesas";
import { consultarTasaCambio } from "../../api/tasacambio"; // ✅ nuevo helper

export default function RegistrarRemesa({
  remitente,
  destinatario,
  onClose,
  onGuardado,
}) {
  const [form, setForm] = useState({
    monto: "",
    id_moneda_origen: "",
    id_moneda_destino: "",
    tasa_cambio: "",
    comision: "",
    detalle: "",
  });

  const [monedas, setMonedas] = useState([]);
  const [loadingComision, setLoadingComision] = useState(false);
  const [loadingTasa, setLoadingTasa] = useState(false);

  // Cargar monedas disponibles
  useEffect(() => {
    obtenerMonedas().then((res) => {
      if (res.success) setMonedas(res.monedas || []);
      else alert("Error al cargar monedas");
    });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Consultar tasa de cambio automáticamente
  useEffect(() => {
    const { id_moneda_origen, id_moneda_destino } = form;
    if (!id_moneda_origen || !id_moneda_destino) return;

    setLoadingTasa(true);

    consultarTasaCambio(
      parseInt(id_moneda_origen),
      parseInt(id_moneda_destino)
    ).then((res) => {
      if (res.success) {
        setForm((prev) => ({ ...prev, tasa_cambio: res.Tasa }));
      } else {
        setForm((prev) => ({ ...prev, tasa_cambio: "" }));
        alert(res.message);
      }
      setLoadingTasa(false);
    });
  }, [form.id_moneda_origen, form.id_moneda_destino]);

  // Calcular comisión automáticamente
  useEffect(() => {
    const { monto, id_moneda_origen, id_moneda_destino } = form;
    if (!monto || !id_moneda_origen || !id_moneda_destino) return;

    const paisOrigen = monedas.find(
      (m) => m.Id_Moneda == id_moneda_origen
    )?.Id_Pais;
    const paisDestino = monedas.find(
      (m) => m.Id_Moneda == id_moneda_destino
    )?.Id_Pais;

    if (!paisOrigen || !paisDestino) return;

    setLoadingComision(true);
    consultarComision(paisOrigen, paisDestino, parseFloat(monto)).then(
      (res) => {
        console.log("Respuesta comisión:", res);
        if (res.success) {
          const porcentaje = parseFloat(res.Porcentaje ?? res.porcentaje);
          console.log("Porcentaje leído:", porcentaje);

          if (!isNaN(porcentaje)) {
            const comisionCalculada = (
              (porcentaje / 100) *
              parseFloat(monto)
            ).toFixed(2);
            setForm((prev) => ({ ...prev, comision: comisionCalculada }));
          } else {
            setForm((prev) => ({ ...prev, comision: "" }));
          }
        } else {
          setForm((prev) => ({ ...prev, comision: "" }));
          alert(res.message);
        }
        setLoadingComision(false);
      }
    );
  }, [form.monto, form.id_moneda_origen, form.id_moneda_destino]);

  const handleSubmit = async (e) => {
  e.preventDefault();

  const usuario = JSON.parse(localStorage.getItem("usuario"));

  const payload = {
    id_usuario: parseInt(usuario.Id_Usuario),
    id_remitente: remitente.Id_Persona,
    id_destinatario: destinatario.Id_Persona,
    monto: parseFloat(form.monto),
    id_moneda_origen: parseInt(form.id_moneda_origen),
    id_moneda_destino: parseInt(form.id_moneda_destino),
    tasa_cambio: parseFloat(form.tasa_cambio),
    comision: parseFloat(form.comision),
    id_pais_origen: parseInt(remitente.Id_Pais),
    id_pais_destino: parseInt(destinatario.Id_Pais),
    detalle: form.detalle,
  };

  const res = await registrarRemesa(payload);
  alert(res.message);

  if (res.success) {
    // 🔹 Resetear formulario
    setForm({
      monto: "",
      id_moneda_origen: "",
      id_moneda_destino: "",
      tasa_cambio: "",
      comision: "",
      detalle: "",
    });

    // 🔹 Pasar el Id_Remesa al padre para que invoque la factura
    if (onGuardado) onGuardado(res.Id_Remesa);

    if (onClose) onClose();
  }
};

  return (
    <div className="space-y-6">
      

      {/* Formulario de remesa */}
      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
        <input
          name="monto"
          type="number"
          step="0.01"
          placeholder="Monto"
          value={form.monto}
          onChange={handleChange}
          required
          className="border p-2 rounded"
        />

        <select
          name="id_moneda_origen"
          value={form.id_moneda_origen}
          onChange={handleChange}
          required
          className="border p-2 rounded"
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
          className="border p-2 rounded"
        >
          <option value="">Moneda Destino</option>
          {monedas.map((m) => (
            <option key={m.Id_Moneda} value={m.Id_Moneda}>
              {m.Nombre_Moneda} ({m.Simbolo})
            </option>
          ))}
        </select>

        {/* Tasa de cambio consultada automáticamente */}
        <input
          name="tasa_cambio"
          type="number"
          step="0.000001"
          placeholder="Tasa Cambio"
          value={form.tasa_cambio}
          readOnly
          required
          className="border p-2 rounded bg-gray-100"
        />

        {/* Comisión calculada automáticamente */}
        <input
          name="comision"
          type="number"
          step="0.01"
          placeholder="Comisión"
          value={form.comision}
          readOnly
          required
          className="border p-2 rounded bg-gray-100"
        />

        <input
          name="detalle"
          placeholder="Detalle"
          value={form.detalle}
          onChange={handleChange}
          className="border p-2 rounded col-span-2"
        />

        <button
          type="submit"
          className="col-span-2 bg-blue-600 text-white p-2 rounded"
          disabled={loadingComision || loadingTasa}
        >
          Registrar Remesa
        </button>
      </form>
    </div>
  );
}
