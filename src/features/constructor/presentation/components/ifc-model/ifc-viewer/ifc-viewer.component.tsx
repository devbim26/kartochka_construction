import { useIFCViewer } from '@features/constructor/utils';
import { useRef } from 'react';
import { modelInfoPanelConstructor, uiControlPanelConstructor } from './ifc-viewer-ui-constructors';

export const IFCViewer = () => {
	const sceneContainerRef = useRef<HTMLDivElement>(null);
	const controlPanelRef = useRef<HTMLDivElement>(null);
	const modalInfroPanelContainerRef = useRef<HTMLDivElement>(null);

	useIFCViewer(
		{
			controlPanelContainer: controlPanelRef,
			sceneContainer: sceneContainerRef,
			modalInfroPanelContainer: modalInfroPanelContainerRef,
		},
		{
			ui: {
				uiControlPanelConstructor: uiControlPanelConstructor,
				modelInfoPanelConstructor: modelInfoPanelConstructor,
			},
		},
	);

	return (
		<div className="relative flex flex-1 rounded-[20px] border border-[#EDEFF2] p-[14px]">
			<div
				className="absolute left-10 top-[70px] z-10"
				ref={modalInfroPanelContainerRef}
			></div>
			<div className="absolute right-10 top-10 z-10" ref={controlPanelRef}></div>
			<div className="relative z-0 flex flex-1" ref={sceneContainerRef}></div>
		</div>
	);
};
