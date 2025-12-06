// 🎨 Tema visual para SIREL (colores y estilos base)
// Este archivo centraliza los colores y estilos principales
// para mantener coherencia visual en todo el sistema.

export const sirelTheme = {
    colors: {
        // Paleta base derivada del logo y paleta oficial
        primary: "#0b6c50", // verde principal (botones, acentos)
        secondary: "#06b9b6", // verde turquesa brillante (elementos destacados)
        dark: "#082644", // azul profundo (sidebar, texto principal)
        success: "#2c745e", // verde medio (reactivar, éxito)
        warning: "#11a18b", // verde lima (alertas suaves)
        light: "#f3f6f5", // fondo general claro
        white: "#ffffff", // fondo de tarjetas
    },

    typography: {
        fontFamily: 'Poppins, Nunito Sans, sans-serif',
        fontWeightNormal: 400,
        fontWeightMedium: 500,
        fontWeightBold: 700,
    },

    layout: {
        sidebar: {
        background: "#082644",
        text: "#ffffff",
        textActive: "#06b9b6",
        },
        header: {
        background: "linear-gradient(90deg, #0b6c50, #06b9b6)",
        text: "#ffffff",
        },
        card: {
        background: "#ffffff",
        border: "#e3e9e7",
        shadow: "rgba(0,0,0,0.1)",
        },
    },

    buttons: {
        primary: {
        background: "#0b6c50",
        hover: "#0c8e6c",
        text: "#ffffff",
        },
        secondary: {
        background: "#06b9b6",
        hover: "#0c8e6c",
        text: "#ffffff",
        },
        danger: {
        background: "#115642",
        hover: "#0b6c50",
        text: "#ffffff",
        },
        success: {
        background: "#2c745e",
        hover: "#11a18b",
        text: "#ffffff",
        },
    },
};

// 🧱 Ejemplo de uso en Tailwind o CSS-in-JS
// import { sirelTheme } from './theme';
// style={{ backgroundColor: sirelTheme.colors.primary }}
