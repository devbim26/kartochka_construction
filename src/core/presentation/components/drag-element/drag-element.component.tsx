import { useDragElementContext } from '@core/utils';
import { useCallback, useEffect, useMemo, useRef, useState, type RefObject } from 'react';

interface DragElementCoord {
	x: number;
	y: number;
}

interface InitialPosition {
	top?: number;
	left?: number;
	right?: number;
	bottom?: number;
}

export interface DragElementSavedPosition {
	x: number;
	y: number;
}

interface DragElementProps {
	parentRef: RefObject<HTMLElement | null>;
	initialPosition: InitialPosition;
	savedPosition?: DragElementSavedPosition | null;
	onPositionChange?: (position: DragElementSavedPosition) => void;
	title?: string;
	zIndex?: number;
	containerClassName?: string;
	children: React.JSX.Element | React.ReactNode;
	styles?: React.HTMLAttributes<HTMLDivElement>['style'];
}

const calcInitialCoords = (
	parentRect: DOMRect,
	elementRect: DOMRect,
	initialPosition: InitialPosition,
): DragElementCoord => {
	let x = 0;
	let y = 0;
	if (initialPosition.left !== undefined) {
		x = initialPosition.left;
	} else if (initialPosition.right !== undefined) {
		x = parentRect.width - elementRect.width - initialPosition.right;
	}

	if (initialPosition.top !== undefined) {
		y = initialPosition.top;
	} else if (initialPosition.bottom !== undefined) {
		y = parentRect.height - elementRect.height - initialPosition.bottom;
	}
	return { x, y };
};

const parseTransformCoords = (transformStyle: string): DragElementCoord => {
	const transform = transformStyle.match(/translate3d\((.*?)px, (.*?)px, (.*?)px\)/);
	return {
		x: transform ? parseFloat(transform[1]) : 0,
		y: transform ? parseFloat(transform[2]) : 0,
	};
};

const caclCoordsBySize = (
	parentRect: DOMRect,
	elementRect: DOMRect,
	transformStyle: string,
): DragElementCoord | null => {
	const { x: newX, y: newY } = parseTransformCoords(transformStyle);
	const exceedsRight = newX + elementRect.width > parentRect.width;
	const exceedsBottom = newY + elementRect.height > parentRect.height;
	const exceedsLeft = newX < 0;
	const exceedsTop = newY < 0;
	let fixedX = newX;
	let fixedY = newY;
	if (exceedsRight) {
		fixedX = parentRect.width - elementRect.width;
	}
	if (exceedsBottom) {
		fixedY = parentRect.height - elementRect.height;
	}
	if (exceedsLeft) {
		fixedX = 0;
	}
	if (exceedsTop) {
		fixedY = 0;
	}
	return exceedsRight || exceedsBottom || exceedsLeft || exceedsTop
		? { x: fixedX, y: fixedY }
		: null;
};

