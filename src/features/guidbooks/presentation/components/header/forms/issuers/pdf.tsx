import * as pdfjs from 'pdfjs-dist';
import React, { useEffect, useRef, useState } from 'react';

pdfjs.GlobalWorkerOptions.workerSrc = `https://app.unpkg.com/pdfjs-dist@5.1.91/files/build/pdf.worker.mjs`;

export const PDFViewer = () => {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const [pdfDoc, setPdfDoc] = useState<pdfjs.PDFDocumentProxy | null>(null);
	const [pageNum, setPageNum] = useState(1);
	const [numPages, setNumPages] = useState(0);

	const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			const arrayBuffer = await file.arrayBuffer();
			const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
			setPdfDoc(pdf);
			setNumPages(pdf.numPages);
			setPageNum(1);
		}
	};

	const renderPage = async (num: number) => {
		if (!pdfDoc || !canvasRef.current) return;
		const page = await pdfDoc.getPage(num);
		const viewport = page.getViewport({ scale: 1.5 });

		const canvas = canvasRef.current;
		const context = canvas.getContext('2d');
		if (!context) return;

		canvas.height = viewport.height;
		canvas.width = viewport.width;

		await page.render({
			canvasContext: context,
			viewport: viewport,
		}).promise;
	};

	useEffect(() => {
		if (pdfDoc) {
			renderPage(pageNum);
		}
	}, [pdfDoc, pageNum]);

	const handlePrev = () => {
		if (pageNum > 1) setPageNum(pageNum - 1);
	};

	const handleNext = () => {
		if (pdfDoc && pageNum < numPages) setPageNum(pageNum + 1);
	};

	return (
		<div className="space-y-4 p-4">
			<input
				type="file"
				accept="application/pdf"
				onChange={handleFileChange}
				className="mb-4"
			/>

			<div className="flex items-center justify-between">
				<button
					onClick={handlePrev}
					disabled={pageNum <= 1}
					className="rounded bg-blue-500 px-4 py-2 text-white disabled:opacity-50"
				>
					Prev
				</button>
				<span className="text-lg">
					Page {pageNum} / {numPages}
				</span>
				<button
					onClick={handleNext}
					disabled={pageNum >= numPages}
					className="rounded bg-blue-500 px-4 py-2 text-white disabled:opacity-50"
				>
					Next
				</button>
			</div>

			<canvas ref={canvasRef} className="max-w-full border shadow" />
		</div>
	);
};
