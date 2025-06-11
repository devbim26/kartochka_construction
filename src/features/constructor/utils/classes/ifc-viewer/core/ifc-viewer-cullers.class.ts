import { Cullers, MeshCullerRenderer } from '@thatopen/components';
import { InstancedMesh, Mesh, Object3D } from 'three';
import { IFCViewerBase } from './ifc-viewer-base.class';
import { IFCViewerCore } from './ifc-viewer-core.class';

interface IFCViewerCullersConstructorArgs {
	ifcViewerCoreInstance: IFCViewerCore;
}

export interface IFCViewerCullersState {
	culler: MeshCullerRenderer | null;
	cullers: Cullers | null;
}

export class IFCViewerCullers extends IFCViewerBase<
	IFCViewerCullersState,
	IFCViewerCullersConstructorArgs
> {
	get culler(): IFCViewerCullersState['culler'] {
		return this.state.culler;
	}

	protected async init(props: IFCViewerCullersConstructorArgs) {
		const cullers = props.ifcViewerCoreInstance.components!.get(Cullers);
		const culler = cullers.create(props.ifcViewerCoreInstance.currentWorld!);
		culler.needsUpdate = true;

		this.changeState(() => ({
			culler,
			cullers,
		}));
	}

	destroy() {
		this.baseDestroy();
	}

	prepareCuller(model: Object3D) {
		if (this.state.culler && this.state.culler.needsUpdate) {
			this.state.culler.needsUpdate = false;
			this.state.culler.dispose();
		}

		model.traverse((child) => {
			if (child instanceof Mesh || child instanceof InstancedMesh) {
				this.state.culler!.add(child);
			}
		});

		this.state.culler!.needsUpdate = true;
	}
}
