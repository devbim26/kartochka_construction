import {
	IFCViewerBase,
	IFCViewerCasters,
	IFCViewerCore,
	IFCViewerCullers,
	IFCViewerHandlers,
	IFCViewerModelManager,
	IFCViewerUI,
	IFCViewerUIContainers,
	IFCViewerUIDOMConstructors,
} from './core';

interface IFCViewerState {
	core: IFCViewerCore | null;
	casters: IFCViewerCasters | null;
	cullers: IFCViewerCullers | null;
	handlers: IFCViewerHandlers | null;
	modelManager: IFCViewerModelManager | null;
	ui: IFCViewerUI | null;
}

interface IFCViewerConstructorArgs {
	containers: IFCViewerUIContainers;
	ui: {
		constructors: IFCViewerUIDOMConstructors;
	};
}

export class IFCViewer extends IFCViewerBase<IFCViewerState> {
	constructor(args: IFCViewerConstructorArgs) {
		super(args, {
			casters: null,
			core: null,
			cullers: null,
			handlers: null,
			modelManager: null,
			ui: null,
		});
	}

	destroy() {}

	init(args: IFCViewerConstructorArgs) {}
}
