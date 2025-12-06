import React, { useEffect, useState } from "react";
import { listarPaises } from "../../api/paises";
import { obtenerSucursalesPorPais } from "../../api/auxiliares";

import { useBuscarCliente } from "../../hooks/useBuscarCliente";
import ClienteCard from "../Clientes/ClienteCard";
import FormCliente from "../Clientes/FormCliente";

export default function DestinatarioSection({ setDestinatarioSeleccionado }) {
  const destinatarioHook = useBuscarCliente();
  const [sucursalesDestinatario, setSucursalesDestinatario] = useState([]);
  const [mostrarFormDestinatario, setMostrarFormDestinatario] = useState(false);
  const [mensajeCreado, setMensajeCreado] = useState(""); // 👈 nuevo estado
  const [paises, setPaises] = useState([]);

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
    const idPais = destinatarioHook?.formCliente?.id_pais;
    if (idPais) {
      obtenerSucursalesPorPais(idPais)
        .then((r) => {
          if (r.success) setSucursalesDestinatario(r.sucursales || []);
        })
        .catch((err) =>
          console.error("Error obtenerSucursales destinatario:", err)
        );
    } else {
      setSucursalesDestinatario([]);
    }
  }, [destinatarioHook.formCliente?.id_pais]);

  const crearDestinatario = async () => {
    try {
      await destinatarioHook.crear();
      setDestinatarioSeleccionado(destinatarioHook.cliente);
      setMostrarFormDestinatario(false);
      setMensajeCreado("Destinatario creado correctamente ✅");

      // 👇 volver a ejecutar búsqueda con la identificación recién creada
      if (destinatarioHook.identificacion) {
        await destinatarioHook.buscar();
      }
    } catch (err) {
      alert(err.message || "Error creando destinatario");
    }
  };

  return (
    <section>
      <h3 className="font-semibold text-gray-800">Destinatario</h3>

      <div className="flex gap-2 items-center">
        <input
          value={destinatarioHook.identificacion}
          onChange={(e) => destinatarioHook.setIdentificacion(e.target.value)}
          placeholder="Identificación del destinatario"
          className="border p-2 w-[60%]"
        />
        <button
          onClick={destinatarioHook.buscar}
          disabled={!destinatarioHook.identificacion || destinatarioHook.cargando}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          {destinatarioHook.cargando ? "Buscando..." : "Buscar"}
        </button>
      </div>

      {mensajeCreado && (
        <div className="mt-2 text-green-600">{mensajeCreado}</div>
      )}

      {destinatarioHook.mensaje && !destinatarioHook.cliente && (
        <div style={{ color: "orange" }}>{destinatarioHook.mensaje}</div>
      )}

      {destinatarioHook.cliente ? (
        <div>
          <ClienteCard cliente={destinatarioHook.cliente} />
          <div className="mt-2">
            <button
              onClick={() => setDestinatarioSeleccionado(destinatarioHook.cliente)}
              className="bg-green-500 text-white px-3 py-1 rounded"
            >
              Seleccionar Destinatario
            </button>
          </div>
        </div>
      ) : (
        <div className="mt-3">
          <button
            onClick={() => {
              destinatarioHook.setFormCliente((prev) => ({
                ...prev,
                identificacion: destinatarioHook.identificacion,
              }));
              setMostrarFormDestinatario(true);
            }}
            className="bg-gray-200 px-3 py-1 rounded"
          >
            Crear destinatario
          </button>

          {mostrarFormDestinatario && (
            <FormCliente
              formCliente={destinatarioHook.formCliente}
              handleChangeCliente={(e) =>
                destinatarioHook.setFormCliente((prev) => ({
                  ...prev,
                  [e.target.name]: e.target.value,
                }))
              }
              onCrearCliente={crearDestinatario}
              paises={paises}
              sucursales={sucursalesDestinatario}
            />
          )}
        </div>
      )}
    </section>
  );
}