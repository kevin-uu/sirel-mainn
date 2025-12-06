import { useState } from "react";
import {
  buscarClientePorIdentificacion,
  crearClienteConUsuario,
} from "../api/clientes";

export function useBuscarCliente(initialIdentificacion = "") {
  const [identificacion, setIdentificacion] = useState(initialIdentificacion);
  const [cliente, setCliente] = useState(null);
  const [mensaje, setMensaje] = useState("");
  const [cargando, setCargando] = useState(false);
  const [formCliente, setFormCliente] = useState({
    nombre: "",
    apellido: "",
    fecha_nacimiento: "",
    identificacion: initialIdentificacion,
    telefono: "",
    email: "",
    direccion: "",
    id_pais: "",
    id_sucursal: 1,
  });
const reset = () => {
    setIdentificacion("");
    setCliente(null);
    setMensaje("");
    setFormCliente({
      nombre: "",
      apellido: "",
      fecha_nacimiento: "",
      identificacion: "",
      telefono: "",
      email: "",
      direccion: "",
      id_pais: "",
      id_sucursal: 1,
    });
  };

  const buscar = async () => {
    if (!identificacion) {
      setMensaje("Ingrese identificación para buscar");
      setCliente(null);
      return;
    }
    setCargando(true);
    try {
      const res = await buscarClientePorIdentificacion(identificacion);
      if (res && res.success && res.cliente) {
        const c = res.cliente;
        setCliente({
          Id_Usuario: c.Id_Usuario,
          Id_Persona: c.Id_Persona,
          nombre: c.Nombre,
          apellido: c.Apellido,
          fecha_nacimiento: c.Fecha_Nacimiento,
          identificacion: c.Identificacion,
          telefono: c.Telefono,
          email: c.Email,
          direccion: c.Direccion,
          Id_Pais: c.Id_Pais,
          Id_Sucursal: c.Id_Sucursal,
        });
        setMensaje("");
      } else {
        setCliente(null);
        setMensaje(res?.message || "Usuario no encontrado");
        setFormCliente((prev) => ({ ...prev, identificacion }));
      }
    } catch (err) {
      setCliente(null);
      setMensaje(err?.message || "Error buscando cliente");
    } finally {
      setCargando(false);
    }
  };

  const crear = async () => {
    const camposObligatorios = [
      "nombre",
      "apellido",
      "fecha_nacimiento",
      "identificacion",
      "telefono",
      "email",
      "direccion",
      "id_pais",
    ];
    const incompletos = camposObligatorios.some((k) => !formCliente[k]);
    if (incompletos) {
      throw new Error("Por favor complete todos los campos obligatorios");
    }

    setCargando(true);
    try {
      const res = await crearClienteConUsuario(formCliente);
      if (res && res.success) {
        setCliente({
          Id_Usuario: res.usuario_id,
          Id_Persona: res.persona_id,
          ...formCliente,
          Id_Pais: formCliente.id_pais,
          Id_Sucursal: formCliente.id_sucursal,
        });
        setMensaje("");
        return res;
      } else {
        throw new Error(res?.message || "Error creando cliente");
      }
    } finally {
      setCargando(false);
    }
  };

  return {
    identificacion,
    setIdentificacion,
    cliente,
    mensaje,
    cargando,
    formCliente,
    setFormCliente,
    buscar,
    crear,
  };
}
