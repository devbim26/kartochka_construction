import { IFCViewerWorld } from '@features/constructor/types';
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

	constructor(args: IFCViewerCastersConstrucrorArgs) {
		this.setupCasters(args.ifcViewerCoreInstance);
		this.setupClipper(args.ifcViewerCoreInstance);
		this.setupEdges(args.ifcViewerCoreInstance);
	}

	destroy() {}

	private setupCasters(
		ifcViewerCoreInstance: IFCViewerCastersConstrucrorArgs['ifcViewerCoreInstance'],
	) {
		const casters = ifcViewerCoreInstance.components!.get(Raycasters);
		this._currentRayCaster = casters.get(ifcViewerCoreInstance.currentWorld!);
	}

	private setupClipper(
		ifcViewerCoreInstance: IFCViewerCastersConstrucrorArgs['ifcViewerCoreInstance'],
	) {
		this._currentClipper = ifcViewerCoreInstance.components!.get(Clipper);
		this._currentClipper.enabled = true;
	}

	private setupEdges(
		ifcViewerCoreInstance: IFCViewerCastersConstrucrorArgs['ifcViewerCoreInstance'],
	) {
		this._edges = ifcViewerCoreInstance.components!.get(ClipEdges);
		this._currentClipper!.Type = EdgesPlane;
	}

	setClipperStylesOnModel(model: Object3D, currentWorld: IFCViewerWorld) {
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
			currentWorld,
			redLine,
			salmonFill,
			redOutline,
		);
	}
}
