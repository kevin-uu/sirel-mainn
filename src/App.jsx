import React, { useState, useEffect } from "react";
import Login from "./pages/login";
import Dashboard from "./pages/Dashboard";
import Layout from "./components/Layout/Layout";
import UsuariosPage from "./components/Usuarios/UsuariosPage";
import { cerrarSesion as cerrarSesionAPI, verificarSesion } from "./api/auth"; // 🔹 importar
import Transacciones from "./pages/Transacciones";
import RedimirRemesaPage from "./pages/RedimirRemesa";
import PaisesPage from "./pages/PaisesPage";
import MaestroFinancieroPage from "./pages/MaestroFinancieroPage";

export default function App() {
  const [usuario, setUsuario] = useState(null);
  const [paginaActual, setPaginaActual] = useState("dashboard");
  const [verificandoSesion, setVerificandoSesion] = useState(true);

  // 🔍 Verificar sesión activa en la base de datos
  useEffect(() => {
    const guardado = localStorage.getItem("usuario");
    if (!guardado) {
      setVerificandoSesion(false);
      return;
    }

    const datos = JSON.parse(guardado);
    const sesion_id = datos?.sesion_id;

    if (!sesion_id) {
      localStorage.removeItem("usuario");
      setVerificandoSesion(false);
      return;
    }

    verificarSesion(sesion_id) // 🔹 usar función de auth.js
      .then((data) => {
        if (data.success && data.usuario) {
          localStorage.setItem("usuario", JSON.stringify(data.usuario));
          setUsuario(data.usuario);
        } else {
          localStorage.removeItem("usuario");
          setUsuario(null);
        }
        setVerificandoSesion(false);
      })
      .catch(() => {
        localStorage.removeItem("usuario");
        setUsuario(null);
        setVerificandoSesion(false);
      });
  }, []);

  const cerrarSesion = async () => {
    const datos = JSON.parse(localStorage.getItem("usuario"));
    if (datos?.sesion_id) {
      await cerrarSesionAPI(datos.sesion_id);
    }
    localStorage.removeItem("usuario");
    setUsuario(null);
  };

  const tieneAcceso = (pagina) => {
    if (!usuario) return false;
    return usuario.permisos?.includes(pagina);
  };

  const renderPaginaActual = () => {
    if (!tieneAcceso(paginaActual)) {
      return (
        <div className="flex items-center justify-center min-h-screen text-gray-600">
          🚫 No tienes permisos para acceder a esta sección.
        </div>
      );
    }

    switch (paginaActual) {
      case "dashboard":
        return <Dashboard usuario={usuario} />;
      case "usuarios":
        return <UsuariosPage />;
      case "transacciones":
        return <Transacciones />;
      case "redimir":
        return <RedimirRemesaPage />;
      case "paises":
        return <PaisesPage />;
      case "maestro_financiero":
        return <MaestroFinancieroPage />;
      default:
        return <Transacciones />;
    }
  };

  if (verificandoSesion) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-500">
        ⏳ Verificando sesión...
      </div>
    );
  }

  if (!usuario) {
    return (
      <Login
        onLogin={(user) => {
          localStorage.setItem("usuario", JSON.stringify(user));
          setUsuario(user);
          setPaginaActual("dashboard");
        }}
      />
    );
  }

  return (
    <Layout
      usuario={usuario}
      onCerrarSesion={cerrarSesion}
      onPaginaCambio={setPaginaActual}
      paginaActual={paginaActual}
    >
      {renderPaginaActual()}
    </Layout>
  );
}