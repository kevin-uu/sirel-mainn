import React, { useEffect, useState } from "react";
import { listarPaises } from "../../api/paises";
import { obtenerSucursalesPorPais } from "../../api/auxiliares";
import { useBuscarCliente } from "../../hooks/useBuscarCliente";
import ClienteCard from "../Clientes/ClienteCard";
import FormCliente from "../Clientes/FormCliente";

export default function RemitenteSection({ setRemitenteSeleccionado }) {
  const remitenteHook = useBuscarCliente();
  const [sucursalesRemitente, setSucursalesRemitente] = useState([]);
  const [mostrarFormRemitente, setMostrarFormRemitente] = useState(false);
  const [paises, setPaises] = useState([]);
  const [mensajeCreado, setMensajeCreado] = useState(""); // 👈 nuevo estado

  // 📌 Cargar países al montar
  useEffect(() => {
  async function cargarPaises() {
    try {
      const r = await listarPaises();
      if (r.success) {
        setPaises(r.paises || []);
      }
    } catch (err) {
      console.error("Error cargando países:", err);
    }
  }
  cargarPaises();
}, []);


  // 📌 Cargar sucursales según país seleccionado
  useEffect(() => {
    const idPais = remitenteHook?.formCliente?.id_pais;
    if (idPais) {
      obtenerSucursalesPorPais(idPais)
        .then((r) => {
          if (r.success) setSucursalesRemitente(r.sucursales || []);
        })
        .catch((err) =>
          console.error("Error obtenerSucursales remitente:", err)
        );
    } else {
      setSucursalesRemitente([]);
    }
  }, [remitenteHook.formCliente?.id_pais]);

  const crearRemitente = async () => {
    try {
      await remitenteHook.crear();
      setRemitenteSeleccionado(remitenteHook.cliente);
      setMostrarFormRemitente(false);
      setMensajeCreado("Remitente creado correctamente ✅");

      // 👇 volver a ejecutar búsqueda con la identificación recién creada
      if (remitenteHook.identificacion) {
        await remitenteHook.buscar();
      }
    } catch (err) {
      alert(err.message || "Error creando remitente");
    }
  };

  return (
    <section>
      <h3 className="font-semibold text-gray-800">Remitente</h3>

      <div className="flex gap-2 items-center">
        <input
          value={remitenteHook.identificacion}
          onChange={(e) => remitenteHook.setIdentificacion(e.target.value)}
          placeholder="Identificación del remitente"
          className="border p-2 w-[60%]"
        />
        <button
          onClick={remitenteHook.buscar}
          disabled={!remitenteHook.identificacion || remitenteHook.cargando}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          {remitenteHook.cargando ? "Buscando..." : "Buscar"}
        </button>
      </div>

      {mensajeCreado && (
        <div className="mt-2 text-green-600">{mensajeCreado}</div>
      )}

      {remitenteHook.mensaje && !remitenteHook.cliente && (
        <div style={{ color: "orange" }}>{remitenteHook.mensaje}</div>
      )}

      {remitenteHook.cliente ? (
        <div>
          <ClienteCard cliente={remitenteHook.cliente} />
          <div className="mt-2">
            <button
              onClick={() => setRemitenteSeleccionado(remitenteHook.cliente)}
              className="bg-green-500 text-white px-3 py-1 rounded"
            >
              Seleccionar Remitente
            </button>
          </div>
        </div>
      ) : (
        <div className="mt-3">
          <button
            onClick={() => {
              remitenteHook.setFormCliente((prev) => ({
                ...prev,
                identificacion: remitenteHook.identificacion,
              }));
              setMostrarFormRemitente(true);
            }}
            className="bg-gray-200 px-3 py-1 rounded"
          >
            Crear remitente
          </button>

          {mostrarFormRemitente && (
            <FormCliente
              formCliente={remitenteHook.formCliente}
              handleChangeCliente={(e) =>
                remitenteHook.setFormCliente((prev) => ({
                  ...prev,
                  [e.target.name]: e.target.value,
                }))
              }
              onCrearCliente={crearRemitente}
              paises={paises}
              sucursales={sucursalesRemitente}
            />
          )}
        </div>
      )}
    </section>
  );
}