import { IFCViewerOptions } from '@features/constructor/types';
import {
	Components,
	Grids,
	Raycasters,
	SimpleCamera,
	SimpleGrid,
	SimpleRaycaster,
	SimpleRenderer,
	SimpleScene,
	SimpleWorld,
	Worlds,
} from '@thatopen/components';
import { Manager } from '@thatopen/ui';
import { RefObject, useLayoutEffect, useRef } from 'react';
import Stats from 'stats.js';
import {
	BoxGeometry,
	Mesh,
	MeshLambertMaterial,
	MeshStandardMaterial,
	Object3DEventMap,
} from 'three';

export const use3dScene = (
	sceneContainer: RefObject<HTMLDivElement | null>,
	panelContainer: RefObject<HTMLDivElement | null>,
	options?: IFCViewerOptions,
) => {
	const currentWorld = useRef<SimpleWorld<SimpleScene, SimpleCamera, SimpleRenderer>>(null);

	//Local
	const components = useRef<Components>(null);
	const statsPanel = useRef<Stats>(null);
	const currentGrid = useRef<SimpleGrid>(null);
	const currentRayCaster = useRef<SimpleRaycaster>(null);

	//Additional
	const previousSelection = useRef<Mesh | null>(null);

	useLayoutEffect(() => {
		if (sceneContainer.current) {
			const res = setupWorld();
			setupRayCaster(res);
			setupStatsPanel();
			setupUIPanel();
		}
		return () => {
			if (components.current) {
				components.current.dispose();
			}
		};
	}, []);

	//TODO cube
	const onMouseMoveRayCasterHandler = (payload: {
		cube: Mesh<BoxGeometry, MeshLambertMaterial, Object3DEventMap>;
		material: MeshLambertMaterial;
	}) => {
		const result = currentRayCaster.current!.castRay([payload.cube]);
		if (previousSelection.current) {
			previousSelection.current.material = payload.material;
		}
		if (!result || !(result.object instanceof Mesh)) {
			return;
		}
		result.object.material = new MeshStandardMaterial({ color: '#BCF124' });
		previousSelection.current = result.object;
	};

	//TODO cube
	const setupRayCaster = (payload: {
		cube: Mesh<BoxGeometry, MeshLambertMaterial, Object3DEventMap>;
		material: MeshLambertMaterial;
	}) => {
		const casters = components.current!.get(Raycasters);
		currentRayCaster.current = casters.get(currentWorld.current!);
		sceneContainer.current?.addEventListener('mousemove', () =>
			onMouseMoveRayCasterHandler(payload),
		);
	};

	const setupUIPanel = () => {
		if (options?.uiControlPanelConstructor) {
			Manager.init();
			const uiPanel = options.uiControlPanelConstructor(
				currentWorld.current!,
				currentGrid.current!,
			);
			panelContainer.current?.append(uiPanel);
		}
	};

	const setupWorld = () => {
		components.current = new Components();
		const worlds = components.current.get(Worlds);
		currentWorld.current = worlds.create<SimpleScene, SimpleCamera, SimpleRenderer>();
		currentWorld.current.scene = new SimpleScene(components.current);
		currentWorld.current.renderer = new SimpleRenderer(
			components.current,
			sceneContainer.current!,
		);
		currentWorld.current.camera = new SimpleCamera(components.current);
		components.current.init();
		currentWorld.current.scene.setup();
		currentWorld.current.scene.three.background = null;

		const grids = components.current.get(Grids);
		currentGrid.current = grids.create(currentWorld.current);

		//Cube
		const material = new MeshLambertMaterial({
			color: '#6528D7',
			transparent: true,
			opacity: 0.2,
		});
		const geometry = new BoxGeometry();
		const cube = new Mesh(geometry, material);
		currentWorld.current.scene.three.add(cube);
		//

		currentWorld.current.camera.controls.setLookAt(10, 10, 10, 0, 0, 0);

		return {
			cube,
			material,
		};
	};

	const setupStatsPanel = () => {
		if (!!process.env.REACT_APP_MODE && process.env.REACT_APP_MODE === 'development') {
			statsPanel.current = new Stats();
			statsPanel.current.showPanel(2);
			sceneContainer.current!.append(statsPanel.current.dom);
			currentWorld.current?.renderer!.onBeforeUpdate.add(() => statsPanel.current!.begin());
			currentWorld.current?.renderer!.onAfterUpdate.add(() => statsPanel.current!.end());
			statsPanel.current.dom.style.cssText =
				'position: absolute; top: 10px; left: 10px; z-index: unset;';
		}
	};

	return { currentWorld };
};
