import { IFCViewerWorld } from '@features/constructor/types';
import { Clipper, Raycasters, SimpleRaycaster } from '@thatopen/components';
import { ClipEdges, EdgesPlane } from '@thatopen/components-front';
import { Mesh, Object3D } from 'three';
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
		clipper.visible = true;

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
		world.meshes.clear();
		model.traverse((child) => {
			if (child instanceof Mesh) {
				world.meshes.add(child);
			}
		});
	}
}
