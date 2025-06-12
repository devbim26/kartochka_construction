import { IFCViewerRelationsTree } from '@features/constructor/types';
import { FragmentsManager, IfcLoader, IfcRelationsIndexer } from '@thatopen/components';
import { Highlighter } from '@thatopen/components-front';
import { tables } from '@thatopen/ui-obc';
import { IFCViewerBase } from './ifc-viewer-base.class';
import { IFCViewerCore } from './ifc-viewer-core.class';

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
		fragmentIfcLoader.settings.webIfc.COORDINATE_TO_ORIGIN = true;

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
			fragmentIfcLoader: fragmentIfcLoader,
			fragmentsManager: fragmentsManager,
			ifcRelationsIndexer: ifcRelationsIndexer,
			relationsTree: relationsTree,
		}));
	}

	destroy() {
		this.baseDestroy();
	}

	async getFragments(fileData: ArrayBuffer, fileName: string) {
		const buffer = new Uint8Array(fileData);
		const fragments = await this.state.fragmentIfcLoader!.load(buffer);
	}
}
