import React from 'react';

/**
 * Componente de gráfico de barras simple para transacciones mensuales
 * @param {Object} props - Propiedades del componente
 * @param {Array} props.datos - Datos para el gráfico
 */
export default function BarChart({ datos = [] }) {
    // Datos de ejemplo si no hay datos reales
    const datosGrafico = datos;
    if (!datosGrafico.length) {
    return (
        <div className="h-full flex items-center justify-center text-gray-400">
        No hay transacciones mensuales para mostrar
        </div>
    );
}

    // Calcular valores máximos para escalar las barras
    const maxTransacciones = Math.max(...datosGrafico.map(d => d.transacciones));
    const maxMonto = Math.max(...datosGrafico.map(d => d.monto));

    return (
        <div className="w-full h-full">
        {/* Leyenda */}
        <div className="flex items-center justify-center space-x-6 mb-6">
            <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-500 rounded"></div>
            <span className="text-sm text-gray-600">Transacciones</span>
            </div>
            <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded"></div>
            <span className="text-sm text-gray-600">Monto (USD)</span>
            </div>
        </div>

        {/* Gráfico de barras */}
        <div className="flex items-end justify-between h-48 space-x-2">
            {datosGrafico.map((item, index) => {
            // Calcular alturas relativas para las barras
            const alturaTransacciones = (item.transacciones / maxTransacciones) * 100;
            const alturaMonto = (item.monto / maxMonto) * 100;

            return (
                <div key={index} className="flex flex-col items-center flex-1 space-y-1">
                {/* Barras */}
                <div className="flex items-end space-x-1 w-full justify-center">
                    {/* Barra de transacciones */}
                    <div 
                    className="w-4 bg-blue-500 rounded-t transition-all duration-500 hover:bg-blue-600 cursor-pointer"
                    style={{ height: `${alturaTransacciones}%` }}
                    title={`${item.transacciones} transacciones`}
                    ></div>
                    
                    {/* Barra de monto */}
                    <div 
                    className="w-4 bg-green-500 rounded-t transition-all duration-500 hover:bg-green-600 cursor-pointer"
                    style={{ height: `${alturaMonto}%` }}
                    title={`$${item.monto.toLocaleString()}`}
                    ></div>
                </div>
                
                {/* Etiqueta del mes */}
                <span className="text-xs text-gray-600 font-medium">
                    {item.mes}
                </span>
                
                {/* Valores numéricos */}
                <div className="text-center">
                    <p className="text-xs font-bold text-gray-900">
                    {item.transacciones}
                    </p>
                    <p className="text-xs text-gray-500">
                    ${(item.monto / 1000).toFixed(0)}K
                    </p>
                </div>
                </div>
            );
            })}
        </div>

        {/* Eje X */}
        <div className="mt-4 pt-2 border-t border-gray-200">
            <p className="text-center text-sm text-gray-600">
            Distribución mensual de transacciones
            </p>
        </div>
        </div>
    );
}