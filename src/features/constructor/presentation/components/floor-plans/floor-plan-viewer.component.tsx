import type { AppDispatch } from '@core';
import { Button, ChevronIcon, useAppDispatch, useAppNavigate } from '@core';
import Loader from '@core/presentation/components/loaders/loader.component';
import { uploadImage, uploadScreenshot } from '@features/constructor/services';
import { constructorSlice, stopLoading } from '@features/constructor/store';
import type { FloorConstruction } from '@features/constructor/types';
import {
	cropCanvasToFile,
	drawConstructionOnCanvas,
	useRenderPage,
} from '@features/constructor/utils';
import { AxiosError } from 'axios';
import * as pdfjs from 'pdfjs-dist';
import React, { useEffect, useRef, useState } from 'react';
import { FaMinus, FaPlus } from 'react-icons/fa6';
import { TbZoomReset } from 'react-icons/tb';
import { useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
pdfjs.GlobalWorkerOptions.workerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@5.1.91/build/pdf.worker.min.mjs`;

type Props = {
	pdfFile: pdfjs.PDFDocumentProxy;
	currentConstruction?: FloorConstruction;
	reportFloorInfoId?: string;
};

export const FloorPlanViewer = ({ pdfFile, currentConstruction, reportFloorInfoId }: Props) => {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const [pageNum, setPageNum] = useState(1);
	const [numPages, setNumPages] = useState(0);
	const [scale, setScale] = useState(1.5);
	const navigate = useAppNavigate();
	const [search] = useSearchParams();
	const dispatch = useAppDispatch();

	const { renderPage, isRendering } = useRenderPage(pdfFile, canvasRef, scale);

	useEffect(() => {
		setNumPages(pdfFile.numPages);
		setPageNum(1);
	}, []);

	const handleCanvasRightClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
		event.preventDefault();

		const canvas = canvasRef.current;
		if (!canvas) return;

		const rect = canvas.getBoundingClientRect();
		const x = event.clientX - rect.left;
		const y = event.clientY - rect.top;
		dispatch(constructorSlice.actions.setFile({ image: canvas.toDataURL('image/png') }));
		navigate('', {
			create: 'true',
			reportId: search.get('reportId')!.toString(),
			reportType: search.get('reportType')!.toString(),
			x: (x / scale).toString(),
			y: (y / scale).toString(),
			page: pageNum.toString(),
		});
	};

	const uploadImagesAndRefresh = async (
		imageFile: File,
		id: string,
		dispatch: AppDispatch,
	): Promise<void> => {
		try {
			const imageResponse = await uploadImage({
				data: {
					reportFloorInfoId: reportFloorInfoId,
					floorDocumentImage: imageFile,
				},
			});

			if (imageResponse.status !== 200) return;

			const screenshotResponse = await uploadScreenshot({
				data: {
					floorConstructionInfoId: id,
					floorScreenshot: imageFile,
				},
			});

			if (screenshotResponse.status === 200) {
				toast.success('Изображение и скриншот успешно загружены');
			}
		} catch (error) {
			if (error instanceof AxiosError) {
				toast.error(error.response?.data);
			}
			dispatch(stopLoading());
		}
	};

	useEffect(() => {
		if (!pdfFile || !canvasRef.current) return;

		const canvas = canvasRef.current;

		renderPage(pageNum)
			.then(() => {
				if (currentConstruction) {
					drawConstructionOnCanvas(canvas, currentConstruction, scale);

					if (currentConstruction.page === pageNum) {
						const centerX = currentConstruction.coordinates.x * scale;
						const centerY = currentConstruction.coordinates.y * scale;
						const imageFile = cropCanvasToFile(canvas, centerX, centerY, 900, 400);

						uploadImagesAndRefresh(
							imageFile,
							currentConstruction.reportConstructionHeader.id,
							dispatch,
						);
					}
				}
			})
			.catch((error) => {
				console.error('Ошибка при обработке конструкции:', error);
				dispatch(stopLoading());
			});
	}, [pdfFile, pageNum, scale, currentConstruction]);

	const handlePrev = () => {
		if (pageNum > 1) setPageNum(pageNum - 1);
	};

	const handleNext = () => {
		if (pdfFile && pageNum < numPages) setPageNum(pageNum + 1);
	};

	return (
		<div className="flex items-center justify-center rounded-[20px] py-[30px]">
			<div className="flex w-fit flex-col gap-[18px] rounded-[20px] bg-white">
				<div className="relative h-[600px] w-[1600px] overflow-auto border border-input-label-primary">
					{isRendering && (
						<div className="absolute inset-0 z-10 flex items-center justify-center bg-white/60">
							<Loader />
						</div>
					)}
					<canvas ref={canvasRef} onContextMenu={handleCanvasRightClick} />
				</div>
				{pdfFile && (
					<div className="flex w-full items-center justify-between gap-3 self-end">
						<div className="flex gap-[10px]">
							<Button
								onClick={() => setScale(1)}
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
