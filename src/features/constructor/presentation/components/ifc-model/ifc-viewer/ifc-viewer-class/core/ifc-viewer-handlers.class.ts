import { IFCViewerCasters } from './ifc-viewer-casters.class';
import { IFCViewerCore } from './ifc-viewer-core.class';
import { IFCViewerCullers } from './ifc-viewer-cullers.class';
import { IFCViewerModelManager } from './ifc-viewer-model-manager.class';

type VoidFunc = () => void;
type VoidAsyncFunc = () => Promise<any>;

interface IFCViewerHandlersConstructorArgs {
    
}

export class IFCViewerHandlers {
	private _loadIfcFileHandlerRef: VoidAsyncFunc | null = null;
	private _disposeFragmentsHandlerRef: VoidFunc | null = null;

	//external
	private _ifcViewerModelManagerInstance: IFCViewerModelManager | null = null;
	private _ifcViewerCoreInstance: IFCViewerCore | null = null;
	private _cullerInstance: IFCViewerCullers | null = null;
	private _ifcViewerCasters: IFCViewerCasters | null = null;

	constructor() {
        
    }

	destroy() {}

	private async loadIfcFileHandler() {
		const input = document.createElement('input');
		input.type = 'file';
		input.accept = '.ifc';
		input.style.display = 'none';

		const handleFileLoad = async (event: Event) => {
			const file = (event.target as HTMLInputElement).files?.[0];
			if (!file) return;

			const reader = new FileReader();
			reader.readAsArrayBuffer(file);

			reader.onload = async () => {
				const buffer = new Uint8Array(reader.result as ArrayBuffer);
				const model =
					await this._ifcViewerModelManagerInstance!.currentFragmentIfcLoader!.load(
						buffer,
					);
				model.name = file.name;
				this._ifcViewerCasters!.setClipperStylesOnModel(model);
				this._ifcViewerCoreInstance?.currentWorld!.scene.three.add(model);
				this._cullerInstance!.setupCullerByModel(model);

				document.body.removeChild(input);
				input.removeEventListener('change', handleFileLoad);
			};
		};

		input.addEventListener('change', handleFileLoad);

		document.body.appendChild(input);
		input.click();
	}

	private disposeFragmentsHandler() {
		this._ifcViewerModelManagerInstance!.currentFragmentsManager!.dispose();
	}
}
