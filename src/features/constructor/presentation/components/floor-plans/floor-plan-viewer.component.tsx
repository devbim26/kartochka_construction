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
	/** Таб экспликации: стены / полы / помещения (для помещений — отдельная модалка). */
	explantationTab?: 'walls' | 'floors' | 'rooms';
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
	explantationTab = 'walls',
	currentPage = 1, // значение по умолчанию
	onPageChange,
}: Props) => {
	const { t, locale } = useI18n();
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const overlayCanvasRef = useRef<HTMLCanvasElement>(null);
	// Внутреннее состояние для количества страниц (только для чтения)
	const [numPages, setNumPages] = useState(0);
	const [scale, setScale] = useState(1.5);
	const navigate = useAppNavigate();
	const [search] = useSearchParams();
	const dispatch = useAppDispatch();

	const previousConstructionRef = useRef<FloorConstruction | null>(null);
	const hoveredConstructionIdRef = useRef<string | null>(null);
	const isMarqueeDraggingRef = useRef(false);
	const marqueeStartRef = useRef<{ x: number; y: number } | null>(null);
	const marqueeEndRef = useRef<{ x: number; y: number } | null>(null);
	const marqueeWindowHandlersRef = useRef<{
		move: (e: MouseEvent) => void;
		up: (e: MouseEvent) => void;
	} | null>(null);
	const renderJobRef = useRef(0);
	const imageUploadInFlightRef = useRef<Set<string>>(new Set());
	const imageUploadFailedAtRef = useRef<Map<string, number>>(new Map());
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

	const MIN_MARQUEE_PX = 5;

	const getCanvasPointClamped = (clientX: number, clientY: number) => {
		const canvas = canvasRef.current;
		if (!canvas) return null;
		const rect = canvas.getBoundingClientRect();
		const x = Math.min(Math.max(clientX - rect.left, 0), canvas.width);
		const y = Math.min(Math.max(clientY - rect.top, 0), canvas.height);
		return { x, y };
	};

	const detachMarqueeWindowListeners = () => {
		const h = marqueeWindowHandlersRef.current;
		if (!h) return;
		window.removeEventListener('mousemove', h.move);
		window.removeEventListener('mouseup', h.up);
		marqueeWindowHandlersRef.current = null;
	};

	const syncOverlay = () => {
		const overlayCanvas = overlayCanvasRef.current;
		const canvas = canvasRef.current;
		if (!overlayCanvas || !canvas) return;
		const overlayContext = overlayCanvas.getContext('2d');
		if (!overlayContext) return;

		overlayContext.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height);

		if (
			isMarqueeDraggingRef.current &&
			marqueeStartRef.current &&
			marqueeEndRef.current
		) {
			const a = marqueeStartRef.current;
			const b = marqueeEndRef.current;
			const left = Math.min(a.x, b.x);
			const top = Math.min(a.y, b.y);
			const w = Math.abs(b.x - a.x);
			const h = Math.abs(b.y - a.y);
			if (w > 0 && h > 0) {
				overlayContext.fillStyle = 'rgba(37, 99, 235, 0.14)';
				overlayContext.strokeStyle = 'rgb(59, 130, 246)';
				overlayContext.lineWidth = 2;
				overlayContext.setLineDash([6, 4]);
				overlayContext.fillRect(left, top, w, h);
				overlayContext.strokeRect(left, top, w, h);
				overlayContext.setLineDash([]);
			}
			return;
		}

		const hoveredId = hoveredConstructionIdRef.current;
		if (!hoveredId) return;
		const hoveredItem =
			constructionsOnPageRef.current.find((i) => i.construction.id === hoveredId) || null;
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

	const tryOpenCreateConstruction = (
		normalizedX1: number,
		normalizedY1: number,
		normalizedX2: number,
		normalizedY2: number,
	) => {
		const newRect = {
			left: Math.min(normalizedX1, normalizedX2),
			top: Math.min(normalizedY1, normalizedY2),
			right: Math.max(normalizedX1, normalizedX2),
			bottom: Math.max(normalizedY1, normalizedY2),
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
			toast.error(t('floorPlanViewer.overlapError'));
			return;
		}

		const canvas = canvasRef.current;
		if (!canvas) return;

		dispatch(constructorSlice.actions.setFile({ image: canvas.toDataURL('image/png') }));
		navigate('', {
			...(explantationTab === 'rooms' ? { addRoom: 'true' } : { create: 'true' }),
			createTypeTab:
				explantationTab === 'floors'
					? 'floors'
					: explantationTab === 'rooms'
						? 'rooms'
						: 'walls',
			reportId: search.get('reportId')!.toString(),
			reportType: search.get('reportType')!.toString(),
			layerId: floorId || '',
			floorNumber: floorNumber || '',
			x: newRect.left.toString(),
			y: newRect.top.toString(),
			x2: newRect.right.toString(),
			y2: newRect.bottom.toString(),
			page: currentPage.toString(),
		});
	};

	const cancelMarqueeWithoutCreate = () => {
		if (!isMarqueeDraggingRef.current) return;
		detachMarqueeWindowListeners();
		isMarqueeDraggingRef.current = false;
		marqueeStartRef.current = null;
		marqueeEndRef.current = null;
		syncOverlay();
	};

	const finishMarqueeSelection = (event: MouseEvent) => {
		if (!isMarqueeDraggingRef.current) return;

		/* Только отпускание ЛКМ завершает выделение; ПКМ/средняя — отмена (иначе modal откроется на mouseup button=2). */
		if (event.button !== 0) {
			cancelMarqueeWithoutCreate();
			return;
		}

		detachMarqueeWindowListeners();
		isMarqueeDraggingRef.current = false;

		const canvas = canvasRef.current;
		const start = marqueeStartRef.current;
		const end = getCanvasPointClamped(event.clientX, event.clientY);
		marqueeStartRef.current = null;
		marqueeEndRef.current = null;

		if (!canvas || !start || !end) {
			syncOverlay();
			return;
		}

		const wPx = Math.abs(end.x - start.x);
		const hPx = Math.abs(end.y - start.y);
		if (wPx < MIN_MARQUEE_PX || hPx < MIN_MARQUEE_PX) {
			syncOverlay();
			return;
		}

		const nx1 = +(Math.min(start.x, end.x) / scale).toString();
		const ny1 = +(Math.min(start.y, end.y) / scale).toString();
		const nx2 = +(Math.max(start.x, end.x) / scale).toString();
		const ny2 = +(Math.max(start.y, end.y) / scale).toString();

		tryOpenCreateConstruction(nx1, ny1, nx2, ny2);
		syncOverlay();
	};

	const handleCanvasMouseDown = (event: React.MouseEvent<HTMLCanvasElement>) => {
		/* ПКМ в начале жеста — сразу отменить рамку (до contextmenu / chord с ЛКМ). */
		if (event.button === 2) {
			if (isMarqueeDraggingRef.current) {
				event.preventDefault();
				cancelMarqueeWithoutCreate();
				toast.info(t('floorPlanViewer.selectionCancelled'));
			}
			return;
		}

		if (event.button !== 0) return;

		if (search.get('reportType') === 'Floor' && !floorNumber) {
			toast.error(t('floorPlanViewer.selectLevelFirst'));
			return;
		}

		const p = getCanvasPointClamped(event.clientX, event.clientY);
		if (!p) return;

		event.preventDefault();
		isMarqueeDraggingRef.current = true;
		marqueeStartRef.current = p;
		marqueeEndRef.current = p;
		hoveredConstructionIdRef.current = null;
		syncOverlay();

		const onMove = (e: MouseEvent) => {
			if (!isMarqueeDraggingRef.current) return;
			const next = getCanvasPointClamped(e.clientX, e.clientY);
			if (!next) return;
			marqueeEndRef.current = next;
			syncOverlay();
		};
		const onUp = (e: MouseEvent) => {
			finishMarqueeSelection(e);
		};

		marqueeWindowHandlersRef.current = { move: onMove, up: onUp };
		window.addEventListener('mousemove', onMove);
		window.addEventListener('mouseup', onUp);
	};

	const handleCanvasRightClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
		event.preventDefault();

		if (isMarqueeDraggingRef.current) {
			cancelMarqueeWithoutCreate();
			toast.info(t('floorPlanViewer.selectionCancelled'));
			return;
		}

		if (search.get('reportType') === 'Floor' && !floorNumber) {
			if (explantationTab === 'rooms') {
				toast.error(t('floorPlanViewer.selectLevelFirst'));
			}
			return;
		}

		const canvas = canvasRef.current;
		if (!canvas) return;

		if (explantationTab === 'rooms') {
			dispatch(constructorSlice.actions.setFile({ image: canvas.toDataURL('image/png') }));
			navigate('', {
				addRoom: 'true',
				createTypeTab: 'rooms',
				reportId: search.get('reportId')!.toString(),
				reportType: search.get('reportType')!.toString(),
				layerId: floorId || '',
				floorNumber: floorNumber || '',
				page: currentPage.toString(),
			});
		}
	};

	const handleCanvasMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
		if (isMarqueeDraggingRef.current) return;

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
		syncOverlay();
	};

	const handleCanvasMouseLeave = () => {
		if (isMarqueeDraggingRef.current) return;
		hoveredConstructionIdRef.current = null;
		syncOverlay();
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
		const renderJobId = ++renderJobRef.current;

		const renderAndDraw = async () => {
			try {
				// Рендерим текущую страницу (из пропсов)
				await renderPage(currentPage);
				if (renderJobRef.current !== renderJobId) return;
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
					if (renderJobRef.current !== renderJobId) return;
				}
				constructionsOnPageRef.current = nextConstructionItems;

				for (const item of nextConstructionItems) {
					if (renderJobRef.current !== renderJobId) return;
					const constructionId = item.construction.id;
					if (!constructionId) continue;
					if (item.construction.documentImageUrl) continue;
					if (imageUploadInFlightRef.current.has(constructionId)) continue;
					const failedAt = imageUploadFailedAtRef.current.get(constructionId);
					if (failedAt && Date.now() - failedAt < 3000) continue;

					imageUploadInFlightRef.current.add(constructionId);
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
					imageUploadInFlightRef.current.delete(constructionId);
					if (uploaded) {
						shouldRefreshData = true;
						imageUploadFailedAtRef.current.delete(constructionId);
					} else {
						imageUploadFailedAtRef.current.set(constructionId, Date.now());
					}
				}

				// Upload image for the active construction only when its coordinates changed.
				if (currentConstruction?.page === currentPage && currentConstruction.id) {
					const bounds = resolveConstructionBounds(canvas, currentConstruction, scale);

					const prev = previousConstructionRef.current;
					const coordsChanged =
						prev &&
						prev.reportConstructionHeader.id ===
							currentConstruction.reportConstructionHeader.id &&
						(prev.coordinates.x !== currentConstruction.coordinates.x ||
							prev.coordinates.y !== currentConstruction.coordinates.y ||
							prev.coordinates2.x !== currentConstruction.coordinates2.x ||
							prev.coordinates2.y !== currentConstruction.coordinates2.y);

					const isNewConstruction =
						!prev ||
						prev.reportConstructionHeader.id !==
							currentConstruction.reportConstructionHeader.id;

				const needsUpload =
					coordsChanged ||
					(isNewConstruction && !currentConstruction.documentImageUrl);

				if (needsUpload) {
					if (renderJobRef.current !== renderJobId) return;
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
				}

					previousConstructionRef.current = currentConstruction;
				}
				if (shouldRefreshData && renderJobRef.current === renderJobId) {
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
		explantationTab,
	]);

	useEffect(() => {
		detachMarqueeWindowListeners();
		isMarqueeDraggingRef.current = false;
		marqueeStartRef.current = null;
		marqueeEndRef.current = null;
		hoveredConstructionIdRef.current = null;
		const overlay = overlayCanvasRef.current;
		const ctx = overlay?.getContext('2d');
		if (overlay && ctx) {
			ctx.clearRect(0, 0, overlay.width, overlay.height);
		}
	}, [currentPage, search.get('create')]);

	useEffect(() => {
		hoveredConstructionIdRef.current = null;
		constructionsOnPageRef.current = [];
	}, [currentPage, currentConstructions]);

	useEffect(() => {
		return () => detachMarqueeWindowListeners();
	}, []);

	return (
		<div className="flex w-full max-w-full items-center justify-center rounded-[20px] py-[30px]">
			<div className="flex w-full max-w-full flex-col gap-[18px] rounded-[20px] bg-white px-2 md:px-0">
				<div className="relative mx-auto h-[min(70vh,720px)] w-full max-w-[min(100%,1600px)] overflow-auto border border-input-label-primary">
					{isRendering && (
						<div className="absolute inset-0 z-10 flex items-center justify-center bg-white/60">
							<Loader />
						</div>
					)}
					<canvas
						ref={canvasRef}
						onMouseDown={handleCanvasMouseDown}
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
								onClick={() => setScale((prev) => Math.max(prev - 0.2, 0.4))}
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
