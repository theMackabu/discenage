import fs from 'node:fs';
import { PDFDocument } from 'pdf-lib';

export async function mergePDFs(folderPath, bookJson, outputPath) {
	const pdfDoc = await PDFDocument.create();
	const pagesList = bookJson.pagesList;

	for (const pageInfo of pagesList) {
		const filePath = `${folderPath}/${pageInfo.target.split('/')[1].split('.html')[0]}.pdf`;
		const fileBytes = fs.readFileSync(filePath);
		const filePdf = await PDFDocument.load(fileBytes);

		const pages = await pdfDoc.copyPages(filePdf, filePdf.getPageIndices());
		pages.forEach((page) => pdfDoc.addPage(page));
	}

	const mergedPdfBytes = await pdfDoc.save();
	fs.writeFileSync(outputPath, mergedPdfBytes);
}
