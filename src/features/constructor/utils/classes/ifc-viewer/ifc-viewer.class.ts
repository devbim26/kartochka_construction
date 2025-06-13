import type {
	IFCViewerOnDoubleClickHandler,
	IFCViewerOnKeyDownHandler,
	IFCViewerProjectionOnChanged,
	IFCViewerRenderEventHandler,
	IFCViewerVoidAsyncFunc,
	IFCViewerVoidFunc,
} from '@features/constructor/types';
import type { RefObject } from 'react';
import {
	IFCViewerBase,
	IFCViewerClipper,
	IFCViewerClipperState,
	IFCViewerCore,
	IFCViewerModelManager,
	IFCViewerStats,
	IFCViewerUI,
	type IFCViewerCoreState,
	type IFCViewerModelManagerState,
	type IFCViewerStatsState,
	type IFCViewerUIConstructorArgs,
	type IFCViewerUIState,
} from './core';

interface IFCViewerContainers {
	sceneContainer: RefObject<HTMLDivElement | null>;
	panels: {
		controlPanelContainer: RefObject<HTMLDivElement | null>;
		treeInfoPanelContainer: RefObject<HTMLDivElement | null>;
	};
}

export interface IFCViewerState {
	core: IFCViewerCore | null;
	clipper: IFCViewerClipper | null;
	modelManager: IFCViewerModelManager | null;
	ui: IFCViewerUI | null;
	stats: IFCViewerStats | null;
	containers: IFCViewerContainers | null;
}

export interface IFCViewerConstructorArgs {
	ui: {
		constructors: IFCViewerUIConstructorArgs['constructors'];
	};
}

export class IFCViewer extends IFCViewerBase<IFCViewerState, IFCViewerConstructorArgs> {
	private _onKeyDownHandlerRef: IFCViewerOnKeyDownHandler | null = null;
	private _onDoubleClickHandlerRef: IFCViewerOnDoubleClickHandler | null = null;
	private _onResizeHandlerRef: IFCViewerVoidFunc | null = null;
	private _onBeforeUpdateHandlerRef: IFCViewerRenderEventHandler | null = null;
	private _onAfterUpdateHandlerRef: IFCViewerRenderEventHandler | null = null;
	private _projectionOnChangedRef: IFCViewerProjectionOnChanged | null = null;
	private _loadIfcFileHandlerRef: IFCViewerVoidAsyncFunc | null = null;
	private _disposeFragmentsHandlerRef: IFCViewerVoidFunc | null = null;

	get inited(): boolean {
		return this.baseState.inited;
	}

	protected async init(props: IFCViewerConstructorArgs) {
		const core = await IFCViewerBase.create(
			IFCViewerCore,
			{
				sceneContainer: this.state.containers!.sceneContainer,
			},
			{
				currentWorld: null,
				components: null,
				worlds: null,
				currentGrid: null,
			} as IFCViewerCoreState,
		);

		const modelManager = await IFCViewerBase.create(
			IFCViewerModelManager,
			{
				ifcViewerCoreInstance: core,
			},
			{
				fragmentIfcLoader: null,
				fragmentsManager: null,
				ifcRelationsIndexer: null,
				relationsTree: null,
			} as IFCViewerModelManagerState,
		);

		const clipper = await IFCViewerBase.create(
			IFCViewerClipper,
			{
				ifcViewerCoreInstance: core,
			},
			{ currentClipper: null, caster: null, casters: null } as IFCViewerClipperState,
		);

		let stats: IFCViewerState['stats'] = null;

		if (!!process.env.REACT_APP_MODE && process.env.REACT_APP_MODE === 'development') {
			stats = await IFCViewerBase.create(
				IFCViewerStats,
				{
					sceneContainer: this.state.containers!.sceneContainer,
				},
				{ statsPanel: null } as IFCViewerStatsState,
			);
		}

		this.setupHandlers(core, modelManager);

		core.currentWorld!.scene.setup();

		const ui = await IFCViewerBase.create(
			IFCViewerUI,
			{
				constructors: props.ui.constructors,
				constructorProps: {
					uiControlPanelConstructorProps: {
						sceneItems: {
							world: core.currentWorld!,
							grid: core.currentGrid!,
							clipper: clipper.currentClipper!,
						},
						callbacks: {
							loadIfcFileHandler: this._loadIfcFileHandlerRef!,
							disposeFragmentsHandler: this._disposeFragmentsHandlerRef!,
						},
					},
					treeInfoPanelConstructorProps: {
						components: core.components!,
						relationsTree: modelManager.relationsTree!,
					},
				},
				containers: this.state.containers!.panels,
			},
			{ stub: null } as IFCViewerUIState,
		);

		this.changeState(() => ({
			core,
			modelManager,
			clipper,
			stats,
			ui,
		}));
	}

