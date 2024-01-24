import fs from 'node:fs';
import path from 'node:path';

export async function downloadPageAsPDF(page, browser, baseUrl, cookiesData) {
	try {
		const pageInstance = await browser.newPage();
		const url = baseUrl + page.target;

		await pageInstance.setCookie(...cookiesData);
		await pageInstance.goto(url, { waitUntil: 'domcontentloaded' });

		const pdfPath = path.join(path.dirname(page.target), `${path.basename(page.target, '.html')}.pdf`);
		await pageInstance.pdf({ path: pdfPath, format: 'A4' });

		console.log(`Converted to PDF: ${pdfPath}`);
		await pageInstance.close();
	} catch (error) {
		console.error(`Error converting ${page.target} to PDF: ${error.message}`);
	}
}
