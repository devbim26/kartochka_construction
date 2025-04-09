import { Button, ChevronIcon } from '@core';
import * as pdfjs from 'pdfjs-dist';
import React, { useEffect, useRef, useState } from 'react';

pdfjs.GlobalWorkerOptions.workerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@5.1.91/build/pdf.worker.min.mjs`;

export const FloorPlanViewer = () => {
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

	const drawFrame = (x: number, y: number) => {
		if (!canvasRef.current) return;
		const context = canvasRef.current.getContext('2d');
		if (!context) return;

		const frameSize = 50;
		context.strokeStyle = 'blue';
		context.lineWidth = 2;
		context.strokeRect(x - frameSize / 2, y - frameSize / 2, frameSize, frameSize);
	};

	const handleCanvasRightClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
		event.preventDefault();
		const canvas = canvasRef.current;
		if (!canvas) return;

		const rect = canvas.getBoundingClientRect();
		const x = event.clientX - rect.left;
		const y = event.clientY - rect.top;

		drawFrame(x, y);
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
		<div className="flex items-center justify-center rounded-[20px]">
			<div className="flex w-fit flex-col gap-[18px] rounded-[20px] bg-white">
				<input
					type="file"
					accept="application/pdf"
					onChange={handleFileChange}
					className="mb-4"
				/>

				<div className="h-[400px] w-[933px] overflow-auto border border-input-label-primary">
					<canvas ref={canvasRef} onContextMenu={handleCanvasRightClick} />
				</div>
				{pdfDoc && (
					<div className="flex items-center justify-between gap-3 self-end">
						<Button
							onClick={handlePrev}
							disabled={pageNum <= 1}
							variant="primary"
							className="p-[10px]"
						>
							<ChevronIcon className="rotate-90" fill="white" />
						</Button>
						<span className="text-[16px] font-bold">{pageNum} страница </span>
						<Button
							onClick={handleNext}
							disabled={pageNum >= numPages}
							variant="primary"
							className="p-[10px]"
						>
							<ChevronIcon className="-rotate-90" fill="white" />
						</Button>
					</div>
				)}
			</div>
		</div>
	);
};
