import { useLayoutEffect, useRef, type RefObject } from 'react';
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
	containers: null,
	constructors: null,
};

export const useIFCViewer = (props: {
	viewerProps: IFCViewerConstructorArgs;
	containers: {
		sceneContainer: RefObject<HTMLDivElement | null>;
		controlPanelContainer: RefObject<HTMLDivElement | null>;
		treeInfoPanelContainer: RefObject<HTMLDivElement | null>;
	};
}) => {
	const currentViewer = useRef<IFCViewer>(null);

	useLayoutEffect(() => {
		const isExists = Object.values(props.containers).every(
			(c) => !!(c as RefObject<any>).current,
		);
		if (isExists) {
			IFCViewerBase.create(IFCViewer, props.viewerProps, {
				...IFCIFCViewerDefState,
				containers: {
					sceneContainer: props.containers.sceneContainer,
					panels: {
						controlPanelContainer: props.containers.controlPanelContainer,
						treeInfoPanelContainer: props.containers.treeInfoPanelContainer,
					},
				},
				constructors: props.viewerProps.ui.constructors,
			} as IFCViewerState).then((res) => (currentViewer.current = res));
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
