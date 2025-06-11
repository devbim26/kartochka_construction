import { Clipper, Raycasters, SimpleRaycaster } from '@thatopen/components';
import { ClipEdges, EdgesPlane } from '@thatopen/components-front';
import { InstancedMesh, LineBasicMaterial, Mesh, MeshBasicMaterial, Object3D } from 'three';
import { IFCViewerCore } from './ifc-viewer-core.class';

interface IFCViewerCastersConstrucrorArgs {
	ifcViewerCoreInstance: IFCViewerCore;
}

export class IFCViewerCasters {
	private _casters: Raycasters | null = null;
	private _currentRayCaster: SimpleRaycaster | null = null;
	private _currentClipper: Clipper | null = null;
	private _edges: ClipEdges | null = null;

	//external
	private _ifcViewerCoreInstance: IFCViewerCore | null = null;

	constructor(args: IFCViewerCastersConstrucrorArgs) {
		this._ifcViewerCoreInstance = args.ifcViewerCoreInstance;
		this.setupCasters();
		this.setupClipper();
		this.setupEdges();
	}

	destroy() {}

	private setupCasters() {
		const casters = this._ifcViewerCoreInstance!.components!.get(Raycasters);
		this._currentRayCaster = casters.get(this._ifcViewerCoreInstance!.currentWorld!);
	}

	private setupClipper() {
		this._currentClipper = this._ifcViewerCoreInstance!.components!.get(Clipper);
		this._currentClipper.enabled = true;
	}

	private setupEdges() {
		this._edges = this._ifcViewerCoreInstance!.components!.get(ClipEdges);
		this._currentClipper!.Type = EdgesPlane;
	}

	setClipperStylesOnModel(model: Object3D) {
		const allMeshes = new Set<Mesh | InstancedMesh>();
		model.traverse((child) => {
			if (child instanceof Mesh || child instanceof InstancedMesh) {
				allMeshes.add(child);
			}
		});

		const salmonFill = new MeshBasicMaterial({ color: 'salmon', side: 2 });
		const redLine = new LineBasicMaterial({ color: 'red' });
		const redOutline = new MeshBasicMaterial({
			color: 'red',
			opacity: 0.5,
			side: 2,
			transparent: true,
		});

		this._edges!.styles.create(
			'Blue lines',
			allMeshes,
			this._ifcViewerCoreInstance!.currentWorld!,
			redLine,
			salmonFill,
			redOutline,
		);
	}
}
