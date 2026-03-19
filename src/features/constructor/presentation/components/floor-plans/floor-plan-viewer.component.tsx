import type { AppDispatch } from '@core';
import { Button, ChevronIcon, useAppDispatch, useAppNavigate, useI18n } from '@core';
import Loader from '@core/presentation/components/loaders/loader.component';
import { uploadImage } from '@features/constructor/services';
import { constructorSlice, stopLoading } from '@features/constructor/store';
import type { FloorConstruction } from '@features/constructor/types';
import {
	cropCanvasToFile,
	drawConstructionLabelOnCanvas,
	drawConstructionOnCanvas,
	resolveConstructionBounds,
	useRenderPage,
} from '@features/constructor/utils';
import type { ConstructionsEditData, ConstructionTypeEnum } from '@features/guidbooks/types';
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
	floorId?: string;
	floorNumber?: string;
	currentConstructionHeader?: ConstructionsEditData;
	currentConstructions?: FloorConstruction[];
	constructionHeadersById?: Record<string, ConstructionsEditData>;
	getData: () => void;
	// Новые пропсы для управления страницей из родителя
	currentPage?: number;
	onPageChange?: (page: number) => void;
};

export const FloorPlanViewer = ({
	pdfFile,
	currentConstruction,
	reportFloorInfoId,
	floorId,
	floorNumber,
	getData,
	currentConstructionHeader,
	currentConstructions = [],
	constructionHeadersById = {},
	currentPage = 1, // значение по умолчанию
	onPageChange,
}: Props) => {
	const { t, locale } = useI18n();
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const overlayCanvasRef = useRef<HTMLCanvasElement>(null);
	// Внутреннее состояние для количества страниц (только для чтения)
	const [numPages, setNumPages] = useState(0);
	const [scale, setScale] = useState(1.5);
	const [firstPoint, setFirstPoint] = useState<{ x: number; y: number } | null>(null);
	const navigate = useAppNavigate();
	const [search] = useSearchParams();
	const dispatch = useAppDispatch();

	const previousConstructionRef = useRef<FloorConstruction | null>(null);
	const hoveredConstructionIdRef = useRef<string | null>(null);
	const attemptedImageUploadIdsRef = useRef<Set<string>>(new Set());
	const constructionsOnPageRef = useRef<
		Array<{
			construction: FloorConstruction;
			header?: ConstructionsEditData;
			bounds: { left: number; top: number; width: number; height: number };
		}>
	>([]);

	// Хук рендера использует текущую страницу из пропсов
	const { renderPage, isRendering } = useRenderPage(pdfFile, canvasRef, scale);

	const constructionLabels = {
		construction: t('construction.labels.construction'),
		divides: t('construction.labels.divides'),
	};

	// Устанавливаем общее количество страниц при загрузке PDF
	useEffect(() => {
		setNumPages(pdfFile.numPages);
	}, [pdfFile]);

	const handleCanvasRightClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
		event.preventDefault();
		if (search.get('reportType') === 'Floor' && !floorNumber) {
			toast.error('Сначала выберите уровень');
			return;
		}

		const canvas = canvasRef.current;
		if (!canvas) return;

		const rect = canvas.getBoundingClientRect();
		const x = event.clientX - rect.left;
		const y = event.clientY - rect.top;
		const normalizedX = +(x / scale).toString();
		const normalizedY = +(y / scale).toString();

		if (!firstPoint) {
			setFirstPoint({ x: normalizedX, y: normalizedY });
			toast.info('Выбрана первая точка. Укажите вторую точку.');
			return;
		}

		const newRect = {
			left: Math.min(firstPoint.x, normalizedX),
			top: Math.min(firstPoint.y, normalizedY),
			right: Math.max(firstPoint.x, normalizedX),
			bottom: Math.max(firstPoint.y, normalizedY),
		};
		const intersectsExisting = currentConstructions
			.filter((construction) => construction.page === currentPage)
			.some((construction) => {
				const { coordinates, coordinates2 } = construction;
				const hasValidCoordinates = [coordinates.x, coordinates.y, coordinates2.x, coordinates2.y]
					.every((value) => Number.isFinite(value))
					&& !(coordinates.x === 0 && coordinates.y === 0 && coordinates2.x === 0 && coordinates2.y === 0);
				if (!hasValidCoordinates) return false;

				const existingRect = {
					left: Math.min(coordinates.x, coordinates2.x),
					top: Math.min(coordinates.y, coordinates2.y),
					right: Math.max(coordinates.x, coordinates2.x),
					bottom: Math.max(coordinates.y, coordinates2.y),
				};

				return !(
					newRect.right <= existingRect.left ||
					newRect.left >= existingRect.right ||
					newRect.bottom <= existingRect.top ||
					newRect.top >= existingRect.bottom
				);
			});

		if (intersectsExisting) {
			toast.error('Нельзя накладывать одну конструкцию на другую');
			setFirstPoint(null);
			return;
		}

		dispatch(constructorSlice.actions.setFile({ image: canvas.toDataURL('image/png') }));
		navigate('', {
			create: 'true',
			reportId: search.get('reportId')!.toString(),
			reportType: search.get('reportType')!.toString(),
			layerId: floorId || '',
			floorNumber: floorNumber || '',
			x: firstPoint.x.toString(),
			y: firstPoint.y.toString(),
			x2: normalizedX.toString(),
			y2: normalizedY.toString(),
			page: currentPage.toString(), // используем пропс
		});
		setFirstPoint(null);
	};

	const drawHoveredLabelOnOverlay = (
		hoveredItem: {
			construction: FloorConstruction;
			header?: ConstructionsEditData;
		} | null,
	) => {
		const overlayCanvas = overlayCanvasRef.current;
		if (!overlayCanvas) return;
		const overlayContext = overlayCanvas.getContext('2d');
		if (!overlayContext) return;

		overlayContext.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height);
		if (!hoveredItem) return;

		drawConstructionLabelOnCanvas(
			overlayCanvas,
			hoveredItem.construction,
			scale,
			hoveredItem.header?.constructionType as ConstructionTypeEnum,
			hoveredItem.header?.name || 'Placeholder',
			constructionLabels,
		);
	};

	const handleCanvasMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
		const canvas = canvasRef.current;
		if (!canvas) return;

		const rect = canvas.getBoundingClientRect();
		const x = event.clientX - rect.left;
		const y = event.clientY - rect.top;
		const hoveredItem =
			[...constructionsOnPageRef.current]
				.reverse()
				.find((item) => {
					const inX = x >= item.bounds.left && x <= item.bounds.left + item.bounds.width;
					const inY = y >= item.bounds.top && y <= item.bounds.top + item.bounds.height;
					return inX && inY;
				}) || null;
		const nextHoveredId = hoveredItem?.construction.id || null;
		if (hoveredConstructionIdRef.current === nextHoveredId) return;

		hoveredConstructionIdRef.current = nextHoveredId;
		drawHoveredLabelOnOverlay(hoveredItem);
	};

	const handleCanvasMouseLeave = () => {
		hoveredConstructionIdRef.current = null;
		drawHoveredLabelOnOverlay(null);
	};

	const uploadImageForConstruction = async (
		constructionId: string | undefined,
		imageFile: File,
		dispatch: AppDispatch,
	): Promise<boolean> => {
		if (!constructionId) return false;
		try {
			const imageResponse = await uploadImage({
				data: {
					reportFloorConstructionInfoId: constructionId,
					floorDocumentImage: imageFile,
				},
			});

			return imageResponse.status === 200;
		} catch (error) {
			if (error instanceof AxiosError) {
				toast.error(error.response?.data || t('floorPlanViewer.uploadError'));
			} else {
				toast.error(t('floorPlanViewer.uploadError'));
			}
			dispatch(stopLoading());
			return false;
		}
	};

	const handlePrev = () => {
		if (currentPage > 1 && onPageChange) {
			onPageChange(currentPage - 1);
		}
	};

	const handleNext = () => {
		if (pdfFile && currentPage < numPages && onPageChange) {
			onPageChange(currentPage + 1);
		}
	};

	// Эффект для рендера страницы и отрисовки конструкции
	useEffect(() => {
		if (!pdfFile || !canvasRef.current) return;

		const canvas = canvasRef.current;

		const renderAndDraw = async () => {
			try {
				// Рендерим текущую страницу (из пропсов)
				await renderPage(currentPage);
				const overlayCanvas = overlayCanvasRef.current;
				if (overlayCanvas) {
					overlayCanvas.width = canvas.width;
					overlayCanvas.height = canvas.height;
					const overlayContext = overlayCanvas.getContext('2d');
					overlayContext?.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height);
				}
				hoveredConstructionIdRef.current = null;

				const constructionsOnPage = currentConstructions.filter(
					(construction) => construction.page === currentPage,
				);
				let shouldRefreshData = false;
				const nextConstructionItems: Array<{
					construction: FloorConstruction;
					header?: ConstructionsEditData;
					bounds: { left: number; top: number; width: number; height: number };
				}> = [];
				for (const construction of constructionsOnPage) {
					const headerId = construction.reportConstructionHeader.constructionHeaderId;
					const header =
						constructionHeadersById[headerId] ||
						(currentConstruction?.id === construction.id
							? currentConstructionHeader
							: undefined);
					const bounds = resolveConstructionBounds(canvas, construction, scale);
					nextConstructionItems.push({
						construction,
						header,
						bounds: {
							left: bounds.left,
							top: bounds.top,
							width: bounds.width,
							height: bounds.height,
						},
					});
					await drawConstructionOnCanvas(
						canvas,
						construction,
						scale,
						header?.constructionType as ConstructionTypeEnum,
						header?.name || 'Placeholder',
						constructionLabels,
						false,
					);
				}
				constructionsOnPageRef.current = nextConstructionItems;

				// Для каждой конструкции без скрина формируем и загружаем изображение.
				for (const item of nextConstructionItems) {
					const constructionId = item.construction.id;
					if (!constructionId) continue;
					if (item.construction.documentImageUrl) {
						attemptedImageUploadIdsRef.current.delete(constructionId);
						continue;
					}
					if (attemptedImageUploadIdsRef.current.has(constructionId)) continue;

					const imageFile = cropCanvasToFile(
						canvas,
						item.bounds.left + item.bounds.width / 2,
						item.bounds.top + item.bounds.height / 2,
						900,
						400,
					);
					const uploaded = await uploadImageForConstruction(
						constructionId,
						imageFile,
						dispatch,
					);
					if (uploaded) {
						shouldRefreshData = true;
					} else {
						attemptedImageUploadIdsRef.current.add(constructionId);
					}
				}

				// Для генерации мини-изображения ориентируемся на текущую активную конструкцию
				if (currentConstruction?.page === currentPage) {
					const bounds = resolveConstructionBounds(canvas, currentConstruction, scale);

					const prev = previousConstructionRef.current;
					const hasChanged =
						!prev ||
						prev.reportConstructionHeader.id !==
							currentConstruction.reportConstructionHeader.id ||
						prev.coordinates.x !== currentConstruction.coordinates.x ||
						prev.coordinates.y !== currentConstruction.coordinates.y ||
						prev.coordinates2.x !== currentConstruction.coordinates2.x ||
						prev.coordinates2.y !== currentConstruction.coordinates2.y;

					if (hasChanged) {
						const imageFile = cropCanvasToFile(
							canvas,
							bounds.centerX,
							bounds.centerY,
							900,
							400,
						);

						const uploaded = await uploadImageForConstruction(
							currentConstruction.id,
							imageFile,
							dispatch,
						);
						if (uploaded) {
							shouldRefreshData = true;
						}

						previousConstructionRef.current = currentConstruction;
					}
				}
				if (shouldRefreshData) {
					getData();
				}
			} catch (error) {
				console.error(t('pdf.error'), error);
				dispatch(stopLoading());
			}
		};

		renderAndDraw();
		// Зависимости: currentPage, scale, currentConstruction, currentConstructionHeader, locale
	}, [
		pdfFile,
		currentPage,
		scale,
		currentConstruction,
		currentConstructionHeader,
		currentConstructions,
		constructionHeadersById,
		locale,
	]);

	useEffect(() => {
		setFirstPoint(null);
	}, [currentPage, search.get('create')]);

	useEffect(() => {
		attemptedImageUploadIdsRef.current.clear();
	}, [currentConstructions]);

	return (
		<div className="flex items-center justify-center rounded-[20px] py-[30px]">
			<div className="flex w-fit flex-col gap-[18px] rounded-[20px] bg-white">
				<div className="relative h-[600px] w-[1600px] overflow-auto border border-input-label-primary">
					{isRendering && (
						<div className="absolute inset-0 z-10 flex items-center justify-center bg-white/60">
							<Loader />
						</div>
					)}
					<canvas
						ref={canvasRef}
						onContextMenu={handleCanvasRightClick}
						onMouseMove={handleCanvasMouseMove}
						onMouseLeave={handleCanvasMouseLeave}
					/>
					<canvas
						ref={overlayCanvasRef}
						className="pointer-events-none absolute left-0 top-0"
					/>
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
						<p className="text-[18px] text-primary">
							{t('floorPlanViewer.instruction')}
						</p>
						<div className="flex items-center gap-[10px]">
							<Button
								onClick={handlePrev}
								disabled={currentPage <= 1}
								variant="primary"
								className="p-[10px]"
							>
								<ChevronIcon className="rotate-90" fill="white" />
							</Button>
							<span className="text-[16px] font-bold">
								{currentPage} {t('floorPlanViewer.page')} {numPages}
							</span>
							<Button
								onClick={handleNext}
								disabled={currentPage >= numPages}
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
