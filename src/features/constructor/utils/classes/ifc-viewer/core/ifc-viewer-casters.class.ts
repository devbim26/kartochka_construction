import { IFCViewerWorld } from '@features/constructor/types';
import { Clipper, Raycasters, SimpleRaycaster } from '@thatopen/components';
import { ClipEdges, EdgesPlane } from '@thatopen/components-front';
import { InstancedMesh, LineBasicMaterial, Mesh, MeshBasicMaterial, Object3D } from 'three';
import { IFCViewerBase } from './ifc-viewer-base.class';
import { IFCViewerCore } from './ifc-viewer-core.class';

interface IFCViewerCastersConstrucrorArgs {
	ifcViewerCoreInstance: IFCViewerCore;
}

export interface IFCViewerCastersState {
	casters: Raycasters | null;
	rayCaster: SimpleRaycaster | null;
	clipper: Clipper | null;
	edges: ClipEdges | null;
}

export class IFCViewerCasters extends IFCViewerBase<
	IFCViewerCastersState,
	IFCViewerCastersConstrucrorArgs
> {
	get clipper(): IFCViewerCastersState['clipper'] {
		return this.state.clipper;
	}

	get edges(): IFCViewerCastersState['edges'] {
		return this.state.edges;
	}

	protected async init(props: IFCViewerCastersConstrucrorArgs) {
		const casters = props.ifcViewerCoreInstance.components!.get(Raycasters);
		const rayCaster = casters.get(props.ifcViewerCoreInstance.currentWorld!);

		const clipper = props.ifcViewerCoreInstance.components!.get(Clipper);
		clipper.enabled = true;

		const edges = props.ifcViewerCoreInstance.components!.get(ClipEdges);
		clipper.Type = EdgesPlane;

		this.changeState(() => ({
			casters: casters,
			rayCaster: rayCaster,
			clipper: clipper,
			edges: edges,
		}));
	}

	destroy() {
		this.baseDestroy();
	}

	setClipperStylesOnModel(model: Object3D, world: IFCViewerWorld) {
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

		this.state.edges!.styles.create(
			'Blue lines',
			allMeshes,
			world,
			redLine,
			salmonFill,
			redOutline,
		);
	}
}
