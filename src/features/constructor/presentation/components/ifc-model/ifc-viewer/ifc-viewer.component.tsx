import { useIFCViewer } from '@features/constructor/utils';
import { useRef } from 'react';
import { uiControlPanelConstructor } from './ifc-viewer-ui-constructors';

export const IFCViewer = () => {
	const sceneContainerRef = useRef<HTMLDivElement>(null);
	const panelRef = useRef<HTMLDivElement>(null);
	useIFCViewer(sceneContainerRef, panelRef, {
		uiControlPanelConstructor: uiControlPanelConstructor,
	});

	return (
		<div className="relative flex flex-1">
			<div className="absolute right-10 top-10 z-10" ref={panelRef}></div>
			<div className="z-1 relative flex flex-1" ref={sceneContainerRef}></div>
		</div>
	);
};
