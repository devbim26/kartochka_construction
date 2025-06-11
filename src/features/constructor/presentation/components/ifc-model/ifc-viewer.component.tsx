import { DragElement, DragElementContextWrapper } from '@core';
import { uiControlPanelConstructor, useIFCViewer } from '@features/constructor/utils';
import { treeInfoPanelConstructor } from '@features/constructor/utils/classes/ifc-viewer/ifc-viewer-ui-constructors/tree-info-panel.constructor';
import { useRef } from 'react';

export const IFCViewerComponent = () => {
	const ifcViewerRef = useRef<HTMLDivElement>(null);
	const sceneContainerRef = useRef<HTMLDivElement>(null);
	const controlPanelRef = useRef<HTMLDivElement>(null);
	const treeInfoPanelContainerRef = useRef<HTMLDivElement>(null);

	useIFCViewer({
		viewerProps: {
			ui: {
				constructors: {
					treeInfoPanelConstructor,
					uiControlPanelConstructor,
				},
			},
		},
		containers: {
			sceneContainer: sceneContainerRef,
			controlPanelContainer: controlPanelRef,
			treeInfoPanelContainer: treeInfoPanelContainerRef,
		},
	});

	return (
		<div
			className="relative flex flex-1 rounded-[20px] border border-[#EDEFF2] p-[14px]"
			ref={ifcViewerRef}
		>
			<DragElementContextWrapper>
				<DragElement
					initialState={{
						left: 30,
						top: 70,
					}}
					parentRef={ifcViewerRef}
					styles={{
						borderRadius: '1rem',
					}}
				>
					<div ref={treeInfoPanelContainerRef}></div>
				</DragElement>
				<DragElement
					initialState={{
						right: 270,
						top: 70,
					}}
					parentRef={ifcViewerRef}
					styles={{
						borderRadius: '1rem',
					}}
				>
					<div ref={controlPanelRef}></div>
				</DragElement>
			</DragElementContextWrapper>
			<div className="relative z-0 flex flex-1" ref={sceneContainerRef}></div>
		</div>
	);
};
