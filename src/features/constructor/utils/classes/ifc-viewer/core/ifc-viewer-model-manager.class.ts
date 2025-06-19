import type { IFCDataTable } from '@features/constructor/types';
import { Classifier, FragmentsManager, IfcLoader, IfcRelationsIndexer } from '@thatopen/components';
import { Highlighter } from '@thatopen/components-front';
import { FragmentIdMap } from '@thatopen/fragments';
import type { UpdateFunction } from '@thatopen/ui';
import { tables } from '@thatopen/ui-obc';
import { ClassificationTreeUIState } from '@thatopen/ui-obc/dist/components/tables/ClassificationsTree/src/template';
import { ElementPropertiesUI } from '@thatopen/ui-obc/dist/components/tables/ElementProperties/src/template';
import type { RelationsTreeUIState } from '@thatopen/ui-obc/dist/components/tables/RelationsTree/src/template';
import { Mesh } from 'three';
import { IFCViewerBase } from './ifc-viewer-base.class';
import type { IFCViewerCore } from './ifc-viewer-core.class';

interface IFCViewerModelManagerConstructorArgs {
	ifcViewerCoreInstance: IFCViewerCore;
}

export interface IFCViewerModelManagerState {
	relationsTree: {
		tree: IFCDataTable;
		updateTree: UpdateFunction<RelationsTreeUIState>;
	} | null;
	classificationsTree: {
		tree: IFCDataTable;
		updateTree: UpdateFunction<ClassificationTreeUIState>;
	} | null;
	propertiesTable: {
		table: IFCDataTable;
		updateTable: UpdateFunction<ElementPropertiesUI>;
	} | null;
	fragmentIfcLoader: IfcLoader | null;
	fragmentsManager: FragmentsManager | null;
	ifcRelationsIndexer: IfcRelationsIndexer | null;
	classifier: Classifier | null;
	highlighter: Highlighter | null;
}

export class IFCViewerModelManager extends IFCViewerBase<
	IFCViewerModelManagerState,
	IFCViewerModelManagerConstructorArgs
> {
	private _onHighlightHandlerRef: ((fragmentIdMap: FragmentIdMap) => void) | null = null;
	private _onClearHighlightHandlerRef: (() => void) | null = null;

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

	get classificationsTree(): IFCViewerModelManagerState['classificationsTree'] {
		return this.state.classificationsTree;
	}

	get propertiesTable(): IFCViewerModelManagerState['propertiesTable'] {
		return this.state.propertiesTable;
	}

	protected async init(props: IFCViewerModelManagerConstructorArgs) {
		const fragmentsManager = props.ifcViewerCoreInstance.components!.get(FragmentsManager);
		const fragmentIfcLoader = props.ifcViewerCoreInstance.components!.get(IfcLoader);
		await fragmentIfcLoader.setup();

		const highlighter = props.ifcViewerCoreInstance.components!.get(Highlighter);
		highlighter.setup({ world: props.ifcViewerCoreInstance.currentWorld });
		highlighter.zoomToSelection = true;

		this._onHighlightHandlerRef = this.onHighlightHandler.bind(this);
		highlighter.events.select.onHighlight.add(this._onHighlightHandlerRef);

		this._onClearHighlightHandlerRef = this.onClearHighlightHandler.bind(this);
		highlighter.events.select.onClear.add(this._onClearHighlightHandlerRef);

		const ifcRelationsIndexer =
			props.ifcViewerCoreInstance.components!.get(IfcRelationsIndexer);

		const [relationsTreeInstance, updateRelationsTree] = tables.relationsTree({
			components: props.ifcViewerCoreInstance.components!,
			models: [],
		});

		relationsTreeInstance.preserveStructureOnFilter = true;

		const classifier = props.ifcViewerCoreInstance.components!.get(Classifier);

		const [classificationsTreeInstance, updateClassificationsTree] = tables.classificationTree({
			components: props.ifcViewerCoreInstance.components!,
			classifications: [],
		});

		this.changeState(() => ({
			fragmentIfcLoader,
			fragmentsManager,
			ifcRelationsIndexer,
			relationsTree: {
				tree: relationsTreeInstance,
				updateTree: updateRelationsTree,
			},
			classificationsTree: {
				tree: classificationsTreeInstance,
				updateTree: updateClassificationsTree,
			},
			classifier,
		}));
	}

	destroy() {
		this.baseDestroy({
			direction: [
				'classificationsTree',
				'classifier',
				'relationsTree',
				'ifcRelationsIndexer',
				'fragmentIfcLoader',
				'highlighter',
				'fragmentsManager',
			],
		});
	}

	private async onHighlightHandler(fragmentIdMap: FragmentIdMap) {
		this.state.propertiesTable!.updateTable!({ fragmentIdMap });
	}

	private onClearHighlightHandler() {
		this.state.propertiesTable!.updateTable!({ fragmentIdMap: {} });
	}

	async loadModel(buffer: ArrayBuffer, core: IFCViewerCore, filename: string) {
		this.state.fragmentsManager?.dispose();
		this.state.ifcRelationsIndexer?.dispose();
		this.state.classifier?.dispose();
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
			const [propertiesTableInstance, updatePropertiesTable] = tables.elementProperties({
				components: core.components!,
				fragmentIdMap: {},
			});
			propertiesTableInstance.preserveStructureOnFilter = true;
			propertiesTableInstance.indentationInText = false;
			this.changeState(() => ({
				propertiesTable: {
					table: propertiesTableInstance,
					updateTable: updatePropertiesTable,
				},
			}));
		}
		this.state.classifier?.byEntity(model);
		await this.state.classifier?.byPredefinedType(model);
		await this.state.classifier?.bySpatialStructure(model);
		this.state.classificationsTree?.updateTree({
			classifications: [
				{ system: 'entities', label: 'Сущности' },
				{ system: 'predefinedTypes', label: 'Предопределенные типы' },
				{ system: 'spatialStructure', label: 'Пространственная структура' },
			],
		});
	}

	disposeModel(core: IFCViewerCore) {
		this.state.fragmentsManager?.dispose();
		this.state.ifcRelationsIndexer?.dispose();
		this.state.classifier?.dispose();
		this.state.relationsTree!.updateTree({
			models: [],
		});
		this.state.classificationsTree?.updateTree({
			classifications: [],
		});
		this.state.propertiesTable!.updateTable!({
			fragmentIdMap: {},
		});
	}
}
