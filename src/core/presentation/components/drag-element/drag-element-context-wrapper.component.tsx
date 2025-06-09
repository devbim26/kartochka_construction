import { DragElementContext } from '@core/utils';
import { useState } from 'react';

interface DragElementContextWrapperProps {
	children: React.ReactNode;
}

export const DragElementContextWrapper = ({ children }: DragElementContextWrapperProps) => {
	const [draggableElementId, setDraggableElementId] = useState<string>('');

	return (
		<DragElementContext.Provider value={{ draggableElementId, setDraggableElementId }}>
			{children}
		</DragElementContext.Provider>
	);
};
