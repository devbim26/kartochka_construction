import type {
	OrthoPerspectiveCamera,
	SimpleRenderer,
	SimpleScene,
	SimpleWorld,
} from '@thatopen/components';
import type { FragmentsGroup } from '@thatopen/fragments';
import type { Table, TableCellValue, TableRowData } from '@thatopen/ui';
import type { OrthographicCamera, PerspectiveCamera } from 'three';

export type IFCViewerRelationsTree = Table<TableRowData<Record<string, TableCellValue>>>;
export type IFCViewerWorld = SimpleWorld<SimpleScene, OrthoPerspectiveCamera, SimpleRenderer>;

export type IFCViewerOnKeyDownHandler = (event: KeyboardEvent) => void;
export type IFCViewerOnDoubleClickHandler = (event: MouseEvent) => void;
export type IFCViewerRenderEventHandler = (data: unknown) => void;
export type IFCViewerProjectionOnChanged =
	| ((data: OrthographicCamera) => void)
	| ((data: PerspectiveCamera) => void);

export type IFCViewerVoidFunc = () => void;
export type IFCViewerVoidAsyncFunc = () => Promise<any>;
export type IFCViewerOnFragmentsLoadedHandler = (model: FragmentsGroup) => Promise<any>;
