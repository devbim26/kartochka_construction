import { Cullers, MeshCullerRenderer } from '@thatopen/components';
import { InstancedMesh, Mesh, Object3D } from 'three';
import { IFCViewerCore } from './ifc-viewer-core.class';

interface IFCViewerCullersConstructorArgs {
	ifcViewerCoreInstance: IFCViewerCore;
}

export class IFCViewerCullers {
	private _currentCuller: MeshCullerRenderer | null = null;
	private _cullers: Cullers | null = null;

	constructor(args: IFCViewerCullersConstructorArgs) {
		this.setupCullers(args.ifcViewerCoreInstance);
	}

	destroy() {}

	private setupCullers(
		ifcViewerCoreInstance: IFCViewerCullersConstructorArgs['ifcViewerCoreInstance'],
	) {
		if (this._currentCuller) {
			this._currentCuller.dispose();
		}
		if (!this._cullers) {
			this._cullers = ifcViewerCoreInstance.components!.get(Cullers);
		}
		this._currentCuller = this._cullers.create(ifcViewerCoreInstance.currentWorld!);
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

	setupCullerByModel(model: Object3D, ifcViewerCoreInstance: IFCViewerCore) {
		this.setupCullers(ifcViewerCoreInstance);
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
