import { DragElement, DragElementContextWrapper } from '@core';
import {
	ifcModelProperiesPanelConstructor,
	treeInfoPanelConstructor,
	uiControlPanelConstructor,
	useIFCViewer,
} from '@features/constructor/utils';
import { useRef } from 'react';

export const IFCViewerComponent = () => {
	const ifcViewerRef = useRef<HTMLDivElement>(null);
	const sceneContainerRef = useRef<HTMLDivElement>(null);
	const controlPanelRef = useRef<HTMLDivElement>(null);
	const treeInfoPanelContainerRef = useRef<HTMLDivElement>(null);
	const propertiesPanelContainerRef = useRef<HTMLDivElement>(null);

	useIFCViewer({
		sceneContainer: sceneContainerRef,
		ui: {
			controlPanel: {
				constructor: uiControlPanelConstructor,
				container: controlPanelRef,
			},
			treeInfoPanel: {
				constructor: treeInfoPanelConstructor,
				container: treeInfoPanelContainerRef,
			},
			propertiesPanel: {
				constructor: ifcModelProperiesPanelConstructor,
				container: propertiesPanelContainerRef,
			},
		},
	});

	return (
		<div className="relative flex flex-1" ref={ifcViewerRef}>
			<DragElementContextWrapper>
				<DragElement
					initialPosition={{
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
					initialPosition={{
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
				<DragElement
					parentRef={ifcViewerRef}
					initialPosition={{
						bottom: 270,
						left: 400,
					}}
					styles={{
						borderRadius: '1rem',
					}}
				>
					<div ref={propertiesPanelContainerRef}></div>
				</DragElement>
			</DragElementContextWrapper>
			<div className="relative z-0 flex flex-1" ref={sceneContainerRef}></div>
		</div>
	);
};
