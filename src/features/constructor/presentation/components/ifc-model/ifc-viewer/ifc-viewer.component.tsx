import { DragElement } from '@core';
import { useIFCViewer } from '@features/constructor/utils';
import { useRef } from 'react';
import { modelInfoPanelConstructor, uiControlPanelConstructor } from './ifc-viewer-ui-constructors';

export const IFCViewer = () => {
	const ifcViewerRef = useRef<HTMLDivElement>(null);
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
		<div
			className="relative flex flex-1 rounded-[20px] border border-[#EDEFF2] p-[14px]"
			ref={ifcViewerRef}
		>
			<DragElement
				initialState={{
					x: 30,
					y: 70,
				}}
				parentRef={ifcViewerRef}
				styles={{
					borderRadius: '1rem',
				}}
			>
				<div ref={modalInfroPanelContainerRef}></div>
			</DragElement>
			<DragElement
				initialState={{
					x: 200,
					y: 70,
				}}
				parentRef={ifcViewerRef}
				styles={{
					borderRadius: '1rem',
				}}
			>
				<div ref={controlPanelRef}></div>
			</DragElement>
			<div className="relative z-0 flex flex-1" ref={sceneContainerRef}></div>
		</div>
	);
};
