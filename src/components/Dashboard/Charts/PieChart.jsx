import React from 'react';

/**
 * Componente de gráfico circular simple para distribución de usuarios por rol
 * @param {Object} props - Propiedades del componente
 * @param {Array} props.datos - Datos para el gráfico
 */
export default function PieChart({ datos = [] }) {
    // Datos de ejemplo si no hay datos reales
    const datosGrafico = datos;
    if (!datosGrafico.length) {
    return (
        <div className="h-full flex items-center justify-center text-gray-400">
        No hay datos de usuarios por rol para mostrar
        </div>
    );
}

    // Calcular total para porcentajes
    const total = datosGrafico.reduce((sum, item) => sum + item.cantidad, 0);

    return (
        <div className="w-full h-full">
        {/* Gráfico y leyenda en grid responsive */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-center">
            {/* Gráfico circular */}
            <div className="relative w-32 h-32 mx-auto lg:mx-0">
            {/* Contenedor del gráfico */}
            <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                {datosGrafico.reduce((acc, item, index) => {
                const porcentaje = (item.cantidad / total) * 100;
                const radio = 40; // Radio del círculo
                const circunferencia = 2 * Math.PI * radio;
                const offset = circunferencia - (porcentaje / 100) * circunferencia;

                // Acumular el offset para el siguiente segmento
                const offsetAcumulado = acc.offsetAcumulado;

                const segmento = (
                    <circle
                    key={index}
                    cx="50"
                    cy="50"
                    r={radio}
                    fill="transparent"
                    stroke={item.color}
                    strokeWidth="20"
                    strokeDasharray={circunferencia}
                    strokeDashoffset={offsetAcumulado}
                    className="transition-all duration-1000 ease-out"
                    />
                );

                return {
                    offsetAcumulado: offsetAcumulado + offset,
                    segments: [...acc.segments, segmento]
                };
                }, { offsetAcumulado: 0, segments: [] }).segments}
            </svg>

            {/* Texto central */}
            <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                <div className="text-lg font-bold text-gray-900">{total}</div>
                <div className="text-xs text-gray-600">Total</div>
                </div>
            </div>
            </div>

            {/* Leyenda */}
            <div className="space-y-3">
            {datosGrafico.map((item, index) => {
                const porcentaje = ((item.cantidad / total) * 100).toFixed(1);
                
                return (
                <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                    {/* Color indicator */}
                    <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: item.color }}
                    ></div>
                    
                    {/* Rol */}
                    <span className="text-sm text-gray-700 font-medium">
                        {item.rol}
                    </span>
                    </div>
                    
                    {/* Porcentaje y cantidad */}
                    <div className="text-right">
                    <div className="text-sm font-bold text-gray-900">
                        {item.cantidad}
                    </div>
                    <div className="text-xs text-gray-500">
                        {porcentaje}%
                    </div>
                    </div>
                </div>
                );
            })}
            </div>
        </div>

        {/* Información adicional */}
        <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
            Distribución de {total} usuarios en el sistema
            </p>
        </div>
        </div>
    );
}