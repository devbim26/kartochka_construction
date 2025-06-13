import type { IFCViewerRelationsTree, IFCViewerWorld } from '@features/constructor/types';
import { FragmentsManager, IfcLoader, IfcRelationsIndexer } from '@thatopen/components';
import { Highlighter } from '@thatopen/components-front';
import { tables } from '@thatopen/ui-obc';
import { Mesh } from 'three';
import { IFCViewerBase } from './ifc-viewer-base.class';
import { IFCViewerClipper } from './ifc-viewer-clipper.class';
import type { IFCViewerCore } from './ifc-viewer-core.class';

interface IFCViewerModelManagerConstructorArgs {
	ifcViewerCoreInstance: IFCViewerCore;
}

export interface IFCViewerModelManagerState {
	fragmentIfcLoader: IfcLoader | null;
	fragmentsManager: FragmentsManager | null;
	ifcRelationsIndexer: IfcRelationsIndexer | null;
	relationsTree: IFCViewerRelationsTree | null;
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

		const [tree] = tables.relationsTree({
			components: props.ifcViewerCoreInstance.components!,
			models: [],
		});

		tree.preserveStructureOnFilter = true;

		const relationsTree = tree;

		this.changeState(() => ({
			fragmentIfcLoader,
			fragmentsManager,
			ifcRelationsIndexer,
			relationsTree,
		}));
	}

	destroy() {
		this.baseDestroy();
	}

	async loadModel(buffer: ArrayBuffer, world: IFCViewerWorld, filename: string) {
		this.state.fragmentsManager?.dispose();
		world.meshes.clear();
		const model = await this.state.fragmentIfcLoader!.load(new Uint8Array(buffer));
		model.name = filename;
		world.scene.three.add(model);
		model.traverse((item) => {
			if (item instanceof Mesh) world.meshes.add(item);
		});
		if (model.hasProperties) await this.state.ifcRelationsIndexer?.process(model);
	}

	disposeModel(core: IFCViewerCore, clipper: IFCViewerClipper) {
		clipper.currentClipper?.deleteAll();
		this.state.fragmentsManager?.dispose();
		this.ifcRelationsIndexer?.dispose();
		const [tree] = tables.relationsTree({
			components: core.components!,
			models: [],
		});
		tree.preserveStructureOnFilter = true;
		this.changeState(() => ({ relationsTree: tree }));
	}
}
