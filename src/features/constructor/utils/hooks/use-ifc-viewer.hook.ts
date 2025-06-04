import { IFCViewer } from '@features/constructor/presentation/components/ifc-model/ifc-viewer/ifc-viewer.class';
import { IFCViewerOptions } from '@features/constructor/types';
import { RefObject, useLayoutEffect, useRef } from 'react';

export const useIFCViewer = (
	sceneContainer: RefObject<HTMLDivElement | null>,
	panelContainer: RefObject<HTMLDivElement | null>,
	options?: IFCViewerOptions,
) => {
	const currentViewer = useRef<IFCViewer>(null);

	useLayoutEffect(() => {
		if (sceneContainer.current && panelContainer.current) {
			currentViewer.current = new IFCViewer(sceneContainer, panelContainer, options);
		}
		return () => {
			if (currentViewer.current) {
				currentViewer.current.destroy();
				currentViewer.current = null;
			}
		};
	}, []);

	return { currentViewer };
};
