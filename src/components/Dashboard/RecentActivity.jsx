import React from 'react';

/**
 * Componente que muestra la actividad reciente del sistema
 * @param {Object} props - Propiedades del componente
 * @param {Array} props.actividad - Array de actividades recientes
 */
export default function RecentActivity({ actividad = [] }) {
    // Datos de ejemplo si no hay actividad real
    const actividades = actividad.length > 0 ? actividad : [
        {
        id: 1,
        usuario: 'Admin Sistema',
        accion: 'Usuario registrado',
        objetivo: 'Juan Pérez',
        tiempo: 'Hace 5 min',
        tipo: 'usuario'
        },
        {
        id: 2,
        usuario: 'María López',
        accion: 'Transacción completada',
        objetivo: '#TRX-001',
        tiempo: 'Hace 15 min',
        tipo: 'transaccion'
        },
        {
        id: 3,
        usuario: 'Carlos Ruiz',
        accion: 'Cliente agregado',
        objetivo: 'Ana Martínez',
        tiempo: 'Hace 1 hora',
        tipo: 'cliente'
        },
        {
        id: 4,
        usuario: 'Sistema',
        accion: 'Backup realizado',
        objetivo: 'Base de datos',
        tiempo: 'Hace 2 horas',
        tipo: 'sistema'
        }
    ];

    /**
     * Función para obtener el ícono según el tipo de actividad
     * @param {String} tipo - Tipo de actividad
     * @returns {String} Emoji del ícono
     */
    const obtenerIcono = (tipo) => {
        const iconos = {
        usuario: '👤',
        transaccion: '💳',
        cliente: '👥',
        sistema: '⚙️',
        default: '📝'
        };
        return iconos[tipo] || iconos.default;
    };

    /**
     * Función para obtener el color según el tipo de actividad
     * @param {String} tipo - Tipo de actividad
     * @returns {String} Clases CSS del color
     */
    const obtenerColor = (tipo) => {
        const colores = {
        usuario: 'bg-blue-100 text-blue-800',
        transaccion: 'bg-green-100 text-green-800',
        cliente: 'bg-purple-100 text-purple-800',
        sistema: 'bg-orange-100 text-orange-800',
        default: 'bg-gray-100 text-gray-800'
        };
        return colores[tipo] || colores.default;
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        {/* Header de la sección */}
        <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">
            Actividad Reciente
            </h3>
            <span className="text-xs font-medium bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
            {actividades.length} actividades
            </span>
        </div>

        {/* Lista de actividades */}
        <div className="space-y-4">
            {actividades.map((item) => (
            <div 
                key={item.id}
                className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200"
            >
                {/* Ícono de la actividad */}
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${obtenerColor(item.tipo)}`}>
                {obtenerIcono(item.tipo)}
                </div>

                {/* Contenido de la actividad */}
                <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">
                    {item.usuario}
                </p>
                <p className="text-sm text-gray-600">
                    {item.accion} - <span className="font-medium">{item.objetivo}</span>
                </p>
                <p className="text-xs text-gray-500 mt-1">
                    {item.tiempo}
                </p>
                </div>

                {/* Indicador de estado */}
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
            </div>
            ))}
        </div>

        {/* Footer con enlace ver todo */}
        <div className="mt-6 pt-4 border-t border-gray-200">
            <button className="w-full text-center text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200">
            Ver toda la actividad →
            </button>
        </div>
        </div>
    );
}