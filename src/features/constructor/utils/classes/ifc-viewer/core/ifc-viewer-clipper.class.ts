import type { IFCViewerWorld } from '@features/constructor/types';
import { Clipper, Raycasters, type SimpleRaycaster } from '@thatopen/components';
import { IFCViewerBase } from './ifc-viewer-base.class';
import type { IFCViewerCore } from './ifc-viewer-core.class';

interface IFCViewerClipperConstrucrorArgs {
	ifcViewerCoreInstance: IFCViewerCore;
}

export interface IFCViewerClipperState {
	currentClipper: Clipper | null;
	caster: SimpleRaycaster | null;
	casters: Raycasters | null;
}

export class IFCViewerClipper extends IFCViewerBase<
	IFCViewerClipperState,
	IFCViewerClipperConstrucrorArgs
> {
	get currentClipper(): IFCViewerClipperState['currentClipper'] {
		return this.state.currentClipper;
	}

	protected async init(props: IFCViewerClipperConstrucrorArgs) {
		const casters = props.ifcViewerCoreInstance.components!.get(Raycasters);
		const caster = casters.get(props.ifcViewerCoreInstance.currentWorld!);
		const clipper = props.ifcViewerCoreInstance.components!.get(Clipper);
		clipper.enabled = true;
		clipper.visible = true;

		this.changeState(() => ({
			currentClipper: clipper,
			caster,
			casters,
		}));
	}

	destroy() {
		this.baseDestroy({
			direction: ['currentClipper', 'caster', 'casters'],
		});
	}

	addClipperPlane(core: IFCViewerCore) {
		if (this.state.currentClipper?.enabled) {
			this.state.currentClipper.create(core.currentWorld!);
		}
	}

	deleteClipperPlane(world: IFCViewerWorld) {
		if (this.state.currentClipper?.enabled) {
			this.state.currentClipper.delete(world);
		}
	}
}
