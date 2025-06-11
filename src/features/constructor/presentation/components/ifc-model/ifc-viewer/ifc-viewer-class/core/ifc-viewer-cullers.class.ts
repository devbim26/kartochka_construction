import { Cullers, MeshCullerRenderer } from '@thatopen/components';
import { InstancedMesh, Mesh, Object3D } from 'three';
import { IFCViewerCore } from './ifc-viewer-core.class';

interface IFCViewerCullersConstructorArgs {
	ifcViewerCoreInstance: IFCViewerCore;
}

export class IFCViewerCullers {
	private _currentCuller: MeshCullerRenderer | null = null;
	private _cullers: Cullers | null = null;

	//external
	private _ifcViewerCoreInstance: IFCViewerCore | null = null;

	constructor(args: IFCViewerCullersConstructorArgs) {
		this._ifcViewerCoreInstance = args.ifcViewerCoreInstance;
		this.setupCullers();
	}

	destroy() {}

	private setupCullers() {
		if (this._currentCuller) {
			this._currentCuller.dispose();
		}
		if (!this._cullers) {
			this._cullers = this._ifcViewerCoreInstance!.components!.get(Cullers);
		}
		this._currentCuller = this._cullers.create(this._ifcViewerCoreInstance!.currentWorld!);
		this._currentCuller.needsUpdate = true;
		// if (!this._cameraControlendHandlerRef) {
		// 	this._cameraControlendHandlerRef = this.cameraControlendHandler.bind(this);
		// }
		// this._currentWorld!.camera.controls.addEventListener(
		// 	'controlend',
		// 	this._cameraControlendHandlerRef,
		// );
		this._currentCuller!.needsUpdate = true;
	}

	setupCullerByModel(model: Object3D) {
		this.setupCullers();
		if (!!model) {
			model.traverse((child) => {
				if (child instanceof Mesh || child instanceof InstancedMesh) {
					this._currentCuller!.add(child);
				}
			});
		}
		this._currentCuller!.needsUpdate = true;
	}
}
