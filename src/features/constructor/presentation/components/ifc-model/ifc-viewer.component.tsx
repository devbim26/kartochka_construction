import { DragElement, DragElementContextWrapper } from '@core';
import {
	treeInfoPanelConstructor,
	uiControlPanelConstructor,
	ifcModelProperiesPanelConstructor,
	useIFCViewer,
} from '@features/constructor/utils';
import { useCallback, useRef, useState } from 'react';
import { IfcPanelToolbar } from './ifc-panel-toolbar.component';
import {
	clearIfcPanelLayoutStorage,
	IFC_PANEL_DEFAULT_INITIAL,
	IFC_PANEL_DEFAULT_VISIBILITY,
	loadIfcPanelLayout,
	saveIfcPanelLayout,
	type IfcPanelId,
	type IfcPanelLayoutState,
	type IfcPanelPosition,
} from './ifc-panel-layout.utils';

const PANEL_TITLES: Record<IfcPanelId, string> = {
	tree: 'Дерево модели',
	control: 'Управление',
	properties: 'Свойства',
};

export const IFCViewerComponent = () => {
	const ifcViewerRef = useRef<HTMLDivElement>(null);
	const sceneContainerRef = useRef<HTMLDivElement>(null);
	const controlPanelRef = useRef<HTMLDivElement>(null);
	const treeInfoPanelContainerRef = useRef<HTMLDivElement>(null);
	const propertiesPanelContainerRef = useRef<HTMLDivElement>(null);

	const [layout, setLayout] = useState<IfcPanelLayoutState>(loadIfcPanelLayout);
	const [layoutVersion, setLayoutVersion] = useState(0);

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

	const persistPosition = useCallback((id: IfcPanelId, position: IfcPanelPosition) => {
		setLayout((prev) => {
			const next: IfcPanelLayoutState = {
				...prev,
				positions: { ...prev.positions, [id]: position },
			};
			saveIfcPanelLayout(next);
			return next;
		});
	}, []);

	const togglePanel = useCallback((id: IfcPanelId) => {
		setLayout((prev) => {
			const next: IfcPanelLayoutState = {
				...prev,
				visible: { ...prev.visible, [id]: !prev.visible[id] },
			};
			saveIfcPanelLayout(next);
			return next;
		});
	}, []);

	const resetLayout = useCallback(() => {
		clearIfcPanelLayoutStorage();
		setLayout({
			visible: { ...IFC_PANEL_DEFAULT_VISIBILITY },
			positions: {},
		});
		setLayoutVersion((v) => v + 1);
	}, []);

	const focusScene = () => {
		sceneContainerRef.current?.focus();
	};

	return (
		<div
			className="relative flex min-h-0 min-w-0 flex-1 flex-row"
			ref={ifcViewerRef}
		>
			<IfcPanelToolbar
				visible={layout.visible}
				onToggle={togglePanel}
				onResetLayout={resetLayout}
			/>

			<button
				type="button"
				onClick={focusScene}
				className="pointer-events-auto absolute bottom-3 right-3 z-[60] rounded-lg border border-gray-200 bg-white/95 px-3 py-1.5 text-xs text-gray-700 shadow-md hover:bg-gray-50"
			>
				Фокус на 3D-сцену
			</button>

			<DragElementContextWrapper>
				<DragElement
					key={`tree-${layoutVersion}`}
					title={PANEL_TITLES.tree}
					parentRef={ifcViewerRef}
					initialPosition={IFC_PANEL_DEFAULT_INITIAL.tree}
					savedPosition={layout.positions.tree}
					onPositionChange={(pos) => persistPosition('tree', pos)}
					styles={{
						borderRadius: '0.75rem',
						maxWidth: 'min(420px, 90vw)',
						display: layout.visible.tree ? 'flex' : 'none',
					}}
				>
					<div ref={treeInfoPanelContainerRef} />
				</DragElement>
				<DragElement
					key={`control-${layoutVersion}`}
					title={PANEL_TITLES.control}
					parentRef={ifcViewerRef}
					initialPosition={IFC_PANEL_DEFAULT_INITIAL.control}
					savedPosition={layout.positions.control}
					onPositionChange={(pos) => persistPosition('control', pos)}
					styles={{
						borderRadius: '0.75rem',
						maxWidth: 'min(360px, 90vw)',
						display: layout.visible.control ? 'flex' : 'none',
					}}
				>
					<div ref={controlPanelRef} />
				</DragElement>
				<DragElement
					key={`properties-${layoutVersion}`}
					title={PANEL_TITLES.properties}
					parentRef={ifcViewerRef}
					initialPosition={IFC_PANEL_DEFAULT_INITIAL.properties}
					savedPosition={layout.positions.properties}
					onPositionChange={(pos) => persistPosition('properties', pos)}
					styles={{
						borderRadius: '0.75rem',
						maxWidth: 'min(480px, 90vw)',
						display: layout.visible.properties ? 'flex' : 'none',
					}}
				>
					<div ref={propertiesPanelContainerRef} />
				</DragElement>
			</DragElementContextWrapper>

			<div
				className="relative z-0 flex min-h-0 min-w-0 flex-1 flex-col outline-none"
				ref={sceneContainerRef}
				role="application"
				aria-label="3D сцена IFC"
				onMouseDown={() => sceneContainerRef.current?.focus()}
			/>
		</div>
	);
};
