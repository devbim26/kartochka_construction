import { RefObject, useRef, useState } from 'react';

interface DragElementCoord {
	x: number;
	y: number;
}

interface DragElementProps {
	parentRef: RefObject<HTMLElement | null>;
	initialState: DragElementCoord;
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
	const currentWrapper = useRef<HTMLDivElement>(null);
	const offset = useRef<DragElementCoord>({ x: 0, y: 0 });
	const isDragging = useRef<boolean>(false);
	const timeout = useRef<NodeJS.Timeout>(null);
	const [dragEnabled, setDragEnabled] = useState(false);

	const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
		if (e.button !== 0 || !dragEnabled) return;
		e.stopPropagation();
		e.preventDefault();
		if (!currentWrapper.current || !parentRef.current) return;

		const elementRect = currentWrapper.current.getBoundingClientRect();
		offset.current = {
			x: e.clientX - elementRect.left,
			y: e.clientY - elementRect.top,
		};

		isDragging.current = true;
	};

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

		if (timeout.current) {
			clearTimeout(timeout.current);
		}
		timeout.current = setTimeout(
			() => (currentWrapper.current!.style.transform = `translate(${newX}px, ${newY}px)`),
			0,
		);
	};

	const onPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
		e.stopPropagation();
		e.preventDefault();
		isDragging.current = false;
	};

	const onMouseWheelClick = (e: React.MouseEvent<HTMLDivElement>) => {
		e.stopPropagation();
		e.preventDefault();
		if (e.button !== 1) return;
		setDragEnabled((prev) => !prev);
	};

	return (
		<div
			title={`${dragEnabled ? 'Закрепить' : 'Переместить'}: СКМ`}
			ref={currentWrapper}
			onMouseDownCapture={onMouseWheelClick}
			onPointerDown={onPointerDown}
			onPointerMove={onPointerMove}
			onPointerUp={onPointerUp}
			style={{
				...styles,
				position: 'absolute',
				transform: `translate(${initialState.x}px, ${initialState.y}px)`,
				zIndex: dragEnabled ? 50 : zIndex,
				cursor: dragEnabled ? 'move' : 'default',
				border: dragEnabled ? '2px solid #2175f3' : undefined,
				display: 'flex',
				flexDirection: 'column',
			}}
			className={containerClassName}
		>
			{children}
		</div>
	);
};
