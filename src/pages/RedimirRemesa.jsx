import React, { useState } from "react";
import { useRemesas } from "../hooks/useRemesas";
import FacturaEntregaView from "./FacturaEntregadaView"; // 🔹 Nuevo componente

export default function RedimirRemesa() {
  const [identificacion, setIdentificacion] = useState("");
  const [remesaSeleccionada, setRemesaSeleccionada] = useState(null);
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);
  const [facturaEntregaId, setFacturaEntregaId] = useState(null);

  const { remesas, mensaje, consultar, redimir } = useRemesas();

  const handleConsultar = () => {
    if (!identificacion.trim()) {
      alert("Debe ingresar una identificación válida");
      return;
    }
    consultar(identificacion);
  };

  const handleEntregarClick = (remesa) => {
    setRemesaSeleccionada(remesa);
    setMostrarConfirmacion(true);
  };

  const handleConfirmarEntrega = async () => {
    if (remesaSeleccionada) {
      await redimir(remesaSeleccionada.Id_Remesa, identificacion);
      setFacturaEntregaId(remesaSeleccionada.Id_Remesa); // 🔹 Generar Factura Parte 2
    }
    setMostrarConfirmacion(false);
    setRemesaSeleccionada(null);
  };

  return (
    <section className="p-6 rounded-xl shadow bg-white border border-gray-200">
      <h3 className="text-xl font-bold text-gray-800 mb-4">🧾 Redimir Remesa</h3>

      {/* Input de búsqueda */}
      <div className="flex gap-2 mb-4">
        <input
          value={identificacion}
          onChange={(e) => setIdentificacion(e.target.value)}
          placeholder="Identificación del destinatario"
          className="border p-2 rounded w-full focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleConsultar}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition"
        >
          Consultar
        </button>
      </div>

      {/* Mensaje */}
      {mensaje && (
        <div
          className={`mt-2 px-4 py-2 rounded ${
            mensaje.includes("Error")
              ? "bg-red-100 text-red-700"
              : "bg-green-100 text-green-700"
          }`}
        >
          {mensaje}
        </div>
      )}

      {/* Tabla de resultados */}
      {remesas.length > 0 && (
        <div className="overflow-x-auto mt-6">
          <table className="w-full border-collapse rounded-lg overflow-hidden shadow text-sm">
            <thead>
              <tr className="bg-gray-100 text-gray-700">
                <th className="border p-2">Destinatario</th>
                <th className="border p-2">Identificación</th>
                <th className="border p-2">Remitente</th>
                <th className="border p-2">Monto Final</th>
                <th className="border p-2">Acción</th>
              </tr>
            </thead>
            <tbody>
              {remesas.map((r, idx) => (
                <tr
                  key={r.Id_Remesa}
                  className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}
                >
                  <td className="border p-2">{r.Destinatario}</td>
                  <td className="border p-2">{r.Destinatario_Identificacion}</td>
                  <td className="border p-2">{r.Remitente}</td>
                  <td className="border p-2 text-green-700 font-bold">
                    {r.Monto_Final} {r.Moneda_Destino}
                  </td>
                  <td className="border p-2 text-center">
                    <button
                      onClick={() => handleEntregarClick(r)}
                      className="bg-green-600 text-white px-3 py-1 rounded-lg shadow hover:bg-green-700 transition"
                    >
                      ✅ Entregar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal de confirmación con fondo transparente */}
      {mostrarConfirmacion && remesaSeleccionada && (
        <div className="fixed inset-0 bg-gray-200 bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">
              Confirmar entrega
            </h2>
            <p className="mb-2">
              <strong>Remitente:</strong> {remesaSeleccionada.Remitente} (
              {remesaSeleccionada.Remitente_Identificacion})
            </p>
            <p className="mb-2">
              <strong>Monto a entregar:</strong>{" "}
              <span className="text-green-700 font-bold">
                {remesaSeleccionada.Monto_Final} {remesaSeleccionada.Moneda_Destino}
              </span>
            </p>
            <div className="flex justify-end gap-4 mt-4">
              <button
                onClick={() => setMostrarConfirmacion(false)}
                className="px-4 py-2 rounded border text-gray-600 hover:bg-gray-100"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmarEntrega}
                className="px-4 py-2 rounded text-white bg-green-600 hover:bg-green-700"
              >
                Confirmar entrega
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Factura Parte 2 */}
      {facturaEntregaId && (
        <FacturaEntregaView idRemesa={facturaEntregaId} />
      )}
    </section>
  );
}