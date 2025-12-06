import React, { useState } from "react";
import { useBuscarDestinatario } from "../../hooks/useBuscarDestinatario";
import { useCatalogos } from "../../hooks/useCatalogos";

export default function ConsultaVinculacion({
  remitenteSeleccionado,
  destinatarioSeleccionado,
  onVinculacionConfirmada, // ✅ nuevo prop
}) {
  const buscadorDest = useBuscarDestinatario();
  const { parentescos } = useCatalogos();

  const [consultaResultado, setConsultaResultado] = useState(null);
  const [consultaCargando, setConsultaCargando] = useState(false);
  const [consultaError, setConsultaError] = useState(null);

  const [formData, setFormData] = useState({ id_parentesco: "" });

  const resolverIdPersonaDestinatario = () =>
    destinatarioSeleccionado?.id_persona ??
    destinatarioSeleccionado?.Id_Persona ??
    null;

  const resolverIdUsuarioRemitente = () =>
    remitenteSeleccionado?.id_usuario ?? remitenteSeleccionado?.Id_Usuario ?? 0;

  const resolverPaisDestinatario = () =>
    destinatarioSeleccionado?.id_pais ??
    destinatarioSeleccionado?.Id_Pais ??
    null;

  const consultarVinculacion = async () => {
    setConsultaError(null);
    setConsultaResultado(null);

    const idPersonaDest = resolverIdPersonaDestinatario();
    const idUsuarioRem = resolverIdUsuarioRemitente();

    if (!idUsuarioRem) {
      setConsultaError("Seleccione un remitente válido para consultar.");
      return;
    }
    if (!idPersonaDest) {
      setConsultaError("Seleccione un destinatario válido para consultar.");
      return;
    }
    setConsultaCargando(true);
    try {
      const resp = await buscadorDest.buscarPorIds(idPersonaDest, idUsuarioRem);
      if (!resp || resp.success !== 1) {
        setConsultaError(resp.message || "Error en la consulta al servidor");
        setConsultaCargando(false);
        return;
      }

      const d = resp.data;
      const status = d.Estado ?? d.estado;

      setConsultaResultado({
        status,
        data: d,
        enableVincular: status === "NO_DESTINATARIO",
      });

      // ✅ Si el parentesco ya existe, confirmamos vinculación
      if (status !== "NO_DESTINATARIO" && onVinculacionConfirmada) {
        onVinculacionConfirmada();
      }

      setConsultaCargando(false);
    } catch (err) {
      setConsultaCargando(false);
      setConsultaError("Error al consultar vinculación");
      console.error("Error consultar vinculación:", err);
    }
  };

  const handleCrearDestinatario = async () => {
    const idPersona = resolverIdPersonaDestinatario();
    const idUsuario = resolverIdUsuarioRemitente();
    const paisDestino = resolverPaisDestinatario();

    try {
      const resp = await buscadorDest.crearDestinatario({
        id_persona: idPersona,
        id_usuario: idUsuario,
        id_parentesco: formData.id_parentesco,
        pais_destino: paisDestino,
      });

      if (resp.success) {
        setConsultaResultado({
          status: "DESTINATARIO",
          data: resp.data,
          enableVincular: false,
        });

        // ✅ Al crear destinatario, confirmamos vinculación
        if (onVinculacionConfirmada) {
          onVinculacionConfirmada();
        }
      } else {
        setConsultaError(resp.message || "Error creando destinatario");
      }
    } catch (err) {
      setConsultaError("Error creando destinatario");
      console.error("Error creando destinatario:", err);
    }
  };

  return (
    <section>
      <h3 className="font-semibold text-gray-800">Consultar Parentesco</h3>

      <div className="flex gap-2 items-center">
        <button
          onClick={consultarVinculacion}
          disabled={consultaCargando}
          className="bg-indigo-600 text-white px-4 py-2 rounded"
        >
          {consultaCargando ? "Consultando..." : "Consultar"}
        </button>
      </div>

      {consultaError && (
        <div className="mt-2 text-red-600">{consultaError}</div>
      )}

      {consultaResultado && (
        <div className="mt-4 p-3 border rounded bg-gray-50">
          <div>
            <strong>Estado:</strong> {consultaResultado.status}
          </div>

          {consultaResultado.data ? (
            <>
              <div>
                <strong>Parentesco:</strong>{" "}
                {(() => {
                  const idPar =
                    consultaResultado.data.Id_Parentesco ??
                    consultaResultado.data.id_parentesco;
                  const encontrado = parentescos.find(
                    (p) => p.id_parentesco === Number(idPar)
                  );
                  return encontrado ? encontrado.tipo : "—";
                })()}
              </div>
            </>
          ) : (
            <div className="text-orange-600 mt-1">
              Parentezco creado, estado: {consultaResultado.status}
            </div>
          )}

          {consultaResultado.status === "NO_DESTINATARIO" && (
            <div className="mt-3">
              <h4 className="font-semibold">Crear nuevo destinatario</h4>
              <div className="flex flex-col gap-2 mt-2">
                <select
                  value={formData.id_parentesco}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      id_parentesco: Number(e.target.value),
                    })
                  }
                  className="border p-2"
                >
                  <option value="">Seleccione parentesco</option>
                  {parentescos.map((p) => (
                    <option key={p.id_parentesco} value={p.id_parentesco}>
                      {p.tipo}
                    </option>
                  ))}
                </select>

                <button
                  onClick={handleCrearDestinatario}
                  className="bg-green-600 text-white px-3 py-1 rounded"
                >
                  Crear Destinatario
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
