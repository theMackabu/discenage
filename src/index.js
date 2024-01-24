import fs from 'node:fs';
import puppeteer from 'puppeteer';
import { mergePDFs } from './merge.js';
import { downloadPageAsPDF } from './download.js';
import book from '../book.json' assert { type: 'json' };
import cookies from '../cookie.json' assert { type: 'json' };

if (!fs.existsSync(process.env.DOWNLOAD_DIR)) {
	fs.mkdirSync(process.env.DOWNLOAD_DIR, { recursive: true });
}

const browser = await puppeteer.launch({ headless: 'new' });

try {
	for (const page of book.pagesList) {
		!page.target.includes('#') && (await downloadPageAsPDF(page, browser, process.env.BASE_URL, cookies));
	}
} finally {
	browser && (await browser.close());
}

mergePDFs(process.env.DOWNLOAD_DIR, book, 'textbook.pdf')
	.then(() => console.log('PDFs merged successfully'))
	.catch((error) => console.error('Error merging PDFs:', error));
