import { useState } from "react";
import { consultarRemesasPorIdentificacion, redimirRemesa } from "../api/remesas";

export function useRemesas() {
  const [remesas, setRemesas] = useState([]);
  const [mensaje, setMensaje] = useState("");

  const consultar = async (identificacion) => {
    if (!identificacion.trim()) {
      setMensaje("Debe ingresar un número de identificación válido");
      setRemesas([]);
      return;
    }

    setMensaje("Consultando...");
    try {
      const data = await consultarRemesasPorIdentificacion(identificacion);
      if (data.success) {
        setRemesas(data.remesas);
        setMensaje(`Total pendientes: ${data.total}`);
      } else {
        setRemesas([]);
        setMensaje(data.message);
      }
    } catch (err) {
      setRemesas([]);
      setMensaje("Error consultando remesas");
      console.error(err);
    }
  };

  const redimir = async (idRemesa, identificacion) => {
    setMensaje("Redimiendo...");
    try {
      const data = await redimirRemesa(idRemesa);
      setMensaje(data.message);
      if (data.success) {
        await consultar(identificacion); // refresca lista
      }
    } catch (err) {
      setMensaje("Error al redimir remesa");
      console.error(err);
    }
  };

  return { remesas, mensaje, consultar, redimir };
}