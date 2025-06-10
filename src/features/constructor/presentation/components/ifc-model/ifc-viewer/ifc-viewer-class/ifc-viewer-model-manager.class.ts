import { IFCViewerRelationsTree } from '@features/constructor/types';
import { FragmentsManager, IfcLoader, IfcRelationsIndexer } from '@thatopen/components';
import { Highlighter } from '@thatopen/components-front';
import { FragmentsGroup } from '@thatopen/fragments';
import { tables } from '@thatopen/ui-obc';
import { IFCViewerCore } from './ifc-viewer-core.class';

type OnFragmentsLoadedHandler = (model: FragmentsGroup) => Promise<any>;

interface IFCViewerModelManagerConstructorArgs {
	ifcViewerCoreInstance: IFCViewerCore;
}

export class IFCViewerModelManager {
	private _currentFragmentIfcLoader: IfcLoader | null = null;
	private _currentFragmentsManager: FragmentsManager | null = null;
	private _currentIfcRelationsIndexer: IfcRelationsIndexer | null = null;
	private _currentRelationsTree: IFCViewerRelationsTree | null = null;

	//external
	private _ifcViewerCoreInstance: IFCViewerCore | null = null;

	private _onFragmentsLoadedHandlerRef: OnFragmentsLoadedHandler | null = null;

	constructor(args: IFCViewerModelManagerConstructorArgs) {
		this._ifcViewerCoreInstance = args.ifcViewerCoreInstance;
		this.setupIfcLoader(args.components);
	}

	destroy() {}

	private async setupIfcLoader(components: IFCViewerModelManagerConstructorArgs['components']) {
		this._currentFragmentsManager = components.get(FragmentsManager);
		this._currentFragmentIfcLoader = components.get(IfcLoader);
		await this._currentFragmentIfcLoader.setup();
		this._currentFragmentIfcLoader.settings.webIfc.COORDINATE_TO_ORIGIN = true;

		const highlighter = components.get(Highlighter);
		highlighter.setup({ world: this._currentWorldInstance });
		highlighter.zoomToSelection = true;

		this._currentIfcRelationsIndexer = components.get(IfcRelationsIndexer);

		this._onFragmentsLoadedHandlerRef = this.onFragmentsLoadedHandler.bind(this);
		this._currentFragmentsManager.onFragmentsLoaded.add(this._onFragmentsLoadedHandlerRef);

		const [relationsTree] = tables.relationsTree({
			components: components,
			models: [],
		});

		relationsTree.preserveStructureOnFilter = true;

		this._currentRelationsTree = relationsTree;
	}

	private async onFragmentsLoadedHandler(model: FragmentsGroup) {
		if (!!this._currentWorldInstance?.scene) this._currentWorldInstance!.scene.three.add(model);
		if (model.hasProperties) await this._currentIfcRelationsIndexer!.process(model);
	}
}
