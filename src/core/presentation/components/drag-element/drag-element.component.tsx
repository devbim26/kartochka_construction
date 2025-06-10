import { useDragElementContext } from '@core/utils';
import { RefObject, useLayoutEffect, useMemo, useRef, useState } from 'react';

interface DragElementCoord {
	x: number;
	y: number;
}

interface DragElementProps {
	parentRef: RefObject<HTMLElement | null>;
	initialState: {
		top?: number;
		left?: number;
		right?: number;
		bottom?: number;
	};
	zIndex?: number;
	containerClassName?: string;
	children: React.JSX.Element | React.ReactNode;
	styles?: React.HTMLAttributes<HTMLDivElement>['style'];
}

export const DragElement = ({
	parentRef,
	initialState,
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

	const initialCoords: DragElementCoord = useMemo(() => {
		if (!parentRef.current || !currentWrapper.current || !inited) return { x: 0, y: 0 };
		const parentRect = parentRef.current.getBoundingClientRect();
		const elementRect = currentWrapper.current.getBoundingClientRect();
		let x = 0;
		let y = 0;
		if (initialState.left !== undefined) {
			x = initialState.left;
		} else if (initialState.right !== undefined) {
			x = parentRect.width - elementRect.width - initialState.right;
		}

		if (initialState.top !== undefined) {
			y = initialState.top;
		} else if (initialState.bottom !== undefined) {
			y = parentRect.height - elementRect.height - initialState.bottom;
		}
		return { x, y };
	}, [inited]);

	const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
		if (e.button !== 0 || draggableElementId !== currentDragElementId.current!) return;
		e.stopPropagation();
		e.preventDefault();
		if (!currentWrapper.current || !parentRef.current) return;

		e.currentTarget.setPointerCapture(e.pointerId);

		parentRectCache.current = parentRef.current.getBoundingClientRect();

		const elementRect = currentWrapper.current.getBoundingClientRect();
		offset.current = {
			x: e.clientX - elementRect.left,
			y: e.clientY - elementRect.top,
		};

		isDragging.current = true;
	};

	useLayoutEffect(() => {
		setInited(true);
	}, []);

	const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
		if (!isDragging.current || !currentWrapper.current || !parentRef.current) return;
		e.stopPropagation();
		e.preventDefault();
		const parentRect = parentRef.current.getBoundingClientRect();
		const elementRect = currentWrapper.current.getBoundingClientRect();

		let newX = e.clientX - offset.current.x - parentRect.left;
		let newY = e.clientY - offset.current.y - parentRect.top;

		newX = Math.max(0, Math.min(newX, parentRect.width - elementRect.width));
		newY = Math.max(0, Math.min(newY, parentRect.height - elementRect.height));
		requestAnimationFrame(
			() =>
				(currentWrapper.current!.style.transform = `translate3d(${newX}px, ${newY}px, 0)`),
		);
	};

	const onPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
		e.stopPropagation();
		e.preventDefault();
		isDragging.current = false;
		parentRectCache.current = null;
	};

	const onMouseWheelClick = (e: React.MouseEvent<HTMLDivElement>) => {
		e.stopPropagation();
		e.preventDefault();
		if (e.button !== 1) return;
		setDraggableElementId(
			draggableElementId === currentDragElementId.current!
				? ''
				: currentDragElementId.current!,
		);
	};

	return (
		<div
			title={`${draggableElementId === currentDragElementId.current! ? 'Закрепить' : 'Переместить'}: СКМ`}
			ref={currentWrapper}
			onMouseDownCapture={onMouseWheelClick}
			onPointerDown={onPointerDown}
			onPointerMove={onPointerMove}
			onPointerUp={onPointerUp}
			style={{
				...styles,
				position: 'absolute',
				willChange: 'transform',
				transform: `translate3d(${initialCoords.x}px, ${initialCoords.y}px, 0)`,
				zIndex: draggableElementId === currentDragElementId.current! ? 50 : zIndex,
				cursor: draggableElementId === currentDragElementId.current! ? 'move' : 'default',
				border:
					draggableElementId === currentDragElementId.current!
						? '2px solid #2175f3'
						: undefined,
				display: 'flex',
				flexDirection: 'column',
			}}
			className={containerClassName}
		>
			{children}
		</div>
	);
};
