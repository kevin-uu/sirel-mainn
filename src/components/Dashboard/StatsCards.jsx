import React from 'react';

/**
 * Componente que muestra las tarjetas con estadísticas principales
 * @param {Object} props - Propiedades del componente
 * @param {Object} props.estadisticas - Objeto con las estadísticas a mostrar
 */
export default function StatsCards({ estadisticas }) {
    // Datos por defecto para evitar errores si estadisticas es null
    const datos = estadisticas || {
        totalUsuarios: 0,
        totalClientes: 0,
        transaccionesHoy: 0,
        montoTotalHoy: 0,
        usuariosActivos: 0,
        transaccionesMes: 0
    };

    /**
     * Array de tarjetas a mostrar con sus configuraciones
     * Cada tarjeta tiene: título, valor, ícono, color y descripción
     */
    const tarjetas = [
        {
        titulo: 'Total Usuarios',
        valor: datos.totalUsuarios,
        icono: '👥',
        color: 'from-blue-500 to-blue-600',
        descripcion: 'Usuarios registrados',
        cambio: '+12%'
        },
        {
        titulo: 'Clientes Activos',
        valor: datos.totalClientes,
        icono: '👤',
        color: 'from-green-500 to-green-600',
        descripcion: 'Clientes en sistema',
        cambio: '+5%'
        },
        {
        titulo: 'Transacciones Hoy',
        valor: datos.transaccionesHoy,
        icono: '💳',
        color: 'from-purple-500 to-purple-600',
        descripcion: 'Operaciones del día',
        cambio: '+8%'
        },
        {
        titulo: 'Monto Total',
        valor: `$${datos.montoTotalHoy?.toLocaleString() || '0'}`,
        icono: '💰',
        color: 'from-orange-500 to-orange-600',
        descripcion: 'Movimiento diario',
        cambio: '+15%'
        },

        {
        titulo: 'Usuarios Activos',
        valor: datos.usuariosActivos,
        icono: '✅',
        color: 'from-teal-500 to-teal-600',
        descripcion: 'Activos en el sistema',
        cambio: '+0%'
        },

        {
        titulo: 'Transacciones del Mes',
        valor: datos.transaccionesMes,
        icono: '📅',
        color: 'from-indigo-500 to-indigo-600',
        descripcion: 'Operaciones este mes',
        cambio: '+0%'
        }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {tarjetas.map((tarjeta, index) => (
            <div 
            key={index}
            className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-300 transform hover:-translate-y-1"
            >
            <div className="flex items-center justify-between mb-4">
                {/* Ícono con gradiente */}
                <div className={`w-12 h-12 bg-gradient-to-r ${tarjeta.color} rounded-xl flex items-center justify-center text-white text-lg`}>
                {tarjeta.icono}
                </div>
                
                {/* Indicador de cambio */}
                <span className="text-xs font-medium bg-green-100 text-green-800 px-2 py-1 rounded-full">
                {tarjeta.cambio}
                </span>
            </div>

            {/* Valor principal */}
            <h3 className="text-2xl font-bold text-gray-900 mb-1">
                {tarjeta.valor}
            </h3>

            {/* Título y descripción */}
            <p className="text-sm font-medium text-gray-900 mb-1">
                {tarjeta.titulo}
            </p>
            <p className="text-xs text-gray-500">
                {tarjeta.descripcion}
            </p>

            {/* Línea decorativa inferior */}
            <div className={`mt-4 h-1 bg-gradient-to-r ${tarjeta.color} rounded-full`}></div>
            </div>
        ))}
        </div>
    );
}