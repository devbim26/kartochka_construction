import { use3dScene } from '@features/constructor/utils';
import { useRef } from 'react';
import { uiPanelConstructor } from './ifc-viewer-ui-constructors';

export const IFCViewer = () => {
	const sceneContainerRef = useRef<HTMLDivElement>(null);

	use3dScene(sceneContainerRef, {
		uiPanelConstructor: uiPanelConstructor,
	});

	return <div className="relative flex flex-1" ref={sceneContainerRef}></div>;
};
