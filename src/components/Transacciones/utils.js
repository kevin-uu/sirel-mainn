export const normalizarApiAFormCliente = (apiData) => {
  if (!apiData) return {};
  return {
    id_persona: apiData.id_persona ?? apiData.Id_Persona ?? null,
    identificacion: apiData.identificacion ?? apiData.Identificacion ?? "",
    nombre: apiData.nombre ?? apiData.Nombre ?? "",
    apellido: apiData.apellido ?? apiData.Apellido ?? "",
    fecha_nacimiento: apiData.fecha_nacimiento ?? apiData.Fecha_Nacimiento ?? "",
    telefono: apiData.telefono
      ? parseInt(apiData.telefono, 10)
      : apiData.Telefono
      ? parseInt(apiData.Telefono, 10)
      : 0,
    correo: apiData.correo ?? apiData.Email ?? apiData.email ?? "",
    direccion: apiData.direccion ?? apiData.Direccion ?? "",
    id_pais: apiData.id_pais ?? apiData.Id_Pais ?? "",
    id_sucursal: apiData.id_sucursal ?? apiData.Id_Sucursal ?? "",
    id_parentesco: apiData.id_parentesco ?? apiData.Id_Parentesco ?? null,
    pais_destino: apiData.pais_destino ?? apiData.Pais_Destino ?? null,
  };
};