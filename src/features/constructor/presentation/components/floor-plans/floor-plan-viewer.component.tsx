import { Button, ChevronIcon } from '@core';
import * as pdfjs from 'pdfjs-dist';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { FaMinus, FaPlus } from 'react-icons/fa6';
import { TbZoomReset } from 'react-icons/tb';
pdfjs.GlobalWorkerOptions.workerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@5.1.91/build/pdf.worker.min.mjs`;

type Props = {
	pdfFile: pdfjs.PDFDocumentProxy;
};

export const FloorPlanViewer = ({ pdfFile }: Props) => {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const renderTaskRef = useRef<pdfjs.RenderTask | null>(null);
	const [pageNum, setPageNum] = useState(1);
	const [numPages, setNumPages] = useState(0);
	const [scale, setScale] = useState(1.5);

	useEffect(() => {
		setNumPages(pdfFile.numPages);
		setPageNum(1);
	}, []);

	const renderPage = useCallback(
		async (num: number) => {
			if (!pdfFile || !canvasRef.current) return;

			if (renderTaskRef.current) {
				try {
					renderTaskRef.current.cancel();
				} catch (error) {
					console.warn('Ошибка отмены рендера:', error);
				}
			}

			const page = await pdfFile.getPage(num);
			const viewport = page.getViewport({ scale });

			const canvas = canvasRef.current;
			const context = canvas.getContext('2d');
			if (!context) return;

			canvas.width = viewport.width;
			canvas.height = viewport.height;

			renderTaskRef.current = page.render({
				canvasContext: context,
				viewport: viewport,
			});

			try {
				await renderTaskRef.current.promise;
			} catch (error) {
				console.warn('Ошибка выполнения рендера:', error);
			}

			renderTaskRef.current = null;
		},
		[scale, pageNum, pdfFile],
	);

	const drawConstruction = (x: number, y: number, text: string) => {
		if (!canvasRef.current) return;
		const canvas = canvasRef.current;
		const context = canvas.getContext('2d');
		if (!context) return;

		const boxWidth = 100;
		const boxHeight = 50;
		const padding = 10;
		const arrowThickness = 2;
		const dotSize = 2;

		let boxX = x + 180;
		const boxY = y - 100;

		if (boxX + boxWidth + padding > canvas.width) {
			boxX = x - 50 - boxWidth;
		}

		context.fillStyle = '#2175F3';
		context.beginPath();
		context.arc(x, y, dotSize, 0, Math.PI * 2);
		context.fill();

		context.strokeStyle = '#2175F3';
		context.lineWidth = arrowThickness;
		context.beginPath();
		context.moveTo(x, y);
		context.lineTo(boxX + 10, boxY + 45);
		context.stroke();

		context.fillStyle = 'white';
		context.fillRect(boxX, boxY, boxWidth, boxHeight);
		context.strokeStyle = '#2175F3';
		context.lineWidth = 2;
		context.strokeRect(boxX, boxY, boxWidth, boxHeight);

		context.fillStyle = 'black';
		context.font = '14px Arial';
		context.textAlign = 'center';
		context.textBaseline = 'middle';
		context.fillText(text, boxX + boxWidth / 2, boxY + boxHeight / 2);
	};

	const handleCanvasRightClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
		event.preventDefault();

		const canvas = canvasRef.current;
		if (!canvas) return;

		const rect = canvas.getBoundingClientRect();
		const x = event.clientX - rect.left;
		const y = event.clientY - rect.top;

		drawConstruction(x, y, 'Конструкция');
	};

	useEffect(() => {
		if (pdfFile) {
			renderPage(pageNum);
		}
	}, [pdfFile, pageNum, scale]);

	const handlePrev = () => {
		if (pageNum > 1) setPageNum(pageNum - 1);
	};

	const handleNext = () => {
		if (pdfFile && pageNum < numPages) setPageNum(pageNum + 1);
	};

	return (
		<div className="flex items-center justify-center rounded-[20px] py-[30px]">
			<div className="flex w-fit flex-col gap-[18px] rounded-[20px] bg-white">
				<div className="h-[600px] w-[1600px] overflow-auto border border-input-label-primary">
					<canvas ref={canvasRef} onContextMenu={handleCanvasRightClick} />
				</div>
				{pdfFile && (
					<div className="flex w-full items-center justify-between gap-3 self-end">
						<div className="flex gap-[10px]">
							<Button
								onClick={() => setScale(1.5)}
								variant="primary"
								className="p-[10px]"
							>
								<TbZoomReset />
							</Button>
							<Button
								onClick={() => setScale((prev) => Math.min(prev + 0.2, 10))}
								variant="primary"
								className="p-[10px]"
							>
								<FaPlus />
							</Button>
							<Button
								onClick={() => setScale((prev) => Math.max(prev - 0.2, -10))}
								variant="primary"
								className="p-[10px]"
							>
								<FaMinus />
							</Button>
						</div>
						<div className="flex items-center gap-[10px]">
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
					</div>
				)}
			</div>
		</div>
	);
};
