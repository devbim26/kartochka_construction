import { IFCViewer } from '@features/constructor/presentation/components/ifc-model/ifc-viewer/ifc-viewer.class';
import type { IFCViewerContainers, IFCViewerOptions } from '@features/constructor/types';
import { useLayoutEffect, useRef, type RefObject } from 'react';

export const useIFCViewer = (conatiners: IFCViewerContainers, options: IFCViewerOptions) => {
	const currentViewer = useRef<IFCViewer>(null);

	useLayoutEffect(() => {
		const isExists = Object.values(conatiners).every((c) => !!(c as RefObject<any>).current);
		if (isExists) {
			currentViewer.current = new IFCViewer(conatiners, options);
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
