const puppeteer = require('puppeteer');

async function generarPdfDesdeHtml(html) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: 'networkidle0' });
  const pdf = await page.pdf({ format: 'A4', printBackground: true });
  await browser.close();
  return pdf;
}

module.exports = { generarPdfDesdeHtml };
