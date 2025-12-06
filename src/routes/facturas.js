const { generarPdfDesdeHtml } = require('../pdf/generarPdf');

router.get('/remesa/:id/pdf', async (req, res) => {
  const html = "<html>...</html>"; // tu HTML armado
  const pdfBuffer = await generarPdfDesdeHtml(html);

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'inline; filename="factura.pdf"');
  res.send(pdfBuffer);
});