export const DragElement = ({
	parentRef,
	initialPosition,
	savedPosition,
	onPositionChange,
	title,
	zIndex = 10,
	containerClassName,
	children,
	styles,
}: DragElementProps) => {
	const currentDragElementId = useRef<string>(crypto.randomUUID());
	const currentWrapper = useRef<HTMLDivElement>(null);
	const offset = useRef<DragElementCoord>({ x: 0, y: 0 });
	const isDragging = useRef<boolean>(false);
	const parentRectCache = useRef<DOMRect | null>(null);
	const [inited, setInited] = useState<boolean>(false);
	const { draggableElementId, setDraggableElementId } = useDragElementContext();

	const isActive = draggableElementId === currentDragElementId.current;

	const initialCoords: DragElementCoord = useMemo(() => {
		if (savedPosition) {
			return savedPosition;
		}
		if (!parentRef.current || !currentWrapper.current || !inited) return { x: 0, y: 0 };
		return calcInitialCoords(
			parentRef.current.getBoundingClientRect(),
			currentWrapper.current.getBoundingClientRect(),
			initialPosition,
		);
	}, [inited, savedPosition, initialPosition, parentRef]);

	const applyTransform = useCallback((coords: DragElementCoord) => {
		if (!currentWrapper.current) return;
		currentWrapper.current.style.transform = `translate3d(${coords.x}px, ${coords.y}px, 0)`;
	}, []);

	useEffect(() => {
		if (!inited || !currentWrapper.current) return;
		applyTransform(initialCoords);
	}, [inited, initialCoords, applyTransform]);

	useEffect(() => {
		setInited(true);
	}, []);

	useEffect(() => {
		if (!currentWrapper.current || !inited) return;
		const observer = new ResizeObserver(() => {
			if (!currentWrapper.current || !parentRef.current) return;
			const newCoords = caclCoordsBySize(
				parentRef.current.getBoundingClientRect(),
				currentWrapper.current.getBoundingClientRect(),
				currentWrapper.current.style.transform,
			);
			if (newCoords) {
				requestAnimationFrame(() => applyTransform(newCoords));
			}
		});
		observer.observe(currentWrapper.current);
		return () => observer.disconnect();
	}, [inited, parentRef, applyTransform]);

	const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
		if (e.button !== 0 || !isActive) return;
		if (!currentWrapper.current || !parentRef.current) return;

		e.currentTarget.setPointerCapture(e.pointerId);
		e.stopPropagation();

		parentRectCache.current = parentRef.current.getBoundingClientRect();

		const elementRect = currentWrapper.current.getBoundingClientRect();
		offset.current = {
			x: e.clientX - elementRect.left,
			y: e.clientY - elementRect.top,
		};

		isDragging.current = true;
	};

	const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
		if (!isDragging.current || !currentWrapper.current || !parentRef.current) return;
		const parentRect = parentRef.current.getBoundingClientRect();
		const elementRect = currentWrapper.current.getBoundingClientRect();

		let newX = e.clientX - offset.current.x - parentRect.left;
		let newY = e.clientY - offset.current.y - parentRect.top;

		newX = Math.max(0, Math.min(newX, parentRect.width - elementRect.width));
		newY = Math.max(0, Math.min(newY, parentRect.height - elementRect.height));
		requestAnimationFrame(() => applyTransform({ x: newX, y: newY }));
	};

	const onPointerUp = () => {
		if (!isDragging.current || !currentWrapper.current) {
			isDragging.current = false;
			return;
		}
		isDragging.current = false;
		parentRectCache.current = null;
		onPositionChange?.(parseTransformCoords(currentWrapper.current.style.transform));
	};

	const toggleDragMode = () => {
		setDraggableElementId(isActive ? '' : currentDragElementId.current!);
	};

	const onMouseWheelClick = (e: React.MouseEvent<HTMLDivElement>) => {
		if (e.button !== 1) return;
		e.preventDefault();
		toggleDragMode();
	};

	return (
		<div
			ref={currentWrapper}
			onMouseDownCapture={onMouseWheelClick}
			style={{
				...styles,
				position: 'absolute',
				willChange: 'transform',
				transform: `translate3d(${initialCoords.x}px, ${initialCoords.y}px, 0)`,
				zIndex: isActive ? 50 : zIndex,
				border: isActive ? '2px solid #2175f3' : '1px solid rgba(0,0,0,0.08)',
				display: 'flex',
				flexDirection: 'column',
				background: 'white',
				boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
			}}
			className={containerClassName}
		>
			{title ? (
				<div
					className={`flex items-center gap-2 border-b border-gray-200 px-2 py-1.5 ${
						isActive ? 'cursor-move bg-blue-50' : 'cursor-default bg-gray-50'
					}`}
					onPointerDown={onPointerDown}
					onPointerMove={onPointerMove}
					onPointerUp={onPointerUp}
					onPointerCancel={onPointerUp}
					title={isActive ? 'Перетащите панель' : 'Нажмите ≡ или СКМ, чтобы переместить'}
				>
					<button
						type="button"
						onClick={(e) => {
							e.stopPropagation();
							toggleDragMode();
						}}
						className={`rounded px-1.5 py-0.5 text-xs font-bold ${
							isActive
								? 'bg-primary text-white'
								: 'bg-white text-gray-600 ring-1 ring-gray-300'
						}`}
						aria-label={isActive ? 'Закрепить панель' : 'Разблокировать перемещение'}
					>
						≡
					</button>
					<span className="flex-1 select-none text-xs font-semibold text-gray-800">
						{title}
					</span>
					<span className="select-none text-[10px] text-gray-400">СКМ</span>
				</div>
			) : null}
			<div className={title ? 'min-w-0' : undefined}>{children}</div>
		</div>
	);
};