	destroy() {
		this.destoyHandlers();
		this.baseDestroy();
	}

	private destoyHandlers() {
		const containers = this.state.containers!;

		// containers.sceneContainer.current?.removeEventListener(
		// 	'keydown',
		// 	this._onKeyDownHandlerRef!,
		// );
		// containers.sceneContainer.current?.removeEventListener(
		// 	'dblclick',
		// 	this._onDoubleClickHandlerRef!,
		// );
		containers.sceneContainer.current?.removeEventListener('resize', this._onResizeHandlerRef!);

		this.state.core?.currentWorld?.renderer?.onBeforeUpdate.remove(
			this._onBeforeUpdateHandlerRef!,
		);
		this.state.core?.currentWorld?.renderer?.onAfterUpdate.remove(
			this._onAfterUpdateHandlerRef!,
		);

		this.state.core?.currentWorld?.camera.projection.onChanged.remove(
			this._projectionOnChangedRef!,
		);
	}

	private setupHandlers(core: IFCViewerCore, modelManager: IFCViewerModelManager) {
		const containers = this.state.containers!;

		this._onKeyDownHandlerRef = this.onKeyDownHandler.bind(this);
		//containers.sceneContainer.current?.addEventListener('keydown', this._onKeyDownHandlerRef);

		this._onDoubleClickHandlerRef = this.onDoubleClickHandler.bind(this);
		// containers.sceneContainer.current?.addEventListener(
		// 	'dblclick',
		// 	this._onDoubleClickHandlerRef,
		// );

		this._onResizeHandlerRef = this.onResizeHandler.bind(this);
		containers.sceneContainer.current?.addEventListener('resize', this._onResizeHandlerRef);

		this._onBeforeUpdateHandlerRef = this.onBeforeUpdateHandler.bind(this);
		this._onAfterUpdateHandlerRef = this.onAfterUpdateHandler.bind(this);
		core.currentWorld!.renderer!.onBeforeUpdate.add(this._onBeforeUpdateHandlerRef);
		core.currentWorld!.renderer!.onAfterUpdate.add(this._onAfterUpdateHandlerRef);

		this._projectionOnChangedRef = this.projectionOnChanged.bind(this);
		core.currentWorld!.camera.projection.onChanged.add(this._projectionOnChangedRef);

		this._loadIfcFileHandlerRef = this.loadIfcFileHandler.bind(this);
		this._disposeFragmentsHandlerRef = this.disposeFragmentsHandler.bind(this);
	}

	private onKeyDownHandler(event: KeyboardEvent) {
		if (event.code === 'Delete') {
			this.state.clipper?.deleteClipperPlane(this.state.core!.currentWorld!);
		}
	}

	private onDoubleClickHandler() {
		this.state.clipper?.addClipperPlane(this.state.core!);
	}

	private onResizeHandler() {
		this.state.core?.currentWorld!.renderer!.resize();
		this.state.core?.currentWorld!.camera!.updateAspect();
	}

	private onBeforeUpdateHandler() {
		this.state.stats?.statsPanel?.begin();
	}

	private onAfterUpdateHandler() {
		this.state.stats?.statsPanel?.end();
	}

	private projectionOnChanged() {
		this.state.core!.currentGrid!.fade =
			this.state.core!.currentWorld!.camera.projection.current === 'Perspective';
	}

	private async loadIfcFileHandler() {
		const input = document.createElement('input');
		input.type = 'file';
		input.accept = '.ifc';
		input.style.display = 'none';

		const handleFileLoad = async (event: Event) => {
			const file = (event.target as HTMLInputElement).files?.[0];
			if (!file) {
				document.body.removeChild(input);
				input.removeEventListener('change', handleFileLoad);
				return;
			}

			const reader = new FileReader();
			reader.readAsArrayBuffer(file);

			reader.onload = async () => {
				await this.state.modelManager?.loadModel(
					reader.result as ArrayBuffer,
					this.state.core!.currentWorld!,
					file.name,
				);

				document.body.removeChild(input);
				input.removeEventListener('change', handleFileLoad);
			};
		};

		input.addEventListener('change', handleFileLoad);

		document.body.appendChild(input);
		input.click();
	}

	private disposeFragmentsHandler() {
		this.state.modelManager?.disposeModel(this.state.core!, this.state.clipper!);
	}
}
