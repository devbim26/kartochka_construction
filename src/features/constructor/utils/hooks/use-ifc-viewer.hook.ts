import { useLayoutEffect, useRef } from 'react';
import {
	IFCViewer,
	IFCViewerBase,
	type IFCViewerConstructorArgs,
	type IFCViewerState,
} from '../classes';

const IFCIFCViewerDefState: IFCViewerState = {
	core: null,
	clipper: null,
	modelManager: null,
	ui: null,
	stats: null,
};

export const useIFCViewer = (props: IFCViewerConstructorArgs) => {
	const currentViewer = useRef<IFCViewer>(null);

	useLayoutEffect(() => {
		if (props.sceneContainer.current) {
			IFCViewerBase.create(IFCViewer, props, IFCIFCViewerDefState).then(
				(res) => (currentViewer.current = res),
			);
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
