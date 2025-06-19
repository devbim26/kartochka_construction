import type { IFCViewerRelationsTree } from '@features/constructor/types';
import { FragmentsManager, IfcLoader, IfcRelationsIndexer } from '@thatopen/components';
import { Highlighter } from '@thatopen/components-front';
import type { UpdateFunction } from '@thatopen/ui';
import { tables } from '@thatopen/ui-obc';
import type { RelationsTreeUIState } from '@thatopen/ui-obc/dist/components/tables/RelationsTree/src/template';
import { Mesh } from 'three';
import { IFCViewerBase } from './ifc-viewer-base.class';
import type { IFCViewerCore } from './ifc-viewer-core.class';

interface IFCViewerModelManagerConstructorArgs {
	ifcViewerCoreInstance: IFCViewerCore;
}

export interface IFCViewerModelManagerState {
	relationsTree: {
		tree: IFCViewerRelationsTree;
		updateTree: UpdateFunction<RelationsTreeUIState>;
	} | null;
	fragmentIfcLoader: IfcLoader | null;
	fragmentsManager: FragmentsManager | null;
	ifcRelationsIndexer: IfcRelationsIndexer | null;
}

export class IFCViewerModelManager extends IFCViewerBase<
	IFCViewerModelManagerState,
	IFCViewerModelManagerConstructorArgs
> {
	get fragmentIfcLoader(): IFCViewerModelManagerState['fragmentIfcLoader'] {
		return this.state.fragmentIfcLoader;
	}

	get fragmentsManager(): IFCViewerModelManagerState['fragmentsManager'] {
		return this.state.fragmentsManager;
	}

	get ifcRelationsIndexer(): IFCViewerModelManagerState['ifcRelationsIndexer'] {
		return this.state.ifcRelationsIndexer;
	}

	get relationsTree(): IFCViewerModelManagerState['relationsTree'] {
		return this.state.relationsTree;
	}

	protected async init(props: IFCViewerModelManagerConstructorArgs) {
		const fragmentsManager = props.ifcViewerCoreInstance.components!.get(FragmentsManager);
		const fragmentIfcLoader = props.ifcViewerCoreInstance.components!.get(IfcLoader);
		await fragmentIfcLoader.setup();

		const highlighter = props.ifcViewerCoreInstance.components!.get(Highlighter);
		highlighter.setup({ world: props.ifcViewerCoreInstance.currentWorld });
		highlighter.zoomToSelection = true;

		const ifcRelationsIndexer =
			props.ifcViewerCoreInstance.components!.get(IfcRelationsIndexer);

		const [tree, updateTree] = tables.relationsTree({
			components: props.ifcViewerCoreInstance.components!,
			models: [],
		});

		tree.preserveStructureOnFilter = true;

		this.changeState(() => ({
			fragmentIfcLoader,
			fragmentsManager,
			ifcRelationsIndexer,
			relationsTree: {
				tree,
				updateTree,
			},
		}));
	}

	destroy() {
		this.baseDestroy({
			direction: [
				'relationsTree',
				'ifcRelationsIndexer',
				'fragmentIfcLoader',
				'fragmentsManager',
			],
		});
	}

	async loadModel(buffer: ArrayBuffer, core: IFCViewerCore, filename: string) {
		this.state.fragmentsManager?.dispose();
		this.state.ifcRelationsIndexer?.dispose();
		core.currentWorld!.meshes.clear();
		const model = await this.state.fragmentIfcLoader!.load(new Uint8Array(buffer));
		model.name = filename;
		core.currentWorld!.scene.three.add(model);
		model.traverse((item) => {
			if (item instanceof Mesh) core.currentWorld!.meshes.add(item);
		});
		if (model.hasProperties) {
			await this.state.ifcRelationsIndexer!.process(model);
			this.state.relationsTree!.updateTree({
				models: [model],
			});
		}
	}

	disposeModel(core: IFCViewerCore) {
		this.state.fragmentsManager?.dispose();
		this.state.ifcRelationsIndexer?.dispose();
		this.state.relationsTree!.updateTree({
			models: [],
		});
	}
}
