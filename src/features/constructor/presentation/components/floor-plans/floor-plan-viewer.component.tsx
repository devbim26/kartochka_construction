import {
	Button,
	ChevronIcon,
	convertBase64ToFile,
	useAppDispatch,
	useAppNavigate,
	useAppSelector,
} from '@core';
import Loader from '@core/presentation/components/loaders/loader.component';
import { getReportFloorById, uploadImage } from '@features/constructor/services';
import { constructorSlice } from '@features/constructor/store';
import type { ConstructionSheet } from '@features/constructor/types';
import { ReportCategory } from '@features/constructor/types';
import { convertToClientConstructionTypeEnumData } from '@features/guidbooks/converters';
import { RuConstructionTypesMap } from '@features/guidbooks/types';
import * as pdfjs from 'pdfjs-dist';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { FaMinus, FaPlus } from 'react-icons/fa6';
import { TbZoomReset } from 'react-icons/tb';
import { useSearchParams } from 'react-router-dom';
import { from } from 'rxjs';
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
	const navigate = useAppNavigate();
	const [search] = useSearchParams();
	const dispatch = useAppDispatch();
	const [isRendering, setIsRendering] = useState(false);
	useEffect(() => {
		setNumPages(pdfFile.numPages);
		setPageNum(1);
	}, []);

	const info = useAppSelector((store) => store.constructorData).reportInfo;

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

			setIsRendering(true);

			renderTaskRef.current = page.render({
				canvasContext: context,
				viewport: viewport,
			});

			try {
				await renderTaskRef.current.promise;
			} catch (error) {
				console.warn('Ошибка выполнения рендера:', error);
			} finally {
				setIsRendering(false);
			}

			renderTaskRef.current = null;
		},
		[scale, pageNum, pdfFile],
	);

	const drawConstruction = useCallback(
		(
			x: number,
			y: number,
			constructionName: string,
			guidebookConstructionName: string,
			dividedRooms: string,
		) => {
			const maxTextLength = Math.max(
				constructionName.length,
				guidebookConstructionName.length,
				dividedRooms.length,
			);

			if (!canvasRef.current) return;
			const canvas = canvasRef.current;
			const context = canvas.getContext('2d');
			if (!context) return;

			const boxWidth = maxTextLength * 13;
			const boxHeight = 70;
			const padding = 10;
			const arrowThickness = 2;
			const dotSize = 2;

			let boxX = x + 50;
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
			context.font = '300 16px Source Sans Pro';
			context.textAlign = 'left';
			context.textBaseline = 'middle';
			context.fillText(constructionName, boxX + 10, boxY + 20);

			context.fillStyle = 'black';
			context.font = '600 16px Source Sans Pro';
			context.textAlign = 'left';
			context.textBaseline = 'middle';
			context.fillText('Конструкция:', boxX + 10, boxY + 35);

			context.fillStyle = '#2175F3';
			context.font = '800 16px Source Sans Pro';
			context.textAlign = 'left';
			context.textBaseline = 'middle';
			context.fillText(guidebookConstructionName, boxX + 110, boxY + 35);

			context.fillStyle = 'black';
			context.font = '600 16px Source Sans Pro';
			context.textAlign = 'left';
			context.textBaseline = 'middle';
			context.fillText('разделяет:', boxX + 10, boxY + 50);

			context.fillStyle = 'black';
			context.font = '800 16px Source Sans Pro';
			context.textAlign = 'left';
			context.textBaseline = 'middle';
			context.fillText(dividedRooms, boxX + 90, boxY + 50);
		},
		[],
	);

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

	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;
		if (pdfFile) {
			from(renderPage(pageNum)).subscribe(() => {
				if (info) {
					if (info.page === pageNum) {
						drawConstruction(
							info.coordinates!.x! * scale,
							info.coordinates!.y! * scale,
							RuConstructionTypesMap[
								convertToClientConstructionTypeEnumData(
									info.reportConstructionHeader!.constructionHeader!
										.constructionType!.constructionTypeEnum!,
								)
							],
							info.reportConstructionHeader?.constructionHeader?.name || '',
							info.reportConstructionHeader?.firstPlacementRoom?.name +
								'/' +
								info.reportConstructionHeader?.secondPlacementRoom?.name,
						);
						const rectWidth = 900;
						const rectHeight = 400;
						const centerX = info.coordinates!.x! * scale;
						const centerY = info.coordinates!.y! * scale;
						const startX = centerX - rectWidth / 2;
						const startY = centerY - rectHeight / 2;
						const croppedCanvas = document.createElement('canvas');
						croppedCanvas.width = rectWidth;
						croppedCanvas.height = rectHeight;
						const croppedCtx = croppedCanvas.getContext('2d');
						croppedCtx!.drawImage(
							canvas,
							startX,
							startY,
							rectWidth,
							rectHeight,
							0,
							0,
							rectWidth,
							rectHeight,
						);

						const imageFile = convertBase64ToFile(
							croppedCanvas.toDataURL('image/png'),
							'file',
							'image/png',
						);
						from(
							uploadImage({
								data: {
									reportFloorInfoId: info.id,
									floorDocumentImage: imageFile,
								},
							}),
						).subscribe((response) => {
							if (response.status === 200) {
								if (search.get('reportType') == ReportCategory.Floor)
									from(
										getReportFloorById({ id: search.get('reportId')! }),
									).subscribe((response) => {
										dispatch(
											constructorSlice.actions.setConstructionsSheet(
												response.data.floorConstructionInfos?.[0]?.reportFloorInfos?.map(
													(info) => ({
														id: info.id,
														title:
															info.reportConstructionHeader
																?.constructionHeader?.name ||
															'Нет названия',
														floorPlanImage: info.documentImageUrl || '',
														constructionId:
															info.reportConstructionHeader
																?.constructionHeaderId,
														constructionInfoImage:
															info.documentImageUrl || '',
														square:
															info.reportConstructionHeader?.square ||
															'0',
														materials:
															info.reportConstructionHeader
																?.constructionHeader
																?.constructionType?.constructions,
													}),
												) as ConstructionSheet[],
											),
										);
									});
							}
						});
					}
				}
			});
		}
	}, [pdfFile, pageNum, scale, info]);

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
