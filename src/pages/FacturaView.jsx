import { useEffect, useState } from "react";
import { generarFacturaPdf } from "../api/facturas";

export default function FacturaView({ idRemesa }) {
  const [pdfUrl, setPdfUrl] = useState(null);

  useEffect(() => {
    if (!idRemesa) return;
    generarFacturaPdf(idRemesa).then((url) => {
      if (url) setPdfUrl(url);
    });
  }, [idRemesa]);

  if (!pdfUrl) return <p>Generando factura...</p>;

  return (
    <div>
      <iframe src={pdfUrl} width="100%" height="600px" title="Factura PDF" />
      <button
        className="bg-blue-600 text-white px-4 py-2 rounded mt-2"
        onClick={() => window.open(pdfUrl).print()}
      >
        🖨️ Imprimir
      </button>
    </div>
  );
}