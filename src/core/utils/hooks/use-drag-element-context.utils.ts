import { createContext, useContext } from 'react';

interface DragElementContextType {
	draggableElementId: string;
	setDraggableElementId: (value: string) => void;
}

export const DragElementContext = createContext<DragElementContextType | undefined>(undefined);

export const useDragElementContext = () => {
	const context = useContext(DragElementContext);
	if (!context) {
		throw new Error('useDragElement must be used within a DragElementContextWrapper');
	}
	return context;
};
