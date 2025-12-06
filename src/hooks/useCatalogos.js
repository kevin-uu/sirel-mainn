import { useEffect, useState } from "react";
import { obtenerPaises, obtenerSucursalesPorPais, obtenerParentescos } from "../api/auxiliares";

export function useCatalogos() {
  const [paises, setPaises] = useState([]);
  const [sucursales, setSucursales] = useState([]);
  const [parentescos, setParentescos] = useState([]);
  const [cargando, setCargando] = useState(false);

 useEffect(() => {
  let mounted = true;
  setCargando(true);
  Promise.all([obtenerPaises(), obtenerParentescos()])
    .then(([rp, rpar]) => {
      if (!mounted) return;
      if (rp?.success) setPaises(rp.paises || []);
      if (rpar?.success) {
        const normalizados = (rpar.parentescos || []).map(p => ({
          id_parentesco: p.Id_Parentesco,
          tipo: p.Tipo,
          descripcion: p.Descripcion,
        }));
        setParentescos(normalizados);
      }
    })
    .finally(() => mounted && setCargando(false));
  return () => {
    mounted = false;
  };
}, []);


  const cargarSucursales = async (id_pais) => {
    if (!id_pais) {
      setSucursales([]);
      return;
    }
    const res = await obtenerSucursalesPorPais(id_pais);
    if (res && res.success) setSucursales(res.sucursales || []);
    else setSucursales([]);
  };

  return {
    paises,
    sucursales,
    parentescos,
    cargarSucursales,
    cargando,
  };
}