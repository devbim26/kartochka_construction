import type { IFCViewerWorld } from '@features/constructor/types';
import type { CameraProjection, Clipper, NavModeID, SimpleGrid } from '@thatopen/components';
import type { ClipEdges } from '@thatopen/components-front';
import {
	Component,
	html,
	type Checkbox,
	type ColorInput,
	type Dropdown,
	type NumberInput,
	type PanelSection,
} from '@thatopen/ui';
import { Color } from 'three';

export interface UIControlPanelConstructorProps {
	sceneItems: {
		world: IFCViewerWorld;
		grid: SimpleGrid;
		clipper: Clipper;
		edges: ClipEdges;
	};
	callbacks: {
		loadIfcFileHandler: () => void;
		disposeFragmentsHandler: () => void;
	};
}

export const uiControlPanelConstructor = (props: UIControlPanelConstructorProps) => {
	return Component.create<PanelSection>(() => {
		return html`
			<bim-panel>
				<bim-panel-section
					label="Панель управления"
					style="max-height: 600px; overflow-y: auto; color: #2175f3"
				>
					<bim-panel-section collapsed label="Импорт">
						<bim-button
							label="Импорт модели"
							@click="${() => {
								props.callbacks.loadIfcFileHandler();
							}}"
						>
						</bim-button>
						<bim-button
							label="Удалить модель"
							@click="${() => {
								props.callbacks.disposeFragmentsHandler();
							}}"
						>
						</bim-button>
					</bim-panel-section>
					<bim-panel-section collapsed label="Команды">
						<bim-label>Двойной клик: Создание плоскости сечения</bim-label>
						<bim-label>Клавиша 'Del': Удаление плоскости сечения</bim-label>
					</bim-panel-section>
					<bim-panel-section collapsed label="Полоскость сечения">
						<bim-checkbox
							label="Вкл"
							checked
							@change="${({ target }: { target: Checkbox }) => {
								props.sceneItems.clipper.enabled = target.value;
								props.sceneItems.edges.visible = target.value;
							}}"
						>
						</bim-checkbox>

						<bim-checkbox
							label="Видимоть"
							checked
							@change="${({ target }: { target: Checkbox }) => {
								props.sceneItems.clipper.visible = target.value;
							}}"
						>
						</bim-checkbox>

						<bim-color-input
							label="Цвет"
							color="#202932"
							@input="${({ target }: { target: ColorInput }) => {
								props.sceneItems.clipper.material.color.set(target.color);
							}}"
						>
						</bim-color-input>

						<bim-number-input
							slider
							step="0.01"
							label="Прозрачность"
							value="0.2"
							min="0.1"
							max="1"
							@change="${({ target }: { target: NumberInput }) => {
								props.sceneItems.clipper.material.opacity = target.value;
							}}"
						>
						</bim-number-input>

						<bim-number-input
							slider
							step="0.1"
							label="Размер плоскости"
							value="5"
							min="2"
							max="10"
							@change="${({ target }: { target: NumberInput }) => {
								props.sceneItems.clipper.size = target.value;
							}}"
						>
						</bim-number-input>

						<bim-button
							label="Удалить все"
							@click="${() => {
								props.sceneItems.clipper.deleteAll();
							}}"
						>
						</bim-button>
					</bim-panel-section>
					<bim-panel-section collapsed label="Камера">
						<bim-dropdown
							required
							label="Режим"
							@change="${({ target }: { target: Dropdown }) => {
								const selected = target.value[0] as NavModeID;

								const { current } = props.sceneItems.world.camera.projection;
								const isOrtho = current === 'Orthographic';
								const isFirstPerson = selected === 'FirstPerson';
								if (isOrtho && isFirstPerson) {
									target.value[0] = props.sceneItems.world.camera.mode.id;
									return;
								}
								props.sceneItems.world.camera.set(selected);
							}}"
						>
							<bim-option checked label="Orbit"></bim-option>
							<bim-option label="FirstPerson"></bim-option>
							<bim-option label="Plan"></bim-option>
						</bim-dropdown>
						<bim-dropdown
							required
							label="Проекция камеры"
							@change="${({ target }: { target: Dropdown }) => {
								const selected = target.value[0] as CameraProjection;
								const isOrtho = selected === 'Orthographic';
								const isFirstPerson =
									props.sceneItems.world.camera.mode.id === 'FirstPerson';
								if (isOrtho && isFirstPerson) {
									target.value[0] =
										props.sceneItems.world.camera.projection.current;
									return;
								}
								props.sceneItems.world.camera.projection.set(selected);
							}}"
						>
							<bim-option checked label="Perspective"></bim-option>
							<bim-option label="Orthographic"></bim-option>
						</bim-dropdown>
						<bim-checkbox
							label="Разрешить взаимодействие"
							checked
							@change="${({ target }: { target: Checkbox }) => {
								props.sceneItems.world.camera.setUserInput(target.checked);
							}}"
						>
						</bim-checkbox>
					</bim-panel-section>
					<bim-panel-section collapsed label="Сцена">
						<bim-number-input
							slider
							step="0.1"
							label="Интенсивность направленного света"
							value="1.5"
							min="0.1"
							max="10"
							@change="${({ target }: { target: NumberInput }) => {
								props.sceneItems.world.scene.config.directionalLight.intensity =
									target.value;
							}}"
						>
						</bim-number-input>
						<bim-number-input
							slider
							step="0.1"
							label="Интенсивность окружающего света"
							value="1"
							min="0.1"
							max="5"
							@change="${({ target }: { target: NumberInput }) => {
								props.sceneItems.world.scene.config.ambientLight.intensity =
									target.value;
							}}"
						>
						</bim-number-input>
					</bim-panel-section>
					<bim-panel-section collapsed label="Сетка">
						<bim-checkbox
							label="Видимость сетки"
							checked
							@change="${({ target }: { target: Checkbox }) => {
								props.sceneItems.grid.config.visible = target.value;
							}}"
						>
						</bim-checkbox>
						<bim-color-input
							label="Цвет сетки"
							color="#bbbbbb"
							@input="${({ target }: { target: ColorInput }) => {
								props.sceneItems.grid.config.color = new Color(target.color);
							}}"
						>
						</bim-color-input>
						<bim-number-input
							slider
							step="0.1"
							label="Основной размер сетки"
							value="1"
							min="0"
							max="10"
							@change="${({ target }: { target: NumberInput }) => {
								props.sceneItems.grid.config.primarySize = target.value;
							}}"
						>
						</bim-number-input>
						<bim-number-input
							slider
							step="0.1"
							label="Доп. размер сетки"
							value="10"
							min="0"
							max="20"
							@change="${({ target }: { target: NumberInput }) => {
								props.sceneItems.grid.config.secondarySize = target.value;
							}}"
						>
						</bim-number-input>
					</bim-panel-section>
				</bim-panel-section>
			</bim-panel>
		`;
	});
};

export type UiControlPanelConstructor = typeof uiControlPanelConstructor;
