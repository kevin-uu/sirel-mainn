import { useEffect, useState } from "react";
import { generarFacturaEntregaPdf } from "../api/facturas"; // 🔹 Nuevo endpoint para la factura de entrega

export default function FacturaEntregaView({ idRemesa }) {
  const [pdfUrl, setPdfUrl] = useState(null);

  useEffect(() => {
    if (!idRemesa) return;
    generarFacturaEntregaPdf(idRemesa).then((url) => {
      if (url) setPdfUrl(url);
    });
  }, [idRemesa]);

  if (!pdfUrl) return <p>Generando factura de entrega...</p>;

  return (
    <div className="mt-6">
      <h3 className="text-lg font-bold text-gray-800 mb-2">
        📄 Factura de Remesa
      </h3>
      <iframe src={pdfUrl} width="100%" height="600px" title="Factura Entrega PDF" />
      <button
        className="bg-blue-600 text-white px-4 py-2 rounded mt-2"
        onClick={() => window.open(pdfUrl).print()}
      >
        🖨️ Imprimir
      </button>
    </div>
  );
}