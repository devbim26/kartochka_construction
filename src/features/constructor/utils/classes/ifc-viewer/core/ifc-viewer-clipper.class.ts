import type { IFCViewerWorld } from '@features/constructor/types';
import { Clipper, Raycasters, type SimpleRaycaster } from '@thatopen/components';
import { Box3, Vector3 } from 'three';
import { IFCViewerBase } from './ifc-viewer-base.class';
import type { IFCViewerCore } from './ifc-viewer-core.class';

export type IfcClipOrientation = 'horizontal' | 'verticalX' | 'verticalZ';

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

	deleteAllClipperPlanes() {
		this.state.currentClipper?.deleteAll();
	}

	private getSceneBounds(world: IFCViewerWorld): Box3 {
		const box = new Box3();
		world.scene.three.traverse((child) => {
			if ('isMesh' in child && (child as { isMesh?: boolean }).isMesh) {
				box.expandByObject(child);
			}
		});
		if (box.isEmpty()) {
			box.setFromCenterAndSize(new Vector3(0, 0, 0), new Vector3(10, 10, 10));
		}
		return box;
	}

	addSectionPlane(core: IFCViewerCore, orientation: IfcClipOrientation) {
		const clipper = this.state.currentClipper;
		const world = core.currentWorld;
		if (!clipper?.enabled || !world) return;

		const center = this.getSceneBounds(world).getCenter(new Vector3());
		let normal: Vector3;

		switch (orientation) {
			case 'horizontal':
				clipper.orthogonalY = true;
				normal = new Vector3(0, 1, 0);
				break;
			case 'verticalX':
				clipper.orthogonalY = false;
				normal = new Vector3(1, 0, 0);
				break;
			case 'verticalZ':
				clipper.orthogonalY = false;
				normal = new Vector3(0, 0, 1);
				break;
		}

		clipper.createFromNormalAndCoplanarPoint(world, normal, center);
	}
}
