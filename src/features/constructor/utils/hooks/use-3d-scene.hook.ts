import {
	Components,
	SimpleCamera,
	SimpleRenderer,
	SimpleScene,
	SimpleWorld,
	Worlds,
} from '@thatopen/components';
import { Manager, PanelSection } from '@thatopen/ui';
import { RefObject, useLayoutEffect, useRef } from 'react';
import Stats from 'stats.js';
import { BoxGeometry, Color, Mesh, MeshLambertMaterial } from 'three';

interface Use3dSceneOptions {
	uiPanelConstructor: (
		world: SimpleWorld<SimpleScene, SimpleCamera, SimpleRenderer>,
	) => PanelSection;
}

export const use3dScene = (
	sceneContainer: RefObject<HTMLDivElement | null>,
	options?: Use3dSceneOptions,
) => {
	const components = useRef<Components>(null);
	const worlds = useRef<Worlds>(null);
	const currentWorld = useRef<SimpleWorld<SimpleScene, SimpleCamera, SimpleRenderer>>(null);
	const statsPanel = useRef<Stats>(null);

	useLayoutEffect(() => {
		if (sceneContainer.current) {
			setupWorld();
			setupStatsPanel();
			setupUIPanel();
		}
		return () => {
			if (components.current) {
				components.current.dispose();
			}
		};
	}, []);

	const setupUIPanel = () => {
		if (options?.uiPanelConstructor) {
			// Manager.init();
			// const uiPanel = options.uiPanelConstructor(currentWorld.current!);
			// sceneContainer.current?.append(uiPanel);
		}
	};

	const setupWorld = () => {
		components.current = new Components();
		worlds.current = components.current.get(Worlds);
		currentWorld.current = worlds.current.create<SimpleScene, SimpleCamera, SimpleRenderer>();
		currentWorld.current.scene = new SimpleScene(components.current);
		currentWorld.current.renderer = new SimpleRenderer(
			components.current,
			sceneContainer.current!,
		);
		currentWorld.current.camera = new SimpleCamera(components.current);
		components.current.init();
		currentWorld.current.scene.setup();
		currentWorld.current.scene.three.background = new Color(128, 128, 128);

		const material = new MeshLambertMaterial({
			color: '#6528D7',
			transparent: true,
			opacity: 0.2,
		});
		const geometry = new BoxGeometry();
		const cube = new Mesh(geometry, material);
		currentWorld.current.scene.three.add(cube);

		cube.rotation.x += Math.PI / 4.2;
		cube.rotation.y += Math.PI / 4.2;
		cube.rotation.z += Math.PI / 4.2;
		cube.updateMatrixWorld();

		currentWorld.current.camera.controls.setLookAt(3, 3, 3, 0, 0, 0);
	};

	const setupStatsPanel = () => {
		if (
			sceneContainer.current &&
			!!process.env.REACT_APP_MODE &&
			process.env.REACT_APP_MODE === 'development'
		) {
			statsPanel.current = new Stats();
			statsPanel.current.showPanel(2);
			sceneContainer.current.append(statsPanel.current.dom);
			currentWorld.current?.renderer!.onBeforeUpdate.add(() => statsPanel.current!.begin());
			currentWorld.current?.renderer!.onAfterUpdate.add(() => statsPanel.current!.end());
			statsPanel.current.dom.style.cssText =
				'position: absolute; top: 10px; left: 10px; z-index: 1000;';
		}
	};

	return { components, statsPanel, currentWorld, worlds };
};
